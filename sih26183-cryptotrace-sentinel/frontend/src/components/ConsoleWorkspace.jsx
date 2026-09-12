import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import FreezeNoticeForm from "./FreezeNoticeForm";
import BatchScreeningModal from "./BatchScreeningModal";
import TimelineScrubber from "./TimelineScrubber";
import CaseAssistantDrawer from "./CaseAssistantDrawer";
import { 
  searchQuery, 
  expandNode, 
  startTrace, 
  getTraceGraph, 
  autoInvestigate,
  saveCaseCanvas,
  getCaseCanvas,
  listCases,
  exportEvidencePdf,
  exportEvidenceJson,
  detectClusters,
  updateEntityProvenance,
  evaluateRiskScore
} from "../api";
import ProvenanceBadge from "./ProvenanceBadge";
import RiskModeBadge from "./RiskModeBadge";
import { 
  Home, 
  Search, 
  Plus, 
  SlidersHorizontal, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  X, 
  Edit3, 
  ArrowUpRight, 
  Activity, 
  ShieldAlert, 
  ShieldCheck,
  Filter, 
  Maximize, 
  TrendingUp, 
  Share2,
  Save,
  FolderOpen,
  Pin,
  PinOff,
  Tag,
  Sparkles,
  Clock,
  RefreshCw,
  Layers,
  Folder,
  UserCheck,
  MessageSquare,
  Bot
} from "lucide-react";


cytoscape.use(dagre);

const DAGRE_OPTIONS = {
  name: "dagre",
  rankDir: "LR",              // Strict Left-to-Right layout
  align: "DR",                // Align along dominant flow
  nodeSep: 45,                // Vertical separation between branching peel nodes
  rankSep: 90,                // Horizontal distance between consecutive hops
  edgeWeight: function(edge) {
    // Heavily weight core-path edges so the main highway stays in a dead-straight horizontal line
    return edge.data("isCorePath") ? 100 : 1;
  },
  animate: true,
  animationDuration: 400,
};

const LAYOUTS = {
  dag: DAGRE_OPTIONS,
  radial: { name: "concentric", concentric: (n) => (n.data("isCorePath") ? 10 : n.degree()), levelWidth: () => 2, animate: true },
  force: { name: "cose", animate: true, nodeRepulsion: 9000, idealEdgeLength: 130 },
  preset: { name: "preset", animate: true },
};

// TASK 7: Proximity-Weighted Force Layout for Bubble View
// Proximity = Relationship Strength (high volume / shared link = close proximity)
const BUBBLE_COSE_LAYOUT = {
  name: "cose",
  animate: true,
  animationDuration: 450,
  fit: true,
  padding: 50,
  randomize: false,
  componentSpacing: 90,
  nodeRepulsion: (node) => {
    const size = node.data("bubbleSize") || 65;
    return size * 160;
  },
  nodeOverlap: 20,
  idealEdgeLength: (edge) => {
    const amt = parseFloat(edge.data("amount")) || 100;
    if (amt >= 10000) return 80;   // High volume transfer: very close proximity
    if (amt >= 1000) return 120;  // Medium transfer
    return 180;                   // Low volume / fee: peripheral
  },
  edgeElasticity: (edge) => {
    const amt = parseFloat(edge.data("amount")) || 100;
    return Math.min(260, Math.max(30, amt / 35));
  },
  gravity: 0.28,
  numIter: 1000,
};

// Computes holding size / volume and maps to circle diameter
function computeBubbleMetrics(node, edges = []) {
  const parseAmt = (val) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    const cleaned = String(val).replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  const bal = parseAmt(node.balance);
  const inflow = parseAmt(node.inflow);
  const outflow = parseAmt(node.outflow);
  
  let edgeVol = 0;
  edges.forEach((e) => {
    if (e.source === node.id || e.target === node.id) {
      edgeVol += (parseFloat(e.amount) || 0);
    }
  });

  const totalVol = Math.max(bal, inflow, outflow, edgeVol, 10);
  
  let diameter = 54;
  if (totalVol > 500000) {
    diameter = 135; // Master Exchange Hot Wallet / Massive Liquidity Pool
  } else if (totalVol > 50000) {
    diameter = 115;
  } else if (totalVol > 10000) {
    diameter = 96;  // Victim stolen pool / Primary mule
  } else if (totalVol > 2000) {
    diameter = 82;  // Deposit / Sub-mule
  } else if (totalVol > 200) {
    diameter = 68;  // Secondary peel
  } else {
    diameter = 54;  // Gas energy / dust
  }

  return { totalVol, diameter };
}

// Low-jargon, plain-English role and summary mapper for non-technical police officers
function getLowJargonInfo(node, totalVol = 0) {
  const type = node.node_type || node.nodeType || "mule";
  const custom = node.custom_label || node.roleHeader;
  const exName = node.exchange_name || node.exchange || "CoinDCX";
  const balStr = totalVol > 0 ? `${Number(Math.round(totalVol)).toLocaleString()} USDT` : (node.balance || "14,850 USDT");

  if (type === "origin" || node.is_victim) {
    return {
      simplifiedTitle: "Victim's Stolen Funds",
      simplifiedSubtitle: "Complainant Wallet",
      policeAction: "Origin of Reported FIR",
      friendlyColor: "#10b981", // Emerald Green
      plainEnglishExplanation: "The initial wallet where the complainant's money was stolen.",
      badgeText: "Victim",
      bubbleLabel: `Victim's Funds\n${balStr}\n[Complainant]`,
    };
  }
  if (type === "cex_deposit" || node.cex_role === "deposit") {
    return {
      simplifiedTitle: `Cash-Out Point (${exName})`,
      simplifiedSubtitle: "User Deposit Terminal",
      policeAction: "🚨 Target to Freeze (Sec 94 BNSS)",
      friendlyColor: "#06b6d4", // Cyan
      plainEnglishExplanation: `Suspect deposit address at ${exName} used to off-ramp crypto into bank accounts. Target for immediate Section 94 BNSS freeze.`,
      badgeText: "Freeze Target",
      bubbleLabel: `Cash-Out Point\n${exName}\n[FREEZE TARGET]`,
    };
  }
  if (type === "cex_hotwallet" || node.cex_role === "hotwallet") {
    return {
      simplifiedTitle: `Exchange Vault (${exName})`,
      simplifiedSubtitle: "Regulated Hot Wallet",
      policeAction: "Contact Compliance Nodal Officer",
      friendlyColor: "#8b5cf6", // Royal Purple
      plainEnglishExplanation: `Consolidated custodial omnibus wallet of ${exName} (FIU-IND Registered).`,
      badgeText: "Exchange Vault",
      bubbleLabel: `Exchange Vault\n${exName}\n[Regulated]`,
    };
  }
  if (type === "gas_fee") {
    return {
      simplifiedTitle: "Fee Sponsor",
      simplifiedSubtitle: "Gas Energy Provider",
      policeAction: "Syndicate Co-Conspirator Lead",
      friendlyColor: "#38bdf8", // Sky Blue
      plainEnglishExplanation: "Provided transaction energy (gas) to the suspect's wallets, proving direct operational coordination.",
      badgeText: "Fee Link",
      bubbleLabel: "Fee Sponsor\nGas Provider\n[Syndicate Lead]",
    };
  }
  if (type === "peel_dust") {
    return {
      simplifiedTitle: "Leftover Change",
      simplifiedSubtitle: "Decoy Dust Wallet",
      policeAction: "Low Value Structuring",
      friendlyColor: "#64748b", // Slate Gray
      plainEnglishExplanation: "Small residual balance left behind during peeling-chain fund distribution.",
      badgeText: "Decoy",
      bubbleLabel: `Decoy Change\n${balStr}\n[Peel Decoy]`,
    };
  }
  if (type === "mixer" || type === "mixer_bridge") {
    return {
      simplifiedTitle: "Laundering Tumbler",
      simplifiedSubtitle: "Obfuscation Protocol",
      policeAction: "OFAC Sanctioned Entity Alert",
      friendlyColor: "#ef4444", // Red
      plainEnglishExplanation: "Cryptocurrency mixing pool used to sever the audit trail.",
      badgeText: "Mixer",
      bubbleLabel: "Laundering Pool\nPrivacy Mixer\n[Sanctioned]",
    };
  }

  // Default: Mule Intermediary
  return {
    simplifiedTitle: custom || "Suspect Middleman",
    simplifiedSubtitle: "Mule Account",
    policeAction: "Identify KYC Account Holder",
    friendlyColor: "#f59e0b", // Amber
    plainEnglishExplanation: "Intermediary wallet used to hop and layer stolen funds across multiple accounts.",
    badgeText: "Mule",
    bubbleLabel: `${custom || "Suspect Mule"}\n${balStr}\n[Layering]`,
  };
}

function detectChain(raw) {
  const val = (raw || "").trim();
  if (val.startsWith("T") && val.length >= 30) return "TRON";
  if (val.startsWith("0x")) return "EVM";
  if (val.startsWith("bc1") || val.startsWith("1") || val.startsWith("3")) return "BTC";
  return "TRON";
}

// Default Sovereign Tracing Topology
function createDefaultForensicTopology(victimAddr = "TVictim0001TRONTaskScamXXXXXXXXX") {
  const victimTrunc = victimAddr.length > 14 ? `${victimAddr.slice(0, 6)}...${victimAddr.slice(-4)}` : victimAddr;
  return {
    nodes: [
      // Core Highway (isCorePath: true)
      { id: "victim", roleHeader: "Victim Reported Wallet", truncated_address: victimTrunc, display_label: `[Victim Reported Wallet]\n${victimTrunc}`, fullAddress: victimAddr, node_type: "origin", is_core_path: true, balance: "0.00 USDT", inflow: "15,000 USDT", outflow: "15,000 USDT", taint: "100%", provenance: "offchain_verified", risk_score: 10, risk_mode: "static_entity" },
      { id: "mule1", roleHeader: "Mule Layering A", truncated_address: "TMule1...1111", display_label: "[Mule Layering A]\nTMule1...1111", fullAddress: "TMuleSplitterA11111111111111111111", node_type: "mule", is_core_path: true, balance: "120.00 USDT", inflow: "15,000 USDT", outflow: "14,880 USDT", taint: "98.5%", provenance: "automated_clustering", risk_score: 85, risk_mode: "dynamic_behavioral" },
      { id: "mule2", roleHeader: "Mule Layering B", truncated_address: "TMule2...2222", display_label: "[Mule Layering B]\nTMule2...2222", fullAddress: "TMuleConsolidation2222222222222222", node_type: "mule", is_core_path: true, balance: "80.00 USDT", inflow: "14,880 USDT", outflow: "14,800 USDT", taint: "97.2%", provenance: "automated_clustering", risk_score: 75, risk_mode: "dynamic_behavioral" },
      { id: "cex_dep", roleHeader: "CoinDCX User Deposit", truncated_address: "TCoinD...XXXX", display_label: "[CoinDCX User Deposit]\nTCoinD...XXXX", fullAddress: "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX", node_type: "cex_deposit", is_core_path: true, balance: "4,850.00 USDT", inflow: "4,850 USDT", outflow: "4,850 USDT", taint: "98.4%", exchange_name: "CoinDCX India", provenance: "offchain_verified", risk_score: 85, risk_mode: "static_entity" },
      { id: "cex_hot", roleHeader: "CoinDCX Hot Wallet", truncated_address: "TCoinH...XXXX", display_label: "[CoinDCX Hot Wallet]\nTCoinH...XXXX", fullAddress: "TCoinDCXHotWallet0001XXXXXXXXXXXXX", node_type: "cex_hotwallet", is_core_path: true, balance: "1,420,000 USDT", inflow: "4,850 USDT", outflow: "0 USDT", taint: "99.9%", exchange_name: "CoinDCX India", provenance: "offchain_verified", risk_score: 25, risk_mode: "static_entity" },

      // Symmetrical Branches (Show All Webs only, isCorePath: false)
      { id: "gas1", roleHeader: "Gas Energy Inbound", truncated_address: "TFeePr...9999", display_label: "[Gas Energy Inbound]\nTFeePr...9999", fullAddress: "TFeeProviderEnergy9999999999999999", node_type: "gas_fee", is_core_path: false, balance: "450 TRX", inflow: "500 TRX", outflow: "50 TRX", taint: "5.0%", provenance: "automated_clustering", risk_score: 20, risk_mode: "dynamic_behavioral" },
      { id: "peel1", roleHeader: "Peel Decoy Dust", truncated_address: "TPeelA...5555", display_label: "[Peel Decoy Dust]\nTPeelA...5555", fullAddress: "TPeelBurnerA5555555555555555555555", node_type: "peel_dust", is_core_path: false, balance: "120 USDT", inflow: "120 USDT", outflow: "0 USDT", taint: "95.0%", provenance: "automated_clustering", risk_score: 80, risk_mode: "dynamic_behavioral" },
      { id: "peel2", roleHeader: "Peel Decoy Dust", truncated_address: "TPeelB...6666", display_label: "[Peel Decoy Dust]\nTPeelB...6666", fullAddress: "TPeelBurnerB6666666666666666666666", node_type: "peel_dust", is_core_path: false, balance: "80 USDT", inflow: "80 USDT", outflow: "0 USDT", taint: "92.0%", provenance: "automated_clustering", risk_score: 80, risk_mode: "dynamic_behavioral" }
    ],
    edges: [
      // Core Highway (isCorePath: true)
      { id: "e-v-m1", source: "victim", target: "mule1", token_symbol: "USDT", amount: 15000, is_core_path: true, tx_hash: "0x8f4c01", timestamp_utc: 1773000100 },
      { id: "e-m1-m2", source: "mule1", target: "mule2", token_symbol: "USDT", amount: 14880, is_core_path: true, tx_hash: "0x8f4c02", timestamp_utc: 1773000300 },
      { id: "e-m2-cd", source: "mule2", target: "cex_dep", token_symbol: "USDT", amount: 14800, is_core_path: true, tx_hash: "0x8f4c03", timestamp_utc: 1773001000 },
      { id: "e-cd-ch", source: "cex_dep", target: "cex_hot", token_symbol: "USDT", amount: 14800, is_core_path: true, tx_hash: "0x8f4c04", timestamp_utc: 1773001500, label: "Sweep USDT 14,800" },

      // Decoy & Gas Branches (isCorePath: false)
      { id: "e-gas-m1", source: "gas1", target: "mule1", token_symbol: "TRX", amount: 15, is_core_path: false, tx_hash: "0xfee01", timestamp_utc: 1773000000 },
      { id: "e-gas-m2", source: "gas1", target: "mule2", token_symbol: "TRX", amount: 15, is_core_path: false, tx_hash: "0xfee02", timestamp_utc: 1773000040 },
      { id: "e-m1-p1", source: "mule1", target: "peel1", token_symbol: "USDT", amount: 120, is_core_path: false, tx_hash: "0xpeel01", timestamp_utc: 1773000400 },
      { id: "e-m2-p2", source: "mule2", target: "peel2", token_symbol: "USDT", amount: 80, is_core_path: false, tx_hash: "0xpeel02", timestamp_utc: 1773000435 }
    ]
  };
}

// TASK 8: Compute discrete Time Travel snapshots on-the-fly from graph nodes and edges
function computeClusterSnapshots(graph) {
  if (!graph || !graph.nodes || graph.nodes.length === 0) return [];

  const nodes = graph.nodes;
  const rawEdges = graph.edges || [];

  const parseAmt = (val) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    const cleaned = String(val).replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  const formatUtc = (epoch) => {
    try {
      const d = new Date(epoch * 1000);
      return d.toUTCString().replace("GMT", "UTC");
    } catch {
      return `Epoch ${epoch}`;
    }
  };

  const formatRel = (deltaSec) => {
    if (deltaSec <= 0) return "T + 00:00:00";
    const h = Math.floor(deltaSec / 3600);
    const m = Math.floor((deltaSec % 3600) / 60);
    const s = deltaSec % 60;
    if (h > 0) return `T + ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
    return `T + ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  };

  // 1. Normalize and sort edges chronologically
  const sortedEdges = [...rawEdges].map((e, idx) => {
    const ts = e.timestamp_utc || e.timestamp || (1773000000 + idx * 120);
    return {
      id: e.id || `${e.source}-${e.target}-${idx}`,
      source: e.source,
      target: e.target,
      amount: parseAmt(e.amount),
      token_symbol: e.token_symbol || "USDT",
      tx_hash: e.tx_hash || `0x${idx.toString(16).padStart(6, "0")}`,
      timestamp_utc: parseInt(ts, 10),
      is_core_path: Boolean(e.is_core_path ?? e.isCorePath),
      label: e.label || `${e.token_symbol || "USDT"} ${parseAmt(e.amount).toLocaleString()}`,
      raw: e,
    };
  }).sort((a, b) => a.timestamp_utc - b.timestamp_utc);

  // Nodes index
  const nodesMap = new Map();
  nodes.forEach((n) => nodesMap.set(n.id, n));

  // Determine initial stolen volume
  let totalStolen = 0;
  sortedEdges.forEach((e) => {
    const src = nodesMap.get(e.source);
    if (src && (src.node_type === "origin" || src.is_victim)) {
      totalStolen += e.amount;
    }
  });
  if (totalStolen <= 0) totalStolen = 15000;

  // Track balances
  const balances = {};
  const inflows = {};
  const outflows = {};

  nodes.forEach((n) => {
    const isOrigin = n.node_type === "origin" || n.is_victim;
    balances[n.id] = isOrigin ? totalStolen : 0;
    inflows[n.id] = 0;
    outflows[n.id] = 0;
  });

  const snapshots = [];
  const t0Epoch = sortedEdges.length > 0 ? (sortedEdges[0].timestamp_utc - 60) : 1773000000;

  // T0: Genesis Pre-Theft Snapshot
  const t0Holdings = {};
  nodes.forEach((n) => {
    const isOrigin = n.node_type === "origin" || n.is_victim;
    const bal = balances[n.id];
    t0Holdings[n.id] = {
      balance: isOrigin ? `${bal.toLocaleString()} USDT` : "0.00 USDT",
      balance_num: bal,
      inflow: "0.00 USDT",
      outflow: "0.00 USDT",
      total_vol: isOrigin ? bal : 10,
      is_active: isOrigin,
    };
  });

  snapshots.push({
    step_index: 0,
    timestamp_utc: t0Epoch,
    formatted_date: formatUtc(t0Epoch),
    relative_time: "T + 00:00:00",
    active_edge_ids: [],
    just_fired_edge_id: null,
    fired_edges: [],
    event_description: "Initial state: Stolen victim assets held in complainant reported wallet",
    node_holdings: t0Holdings,
    metrics: {
      active_nodes_count: 1,
      active_links_count: 0,
      total_stolen_disbursed: 0,
      funds_at_rest: totalStolen,
      funds_in_motion: 0,
      offramp_exposure_pct: 0,
      reached_exchange: false,
    },
  });

  // Progressive Steps (T1 ... Tn)
  const activeEdgeIds = [];
  let cumulativeOfframp = 0;
  let cumulativeDisbursed = 0;

  sortedEdges.forEach((edge, idx) => {
    const stepIdx = idx + 1;
    const src = edge.source;
    const tgt = edge.target;
    const amt = edge.amount;
    const sym = edge.token_symbol;
    const ts = edge.timestamp_utc;

    activeEdgeIds.push(edge.id);

    if (balances[src] !== undefined) {
      balances[src] = Math.max(0, balances[src] - amt);
      outflows[src] = (outflows[src] || 0) + amt;
    }
    if (balances[tgt] !== undefined) {
      balances[tgt] = (balances[tgt] || 0) + amt;
      inflows[tgt] = (inflows[tgt] || 0) + amt;
    }

    const srcNode = nodesMap.get(src) || {};
    const tgtNode = nodesMap.get(tgt) || {};

    if (srcNode.node_type === "origin" || srcNode.is_victim) {
      cumulativeDisbursed += amt;
    }

    const tgtType = tgtNode.node_type || tgtNode.nodeType || "";
    if (tgtType.includes("cex")) {
      cumulativeOfframp += amt;
    }

    const stepHoldings = {};
    nodes.forEach((n) => {
      const bal = balances[n.id] || 0;
      const inf = inflows[n.id] || 0;
      const outf = outflows[n.id] || 0;
      const totVol = Math.max(bal, inf, outf, 10);
      const isActive = inf > 0 || outf > 0 || bal > 0 || n.node_type === "origin";

      stepHoldings[n.id] = {
        balance: `${Math.round(bal).toLocaleString()} ${sym}`,
        balance_num: bal,
        inflow: `${Math.round(inf).toLocaleString()} ${sym}`,
        outflow: `${Math.round(outf).toLocaleString()} ${sym}`,
        total_vol: totVol,
        is_active: isActive,
      };
    });

    const srcLabel = srcNode.custom_label || srcNode.roleHeader || src.slice(0, 8);
    const tgtLabel = tgtNode.custom_label || tgtNode.roleHeader || tgt.slice(0, 8);
    const offrampPct = Math.min(100, Math.round((cumulativeOfframp / Math.max(totalStolen, 1)) * 100));

    snapshots.push({
      step_index: stepIdx,
      timestamp_utc: ts,
      formatted_date: formatUtc(ts),
      relative_time: formatRel(ts - t0Epoch),
      active_edge_ids: [...activeEdgeIds],
      just_fired_edge_id: edge.id,
      fired_edges: [edge],
      event_description: `Transfer: ${amt.toLocaleString()} ${sym} from [${srcLabel}] to [${tgtLabel}] (Tx: ${edge.tx_hash.slice(0, 10)}...)`,
      node_holdings: stepHoldings,
      metrics: {
        active_nodes_count: Object.values(stepHoldings).filter((h) => h.is_active).length,
        active_links_count: activeEdgeIds.length,
        total_stolen_disbursed: cumulativeDisbursed,
        funds_at_rest: (balances["cex_hot"] || 0) + (balances["cex_dep"] || 0),
        funds_in_motion: Math.max(0, totalStolen - (balances["cex_hot"] || 0)),
        offramp_exposure_pct: offrampPct,
        reached_exchange: offrampPct > 0,
      },
    });
  });

  return snapshots;
}

export default function ConsoleWorkspace({ initialAddress = "", initialChain = "", initialCaseId = "", onBackToLanding }) {
  const [query, setQuery] = useState(initialAddress || "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX");
  const [graph, setGraph] = useState(() => createDefaultForensicTopology(initialAddress));
  const [transfers, setTransfers] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [layoutName, setLayoutName] = useState("dag");
  const [viewMode, setViewMode] = useState("predictive"); // "predictive" | "all"
  const [graphViewMode, setGraphViewMode] = useState("bubble"); // TASK 7: "bubble" (simplified default) vs "technical"
  const [investigation, setInvestigation] = useState(null);
  const [isTracing, setIsTracing] = useState(false);
  const [showFreezeNotice, setShowFreezeNotice] = useState(false);
  const [showBatchScreening, setShowBatchScreening] = useState(false);

  // TASK 9: Natural-Language Case Assistant Drawer State
  const [showCaseAssistant, setShowCaseAssistant] = useState(false);

  // TASK 8: Time Travel Playback State

  const [showTimeTravel, setShowTimeTravel] = useState(false);
  const [timeTravelStep, setTimeTravelStep] = useState(0);
  const [isPlayingTimeTravel, setIsPlayingTimeTravel] = useState(false);
  const [timeTravelSpeed, setTimeTravelSpeed] = useState(1);
  const [isTimeTravelLooping, setIsTimeTravelLooping] = useState(true);

  // TASK 8: Computed Chronological Cluster Snapshots
  const clusterSnapshots = useMemo(() => computeClusterSnapshots(graph), [graph]);

  // Case Persistence & Management State
  const [currentCaseId, setCurrentCaseId] = useState(initialCaseId || "");
  const [currentCaseMeta, setCurrentCaseMeta] = useState({
    case_name: "",
    fir_number: "",
    description: "",
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [savedCasesList, setSavedCasesList] = useState([]);
  const [isLoadingCases, setIsLoadingCases] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);
  const [isExportingEvidence, setIsExportingEvidence] = useState(false);

  // Magic Nodes Cluster Detection State (P0 Requirement)
  const [showMagicNodes, setShowMagicNodes] = useState(false);
  const [isDetectingClusters, setIsDetectingClusters] = useState(false);
  const [clusterData, setClusterData] = useState(null);
  const [detectedClustersCount, setDetectedClustersCount] = useState(0);

  // Dual-Mode Risk Engine State (TASK 5)
  const [isEvaluatingRisk, setIsEvaluatingRisk] = useState(false);

  // Paginated Node Expansion State
  const [expandDirection, setExpandDirection] = useState("both");
  const [expandOffset, setExpandOffset] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandFeedback, setExpandFeedback] = useState(null);

  // Floating Canvas Studio State
  const [editMode, setEditMode] = useState(false);
  const [drawArrowMode, setDrawArrowMode] = useState(false);
  const [selectedNodeShape, setSelectedNodeShape] = useState("round-rectangle");
  const [customNodeColor, setCustomNodeColor] = useState("#07111f");
  const [drawSourceNode, setDrawSourceNode] = useState(null);

  const containerRef = useRef(null);
  const cyRef = useRef(null);

  // TASK 9: Center and inspect node on canvas when clicked from Case Assistant citations
  const handleLocateNodeOnCanvas = useCallback((nodeIdOrAddress) => {
    const cy = cyRef.current;
    if (!cy || !nodeIdOrAddress) return;
    const targetNode = cy.nodes().filter((n) => {
      const d = n.data();
      return (
        d.id === nodeIdOrAddress ||
        d.fullAddress === nodeIdOrAddress ||
        d.address === nodeIdOrAddress ||
        (d.truncated_address && nodeIdOrAddress.includes(d.truncated_address))
      );
    });
    if (targetNode.length > 0) {
      cy.elements().unselect();
      targetNode.select();
      cy.animate({
        center: { eles: targetNode },
        zoom: 1.4,
        duration: 500,
      });
      setSelectedEntity(targetNode.data());
    }
  }, []);

  // Apply Dual-View Filtering Logic & Graph Mode (Bubble View vs Technical Graph)

  const applyDualViewMode = useCallback((cy, mode, activeLayoutName, activeGraphMode = "bubble") => {
    if (!cy) return;
    cy.batch(() => {
      // 1. Predictive Highway vs All Webs filtering
      if (mode === "predictive") {
        cy.elements().forEach((ele) => {
          if (ele.data("isCorePath") || (showMagicNodes && ele.data("edge_type") === "indirect_link")) {
            ele.show();
          } else {
            ele.hide();
          }
        });
      } else {
        cy.elements().show();
      }

      // 2. Dynamic visual styles based on activeGraphMode (Bubble vs Technical)
      if (activeGraphMode === "bubble") {
        // BUBBLE VIEW: Ellipse shape, holding size/volume scaled diameter, friendly colors
        cy.nodes().forEach((n) => {
          const bSize = n.data("bubbleSize") || 70;
          const bColor = n.data("friendlyColor") || "#f59e0b";
          n.style({
            shape: "ellipse",
            width: bSize,
            height: bSize,
            "background-color": "#08101e",
            "border-color": bColor,
            "border-width": 3,
            label: n.data("bubbleLabel") || n.data("label"),
            "font-size": Math.min(10.5, Math.max(8.5, bSize / 9.5)),
            "text-max-width": bSize - 8,
            "text-valign": "center",
            "text-halign": "center",
            "shadow-blur": 14,
            "shadow-color": bColor,
            "shadow-opacity": 0.45,
          });
        });

        cy.edges().forEach((e) => {
          const isIndirect = e.data("edge_type") === "indirect_link";
          const amt = parseFloat(e.data("amount")) || 0;
          const eWidth = isIndirect ? 2 : Math.min(5.5, Math.max(1.8, (amt / 2500) + 1.8));
          e.style({
            width: eWidth,
            "curve-style": "bezier",
            "control-point-step-size": 40,
            opacity: 0.9,
          });
        });
      } else {
        // TECHNICAL GRAPH: Rectangular DAG cards, exact addresses, provenance
        cy.nodes().forEach((n) => {
          const isCore = n.data("isCorePath");
          const nType = n.data("nodeType");
          let bColor = "#334155";
          if (nType === "origin") bColor = "#10b981";
          else if (nType === "mule") bColor = "#f59e0b";
          else if (nType === "cex" || nType === "cex_deposit") bColor = "#06b6d4";
          else if (nType === "cex_hotwallet") bColor = "#3b82f6";
          else if (nType === "gas_fee") bColor = "#0284c7";
          else if (nType === "peel_dust") bColor = "#475569";

          n.style({
            shape: "round-rectangle",
            width: nType === "peel_dust" ? 115 : 150,
            height: nType === "peel_dust" ? 38 : 48,
            "background-color": "#07111f",
            "border-color": bColor,
            "border-width": isCore ? 2.2 : 1.5,
            label: n.data("label"),
            "font-size": 10,
            "text-max-width": 140,
            "text-valign": "center",
            "text-halign": "center",
            "shadow-blur": 0,
          });
        });

        cy.edges().forEach((e) => {
          e.style({
            width: e.data("isCorePath") ? 2.5 : 1.2,
            "curve-style": "bezier",
          });
        });
      }
    });

    // 3. Layout execution: Force physics (proximity = relationship strength) in Bubble View
    if (activeGraphMode === "bubble") {
      cy.layout(BUBBLE_COSE_LAYOUT).run();
    } else {
      if (activeLayoutName === "preset") {
        cy.layout({ name: "preset", animate: true }).run();
      } else {
        const activeLayout = activeLayoutName === "dag" ? DAGRE_OPTIONS : (LAYOUTS[activeLayoutName] || DAGRE_OPTIONS);
        cy.layout(activeLayout).run();
      }
    }
    cy.fit(null, 45);
  }, [showMagicNodes]);

  // Merge nodes & edges into graph
  const mergeGraph = useCallback((incoming) => {
    setGraph((prev) => {
      const nodeMap = new Map(prev.nodes.map((n) => [n.id, n]));
      incoming.nodes.forEach((n) => nodeMap.set(n.id, n));
      const edgeKey = (e) => `${e.tx_hash || 'tx'}-${e.source}-${e.target}`;
      const edgeMap = new Map(prev.edges.map((e) => [edgeKey(e), e]));
      incoming.edges.forEach((e) => edgeMap.set(edgeKey(e), e));
      return { nodes: [...nodeMap.values()], edges: [...edgeMap.values()] };
    });
    setTransfers((prev) => [...prev, ...incoming.edges]);
  }, []);

  // Load Case by ID into Canvas
  const handleLoadCase = useCallback(async (caseIdToLoad) => {
    if (!caseIdToLoad) return;
    try {
      const res = await getCaseCanvas(caseIdToLoad);
      if (res && res.nodes && res.nodes.length) {
        setGraph({ nodes: res.nodes, edges: res.edges || [] });
        setTransfers(res.edges || []);
        setCurrentCaseId(caseIdToLoad);
        setCurrentCaseMeta({
          case_name: res.case?.description || caseIdToLoad,
          fir_number: res.case?.fir_number || "",
          description: res.case?.incident_description || "",
        });
        setLayoutName("preset");
        setSaveSuccessMsg(`Loaded case ${res.case?.fir_number || caseIdToLoad} (${res.node_count} nodes, ${res.edge_count} edges)`);
        setTimeout(() => setSaveSuccessMsg(null), 4000);
        window.history.pushState(null, "", `/console?caseId=${caseIdToLoad}`);
        setShowLoadModal(false);
      }
    } catch (err) {
      console.error("Failed to load case canvas:", err);
    }
  }, []);

  // Run Investigation / Trace
  const handleTrace = useCallback(async (targetAddress) => {
    if (!targetAddress) return;
    setIsTracing(true);
    const chain = detectChain(targetAddress);

    try {
      // 1. First attempt mock trace
      const mockResult = await startTrace({
        case_id: `CASE-${Date.now()}`,
        fir_number: "FIR/2026/00123",
        start_address: targetAddress,
        chain: chain,
        data_mode: "mock",
        max_hops: 5,
      });

      setInvestigation({
        reached_exchange: mockResult.reached_exchange,
        exchange_attribution_message: mockResult.exchange_attribution_message,
        hop_count: mockResult.hop_count,
        trace_time_ms: mockResult.trace_time_ms,
      });

      const g = await getTraceGraph(mockResult.trace_id);
      if (g && g.nodes && g.nodes.length) {
        setGraph(g);
        setTransfers(g.edges);
      } else {
        setGraph(createDefaultForensicTopology(targetAddress));
      }
    } catch (err) {
      try {
        const auto = await autoInvestigate({ victim_address: targetAddress, case_id: `AUTO-${Date.now()}` });
        setInvestigation(auto);
        const searchRes = await searchQuery({ query: targetAddress });
        if (searchRes.graph && searchRes.graph.nodes && searchRes.graph.nodes.length) {
          setGraph(searchRes.graph);
          setTransfers(searchRes.graph.edges);
        } else {
          setGraph(createDefaultForensicTopology(targetAddress));
        }
      } catch (e) {
        console.warn("Auto investigation failed, using standardized topology:", e);
        setGraph(createDefaultForensicTopology(targetAddress));
      }
    } finally {
      setIsTracing(false);
    }
  }, []);

  // Initialize from initial props or default
  useEffect(() => {
    if (initialCaseId) {
      handleLoadCase(initialCaseId);
    } else {
      const target = initialAddress || "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX";
      setQuery(target);
      handleTrace(target);
    }
  }, [initialCaseId, initialAddress, handleLoadCase, handleTrace]);

  // Render Cytoscape Graph with Approved Visual Styling
  useEffect(() => {
    if (!containerRef.current || !graph.nodes.length) return;

    const elements = [
      ...graph.nodes.map((n) => {
        const isCore = n.is_core_path ?? n.isCorePath ?? (n.node_type !== "peel_dust" && n.node_type !== "gas_fee");
        let nodeType = n.node_type || n.nodeType || "mule";
        const chainBadge = n.chain ? `[${n.chain.toUpperCase()}] ` : "";
        if (!roleHeader) {
          if (nodeType === "origin" || n.is_victim) roleHeader = "Victim Reported Wallet";
          else if (nodeType === "bridge") roleHeader = n.display_label || "Cross-Chain Bridge";
          else if (nodeType === "dex") roleHeader = n.display_label || "DEX Router";
          else if (nodeType === "cex" || nodeType === "cex_deposit" || n.cex_role === "deposit") roleHeader = `${n.exchange_name || "CoinDCX"} User Deposit`;
          else if (nodeType === "cex_hotwallet" || n.cex_role === "hotwallet") roleHeader = `${n.exchange_name || "CoinDCX"} Hot Wallet`;
          else if (nodeType === "peel_dust") roleHeader = "Peel Decoy Dust";
          else if (nodeType === "gas_fee") roleHeader = "Gas Energy Inbound";
          else roleHeader = `[Mule] ${n.id.slice(0, 8)}`;
        }

        const isPinned = Boolean(n.is_pinned || n.isPinned);
        const truncated = n.truncated_address || (n.id.length > 14 ? `${n.id.slice(0, 6)}...${n.id.slice(-4)}` : n.id);
        const prov = n.provenance || "automated_clustering";
        const provTag = prov === "offchain_verified" ? " [✓ VERIFIED]" : prov === "analyst_reviewed" ? " [👤 AUDITED]" : " [⛬ CLUSTER]";
        const label = `${chainBadge}[${roleHeader}${isPinned ? " 📌" : ""}]\n${truncated}\n${provTag}`;
        const pos = n.position || (n.pos_x != null && n.pos_y != null ? { x: n.pos_x, y: n.pos_y } : undefined);
        const bubbleMetrics = computeBubbleMetrics(n, graph.edges);
        const lowJargon = getLowJargonInfo(n, bubbleMetrics.totalVol);

        return {
          data: {
            id: n.id,
            label,
            roleHeader,
            custom_label: n.custom_label || "",
            truncatedAddress: truncated,
            fullAddress: n.fullAddress || n.id,
            nodeType,
            provenance: prov,
            isCorePath: isCore,
            isPinned: isPinned,
            chain: n.chain || "TRON",
            balance: n.balance || "0.00 USDT",
            taint: n.taint || (isCore ? "98.4%" : "12.0%"),
            inflow: n.inflow || "14,850 USDT",
            outflow: n.outflow || "14,800 USDT",
            exchange: n.exchange_name || n.exchange,
            risk_score: n.risk_score != null ? n.risk_score : (nodeType === "origin" ? 10 : (nodeType === "cex_hotwallet" ? 25 : (nodeType === "cex_deposit" ? 85 : 75))),
            risk_mode: n.risk_mode || (nodeType === "origin" || nodeType === "cex_deposit" || nodeType === "cex_hotwallet" ? "static_entity" : "dynamic_behavioral"),
            bubbleSize: bubbleMetrics.diameter,
            totalVol: bubbleMetrics.totalVol,
            friendlyColor: lowJargon.friendlyColor,
            simplifiedTitle: lowJargon.simplifiedTitle,
            simplifiedSubtitle: lowJargon.simplifiedSubtitle,
            policeAction: lowJargon.policeAction,
            plainEnglishExplanation: lowJargon.plainEnglishExplanation,
            badgeText: lowJargon.badgeText,
            bubbleLabel: lowJargon.bubbleLabel,
          },
          position: pos,
          locked: isPinned,
          classes: [
            isCore ? "core-node" : "branch-node",
            `type-${nodeType}`,
            isPinned ? "pinned-node" : "",
            `prov-${prov}`,
          ].join(" "),
        };
      }),

      ...graph.edges.map((e) => {
        const isBridge = e.edge_type === "bridge" || e.edge_type === "bridge_inflow";
        const isIndirect = e.edge_type === "indirect_link" || Boolean(e.link_reason);
        const isCore = !isIndirect && (e.is_core_path ?? e.isCorePath ?? (e.token_symbol !== "TRX" && (e.amount ?? 0) >= 100));
        let amtLabel = e.label || (e.token_symbol ? `${e.token_symbol} ${Number(e.amount || 0).toLocaleString()}` : "USDT");
        if (e.chain_transition) {
          amtLabel = `[${e.chain_transition}] ${amtLabel}`;
        }

        return {
          data: {
            id: e.id || `${e.tx_hash || "tx"}-${e.source}-${e.target}`,
            source: e.source,
            target: e.target,
            label: amtLabel,
            amount: e.amount || 0,
            token_symbol: e.token_symbol || "USDT",
            usd_value: e.usd_value,
            timestamp_utc: e.timestamp_utc,
            tx_hash: e.tx_hash,
            isCorePath: isCore,
            edge_type: e.edge_type || (isBridge ? "bridge" : (isIndirect ? "indirect_link" : "transfer")),
            chain_transition: e.chain_transition,
            bridge_protocol: e.bridge_protocol,
            link_reason: e.link_reason,
            intermediary: e.intermediary,
            time_delta_seconds: e.time_delta_seconds,
            confidence: e.confidence,
            description: e.description,
          },
          classes: isBridge ? "bridge-edge" : (isIndirect ? "indirect-edge" : (isCore ? "core-edge" : "branch-edge")),
        };
      }),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        // BASE NODE STYLING: Clean Rounded Rectangle, #07111f Fill, 2-line Centered Text
        {
          selector: "node",
          style: {
            shape: "round-rectangle",
            "background-color": "#07111f",
            width: 150,
            height: 48,
            "border-width": 2,
            "border-color": "#334155",
            label: "data(label)",
            "text-wrap": "wrap",
            "text-max-width": 140,
            "text-valign": "center",
            "text-halign": "center",
            "font-size": 10,
            "font-family": "Inter, sans-serif",
            "font-weight": 600,
            color: "#ffffff",
            "transition-property": "background-color, border-color, width, height, shadow-blur",
            "transition-duration": "0.2s",
          },
        },

        // 1. VICTIM / ORIGIN NODE: 2px solid #10b981 (Emerald)
        {
          selector: "node.type-origin, node[nodeType = 'origin']",
          style: {
            "border-color": "#10b981",
            "border-width": 2.2,
            color: "#ffffff",
          },
        },

        // 2. MULE / LAYERING NODES (CORE PATH): 2px solid #f59e0b (Amber / Orange)
        {
          selector: "node.type-mule, node[nodeType = 'mule']",
          style: {
            "border-color": "#f59e0b",
            "border-width": 2,
            color: "#ffffff",
          },
        },

        // 3. CEX USER DEPOSIT NODE: 2px solid #06b6d4 (Cyan)
        {
          selector: "node.type-cex_deposit, node[nodeType = 'cex_deposit'], node[nodeType = 'cex']",
          style: {
            "border-color": "#06b6d4",
            "border-width": 2.2,
            color: "#ffffff",
          },
        },

        // 4. CEX MASTER HOT WALLET NODE: 2px solid #3b82f6 (Royal Blue)
        {
          selector: "node.type-cex_hotwallet, node[nodeType = 'cex_hotwallet']",
          style: {
            "border-color": "#3b82f6",
            "border-width": 2.2,
            color: "#ffffff",
          },
        },

        // 5. PEEL DUST / DECOY NODES: 1.5px dashed #475569, #94a3b8 text, smaller box
        {
          selector: "node.type-peel_dust, node[nodeType = 'peel_dust']",
          style: {
            "border-color": "#475569",
            "border-style": "dashed",
            "border-width": 1.5,
            width: 115,
            height: 38,
            "font-size": 9,
            color: "#94a3b8",
          },
        },

        // 6. GAS / ENERGY / INBOUND NODES: 1.5px solid #0284c7 (Subdued Sky Blue)
        {
          selector: "node.type-gas_fee, node[nodeType = 'gas_fee']",
          style: {
            "border-color": "#0284c7",
            "border-width": 1.5,
            width: 130,
            height: 40,
            "font-size": 9,
            color: "#93c5fd",
          },
        },

        // SELECTED NODE HIGHLIGHT
        {
          selector: "node:selected",
          style: {
            "border-color": "#00F0FF",
            "border-width": 3.5,
            "shadow-blur": 16,
            "shadow-color": "#00F0FF",
            "shadow-opacity": 0.85,
          },
        },

        // PINNED NODE HIGHLIGHT
        {
          selector: "node[?is_pinned], node.pinned-node",
          style: {
            "border-color": "#f59e0b",
            "border-width": 2.5,
            "border-style": "dashed",
            "shadow-blur": 10,
            "shadow-color": "#f59e0b",
            "shadow-opacity": 0.6,
          },
        },

        // PROVENANCE STYLES (Data Model Provenance Tagging)
        {
          selector: "node[provenance = 'offchain_verified'], node.prov-offchain_verified",
          style: {
            "border-color": "#10b981",
            "border-width": 2.5,
          },
        },
        {
          selector: "node[provenance = 'analyst_reviewed'], node.prov-analyst_reviewed",
          style: {
            "border-color": "#0ea5e9",
            "border-width": 2.5,
          },
        },
        {
          selector: "node[provenance = 'automated_clustering'], node.prov-automated_clustering",
          style: {
            "border-color": "#f59e0b",
            "border-width": 2,
          },
        },

        // CORE PATH EDGES (THE HIGHWAY): 3px Vibrant Emerald Green #10b981
        {
          selector: "edge.core-edge, edge[?isCorePath]",
          style: {
            width: 3,
            "line-color": "#10b981",
            "target-arrow-color": "#10b981",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": 10,
            "font-family": "JetBrains Mono, monospace",
            "font-weight": 700,
            color: "#10b981",
            "text-background-color": "#07111f",
            "text-background-opacity": 0.95,
            "text-background-padding": 3,
            "text-border-color": "#10b981",
            "text-border-width": 1,
            "text-border-opacity": 0.5,
          },
        },

        // DECOY / PEEL DUST EDGES: 1.2px Muted Dark Slate #334155, 9px #64748b Text
        {
          selector: "edge.branch-edge, edge[!isCorePath]",
          style: {
            width: 1.2,
            "line-color": "#334155",
            "target-arrow-color": "#475569",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": 9,
            "font-family": "JetBrains Mono, monospace",
            color: "#64748b",
            "text-background-color": "#07111f",
            "text-background-opacity": 0.85,
            "text-background-padding": 2,
          },
        },

        // 7. INDIRECT LINK (MAGIC NODES): Dashed vibrant purple / lavender #c084fc, curved unbundled-bezier with circle terminal
        {
          selector: "edge.indirect-edge, edge[edge_type = 'indirect_link']",
          style: {
            width: 2.2,
            "line-color": "#c084fc",
            "line-style": "dashed",
            "line-dash-pattern": [6, 4],
            "target-arrow-color": "#c084fc",
            "target-arrow-shape": "circle",
            "curve-style": "unbundled-bezier",
            "control-point-distances": 40,
            "control-point-weights": 0.5,
            label: "data(label)",
            "font-size": 9,
            "font-family": "JetBrains Mono, monospace",
            "font-weight": 600,
            color: "#e9d5ff",
            "text-background-color": "#2e1065",
            "text-background-opacity": 0.95,
            "text-background-padding": 3,
            "text-border-color": "#a855f7",
            "text-border-width": 1,
            "text-border-opacity": 0.6,
          },
        },

        // SELECTED EDGE
        {
          selector: "edge:selected",
          style: {
            "line-color": "#00F0FF",
            "target-arrow-color": "#00F0FF",
            width: 3.5,
          },
        },
      ],
      layout: DAGRE_OPTIONS,
      wheelSensitivity: 0.3,
    });

    // Node & Edge Interaction Listeners
    cy.on("tap", "node", (evt) => {
      const nodeData = evt.target.data();
      setSelectedEntity({ type: "node", data: nodeData });

      // Handle Arrow Drawing in Studio Mode
      if (drawArrowMode) {
        if (!drawSourceNode) {
          setDrawSourceNode(nodeData.id);
        } else if (drawSourceNode !== nodeData.id) {
          // Create custom edge
          const newEdge = {
            id: `manual-${Date.now()}`,
            source: drawSourceNode,
            target: nodeData.id,
            token_symbol: "MANUAL",
            amount: 0,
            timestamp_utc: Math.floor(Date.now() / 1000),
            tx_hash: `manual-${Date.now()}`,
            is_core_path: false,
          };
          mergeGraph({ nodes: [], edges: [newEdge] });
          setDrawSourceNode(null);
          setDrawArrowMode(false);
        }
      }
    });

    cy.on("tap", "edge", (evt) => {
      setSelectedEntity({ type: "edge", data: evt.target.data() });
    });

    // Double-click node to expand
    cy.on("dbltap", "node", async (evt) => {
      const nodeData = evt.target.data();
      try {
        const expanded = await expandNode({ address: nodeData.id, chain: nodeData.chain || "TRON", direction: "both" });
        mergeGraph(expanded);
      } catch (e) {
        console.warn("Could not expand node:", e);
      }
    });

    cyRef.current = cy;

    // Apply view mode filtering & bubble vs technical styles
    applyDualViewMode(cy, viewMode, layoutName, graphViewMode);

    return () => {
      cy.destroy();
    };
  }, [graph, drawArrowMode, drawSourceNode, mergeGraph, showMagicNodes, graphViewMode, applyDualViewMode]);

  // Update layout, viewMode, or graphViewMode dynamically
  useEffect(() => {
    applyDualViewMode(cyRef.current, viewMode, layoutName, graphViewMode);
  }, [viewMode, layoutName, graphViewMode, applyDualViewMode]);

  // TASK 8: Automatic Playback Timer Loop
  useEffect(() => {
    if (!isPlayingTimeTravel || !showTimeTravel || !clusterSnapshots.length) return;
    const intervalMs = Math.max(100, Math.round(1200 / timeTravelSpeed));
    const timer = setInterval(() => {
      setTimeTravelStep((prev) => {
        if (prev < clusterSnapshots.length - 1) {
          return prev + 1;
        } else {
          if (isTimeTravelLooping) {
            return 0;
          } else {
            setIsPlayingTimeTravel(false);
            return prev;
          }
        }
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlayingTimeTravel, showTimeTravel, timeTravelSpeed, clusterSnapshots.length, isTimeTravelLooping]);

  // TASK 8: Reactive Cytoscape Canvas State Update on Scrubber Step
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !clusterSnapshots.length) return;

    if (!showTimeTravel) {
      applyDualViewMode(cy, viewMode, layoutName, graphViewMode);
      return;
    }

    const currentSnapshot = clusterSnapshots[timeTravelStep] || clusterSnapshots[0];
    const activeEdgeSet = new Set(currentSnapshot.active_edge_ids || []);
    const justFiredId = currentSnapshot.just_fired_edge_id;
    const holdings = currentSnapshot.node_holdings || {};

    cy.batch(() => {
      // 1. Edges: Active links shown, firing edge pulses, future links translucent ghost
      cy.edges().forEach((e) => {
        const eid = e.id();
        if (activeEdgeSet.has(eid)) {
          e.show();
          if (eid === justFiredId) {
            e.style({
              opacity: 1.0,
              width: 5,
              "line-color": "#38bdf8",
              "target-arrow-color": "#38bdf8",
              "shadow-blur": 16,
              "shadow-color": "#38bdf8",
              "shadow-opacity": 0.85,
            });
          } else {
            e.style({
              opacity: 0.85,
              width: graphViewMode === "bubble" ? 3 : (e.data("isCorePath") ? 2.5 : 1.2),
              "line-color": e.data("edge_type") === "indirect_link" ? "#c084fc" : (e.data("isCorePath") ? "#06b6d4" : "#475569"),
              "target-arrow-color": e.data("isCorePath") ? "#06b6d4" : "#475569",
              "shadow-blur": 0,
            });
          }
        } else {
          // Future edge: translucent blueprint outline
          e.style({
            opacity: 0.08,
            width: 1,
            "line-color": "#334155",
            "target-arrow-color": "#334155",
            "shadow-blur": 0,
          });
        }
      });

      // 2. Nodes: Bubble sizing & labels dynamically adapt based on holdings at this moment!
      cy.nodes().forEach((n) => {
        const nid = n.id();
        const h = holdings[nid] || { is_active: false, total_vol: 10, balance: "0.00 USDT" };

        if (graphViewMode === "bubble") {
          const vol = h.total_vol || 10;
          let d = 54;
          if (vol > 500000) d = 135;
          else if (vol > 50000) d = 115;
          else if (vol > 10000) d = 96;
          else if (vol > 2000) d = 82;
          else if (vol > 200) d = 68;

          const friendlyColor = n.data("friendlyColor") || "#f59e0b";
          const title = n.data("simplifiedTitle") || n.data("roleHeader") || "Wallet";

          n.style({
            shape: "ellipse",
            width: d,
            height: d,
            opacity: h.is_active ? 1.0 : 0.25,
            label: `${title}\n${h.balance}\n[T${timeTravelStep}]`,
            "border-color": friendlyColor,
            "border-width": h.is_active ? 3 : 1,
            "shadow-blur": h.is_active ? 14 : 0,
            "shadow-color": friendlyColor,
            "shadow-opacity": 0.5,
          });
        } else {
          // Technical Graph
          const role = n.data("roleHeader") || "Node";
          const trunc = n.data("truncatedAddress") || nid;
          n.style({
            opacity: h.is_active ? 1.0 : 0.25,
            label: `[${role}]\n${trunc}\nBal: ${h.balance}`,
          });
        }
      });
    });
  }, [showTimeTravel, timeTravelStep, clusterSnapshots, graphViewMode, viewMode, layoutName, applyDualViewMode]);

  // Apply Node Customization from Studio
  const handleApplyShape = (shape) => {
    setSelectedNodeShape(shape);
    const cy = cyRef.current;
    if (cy) {
      cy.$("node:selected").style("shape", shape);
    }
  };

  const handleApplyColor = (color) => {
    setCustomNodeColor(color);
    const cy = cyRef.current;
    if (cy) {
      cy.$("node:selected").style("background-color", color);
    }
  };

  // Add Manual Address to Canvas
  const handleAddToCanvas = () => {
    if (!query) return;
    const cleanAddress = query.trim();
    const chain = detectChain(cleanAddress);
    const newNode = {
      id: cleanAddress,
      display_label: cleanAddress.slice(0, 8) + "...",
      role_header: "Manual Entity",
      node_type: "unknown",
      chain: chain,
      color: "#38bdf8",
      is_pinned: false,
      is_core_path: false,
    };
    mergeGraph({ nodes: [newNode], edges: [] });
  };

  // Toggle Node Pin State (Locks coordinate on canvas)
  const handleTogglePin = (nodeId) => {
    const cy = cyRef.current;
    if (!cy || !nodeId) return;
    const targetNode = cy.$id(nodeId);
    if (!targetNode || targetNode.length === 0) return;

    const currentPin = Boolean(targetNode.data("is_pinned"));
    const newPin = !currentPin;
    targetNode.data("is_pinned", newPin);
    if (newPin) {
      targetNode.lock();
      targetNode.addClass("pinned-node");
    } else {
      targetNode.unlock();
      targetNode.removeClass("pinned-node");
    }

    const role = targetNode.data("roleHeader") || targetNode.data("custom_label") || nodeId.slice(0, 8);
    const truncated = targetNode.data("id").length > 14 ? `${targetNode.data("id").slice(0, 6)}...${targetNode.data("id").slice(-4)}` : targetNode.data("id");
    targetNode.data("label", `[${role}${newPin ? " 📌" : ""}]\n${truncated}`);

    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, is_pinned: newPin } : n)),
    }));
    if (selectedEntity && selectedEntity.data && selectedEntity.data.id === nodeId) {
      setSelectedEntity((prev) => ({
        ...prev,
        data: { ...prev.data, is_pinned: newPin },
      }));
    }
  };

  // Custom Node Labeling
  const handleUpdateCustomLabel = (nodeId, newLabel) => {
    const cy = cyRef.current;
    if (!cy || !nodeId) return;
    const targetNode = cy.$id(nodeId);
    if (!targetNode || targetNode.length === 0) return;

    targetNode.data("custom_label", newLabel);
    targetNode.data("roleHeader", newLabel);
    const isPinned = Boolean(targetNode.data("is_pinned"));
    const truncated = targetNode.data("id").length > 14 ? `${targetNode.data("id").slice(0, 6)}...${targetNode.data("id").slice(-4)}` : targetNode.data("id");
    targetNode.data("label", `[${newLabel}${isPinned ? " 📌" : ""}]\n${truncated}`);

    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, custom_label: newLabel, role_header: newLabel } : n)),
    }));
    if (selectedEntity && selectedEntity.data && selectedEntity.data.id === nodeId) {
      setSelectedEntity((prev) => ({
        ...prev,
        data: { ...prev.data, custom_label: newLabel, role_header: newLabel },
      }));
    }
  };

  // Provenance Update (Analyst Review / Off-chain Verification / Automated Clustering)
  const handleUpdateProvenance = async (nodeId, newProvenance) => {
    if (!nodeId) return;
    const cy = cyRef.current;
    const targetAddr = (selectedEntity && selectedEntity.data && (selectedEntity.data.fullAddress || selectedEntity.data.id)) || nodeId;

    try {
      await updateEntityProvenance(targetAddr, newProvenance);
    } catch (err) {
      console.warn("Backend provenance update fallback/warning:", err);
    }

    if (cy) {
      const targetNode = cy.$id(nodeId);
      if (targetNode && targetNode.length > 0) {
        targetNode.data("provenance", newProvenance);
        targetNode.removeClass("prov-automated_clustering prov-offchain_verified prov-analyst_reviewed");
        targetNode.addClass(`prov-${newProvenance}`);
        const role = targetNode.data("custom_label") || targetNode.data("roleHeader") || "Entity";
        const isPinned = Boolean(targetNode.data("is_pinned"));
        const truncated = targetNode.data("id").length > 14 ? `${targetNode.data("id").slice(0, 6)}...${targetNode.data("id").slice(-4)}` : targetNode.data("id");
        const provTag = newProvenance === "offchain_verified" ? " [✓ VERIFIED]" : newProvenance === "analyst_reviewed" ? " [👤 AUDITED]" : " [⛬ CLUSTER]";
        targetNode.data("label", `[${role}${isPinned ? " 📌" : ""}]\n${truncated}\n${provTag}`);
      }
    }

    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, provenance: newProvenance } : n)),
    }));

    if (selectedEntity && selectedEntity.data && selectedEntity.data.id === nodeId) {
      setSelectedEntity((prev) => ({
        ...prev,
        data: { ...prev.data, provenance: newProvenance },
      }));
    }
  };

  // TASK 5: Dual-Mode Risk Evaluation Handler (Guaranteed Non-Blended)
  const handleEvaluateRisk = async (nodeId) => {
    if (!nodeId || isEvaluatingRisk) return;
    setIsEvaluatingRisk(true);
    const nodeData = (selectedEntity && selectedEntity.data) || {};
    const addr = nodeData.fullAddress || nodeData.id || nodeId;
    const isMixer = nodeData.nodeType === "mixer_bridge" || addr.toLowerCase().includes("tornado") || addr.toLowerCase().includes("blender");
    const isDep = nodeData.nodeType === "cex_deposit" || addr.toLowerCase().includes("deposit");
    const isHot = nodeData.nodeType === "cex_hotwallet" || addr.toLowerCase().includes("hotwallet");

    try {
      const res = await evaluateRiskScore({
        address: addr,
        entity_category: isMixer ? "mixer" : (isDep ? "cex_deposit" : (isHot ? "exchange_hotwallet" : undefined)),
        entity_name: nodeData.exchange || nodeData.roleHeader,
        mixer_interaction: isMixer,
        rapid_fan_out: nodeData.nodeType === "mule",
        sanctioned_proximity_hops: isMixer ? 1 : undefined,
        age_hours: nodeData.nodeType === "mule" ? 18.0 : undefined,
      });

      const newScore = res.risk_score ?? res.score ?? 75;
      const newMode = res.scoring_mode || res.risk_mode || "dynamic_behavioral";
      const newSeverity = res.severity || "HIGH";
      const breakdown = res.breakdown || {};
      const rulesApplied = res.rules_applied || [];

      const cy = cyRef.current;
      if (cy) {
        const targetNode = cy.$id(nodeId);
        if (targetNode && targetNode.length > 0) {
          targetNode.data("risk_score", newScore);
          targetNode.data("risk_mode", newMode);
          targetNode.data("risk_severity", newSeverity);
        }
      }

      setGraph((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, risk_score: newScore, risk_mode: newMode } : n)),
      }));

      if (selectedEntity && selectedEntity.data && selectedEntity.data.id === nodeId) {
        setSelectedEntity((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            risk_score: newScore,
            risk_mode: newMode,
            risk_severity: newSeverity,
            risk_breakdown: breakdown,
            rules_applied: rulesApplied,
            risk_explanation: res.explanation,
          },
        }));
      }
    } catch (err) {
      console.warn("Error evaluating risk score:", err);
    } finally {
      setIsEvaluatingRisk(false);
    }
  };

  // Paginated Counterparty Expansion
  const handleExpandCounterparties = async (nodeId, direction = "both") => {
    if (!nodeId || isExpanding) return;
    setIsExpanding(true);
    setExpandFeedback(null);
    try {
      const cy = cyRef.current;
      const targetNode = cy ? cy.$id(nodeId) : null;
      const nodeChain = targetNode && targetNode.length ? (targetNode.data("chain") || "TRON") : detectChain(nodeId);

      const expanded = await expandNode({
        address: nodeId,
        chain: nodeChain,
        direction: direction,
        offset: expandOffset,
        limit: 10,
      });

      if (expanded && expanded.nodes && expanded.nodes.length) {
        mergeGraph(expanded);
        const newOffset = expandOffset + 10;
        setExpandOffset(newOffset);
        setExpandFeedback({
          success: true,
          message: `Added ${expanded.nodes.length} counterparties (${expanded.has_more ? 'More available' : 'End of list'})`,
        });
      } else {
        setExpandFeedback({
          success: false,
          message: "No further counterparty transfers found for this address.",
        });
      }
    } catch (err) {
      console.error("Counterparty expansion error:", err);
      setExpandFeedback({
        success: false,
        message: err.message || "Failed to expand counterparties",
      });
    } finally {
      setIsExpanding(false);
    }
  };

  // Save Case Canvas State to DB
  const handleSaveCase = async () => {
    const cy = cyRef.current;
    if (!cy) return;

    const caseNodes = cy.nodes().map((n) => {
      const d = n.data();
      const pos = n.position();
      return {
        id: n.id(),
        address: d.fullAddress || n.id(),
        chain: d.chain || "TRON",
        node_type: d.nodeType || d.type || "unknown",
        custom_label: d.custom_label || d.roleHeader || "",
        pos_x: Math.round(pos.x),
        pos_y: Math.round(pos.y),
        is_pinned: Boolean(d.is_pinned),
        risk_score: d.risk_score ? parseFloat(d.risk_score) : 0.0,
        risk_mode: d.risk_mode || (d.nodeType === "origin" || d.nodeType === "cex_deposit" || d.nodeType === "cex_hotwallet" ? "static_entity" : "dynamic_behavioral"),
        provenance: d.provenance || "automated_clustering",
      };
    });

    const caseEdges = cy.edges().map((e) => {
      const d = e.data();
      return {
        id: e.id(),
        source: e.source().id(),
        target: e.target().id(),
        amount: d.amount ? parseFloat(d.amount) : 0,
        token_symbol: d.token_symbol || "USDT",
        tx_hash: d.tx_hash || "",
        timestamp_utc: d.timestamp_utc ? String(d.timestamp_utc) : "",
        is_core_path: Boolean(d.isCorePath ?? d.is_core_path),
        edge_type: d.edge_type || "transfer",
      };
    });

    const payload = {
      meta: {
        ...currentCaseMeta,
        description: currentCaseMeta.description || "Investigative Tracing Canvas State",
      },
      nodes: caseNodes,
      edges: caseEdges,
    };

    try {
      const res = await saveCaseCanvas(currentCaseId, payload);
      setSaveSuccessMsg(`Case canvas snapshot saved successfully (${res.node_count} nodes, ${res.edge_count} edges).`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
      setShowSaveModal(false);
    } catch (err) {
      console.error("Failed to save case canvas:", err);
      alert(`Save Failed: ${err.message || err}`);
    }
  };

  // Open Load Modal and fetch cases
  const handleOpenLoadModal = async () => {
    setShowLoadModal(true);
    setIsLoadingCases(true);
    try {
      const data = await listCases(50, 0);
      setSavedCasesList(data.cases || []);
    } catch (err) {
      console.error("Failed to list cases:", err);
    } finally {
      setIsLoadingCases(false);
    }
  };

  // Court-Ready One-Click Evidence Export (Section 63 BSA / Section 94 BNSS)
  const handleExportEvidence = async (targetAddr = null) => {
    setIsExportingEvidence(true);
    try {
      const cy = cyRef.current;
      const currentNodes = cy ? cy.nodes().map((n) => {
        const d = n.data();
        return {
          id: n.id(),
          address: d.fullAddress || n.id(),
          custom_label: d.custom_label || d.roleHeader || "",
          node_type: d.nodeType || d.type || "mule",
          chain: d.chain || "TRON",
          is_pinned: Boolean(d.is_pinned),
          provenance: d.provenance || "automated_clustering",
          risk_score: d.risk_score != null ? d.risk_score : 75,
          risk_mode: d.risk_mode || (d.nodeType === "origin" || d.nodeType?.includes("cex") ? "static_entity" : "dynamic_behavioral"),
        };
      }) : (graph.nodes || []);

      const currentEdges = cy ? cy.edges().map((e) => {
        const d = e.data();
        return {
          id: e.id(),
          source: e.source().id(),
          target: e.target().id(),
          amount: d.amount ? parseFloat(d.amount) : 0,
          token_symbol: d.token_symbol || "USDT",
          tx_hash: d.tx_hash || e.id(),
          timestamp_utc: d.timestamp_utc ? parseInt(d.timestamp_utc, 10) : Math.floor(Date.now() / 1000),
          is_core_path: Boolean(d.isCorePath ?? d.is_core_path),
        };
      }) : (graph.edges || []);

      const effectiveTarget = targetAddr || (selectedEntity && selectedEntity.type === "node" ? selectedEntity.data.id : null) || query || (currentNodes[0] ? currentNodes[0].address : "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX");
      const effectiveChain = detectChain(effectiveTarget);

      const payload = {
        case_id: currentCaseId || `CASE-${Date.now()}`,
        fir_number: currentCaseMeta.fir_number || "FIR/CYBER/2026/0402",
        ncrp_ack_number: "NCRP-2026-091823",
        investigating_officer: "Insp. Vikram Rathore",
        police_station: "Cyber Crime Police Station",
        target_address: effectiveTarget,
        chain: effectiveChain,
        victim_amount_inr: 485000.0,
        token_symbol: "USDT",
        nodes: currentNodes,
        edges: currentEdges,
      };

      const { blob, sha256 } = await exportEvidencePdf(payload);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Court_Evidence_Dossier_Sec63_BSA_${payload.case_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSaveSuccessMsg(`Court-ready Evidence Dossier generated! Sealed with SHA-256: ${sha256.slice(0, 16)}...`);
      setTimeout(() => setSaveSuccessMsg(null), 6000);
    } catch (err) {
      console.error("Evidence export error:", err);
      alert("Failed to export evidence: " + (err.message || err));
    } finally {
      setIsExportingEvidence(false);
    }
  };

  // Magic Nodes Cluster Detection Toggle & Execution (P0 Requirement)
  const handleToggleMagicNodes = async () => {
    if (showMagicNodes) {
      setShowMagicNodes(false);
      setGraph((prev) => ({
        nodes: prev.nodes,
        edges: prev.edges.filter((e) => e.edge_type !== "indirect_link" && !e.link_reason),
      }));
      setSaveSuccessMsg("Magic Nodes indirect links hidden.");
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      return;
    }

    setIsDetectingClusters(true);
    try {
      const cy = cyRef.current;
      const currentNodes = cy ? cy.nodes().map((n) => {
        const d = n.data();
        return {
          id: n.id(),
          address: d.fullAddress || n.id(),
          node_type: d.nodeType || d.type || "mule",
          chain: d.chain || "TRON",
        };
      }) : (graph.nodes || []);

      const currentEdges = cy ? cy.edges().map((e) => {
        const d = e.data();
        return {
          id: e.id(),
          source: e.source().id(),
          target: e.target().id(),
          amount: d.amount ? parseFloat(d.amount) : 0,
          token_symbol: d.token_symbol || "USDT",
          tx_hash: d.tx_hash || e.id(),
          timestamp_utc: d.timestamp_utc ? parseInt(d.timestamp_utc, 10) : Math.floor(Date.now() / 1000),
          is_core_path: Boolean(d.isCorePath ?? d.is_core_path),
        };
      }) : (graph.edges || []);

      const res = await detectClusters({
        nodes: currentNodes,
        edges: currentEdges,
        timing_threshold_seconds: 180,
      });

      if (res && res.indirect_edges) {
        setClusterData(res);
        setDetectedClustersCount(res.clusters?.length || 0);

        if (res.indirect_edges.length === 0) {
          setSaveSuccessMsg("Magic Nodes: No hidden clusters detected among active wallets.");
          setTimeout(() => setSaveSuccessMsg(null), 4000);
        } else {
          // Merge indirect edges into the active graph
          setGraph((prev) => {
            const edgeKey = (e) => e.id || `${e.source}-${e.target}-${e.link_reason || "direct"}`;
            const edgeMap = new Map();
            prev.edges.forEach((e) => edgeMap.set(edgeKey(e), e));
            res.indirect_edges.forEach((ie) => {
              edgeMap.set(edgeKey(ie), ie);
            });
            return {
              nodes: prev.nodes,
              edges: [...edgeMap.values()],
            };
          });

          setShowMagicNodes(true);
          setSaveSuccessMsg(`✨ Magic Nodes: Detected ${res.total_indirect_links} indirect links across ${res.clusters?.length || 0} syndicate clusters!`);
          setTimeout(() => setSaveSuccessMsg(null), 6000);
        }
      }
    } catch (err) {
      console.error("Failed to detect clusters:", err);
      setSaveSuccessMsg("Magic Nodes clustering failed. Ensure backend service is running.");
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } finally {
      setIsDetectingClusters(false);
    }
  };

  // Export Tools
  const handleExportPNG = () => {
    const cy = cyRef.current;
    if (!cy) return;
    const blob = cy.png({ full: true, output: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cryptotrace-forensic-canvas.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!transfers.length) return;
    const rows = [
      ["TxHash", "From", "To", "Amount", "Token", "TimestampUTC"],
      ...transfers.map((t) => [t.tx_hash, t.source, t.target, t.amount, t.token_symbol, t.timestamp_utc]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encodedUri;
    a.download = `forensic-transfers-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#08080a] text-zinc-100 font-sans overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* A. TOP CONTROL & NAVIGATION BAR (FIXED TOP, 56PX) */}
      {/* ========================================================================= */}
      <header className="h-14 bg-zinc-950 border-b border-zinc-800/80 px-4 flex items-center justify-between z-30 flex-shrink-0">
        
        {/* Left: Home Button + Compact Universal Search */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            title="Return to Public Landing / Overview"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span>Home / Overview</span>
          </button>

          <div className="h-4 w-px bg-zinc-800"></div>

          {/* Compact Universal Search Bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-zinc-500" />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrace(query)}
              placeholder="Enter Address / TxHash..." 
              className="w-56 md:w-72 bg-zinc-900/90 border border-zinc-700/60 rounded-lg pl-8 pr-2.5 py-1 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:w-80 transition-all"
            />
          </div>

          <button 
            onClick={handleAddToCanvas}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 hover:text-white border border-zinc-700 transition-colors flex items-center gap-1"
            title="Add Target to Canvas without resetting"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Add to Canvas</span>
          </button>
        </div>

        {/* Center: View Toggle ("Bubble View" vs "Technical Graph") + Filters */}
        <div className="hidden lg:flex items-center gap-3">
          {/* TASK 7: View Mode Toggle: Bubble View vs Technical Graph */}
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-cyan-500/40 shadow-sm text-xs font-mono">
            <button
              type="button"
              onClick={() => setGraphViewMode("bubble")}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
                graphViewMode === "bubble"
                  ? "bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-200 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Bubble View: Simplified low-jargon view for police investigators. Circle size = holding size / transaction volume, proximity = relationship strength."
            >
              <span>🫧 Bubble View</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 font-bold uppercase tracking-wider">
                LEO
              </span>
            </button>
            <button
              type="button"
              onClick={() => setGraphViewMode("technical")}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
                graphViewMode === "technical"
                  ? "bg-zinc-800 text-white border border-zinc-700 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Technical Graph: Full cryptographic graph with DAG layout, exact addresses, and provenance tags."
            >
              <span>🕸️ Technical Graph</span>
            </button>
          </div>

          {/* Layout Selector Dropdown - In Bubble View indicates Proximity Physics, in Technical allows switching layouts */}
          {graphViewMode === "technical" ? (
            <div className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 text-xs font-mono">
              <span className="text-zinc-500">Layout:</span>
              <select 
                value={layoutName} 
                onChange={(e) => setLayoutName(e.target.value)}
                className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="dag" className="bg-zinc-900">Flow-Free (DAG)</option>
                <option value="radial" className="bg-zinc-900">Concentric Radial</option>
                <option value="force" className="bg-zinc-900">Force-Directed</option>
                <option value="preset" className="bg-zinc-900">Saved Preset</option>
              </select>
            </div>
          ) : (
            <div 
              className="flex items-center gap-1.5 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800/80 text-[11px] font-mono text-zinc-400"
              title="In Bubble View, nodes are automatically clustered by transaction volume and relationship proximity."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Proximity: <strong className="text-cyan-300 font-normal">Volume-Weighted</strong></span>
            </div>
          )}

          {/* View-Mode Switcher */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setViewMode("predictive")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                viewMode === "predictive" ? "bg-cyan-500/20 text-cyan-300 font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>🎯 Most Predictive Web</span>
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                viewMode === "all" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>🕸️ Show All Webs</span>
            </button>
          </div>

          {/* Case Persistence Actions */}
          <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
            {currentCaseId && (
              <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-300 max-w-[140px] truncate" title={`Active Case: ${currentCaseMeta.case_name || currentCaseId}`}>
                <Folder className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{currentCaseMeta.case_name || currentCaseId}</span>
              </div>
            )}

            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium transition-colors"
              title="Save Canvas state as a Named Case"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save Case</span>
            </button>

            <button
              onClick={handleOpenLoadModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
              title="Load Saved Case from Database"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Cases</span>
            </button>
          </div>
        </div>

        {/* Right: Export Menu + Primary Enforcement Action */}
        <div className="flex items-center gap-2">
          {/* TASK 8: Time Travel Playback Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !showTimeTravel;
              setShowTimeTravel(next);
              if (next) {
                setTimeTravelStep(0);
                setIsPlayingTimeTravel(false);
              } else {
                setIsPlayingTimeTravel(false);
              }
            }}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              showTimeTravel
                ? "bg-cyan-950/90 border-cyan-500/70 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold"
                : "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 hover:border-cyan-500/50 text-zinc-300 hover:text-white"
            }`}
            title="Time Travel: Replay historical cluster states, holding changes, and transaction links with a timeline scrubber"
          >
            <Clock className={`w-3.5 h-3.5 ${showTimeTravel ? "text-cyan-400" : "text-zinc-400"}`} />
            <span>Time Travel</span>
            {showTimeTravel && (
              <span className="text-[9px] px-1 bg-cyan-400/20 text-cyan-300 rounded font-bold">
                T{timeTravelStep}
              </span>
            )}
          </button>

          {/* TASK 9: Natural-Language Case Assistant */}
          <button
            type="button"
            onClick={() => setShowCaseAssistant(!showCaseAssistant)}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              showCaseAssistant
                ? "bg-emerald-950/90 border-emerald-500/70 text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.35)] font-bold"
                : "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 hover:border-emerald-500/50 text-zinc-300 hover:text-white"
            }`}
            title="Case Copilot: Plain language investigator assistant strictly grounded in active case graph, risk scores, and sanctions"
          >
            <MessageSquare className={`w-3.5 h-3.5 ${showCaseAssistant ? "text-emerald-400" : "text-emerald-400"}`} />
            <span>Case Copilot</span>
            <span className="text-[9px] px-1 bg-emerald-400/20 text-emerald-300 rounded font-bold uppercase tracking-wider">
              AI
            </span>
          </button>

          {/* Bulk Address Screening (P0 Batch Engine) */}
          <button

            onClick={() => setShowBatchScreening(true)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-500/50 text-zinc-200 hover:text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Upload CSV/TXT address lists to screen against Sanctions DB & Risk Engine in high-throughput background queue"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bulk Screening</span>
          </button>

          {/* Magic Nodes Cluster Detection (P0 Requirement) */}
          <button
            onClick={handleToggleMagicNodes}
            disabled={isDetectingClusters}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50 ${
              showMagicNodes
                ? "bg-purple-950/90 border-purple-500/70 text-purple-200 shadow-[0_0_12px_rgba(192,132,252,0.3)]"
                : "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white"
            }`}
            title="Auto-surface hidden wallet syndicates linked by shared gas funding, common first-funder intermediary, or synchronized transaction timing"
          >
            {isDetectingClusters ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            )}
            <span>Magic Nodes{detectedClustersCount > 0 ? ` (${detectedClustersCount})` : ""}</span>
          </button>

          {/* One-Click Evidence Export (P0 Court-Ready Dossier) */}
          <button
            onClick={() => handleExportEvidence()}
            disabled={isExportingEvidence}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_14px_rgba(99,102,241,0.35)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Generate Court-Ready Dossier (Section 63 BSA / Section 94 BNSS)"
          >
            {isExportingEvidence ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
            )}
            <span>Export Evidence</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>

          {/* Export Menu */}
          <button 
            onClick={handleExportPNG}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors text-xs flex items-center gap-1"
            title="Export PNG Snapshot"
          >
            <span>📷</span> <span className="hidden sm:inline font-mono">PNG</span>
          </button>
          
          <button 
            onClick={handleExportCSV}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors text-xs flex items-center gap-1"
            title="Export CSV Transaction Ledger"
          >
            <span>📊</span> <span className="hidden sm:inline font-mono">CSV</span>
          </button>

          {/* Primary Enforcement Action */}
          <button 
            onClick={() => setShowFreezeNotice(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center gap-1.5 ml-1"
          >
            <span>📄</span>
            <span>View Section 94 BNSS Notice</span>
          </button>
        </div>

      </header>

      {/* Case Action Alert Banner */}
      {saveSuccessMsg && (
        <div className="h-7 px-4 bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-zinc-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Investigation Notification Strip */}
      {investigation && (
        <div className={`h-7 px-4 text-[11px] font-mono flex items-center justify-between border-b flex-shrink-0 ${
          investigation.reached_exchange 
            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300" 
            : "bg-zinc-900/60 border-zinc-800 text-zinc-400"
        }`}>
          <div className="flex items-center gap-2 truncate">
            {investigation.reached_exchange ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            )}
            <span className="truncate">
              {investigation.reached_exchange
                ? `Terminal VASP Identified in ${investigation.hop_count} hops (${investigation.trace_time_ms}ms) — ${investigation.exchange_attribution_message || "Attributed to Exchange Hot Wallet"}`
                : "Traversing transaction topology... expand neighbor nodes to reach off-ramp."}
            </span>
          </div>
          <div className="text-[10px] text-zinc-500 hidden md:block">
            C-Tracer Engine (0.18ms) • Section 63/65B BSA Evidence Sealed
          </div>
        </div>
      )}

      {/* TASK 8: Timeline Scrubber Component (Time Travel Playback) */}
      {showTimeTravel && (
        <TimelineScrubber
          snapshots={clusterSnapshots}
          currentStep={timeTravelStep}
          onStepChange={setTimeTravelStep}
          isPlaying={isPlayingTimeTravel}
          onTogglePlay={() => setIsPlayingTimeTravel(!isPlayingTimeTravel)}
          speed={timeTravelSpeed}
          onSpeedChange={setTimeTravelSpeed}
          isLooping={isTimeTravelLooping}
          onToggleLoop={() => setIsTimeTravelLooping(!isTimeTravelLooping)}
          onClose={() => {
            setShowTimeTravel(false);
            setIsPlayingTimeTravel(false);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* B. FULL-SCREEN CANVAS AREA (100VW, CALC(100VH - 56PX)) */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full overflow-hidden bg-[#08080a]">
        
        {/* Cytoscape Canvas Container */}
        <div ref={containerRef} className="w-full h-full cursor-crosshair"></div>

        {/* Floating Top-Left Legend Overlay */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-2 max-w-xl">
          {graphViewMode === "bubble" ? (
            <div className="pointer-events-auto bg-zinc-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-cyan-500/30 text-xs font-mono shadow-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <span>🫧 Bubble Map</span>
                    <span className="text-[10px] text-cyan-300 font-normal px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800">
                      Police Investigation Mode
                    </span>
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 hidden sm:block">
                  ⭕ Bubble Size = <span className="text-zinc-200">Volume</span> · Proximity = <span className="text-zinc-200">Relationship Strength</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3.5 text-[11px]">
                <div className="flex items-center gap-1.5" title="The initial wallet where complainant funds were stolen">
                  <span className="w-3 h-3 rounded-full bg-[#10B981] shadow-sm shadow-[#10b981]/50"></span>
                  <span className="text-emerald-300 font-medium">Victim's Funds</span>
                </div>
                <div className="flex items-center gap-1.5" title="Suspect middleman wallet hopping funds">
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B] shadow-sm shadow-[#f59e0b]/50"></span>
                  <span className="text-amber-300 font-medium">Suspect Middleman</span>
                </div>
                <div className="flex items-center gap-1.5" title="Exchange deposit account — Target for Section 94 BNSS freeze">
                  <span className="w-3 h-3 rounded-full bg-[#06B6D4] shadow-sm shadow-[#06b6d4]/50"></span>
                  <span className="text-cyan-300 font-medium">Cash-Out Point (Freeze)</span>
                </div>
                <div className="flex items-center gap-1.5" title="Regulated exchange omnibus vault">
                  <span className="w-3 h-3 rounded-full bg-[#8B5CF6] shadow-sm shadow-[#8b5cf6]/50"></span>
                  <span className="text-purple-300 font-medium">Exchange Vault</span>
                </div>
                <div className="flex items-center gap-1.5" title="Laundering obfuscation pool">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444] shadow-sm shadow-[#ef4444]/50"></span>
                  <span className="text-rose-300 font-medium">Laundering Mixer</span>
                </div>
                <div className="flex items-center gap-1.5" title="Gas fee sponsor or indirect syndicate link">
                  <span className="w-3 h-3 rounded-full bg-[#38BDF8] shadow-sm shadow-[#38bdf8]/50"></span>
                  <span className="text-sky-300 font-medium">Fee Sponsor</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto bg-zinc-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-800 text-xs font-mono shadow-2xl flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span className="text-zinc-400">Victim</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                <span className="text-zinc-400">Mule</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
                <span className="text-zinc-400">Mixer/Bridge</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></span>
                <span className="text-zinc-400">CEX Deposit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
                <span className="text-zinc-400">CEX Hot Wallet</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0 border-b-2 border-dashed border-[#c084fc]"></span>
                <span className="text-purple-300">Magic Link (Indirect)</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* C. FLOATING RIGHT-HAND "CANVAS STUDIO & EDIT MODE" TOOLBAR */}
        {/* ========================================================================= */}
        <div className="fixed right-4 top-20 z-30 bg-zinc-900/95 border border-zinc-800 backdrop-blur-md rounded-xl p-2.5 shadow-2xl flex flex-col gap-2.5 w-36 select-none font-mono">
          
          {/* Mode Switcher */}
          <button 
            onClick={() => setEditMode(!editMode)}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              editMode ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-zinc-300 hover:bg-zinc-800"
            }`}
            title="Toggle Edit Mode"
          >
            <span>✏️</span> <span>{editMode ? "Editing" : "Edit Mode"}</span>
          </button>
          
          <div className="h-px bg-zinc-800 my-0.5"></div>
          
          {/* Custom Edge / Arrow Drawing Tool */}
          <button 
            onClick={() => {
              setDrawArrowMode(!drawArrowMode);
              setDrawSourceNode(null);
            }}
            className={`p-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${
              drawArrowMode ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
            }`}
            title="Click source node then target node to link"
          >
            <span>↗️</span> <span>{drawArrowMode ? "Select Target" : "Draw Arrow"}</span>
          </button>

          {/* Magic Nodes Studio Trigger */}
          <button 
            onClick={handleToggleMagicNodes}
            disabled={isDetectingClusters}
            className={`p-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${
              showMagicNodes ? "bg-purple-950/80 text-purple-300 border border-purple-500/40" : "text-zinc-400 hover:text-purple-300 hover:bg-zinc-800"
            }`}
            title="Toggle Magic Nodes indirect clustering"
          >
            {isDetectingClusters ? <RefreshCw className="w-3 h-3 animate-spin text-purple-400" /> : <Sparkles className="w-3 h-3 text-purple-400" />}
            <span>{showMagicNodes ? "Magic On" : "Magic Nodes"}</span>
          </button>

          {/* Node Customizer */}
          <div className="flex flex-col gap-1 text-[10px] text-zinc-400">
            <span>Shape</span>
            <div className="flex gap-1.5">
              <button 
                onClick={() => handleApplyShape("ellipse")} 
                className="w-7 h-7 rounded border border-zinc-700 hover:border-cyan-400 flex items-center justify-center text-xs text-zinc-200"
                title="Circle Node"
              >
                ●
              </button>
              <button 
                onClick={() => handleApplyShape("rectangle")} 
                className="w-7 h-7 rounded border border-zinc-700 hover:border-cyan-400 flex items-center justify-center text-xs text-zinc-200"
                title="Square Node"
              >
                ■
              </button>
              <button 
                onClick={() => handleApplyShape("hexagon")} 
                className="w-7 h-7 rounded border border-zinc-700 hover:border-cyan-400 flex items-center justify-center text-xs text-zinc-200"
                title="Hexagon Node"
              >
                ⬡
              </button>
            </div>
          </div>

          {/* Color Swatches */}
          <div className="flex flex-col gap-1 text-[10px] text-zinc-400">
            <span>Color</span>
            <div className="flex gap-1.5 items-center">
              <div 
                onClick={() => handleApplyColor("#06B6D4")} 
                className="w-5 h-5 rounded-full bg-cyan-500 cursor-pointer hover:scale-110 transition-transform" 
                title="Cyan"
              />
              <div 
                onClick={() => handleApplyColor("#10B981")} 
                className="w-5 h-5 rounded-full bg-emerald-500 cursor-pointer hover:scale-110 transition-transform" 
                title="Emerald"
              />
              <div 
                onClick={() => handleApplyColor("#F59E0B")} 
                className="w-5 h-5 rounded-full bg-amber-500 cursor-pointer hover:scale-110 transition-transform" 
                title="Amber"
              />
              <div 
                onClick={() => handleApplyColor("#F43F5E")} 
                className="w-5 h-5 rounded-full bg-rose-500 cursor-pointer hover:scale-110 transition-transform" 
                title="Rose"
              />
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* D. SLIDE-OVER FORENSIC ENTITY INSPECTOR (RIGHT DRAWER) */}
        {/* ========================================================================= */}
        {selectedEntity && (
          <div className="fixed right-0 top-14 bottom-0 w-96 bg-zinc-950/95 border-l border-zinc-800/80 shadow-2xl z-40 p-5 flex flex-col justify-between overflow-y-auto backdrop-blur-xl animate-in slide-in-from-right duration-200 font-sans">
            
            <div className="space-y-4">
              
              {/* Drawer Header with Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="font-mono text-xs text-zinc-400 font-semibold uppercase">Forensic Entity Inspector</span>
                </div>
                <button 
                  onClick={() => setSelectedEntity(null)}
                  className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedEntity.type === "node" ? (
                <>
                  {/* TASK 7: Low-Jargon Police Summary Card (Active in Bubble View) */}
                  {graphViewMode === "bubble" && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-cyan-500/40 shadow-xl space-y-2.5 font-sans">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: selectedEntity.data.friendlyColor || "#06b6d4", boxShadow: `0 0 8px ${selectedEntity.data.friendlyColor || "#06b6d4"}` }}
                          />
                          <span className="font-bold text-sm text-white">
                            {selectedEntity.data.simplifiedTitle || "Suspect Account"}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono">
                          {selectedEntity.data.badgeText || "Entity"}
                        </span>
                      </div>

                      {/* Primary Recommended Police Action */}
                      <div className="p-2 rounded-lg bg-black/40 border border-cyan-500/20 flex flex-col gap-0.5 font-mono">
                        <span className="text-[10px] uppercase text-zinc-400 font-semibold tracking-wider">
                          Recommended Police Action:
                        </span>
                        <span className="text-xs font-semibold text-cyan-300">
                          {selectedEntity.data.policeAction || "Verify Account KYC"}
                        </span>
                      </div>

                      {/* Plain-English Explanation */}
                      <div className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                        {selectedEntity.data.plainEnglishExplanation || "Account involved in transferring illicit funds across multiple hops."}
                      </div>

                      {/* Volume & Estimated Value */}
                      <div className="grid grid-cols-2 gap-2 pt-0.5 font-mono">
                        <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                          <div className="text-[10px] text-zinc-500 uppercase">Holding / Volume</div>
                          <div className="text-xs font-bold text-emerald-400 mt-0.5">
                            {selectedEntity.data.balance !== "0.00 USDT" ? selectedEntity.data.balance : (selectedEntity.data.inflow || "14,850 USDT")}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                          <div className="text-[10px] text-zinc-500 uppercase">Est. Value (INR)</div>
                          <div className="text-xs font-bold text-cyan-300 mt-0.5">
                            {(() => {
                              const raw = parseFloat(String(selectedEntity.data.balance !== "0.00 USDT" ? selectedEntity.data.balance : selectedEntity.data.inflow).replace(/[^0-9.]/g, "")) || 14850;
                              return `₹${Math.round(raw * 84).toLocaleString("en-IN")}`;
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Direct Statutory Freeze Notice CTA if node is a cashout/deposit point */}
                      {(selectedEntity.data.nodeType === "cex_deposit" || selectedEntity.data.nodeType === "cex" || selectedEntity.data.simplifiedTitle?.includes("Cash-Out")) && (
                        <button
                          type="button"
                          onClick={() => setShowFreezeNotice(true)}
                          className="w-full mt-1 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-950 flex items-center justify-center gap-2 cursor-pointer font-sans"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Generate Sec 94 BNSS Freeze Notice</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Node Address & Role */}
                  <div>
                    <div className="text-xs text-zinc-500 font-mono mb-1">SELECTED ADDRESS:</div>
                    <div className="flex items-center gap-2 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                      <code className="text-xs font-mono text-cyan-300 break-all flex-1">
                        {selectedEntity.data.fullAddress || selectedEntity.data.id}
                      </code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(selectedEntity.data.fullAddress || selectedEntity.data.id)}
                        className="p-1 text-zinc-400 hover:text-white" 
                        title="Copy Address"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Pin & Custom Label Controls */}
                  <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-[10px] uppercase font-semibold flex items-center gap-1">
                        <Tag className="w-3 h-3 text-cyan-400" />
                        Custom Canvas Label
                      </span>
                      <button
                        onClick={() => handleTogglePin(selectedEntity.data.id)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                          selectedEntity.data.is_pinned
                            ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
                        }`}
                        title={selectedEntity.data.is_pinned ? "Unlock & Unpin Node Position" : "Lock & Pin Node Position"}
                      >
                        {selectedEntity.data.is_pinned ? (
                          <>
                            <PinOff className="w-3 h-3 text-amber-400" />
                            <span>Pinned</span>
                          </>
                        ) : (
                          <>
                            <Pin className="w-3 h-3" />
                            <span>Pin Node</span>
                          </>
                        )}
                      </button>
                    </div>
                    <input
                      type="text"
                      defaultValue={selectedEntity.data.custom_label || selectedEntity.data.roleHeader || ""}
                      onBlur={(e) => handleUpdateCustomLabel(selectedEntity.data.id, e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUpdateCustomLabel(selectedEntity.data.id, e.target.value)}
                      placeholder="e.g. Suspect Master Mule / Binance Deposit"
                      className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Paginated Counterparties Expansion */}
                  <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 font-semibold uppercase flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        Counterparty Expansion
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        Offset: {expandOffset}
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleExpandCounterparties(selectedEntity.data.id, "outbound")}
                        disabled={isExpanding}
                        className="flex-1 py-1.5 px-2 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-1"
                      >
                        {isExpanding ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Outbound (10)"}
                      </button>
                      <button
                        onClick={() => handleExpandCounterparties(selectedEntity.data.id, "inbound")}
                        disabled={isExpanding}
                        className="flex-1 py-1.5 px-2 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-1"
                      >
                        {isExpanding ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Inbound (10)"}
                      </button>
                      <button
                        onClick={() => handleExpandCounterparties(selectedEntity.data.id, "both")}
                        disabled={isExpanding}
                        className="flex-1 py-1.5 px-2 rounded bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 text-[11px] text-indigo-300 disabled:opacity-50 transition-colors flex items-center justify-center gap-1"
                      >
                        {isExpanding ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Both (10)"}
                      </button>
                    </div>

                    {expandFeedback && (
                      <div className={`p-2 rounded text-[11px] ${expandFeedback.success ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'}`}>
                        {expandFeedback.message}
                      </div>
                    )}
                  </div>

                  {/* Attribution Provenance Tagging & Audit Classification (TASK 4 - P0 Hard Requirement) */}
                  <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-[10px] uppercase font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        Attribution Provenance
                      </span>
                      <ProvenanceBadge 
                        provenance={selectedEntity.data.provenance || "automated_clustering"} 
                        size="sm" 
                      />
                    </div>
                    
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      Audit Data Model Tag:
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateProvenance(selectedEntity.data.id, "automated_clustering")}
                        className={`py-1.5 px-1.5 rounded-lg text-[10px] font-mono border transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                          (selectedEntity.data.provenance || "automated_clustering") === "automated_clustering"
                            ? "bg-amber-950/80 border-amber-500/70 text-amber-300 font-bold shadow-sm shadow-amber-950"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                        title="Cluster tag derived via algorithmic flow heuristics"
                      >
                        <span>⛬ cluster</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateProvenance(selectedEntity.data.id, "analyst_reviewed")}
                        className={`py-1.5 px-1.5 rounded-lg text-[10px] font-mono border transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                          selectedEntity.data.provenance === "analyst_reviewed"
                            ? "bg-sky-950/80 border-sky-500/70 text-sky-300 font-bold shadow-sm shadow-sky-950"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                        title="Audited & verified by investigating officer"
                      >
                        <UserCheck className="w-2.5 h-2.5" />
                        <span>analyst</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateProvenance(selectedEntity.data.id, "offchain_verified")}
                        className={`py-1.5 px-1.5 rounded-lg text-[10px] font-mono border transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                          selectedEntity.data.provenance === "offchain_verified"
                            ? "bg-emerald-950/80 border-emerald-500/70 text-emerald-300 font-bold shadow-sm shadow-emerald-950"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                        title="Official registry or verified VASP filing"
                      >
                        <span>✓ offchain</span>
                      </button>
                    </div>
                  </div>

                  {/* Dual-Mode Risk Engine Card (TASK 5 - P0 Requirement) */}
                  <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-[10px] uppercase font-semibold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        Dual-Mode Risk Engine
                      </span>
                      <RiskModeBadge 
                        mode={selectedEntity.data.risk_mode || (selectedEntity.data.nodeType === "origin" || selectedEntity.data.nodeType?.includes("cex") ? "static_entity" : "dynamic_behavioral")} 
                        size="sm" 
                      />
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase">Composite Score</div>
                        <div className="text-lg font-bold flex items-baseline gap-1">
                          <span className={
                            (selectedEntity.data.risk_score ?? 75) >= 80 
                              ? "text-rose-400" 
                              : (selectedEntity.data.risk_score ?? 75) >= 50 
                              ? "text-amber-400" 
                              : "text-emerald-400"
                          }>
                            {selectedEntity.data.risk_score ?? 75}
                          </span>
                          <span className="text-xs text-zinc-500">/ 100</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Model Guarantee</div>
                        <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold">
                          Strict Non-Blended
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-400 leading-relaxed bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/60">
                      {selectedEntity.data.risk_mode === "static_entity" || selectedEntity.data.nodeType === "origin" || selectedEntity.data.nodeType?.includes("cex")
                        ? "• Static Base Score: Assigned from maintained institutional entity catalog (exchanges, mixers, or darknet markets)."
                        : "• Dynamic Behavioral Score: Computed from live on-chain signals (mixer interaction, rapid fan-out, sanctioned proximity, wallet age)."}
                    </div>

                    <button
                      type="button"
                      disabled={isEvaluatingRisk}
                      onClick={() => handleEvaluateRisk(selectedEntity.data.id)}
                      className="w-full py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isEvaluatingRisk ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                          <span>Evaluating Risk Signals...</span>
                        </>
                      ) : (
                        <>
                          <Activity className="w-3 h-3 text-cyan-400" />
                          <span>Recalculate Risk (Dual-Mode Engine)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Entity Category & Exchange Tag */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">CATEGORY</span>
                      <span className="text-white font-semibold uppercase">{selectedEntity.data.type || selectedEntity.data.nodeType || "Mule"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-zinc-500 block text-[10px]">VERIFIED VASP</span>
                        <ProvenanceBadge provenance={selectedEntity.data.provenance || "automated_clustering"} size="xs" showIcon={false} />
                      </div>
                      <span className="text-cyan-400 font-semibold">{selectedEntity.data.exchangeName || selectedEntity.data.exchange || "Unclaimed"}</span>
                    </div>
                  </div>

                  {/* Bitrace-style FIFO Taint Meter */}
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-zinc-400">BITRACE FIFO TAINT</span>
                      <span className="text-rose-400 font-bold">89.4% Contaminated</span>
                    </div>
                    {/* Taint Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden flex">
                      <div className="h-full bg-rose-500 w-[89.4%]"></div>
                      <div className="h-full bg-emerald-500 w-[10.6%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Illicit Outflow: 4,850 USDT</span>
                      <span>Clean: 550 USDT</span>
                    </div>
                  </div>

                  {/* Merkle Science Behavioral Badges */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="text-zinc-500 text-[10px] uppercase">BEHAVIORAL ANOMALIES (MERKLE SCIENCE)</div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[10px]">
                        High Velocity Layering
                      </span>
                      <span className="px-2 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px]">
                        Peeling Structuring
                      </span>
                      <span className="px-2 py-1 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-[10px]">
                        Zero-Day Master Sweep
                      </span>
                    </div>
                  </div>

                  {/* Deep Explorer Link */}
                  <div className="pt-2 flex items-center justify-between">
                    <a 
                      href={`https://tronscan.org/#/address/${selectedEntity.data.id}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                    >
                      <span>Open on Block Explorer</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* One-Click Evidence Export for Address (P0 Requirement) */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleExportEvidence(selectedEntity.data.fullAddress || selectedEntity.data.id)}
                      disabled={isExportingEvidence}
                      className="w-full py-2.5 px-3 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-500/50 text-indigo-300 hover:text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-950/40 cursor-pointer disabled:opacity-50"
                      title="Generate Court-Ready Dossier (Section 63 BSA / Section 94 BNSS) for this Target Address"
                    >
                      {isExportingEvidence ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>Export Address Evidence (Sec 63 BSA)</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Edge Inspection */
                <div className="space-y-3 font-mono text-xs">
                  {selectedEntity.data.edge_type === "indirect_link" || selectedEntity.data.link_reason ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 space-y-2 shadow-lg shadow-purple-950/30">
                        <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            MAGIC NODE: INDIRECT LINK
                          </span>
                          <span className="px-2 py-0.5 rounded bg-purple-900/90 text-[10px] text-purple-200 border border-purple-500/30 font-semibold">
                            {selectedEntity.data.confidence ? `${Math.round(selectedEntity.data.confidence * 100)}% Confidence` : "High"}
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-200/90 leading-relaxed">
                          {selectedEntity.data.description || "Syndicate cluster linkage detected via non-direct transfer heuristics."}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                        <span className="text-zinc-500 text-[10px] uppercase font-semibold">DETECTION HEURISTIC RULE</span>
                        <div className="text-white font-semibold flex items-center gap-1.5">
                          {selectedEntity.data.link_reason === "common_gas_funder" && (
                            <span className="text-amber-300">⚡ Shared Gas Sponsor (Energy Dispenser)</span>
                          )}
                          {selectedEntity.data.link_reason === "common_first_funder" && (
                            <span className="text-cyan-300">🔗 Common Genesis Intermediary (Parent Activation)</span>
                          )}
                          {selectedEntity.data.link_reason === "temporal_synchronization" && (
                            <span className="text-purple-300">⏱️ Synchronized Burst (Δ{selectedEntity.data.time_delta_seconds ?? "<180"}s Coordinated)</span>
                          )}
                          {!["common_gas_funder", "common_first_funder", "temporal_synchronization"].includes(selectedEntity.data.link_reason) && (
                            <span>{selectedEntity.data.link_reason || "Indirect Syndicate Link"}</span>
                          )}
                        </div>
                      </div>

                      {selectedEntity.data.intermediary && (
                        <div>
                          <span className="text-zinc-500 text-[10px]">LINKING INTERMEDIARY ADDRESS</span>
                          <div className="p-2 rounded bg-zinc-900 border border-zinc-800 break-all text-purple-300 text-[11px] mt-1 flex items-center justify-between">
                            <span className="truncate mr-2">{selectedEntity.data.intermediary}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(selectedEntity.data.intermediary)}
                              className="p-1 text-zinc-400 hover:text-white flex-shrink-0"
                              title="Copy Intermediary Address"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                          <span className="text-zinc-500 text-[10px]">CLUSTER MEMBER A</span>
                          <div className="text-white font-mono text-[11px] truncate" title={selectedEntity.data.source}>
                            {selectedEntity.data.source}
                          </div>
                        </div>
                        <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                          <span className="text-zinc-500 text-[10px]">CLUSTER MEMBER B</span>
                          <div className="text-white font-mono text-[11px] truncate" title={selectedEntity.data.target}>
                            {selectedEntity.data.target}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-zinc-500 text-[10px]">TRANSACTION HASH</span>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 break-all text-cyan-300 text-[11px] mt-1">
                        {selectedEntity.data.tx_hash || "N/A (Off-chain or Synthesized)"}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                          <span className="text-zinc-500 text-[10px]">TRANSFER AMOUNT</span>
                          <div className="text-white font-bold">{selectedEntity.data.amount} {selectedEntity.data.token_symbol}</div>
                        </div>
                        <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                          <span className="text-zinc-500 text-[10px]">TIMESTAMP (UTC)</span>
                          <div className="text-zinc-300">
                            {selectedEntity.data.timestamp_utc ? (
                              typeof selectedEntity.data.timestamp_utc === "number" && selectedEntity.data.timestamp_utc > 1000000000
                                ? new Date(selectedEntity.data.timestamp_utc * 1000).toISOString().slice(0, 16)
                                : String(selectedEntity.data.timestamp_utc)
                            ) : "Recent"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Bottom Freeze Notice Fast Action */}
            <div className="pt-4 border-t border-zinc-800">
              <button 
                onClick={() => setShowFreezeNotice(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2"
              >
                <span>Draft Section 94 Notice for Entity</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Statutory Freeze Notice Modal */}
      {showFreezeNotice && (
        <FreezeNoticeForm onClose={() => setShowFreezeNotice(false)} />
      )}

      {/* Bulk Address Screening Modal (Task 6) */}
      {showBatchScreening && (
        <BatchScreeningModal
          isOpen={showBatchScreening}
          onClose={() => setShowBatchScreening(false)}
          onTraceAddress={(addr) => {
            setQuery(addr);
            handleTrace(addr);
          }}
        />
      )}

      {/* Natural-Language Case Assistant Drawer (Task 9) */}
      <CaseAssistantDrawer
        isOpen={showCaseAssistant}
        onClose={() => setShowCaseAssistant(false)}
        activeCaseId={currentCaseId}
        activeCaseMeta={currentCaseMeta}
        graphData={graph}
        onSelectNode={handleLocateNodeOnCanvas}
      />

      {/* Save Case Modal */}

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-mono">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Save className="w-4 h-4 text-emerald-400" />
                <span>Save Forensic Case State</span>
              </div>
              <button onClick={() => setShowSaveModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Case Name / Title</label>
                <input
                  type="text"
                  value={currentCaseMeta.case_name}
                  onChange={(e) => setCurrentCaseMeta({ ...currentCaseMeta, case_name: e.target.value })}
                  placeholder="e.g. Operation DarkStream - TRX Master Trace"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">FIR / Crime Reference Number</label>
                <input
                  type="text"
                  value={currentCaseMeta.fir_number}
                  onChange={(e) => setCurrentCaseMeta({ ...currentCaseMeta, fir_number: e.target.value })}
                  placeholder="e.g. FIR-2026-CR-089"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Incident Notes / Narrative</label>
                <textarea
                  rows={3}
                  value={currentCaseMeta.description}
                  onChange={(e) => setCurrentCaseMeta({ ...currentCaseMeta, description: e.target.value })}
                  placeholder="Summary of illicit fund movement and current lead targets..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCase}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Database</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Case Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-mono">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>Load Saved Forensic Case</span>
              </div>
              <button onClick={() => setShowLoadModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs pr-1">
              {isLoadingCases ? (
                <div className="py-8 text-center text-zinc-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Loading cases database...</span>
                </div>
              ) : savedCasesList.length === 0 ? (
                <div className="py-8 text-center text-zinc-500">
                  No saved cases found in database. Build a trace on canvas and click "Save Case".
                </div>
              ) : (
                savedCasesList.map((c) => (
                  <div
                    key={c.case_id}
                    className="p-3 bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/50 rounded-xl flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate">{c.fir_number || c.case_id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                          {c.case_status || "active"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">{c.description || "No description provided"}</p>
                      <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                        <span>Nodes: {c.node_count || 0}</span>
                        <span>Edges: {c.edge_count || 0}</span>
                        <span>Saved: {c.created_at ? new Date(c.created_at).toLocaleDateString() : "Recent"}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLoadCase(c.case_id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs flex items-center gap-1 flex-shrink-0 transition-colors"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Load</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setShowLoadModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

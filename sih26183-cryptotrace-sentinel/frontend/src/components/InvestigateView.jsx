import React, { useState } from "react";
import GraphCanvas from "./GraphCanvas";
import ForensicDrawer from "./ForensicDrawer";
import SearchBar, { SAMPLE_PRESETS, LAYOUT_OPTIONS } from "./SearchBar";
import {
  Search, Shield, Zap, Sliders, ChevronDown, ChevronUp,
  Download, FileText, Activity, Check, Copy, AlertTriangle,
  RotateCcw, Sparkles, ArrowRight, ArrowLeft, Plus
} from "lucide-react";

export default function InvestigateView({
  targetWallet = "",
  onTargetWalletChange,
  onLaunchTrace,
  loading = false,
  graph = null,
  filteredEdges = [],
  layoutName = "dagre",
  onLayoutChange,
  highlightedTxHashes = [],
  onFindNearestExchange,
  offRampLoading = false,
  offRampResult = null,
  onNodeSelect,
  onEdgeSelect,
  selectedElement = null,
  drawerOpen = false,
  onCloseDrawer,
  onExpandNode,
  onOpenNoticeModal,
  onOpenEvidenceModal,
  caseId = "CASE-SIH-2026",
  detectedChain = "TRON",
  traceTimeMs = 0.05,
  cyRef = null,
}) {
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter state
  const [minAmount, setMinAmount] = useState(0);

  const [activeViewMode, setActiveViewMode] = useState("graph"); // "graph" | "storyline"
  const [copiedTxHash, setCopiedTxHash] = useState(null);

  const handleCopyTx = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedTxHash(hash);
    setTimeout(() => setCopiedTxHash(null), 2000);
  };

  // Chainalysis Storyline Incident Feed Data
  const storylineEvents = [
    {
      step: 1,
      time: "14:22:04 UTC",
      delta: "Origin / 0m",
      title: "Victim Initial Outflow",
      type: "outflow",
      description: "Complainant wallet initiates unauthorized transfer to Suspect Layer 1 Mule following a Telegram deceptive task scam inducement.",
      amountUsdt: "$4,850.00 USDT",
      amountInr: "₹4,05,460 INR",
      from: "TVictimComplainant01XXXXXXXXXXXXX",
      fromLabel: "Victim Complainant",
      fromRole: "victim",
      to: "TMule0001XXXXXXXXXXXXXXXXXXXXXXXX",
      toLabel: "Suspect Layer 1 Mule",
      toRole: "mule",
      txHash: "0x8fa4c3b210984de2a5b6c7d8e901f23456789abcdef0123456789abcdef01234",
      badge: "Direct Victim Depletion",
      badgeColor: "rose",
      statutoryRef: "Section 2 Intake (FIR/CYBER/2026/0402)",
    },
    {
      step: 2,
      time: "14:38:12 UTC",
      delta: "+16m",
      title: "Layering & Peeling Chain Structuring",
      type: "peeling",
      description: "Mule 1 peels off $200 USDT decoy split to secondary address and forwards remaining $4,650 USDT to Layer 2 Mule to evade automated anomaly thresholds.",
      amountUsdt: "$4,650.00 USDT",
      amountInr: "₹3,88,740 INR",
      peelDetail: "Peeled $200 USDT decoy (4.1%)",
      from: "TMule0001XXXXXXXXXXXXXXXXXXXXXXXX",
      fromLabel: "Layer 1 Mule",
      fromRole: "mule",
      to: "TMule0002YYYYYYYYYYYYYYYYYYYYYYYY",
      toLabel: "Layer 2 Mule",
      toRole: "mule",
      txHash: "0x7bc19a82f34e6d1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b",
      badge: "Peeling Structuring (95/5 Split)",
      badgeColor: "amber",
      statutoryRef: "Rapid Velocity Structuring (< 20m)",
    },
    {
      step: 3,
      time: "15:10:45 UTC",
      delta: "+32m",
      title: "CEX Deposit Injection into CoinDCX",
      type: "deposit",
      description: "Contaminated funds channeled into CoinDCX verified customer deposit address for fiat off-ramping into domestic banking accounts.",
      amountUsdt: "$4,650.00 USDT",
      amountInr: "₹3,88,740 INR",
      from: "TMule0002YYYYYYYYYYYYYYYYYYYYYYYY",
      fromLabel: "Layer 2 Mule",
      fromRole: "mule",
      to: "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
      toLabel: "CoinDCX User Deposit Account",
      toRole: "exchange_deposit",
      txHash: "0x4e2d1f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e",
      badge: "CEX Inflow Ingress",
      badgeColor: "cyan",
      statutoryRef: "FIU-IND Reporting Gateway Intercept",
    },
    {
      step: 4,
      time: "16:20:10 UTC",
      delta: "+1h 10m",
      title: "Internal Hot Wallet Sweep into Master Reserve",
      type: "sweep",
      description: "Automated exchange infrastructure consolidates deposit into CoinDCX Master Reserve omnibus cluster, establishing Section 94 BNSS statutory debit freeze readiness.",
      amountUsdt: "$4,650.00 USDT",
      amountInr: "₹3,88,740 INR",
      from: "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
      fromLabel: "CoinDCX Deposit Account",
      fromRole: "exchange_deposit",
      to: "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX",
      toLabel: "CoinDCX Master Reserve",
      toRole: "exchange_hotwallet",
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      badge: "Section 94 BNSS Ready",
      badgeColor: "emerald",
      statutoryRef: "Statutory Debit Freeze Directive Ready",
    },
  ];

  const handleInspectStorylineNode = (addr, label, role) => {
    if (onNodeSelect) {
      onNodeSelect({
        kind: "node",
        data: {
          id: addr,
          address: addr,
          label: label,
          role: role,
          label_confidence: 0.98,
        },
      });
    }
  };

  const handleInspectStorylineTx = (ev) => {
    if (onEdgeSelect) {
      onEdgeSelect({
        kind: "edge",
        data: {
          id: ev.txHash,
          tx_hash: ev.txHash,
          source: ev.from,
          target: ev.to,
          amount: 4650,
          timestamp: ev.time,
        },
      });
    }
  };

  const handleCopyTarget = () => {
    if (!targetWallet) return;
    navigator.clipboard.writeText(targetWallet);
    setCopiedTarget(true);
    setTimeout(() => setCopiedTarget(false), 2000);
  };

  const handleExportGraph = () => {
    const cy = cyRef?.current;
    if (!cy) return;
    const png = cy.png({ full: true, scale: 2, bg: "#070A11" });
    if (png) {
      const a = document.createElement("a");
      a.href = png;
      a.download = `Forensic_Graph_${caseId}_${targetWallet.slice(0, 8)}.png`;
      a.click();
    }
  };

  const handleFitGraph = () => {
    cyRef?.current?.fit(undefined, 50);
  };

  return (
    <div className="relative w-full h-[calc(100vh-56px)] mt-14 flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* Unified Contextual Investigation Toolbar */}
      <div className="w-full px-4 pt-3 pb-2 z-20 flex flex-col items-center shrink-0">
        <div className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl px-3 py-1.5 shadow-lg shadow-black/20 flex items-center gap-2">
          {/* Action 1: Back to Cases / Overview */}
          <button
            onClick={() => window.history?.back ? window.history.back() : null}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 shrink-0" />

          {/* Action 2: + New Trace */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded-lg transition cursor-pointer"
            title="New Investigation Target (+)"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 shrink-0" />

          {/* Central Dominant Search / Command Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (targetWallet?.trim()) onLaunchTrace?.(targetWallet);
            }}
            className="relative flex-1 flex items-center min-w-0"
          >
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={targetWallet}
              onChange={(e) => onTargetWalletChange?.(e.target.value)}
              placeholder="Search wallet address, transaction, or case..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-8 pr-14 py-1.5 text-xs text-slate-100 font-mono placeholder-slate-500 outline-none transition"
            />
            <kbd className="hidden sm:inline-block absolute right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              Ctrl+K
            </kbd>
          </form>

          <div className="h-4 w-px bg-slate-800 shrink-0" />

          {/* Action 3: Trace to CEX (Primary solid action) */}
          <button
            onClick={onFindNearestExchange}
            disabled={offRampLoading || !graph?.nodes?.length}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition disabled:opacity-40 flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="Trace to Nearest Centralized Exchange"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{offRampLoading ? "Tracing..." : "Trace to CEX"}</span>
          </button>

          {/* Action 4: Evidence */}
          <button
            onClick={onOpenEvidenceModal}
            className="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-medium transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="View Certified Evidence"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Evidence</span>
          </button>

          {/* Action 5: Export */}
          <button
            onClick={handleExportGraph}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition shrink-0 cursor-pointer"
            title="Export Graph (PNG)"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div className="h-4 w-px bg-slate-800 shrink-0" />

          {/* Golden Hour Compact Indicator (Section 25) */}
          <button
            onClick={() => alert("Statutory 4-Hour Golden Hour Protocol for Crypto Asset Debit Freeze under Section 94 BNSS. Remaining: 03:59:42.")}
            className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] text-amber-400 font-mono cursor-pointer transition shrink-0"
            title="Click to inspect Golden Hour Protocol details"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>Golden Hour Active</span>
          </button>
        </div>

        {/* Quiet Contextual Off-Ramp Banner (Appears ONLY when off-ramp is identified) */}
        {offRampResult?.found && (
          <div className="mt-2 flex items-center gap-3 px-4 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-xs text-emerald-400 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-200">
              Off-ramp identified: <strong className="text-emerald-400 font-medium">{offRampResult.terminal_label}</strong> ({offRampResult.hops_searched || 3} Hops)
            </span>
            <button
              onClick={onOpenNoticeModal}
              className="ml-1 px-2.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-amber-400 text-[11px] font-medium transition cursor-pointer"
            >
              Review Legal Action
            </button>
          </div>
        )}

        {/* Segmented View Mode Switcher Directly Above Graph Container */}
        <div className="w-full max-w-4xl mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl backdrop-blur-md shadow-md">
            <button
              type="button"
              onClick={() => setActiveViewMode("graph")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                activeViewMode === "graph"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>🕸️</span>
              <span>Network Graph Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode("storyline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                activeViewMode === "storyline"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>📜</span>
              <span>Chronological Storyline</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider ${
                  activeViewMode === "storyline"
                    ? "bg-slate-950 text-cyan-400"
                    : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                }`}
              >
                Chainalysis Spec
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-500">Forensic View:</span>
            <span className="text-cyan-400 font-semibold">{activeViewMode === "graph" ? "Topological BFS" : "Chronological Audit"}</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300">4 Audit Events</span>
          </div>
        </div>
      </div>

      {/* 2. Main Viewport (Graph Canvas OR Storyline Timeline) + Contextual Slide-Over Drawer */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-cyan-400">Executing C-Core BFS Forensic Trace...</span>
          </div>
        )}

        {/* View Mode: GRAPH CANVAS */}
        {activeViewMode === "graph" && (
          <>
            <GraphCanvas
              nodes={graph?.nodes || []}
              edges={filteredEdges}
              layout={layoutName}
              highlightedTxHashes={highlightedTxHashes}
              onNodeSelect={onNodeSelect}
              onEdgeSelect={onEdgeSelect}
              onExpandNode={onExpandNode}
              cyRefOut={cyRef}
              targetWallet={targetWallet}
              traceTimeMs={traceTimeMs}
              cCoreActive={true}
            />

            {/* Floating Quick Action Overlays over Canvas */}
            <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-xl">
              <button
                onClick={handleFitGraph}
                className="px-2.5 py-1 text-xs text-slate-300 hover:text-slate-100 rounded hover:bg-slate-800 transition cursor-pointer"
                title="Zoom to Fit"
              >
                Fit View
              </button>
              <div className="w-px h-3.5 bg-slate-800" />
              <button
                onClick={() => onFindNearestExchange?.()}
                className="px-2.5 py-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold rounded hover:bg-slate-800 transition cursor-pointer"
              >
                Highlight Conduit
              </button>
            </div>
          </>
        )}

        {/* View Mode: CHRONOLOGICAL STORYLINE (Chainalysis Spec) */}
        {activeViewMode === "storyline" && (
          <div className="w-full h-full overflow-y-auto px-4 py-6 select-text">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Storyline Narrative Header Banner */}
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                      Chainalysis Storyline Protocol
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono">
                      Sequential Audit Feed
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-100 mt-1">
                    Chronological Fund Flow & Structuring Timeline
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Reconstructed time-series showing initial victim dispensation through rapid layering hops to final CEX omnibus liquidation.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Total Tracked Outflow</div>
                    <div className="text-sm font-mono font-bold text-cyan-400">$4,850.00 USDT</div>
                    <div className="text-[11px] font-mono text-slate-400">₹4,05,460 INR</div>
                  </div>
                  <button
                    onClick={onOpenNoticeModal}
                    className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Section 94 Notice</span>
                  </button>
                </div>
              </div>

              {/* Vertical Chronological Timeline Feed */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-8 ml-3 sm:ml-4 py-2">
                {storylineEvents.map((ev) => {
                  const isCopied = copiedTxHash === ev.txHash;
                  return (
                    <div key={ev.step} className="relative group">
                      {/* Step Indicator Node on Timeline */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-lg transition-transform group-hover:scale-110 ${
                          ev.step === 1
                            ? "bg-rose-500 text-slate-950 ring-4 ring-rose-500/20"
                            : ev.step === 2
                            ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20"
                            : ev.step === 3
                            ? "bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20"
                            : "bg-emerald-400 text-slate-950 ring-4 ring-emerald-500/20"
                        }`}
                      >
                        {ev.step}
                      </div>

                      {/* Event Card */}
                      <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all space-y-4">
                        {/* Header: Timestamp, Delta, Status Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-semibold text-slate-200">
                              {ev.time}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                              {ev.delta}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium font-mono ${
                                ev.badgeColor === "rose"
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                                  : ev.badgeColor === "amber"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                  : ev.badgeColor === "cyan"
                                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              }`}
                            >
                              {ev.badge}
                            </span>
                          </div>
                        </div>

                        {/* Title & Forensic Narrative */}
                        <div>
                          <h3 className="text-sm font-semibold text-slate-100">
                            {ev.title}
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed mt-1">
                            {ev.description}
                          </p>
                        </div>

                        {/* Financial Ledger Amounts */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                              Transferred Value
                            </span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-sm font-mono font-bold text-slate-100">
                                {ev.amountUsdt}
                              </span>
                              <span className="text-xs font-mono text-cyan-400">
                                ({ev.amountInr})
                              </span>
                            </div>
                          </div>

                          {ev.peelDetail && (
                            <div>
                              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                                Peeling Decoy Split
                              </span>
                              <span className="text-xs font-mono text-amber-400 font-medium mt-0.5 block">
                                {ev.peelDetail}
                              </span>
                            </div>
                          )}

                          <div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                              Statutory Forensic Marker
                            </span>
                            <span className="text-xs text-slate-300 font-mono mt-0.5 block">
                              {ev.statutoryRef}
                            </span>
                          </div>
                        </div>

                        {/* Flow Conduit: From -> To Addresses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {/* Sender */}
                          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                                <span>From</span>
                                <span className="text-slate-300 font-semibold">({ev.fromLabel})</span>
                              </div>
                              <div className="font-mono text-xs text-slate-300 truncate mt-0.5">
                                {ev.from}
                              </div>
                            </div>
                            <button
                              onClick={() => handleInspectStorylineNode(ev.from, ev.fromLabel, ev.fromRole)}
                              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-cyan-400 border border-slate-700/60 shrink-0 cursor-pointer"
                              title="Inspect Wallet in Drawer"
                            >
                              Inspect
                            </button>
                          </div>

                          {/* Receiver */}
                          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                                <span>To</span>
                                <span className="text-cyan-400 font-semibold">({ev.toLabel})</span>
                              </div>
                              <div className="font-mono text-xs text-cyan-300 truncate mt-0.5">
                                {ev.to}
                              </div>
                            </div>
                            <button
                              onClick={() => handleInspectStorylineNode(ev.to, ev.toLabel, ev.toRole)}
                              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-cyan-400 border border-slate-700/60 shrink-0 cursor-pointer"
                              title="Inspect Wallet in Drawer"
                            >
                              Inspect
                            </button>
                          </div>
                        </div>

                        {/* Transaction Hash & 1-Click Copy Action */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] font-mono text-slate-500 uppercase">
                              Tx Hash:
                            </span>
                            <span className="font-mono text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs md:max-w-sm">
                              {ev.txHash}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyTx(ev.txHash)}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700/70 text-xs font-mono text-slate-300 hover:text-slate-100 flex items-center gap-1.5 transition cursor-pointer"
                              title="1-Click Copy Transaction Hash"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-medium">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Copy Hash</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleInspectStorylineTx(ev)}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-400 font-medium flex items-center gap-1 transition cursor-pointer"
                              title="Inspect in Forensic Drawer"
                            >
                              <span>Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. Contextual Slide-Over Inspector Drawer (20-25% width, opens on node/edge tap) */}
        <ForensicDrawer
          isOpen={drawerOpen}
          selectedElement={selectedElement}
          transactions={
            selectedElement?.kind === "node"
              ? (graph?.edges || []).filter(
                  (e) =>
                    e.source === selectedElement.data.id ||
                    e.target === selectedElement.data.id
                )
              : []
          }
          onClose={onCloseDrawer}
          onExpandNode={onExpandNode}
        />
      </div>

      {/* Target Address Modal (Allows entering address or picking presets) */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#091525] border border-[#223247] rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#223247]">
              <h3 className="text-sm font-semibold text-[#F5F7FA]">
                Initiate New Forensic Trace
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-[#AAB7C7] hover:text-[#F5F7FA] rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[#AAB7C7]">Suspect Wallet Address</label>
              <input
                type="text"
                value={targetWallet}
                onChange={(e) => onTargetWalletChange?.(e.target.value)}
                placeholder="Enter TRON (T...), EVM (0x...), or BTC address"
                className="w-full px-4 py-3 bg-[#07111F] border border-[#223247] focus:border-[#00AEEF] rounded-xl font-mono text-sm text-[#F5F7FA] outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] text-[#6F7C8D] uppercase tracking-wider">Quick Presets:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onTargetWalletChange?.(SAMPLE_PRESETS.TRON.address);
                    onLaunchTrace?.(SAMPLE_PRESETS.TRON.address);
                    setShowSearchModal(false);
                  }}
                  className="flex-1 p-3 rounded-xl bg-[#0E1B2D] hover:bg-[#122238] border border-[#223247] text-left transition cursor-pointer"
                >
                  <div className="text-xs font-semibold text-[#00AEEF]">TRON Task Scam</div>
                  <div className="text-[10px] text-[#AAB7C7] mt-0.5">5,000 USDT to CoinDCX</div>
                </button>

                <button
                  onClick={() => {
                    onTargetWalletChange?.(SAMPLE_PRESETS.EVM.address);
                    onLaunchTrace?.(SAMPLE_PRESETS.EVM.address);
                    setShowSearchModal(false);
                  }}
                  className="flex-1 p-3 rounded-xl bg-[#0E1B2D] hover:bg-[#122238] border border-[#223247] text-left transition cursor-pointer"
                >
                  <div className="text-xs font-semibold text-[#FFB04D]">EVM Pig-Butchering</div>
                  <div className="text-[10px] text-[#AAB7C7] mt-0.5">12,000 USDT to Binance</div>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#AAB7C7] hover:text-[#F5F7FA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onLaunchTrace?.(targetWallet);
                  setShowSearchModal(false);
                }}
                disabled={loading || !targetWallet.trim()}
                className="px-5 py-2 rounded-xl bg-[#00AEEF] text-[#07111F] font-semibold text-xs hover:bg-[#19B5FE] transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Tracing..." : "Launch Trace"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

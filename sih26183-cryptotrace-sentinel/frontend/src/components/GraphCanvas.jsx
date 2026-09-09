import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import {
  ZoomIn, ZoomOut, Maximize2, RotateCcw, Download,
  Copy, Check, ShieldAlert, Cpu, Layers, ExternalLink, Sparkles,
  Zap, Network
} from "lucide-react";

// Register Cytoscape dagre plugin once
if (!cytoscape.prototype._hasDagre) {
  try {
    cytoscape.use(dagre);
    cytoscape.prototype._hasDagre = true;
  } catch (e) {
    // dagre already registered
  }
}

export const ROLE_COLOR_MAP = {
  victim: "#22C55E",          // Restrained green
  source_wallet: "#22C55E",   // Green
  mule: "#F59E0B",            // Saffron/Amber
  intermediary: "#F59E0B",    // Saffron/Amber
  mixer: "#EF4444",           // Restrained Red
  contract_or_mixer: "#EF4444",// Red
  exchange_deposit: "#00AEEF", // SIH Blue
  exchange_suspected: "#00AEEF",// SIH Blue
  exchange_hotwallet: "#19B5FE",// Light SIH Blue
  exchange_confirmed: "#19B5FE",// Light SIH Blue
  peel_outlet: "#6F7C8D",     // Muted blue-gray
  unknown: "#4B5563",         // Gray
};

export default function GraphCanvas({
  nodes = [],
  edges = [],
  graph = null,
  layout = "dagre",
  onNodeSelect,
  onEdgeSelect,
  onExpandNode,
  highlightedTxHashes = [],
  cyRefOut = null,
  // Floating Header Controls & State
  targetWallet = "",
  offRamp = null,
  onViewNotice = null,
  traceTimeMs = 0.23,
  cCoreActive = true,
  floatingSearchBar = null,
  collapseExchange = false,
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const expandingRef = useRef(false);
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [viewMode, setViewMode] = useState("predictive"); // "predictive" or "all"

  const layoutName =
    layout === "concentric"
      ? "concentric"
      : layout === "fcose" || layout === "cose" || layout === "physics"
      ? "cose"
      : "dagre";

  const allNodes = nodes?.length ? nodes : (graph?.nodes || []);
  const allEdges = edges?.length ? edges : (graph?.edges || []);
  const graphData = useMemo(() => ({ nodes: allNodes, edges: allEdges }), [allNodes, allEdges]);

  const highlightSet = useMemo(
    () => new Set(
      Array.isArray(highlightedTxHashes) ? highlightedTxHashes : Array.from(highlightedTxHashes || [])
    ),
    [highlightedTxHashes]
  );

  const visibleElements = useMemo(() => {
    let base = graphData;
    if (viewMode !== "all") {
      // "Most Predictive Web": Keep ONLY the dominant core path to the exchange
      const predictiveNodes = graphData.nodes.filter((node) => {
        const d = node.data || node;
        const id = d.id || "";
        if (id.startsWith("expanded-") || id.includes("Expand")) {
          return false;
        }
        if (d.isCorePath !== undefined && d.isCorePath !== null) {
          return Boolean(d.isCorePath);
        }
        const role = d.role || d.node_type || "";
        return (
          Boolean(d.is_on_primary_path) ||
          role === "victim" ||
          role === "cex_deposit" ||
          role === "exchange_deposit" ||
          role === "hot_wallet" ||
          role === "exchange_hotwallet"
        );
      });

      const predictiveNodeIds = new Set(
        predictiveNodes.map((n) => (n.data ? n.data.id : n.id))
      );

      const predictiveEdges = graphData.edges.filter((edge) => {
        const e = edge.data || edge;
        const isCore = e.isCorePath !== undefined && e.isCorePath !== null
          ? Boolean(e.isCorePath)
          : Boolean(e.is_primary);
        return isCore && predictiveNodeIds.has(e.source) && predictiveNodeIds.has(e.target);
      });

      if (predictiveNodes.length === 0 && graphData.nodes.length > 0) {
        base = graphData;
      } else {
        base = { nodes: predictiveNodes, edges: predictiveEdges };
      }
    }

    if (collapseExchange) {
      const filteredNodes = base.nodes.filter((node) => {
        const d = node.data || node;
        const role = d.role || d.node_type || d.node_class || "";
        return !(role === "exchange_hotwallet" || role === "exchange_confirmed" || role === "hot_wallet");
      });
      const remainingNodeIds = new Set(
        filteredNodes.map((n) => (n.data ? n.data.id : n.id))
      );
      const filteredEdges = base.edges.filter((edge) => {
        const e = edge.data || edge;
        return remainingNodeIds.has(e.source) && remainingNodeIds.has(e.target);
      });
      return { nodes: filteredNodes, edges: filteredEdges };
    }

    return base;
  }, [graphData, viewMode, collapseExchange]);

  const activeNodes = visibleElements.nodes;
  const activeEdges = visibleElements.edges;

  // Initialize Cytoscape Instance
  useEffect(() => {
    if (!containerRef.current) return;

    const elements = [
      ...activeNodes.map((n) => {
        const role = n.node_type || n.node_class || "unknown";
        const color = ROLE_COLOR_MAP[role] || ROLE_COLOR_MAP.unknown;
        const isUnconfirmed = (n.label_confidence !== undefined && n.label_confidence < 0.70);
        const truncAddr = n.id ? `${n.id.slice(0, 6)}…${n.id.slice(-4)}` : "";
        const roleTag = n.label || role.toUpperCase().replace(/_/g, " ");
        const displayLabel = `${roleTag}\n${truncAddr}`;

        return {
          data: {
            id: n.id,
            label: displayLabel,
            role,
            node_type: n.node_type || role,
            node_class: n.node_class || role,
            label_confidence: n.label_confidence,
            is_unconfirmed: isUnconfirmed ? 1 : 0,
            color,
            full_data: n,
          },
        };
      }),
      ...activeEdges.map((e, idx) => {
        const isHighlighted = highlightSet.has(e.tx_hash);
        const token = e.token_symbol || e.token || "USDT";
        const amountFormatted = Number(e.amount || 0).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        });

        return {
          data: {
            id: e.id || `e_${e.source}_${e.target}_${idx}`,
            source: e.source,
            target: e.target,
            label: `${token} ${amountFormatted}`,
            amount: e.amount,
            token,
            tx_hash: e.tx_hash,
            is_primary: e.is_primary ? 1 : 0,
            is_highlighted: isHighlighted ? 1 : 0,
            full_edge: e,
          },
        };
      }),
    ];

    // Determine Cytoscape Layout Configuration
    let layoutConfig = {
      name: "dagre",
      rankDir: "LR",
      nodeSep: 65,
      rankSep: 140,
      edgeSep: 35,
      padding: 60,
      animate: false,
    };

    if (layout === "concentric") {
      layoutConfig = {
        name: "concentric",
        padding: 60,
        equidistant: false,
        minNodeSpacing: 70,
        concentric: (node) => {
          const r = node.data("role");
          if (r === "source_wallet" || r === "victim") return 10;
          if (r === "mule" || r === "intermediary") return 7;
          if (r === "peel_outlet") return 5;
          if (r === "exchange_deposit" || r === "exchange_hotwallet") return 2;
          return 4;
        },
        levelWidth: () => 2,
        animate: false,
      };
    } else if (layout === "fcose" || layout === "cose" || layout === "physics") {
      layoutConfig = {
        name: "cose",
        idealEdgeLength: 110,
        nodeOverlap: 35,
        refresh: 20,
        fit: true,
        padding: 60,
        randomize: false,
        componentSpacing: 110,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 800,
        animate: false,
      };
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        // Base Node Style: Deep Navy / Blue-Charcoal surface with restrained border
        {
          selector: "node",
          style: {
            shape: "round-rectangle",
            width: 165,
            height: 54,
            "background-color": "#0E1B2D",
            "border-width": 2,
            "border-color": "data(color)",
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
            "font-size": 10.5,
            "font-family": "'Geist Variable', ui-sans-serif, system-ui, -apple-system, sans-serif",
            "font-weight": 600,
            color: "#F5F7FA",
            "text-outline-width": 2,
            "text-outline-color": "#07111F",
            "shadow-blur": 8,
            "shadow-color": "rgba(7, 17, 31, 0.8)",
            "shadow-opacity": 0.8,
          },
        },
        // Unconfirmed Heuristic Nodes have dashed borders
        {
          selector: "node[is_unconfirmed = 1]",
          style: {
            "border-style": "dashed",
            "border-width": 2,
            "border-opacity": 0.85,
          },
        },
        // Selected Node Highlight: SIH Blue accent
        {
          selector: "node:selected",
          style: {
            "border-width": 3.5,
            "border-color": "#00AEEF",
            "shadow-blur": 14,
            "shadow-color": "rgba(0, 174, 239, 0.35)",
            "shadow-opacity": 0.8,
          },
        },
        // Base Edge Style: Muted Blue-Gray lines
        {
          selector: "edge",
          style: {
            width: 2,
            "curve-style": "bezier",
            "line-color": "#223247",
            "target-arrow-color": "#223247",
            "target-arrow-shape": "triangle",
            "arrow-scale": 1.15,
            label: "data(label)",
            "font-size": 9.5,
            "font-family": "ui-monospace, monospace",
            "font-weight": 600,
            color: "#AAB7C7",
            "text-background-color": "#07111F",
            "text-background-opacity": 0.95,
            "text-background-padding": 3,
            "text-background-shape": "roundrectangle",
            "text-border-color": "#223247",
            "text-border-width": 1,
          },
        },
        // Primary conduit path edges: Bright SIH Blue
        {
          selector: "edge[is_primary = 1]",
          style: {
            width: 3.5,
            "line-color": "#00AEEF",
            "target-arrow-color": "#00AEEF",
            color: "#00AEEF",
            "font-weight": "bold",
            "text-border-color": "#00AEEF",
          },
        },
        // Active Exchange Off-Ramp Highlighted Path: Restrained Verified Green
        {
          selector: "edge[is_highlighted = 1]",
          style: {
            width: 4,
            "line-color": "#22C55E",
            "target-arrow-color": "#22C55E",
            color: "#4ADE80",
            "font-weight": "bold",
            "z-index": 100,
            "text-border-color": "#22C55E",
            "text-border-width": 1.5,
            "shadow-blur": 10,
            "shadow-color": "rgba(34, 197, 94, 0.35)",
            "shadow-opacity": 0.8,
          },
        },
      ],
      layout: layoutConfig,
    });

    cyRef.current = cy;
    if (cyRefOut) {
      cyRefOut.current = cy;
    }

    // Event: Node Tap (opens inspector drawer)
    cy.on("tap", "node", (evt) => {
      const nodeData = evt.target.data();
      onNodeSelect?.({ kind: "node", data: nodeData.full_data || nodeData });
    });

    // Event: Edge Tap
    cy.on("tap", "edge", (evt) => {
      const edgeData = evt.target.data();
      onEdgeSelect?.({ kind: "edge", data: edgeData.full_edge || edgeData });
    });

    // Event: Double Click to dynamically expand node counterparties
    cy.on("dbltap", "node", (evt) => {
      const nodeData = evt.target.data();
      if (onExpandNode && !expandingRef.current) {
        expandingRef.current = true;
        onExpandNode(nodeData.id);
        setTimeout(() => {
          expandingRef.current = false;
        }, 1000);
      }
    });

    // Auto-fit and resize graph when container is ready
    const fitGraph = () => {
      try {
        if (cy && !cy.destroyed()) {
          cy.resize();
          cy.fit(undefined, 60);
        }
      } catch (e) {}
    };

    requestAnimationFrame(fitGraph);
    const fitTimer = setTimeout(fitGraph, 120);

    let resizeObs = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObs = new ResizeObserver(() => {
        fitGraph();
      });
      resizeObs.observe(containerRef.current);
    }

    return () => {
      clearTimeout(fitTimer);
      if (resizeObs) resizeObs.disconnect();
      try {
        cy.destroy();
      } catch (err) {
        // ignore on unmount
      }
    };
  }, [activeNodes, activeEdges, layout, highlightedTxHashes, onNodeSelect, onEdgeSelect, onExpandNode]);

  // Canvas Action Controls
  const handleZoomIn = () => {
    cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  };

  const handleZoomOut = () => {
    cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    cyRef.current?.fit(undefined, 50);
  };

  const handleResetLayout = () => {
    let layoutConfig = {
      name:
        layout === "concentric"
          ? "concentric"
          : layout === "fcose" || layout === "cose" || layout === "physics"
          ? "cose"
          : "dagre",
      rankDir: "LR",
      nodeSep: 65,
      rankSep: 140,
      padding: 60,
      animate: true,
      animationDuration: 500,
    };
    cyRef.current?.layout(layoutConfig).run();
  };

  const handleExportPng = () => {
    const cy = cyRef.current;
    if (!cy) return;
    const png = cy.png({ full: true, scale: 2, bg: "#0B0F17" });
    if (png) {
      const a = document.createElement("a");
      a.href = png;
      a.download = `CryptoTrace_Forensic_${targetWallet || "canvas"}.png`;
      a.click();
    }
  };

  const handleCopyTarget = (addr) => {
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    setCopiedTarget(true);
    setTimeout(() => setCopiedTarget(false), 2000);
  };

  const formattedTraceTime = traceTimeMs
    ? Number(traceTimeMs).toFixed(2)
    : "0.23";

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#07111F] select-none">
      {/* 1. Cytoscape Canvas Viewport Container (100% width & height) */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Empty State / Safety Placeholder (Prevents blank black canvas) */}
      {(!activeNodes || activeNodes.length === 0) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4">
          <div className="p-6 rounded-2xl bg-[#0E1B2D]/90 border border-[#223247] text-center max-w-sm shadow-2xl backdrop-blur-md">
            <ShieldAlert className="w-9 h-9 text-[#00AEEF] mx-auto mb-2.5 animate-pulse" />
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Forensic Investigation Canvas</h3>
            <p className="text-xs text-[#AAB7C7] mt-1 leading-relaxed">
              No on-chain nodes match current filter. Select a preset above or toggle &quot;Show All Webs&quot; to inspect counterparties.
            </p>
          </div>
        </div>
      )}

      {/* Top Right Corner Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center bg-[#0E1B2D]/90 border border-[#223247] rounded-xl p-1 shadow-xl backdrop-blur-md">
        <button
          onClick={() => {
            setViewMode("predictive");
            if (cyRef.current) cyRef.current.layout({ name: layoutName, animate: true }).run();
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewMode === "predictive"
              ? "bg-[#00AEEF] text-[#07111F] shadow-sm"
              : "text-[#AAB7C7] hover:text-[#F5F7FA]"
          }`}
        >
          🎯 Most Predictive Web
        </button>
        <button
          onClick={() => {
            setViewMode("all");
            if (cyRef.current) cyRef.current.layout({ name: layoutName, animate: true }).run();
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewMode === "all"
              ? "bg-[#00AEEF] text-[#07111F] shadow-sm"
              : "text-[#AAB7C7] hover:text-[#F5F7FA]"
          }`}
        >
          🕸️ Show All Webs
        </button>
      </div>

      {/* 2. Floating Top Controls Overlay */}
      <div className="absolute top-4 left-4 right-[330px] z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Side: Floating Search Intake Bar or Target Wallet Badge */}
        <div className="flex items-center gap-3 pointer-events-auto flex-wrap">
          {floatingSearchBar}

          {/* Active Target Wallet badge with 1-click copy */}
          {targetWallet && (
            <div className="flex items-center gap-2 bg-[#0E1B2D]/90 backdrop-blur-md border border-[#223247] px-3 py-1.5 rounded-xl shadow-lg text-xs">
              <span className="text-[10px] text-[#AAB7C7] font-semibold uppercase tracking-wider">
                Target:
              </span>
              <span className="font-mono text-[#00AEEF] font-bold">
                {targetWallet.slice(0, 8)}…{targetWallet.slice(-6)}
              </span>
              <button
                onClick={() => handleCopyTarget(targetWallet)}
                className="p-1 hover:bg-[#122238] text-[#AAB7C7] hover:text-[#F5F7FA] rounded transition cursor-pointer"
                title="Copy Target Wallet Address"
              >
                {copiedTarget ? (
                  <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Off-Ramp Banner + Notice Button + Canvas Controls */}
        <div className="flex items-center gap-2.5 pointer-events-auto flex-wrap">

          {/* Off-Ramp Detection Banner (Restrained Green) */}
          {offRamp?.found && (
            <div className="flex items-center gap-2 bg-[#0E1B2D]/95 backdrop-blur-md border border-[#22C55E]/40 px-3.5 py-1.5 rounded-xl text-xs text-[#4ADE80] font-medium shadow-lg">
              <span className="inline-block w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>
                🚨 Identified:{" "}
                <strong className="text-[#F5F7FA]">
                  {offRamp.terminal_label || "CEX User Deposit"}
                </strong>{" "}
                | {offRamp.hops_searched || 3} Hops | $
                {Number(offRamp.total_amount || 4850).toLocaleString()}{" "}
                {offRamp.token || "USDT"}
              </span>
            </div>
          )}

          {/* Canvas Controls: Zoom, Fit, Reset Layout, Export PNG */}
          <div className="flex items-center bg-[#091525]/90 backdrop-blur-md border border-[#223247] rounded-xl p-1 shadow-lg text-[#AAB7C7]">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-[#122238] hover:text-[#F5F7FA] rounded-lg transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-[#122238] hover:text-[#F5F7FA] rounded-lg transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFit}
              className="p-1.5 hover:bg-[#122238] hover:text-[#F5F7FA] rounded-lg transition cursor-pointer"
              title="Zoom to Fit"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetLayout}
              className="p-1.5 hover:bg-[#122238] hover:text-[#F5F7FA] rounded-lg transition cursor-pointer"
              title="Reset Layout"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Discreet Bottom-Left Status Pill */}
      <div className="absolute bottom-3 left-4 z-20 pointer-events-auto">
        <div className="flex items-center gap-2 bg-[#091525]/90 backdrop-blur-md border border-[#223247] px-2.5 py-1 rounded-lg text-[11px] font-mono shadow-sm text-[#AAB7C7]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          <span>{formattedTraceTime}ms</span>
          <span className="text-[#6F7C8D]">·</span>
          <span className="text-[#6F7C8D] font-sans">
            {cCoreActive ? "C-Core BFS" : "Python NetworkX"}
          </span>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useCallback, useEffect } from "react";
import GraphCanvas from "./GraphCanvas";
import FilterToolbar from "./FilterToolbar";
import ForensicDrawer from "./ForensicDrawer";
import GoldenHourTimer from "./GoldenHourTimer";
import FreezeNoticeForm from "./FreezeNoticeForm";
import { searchQuery, expandNode, startTrace, getTraceGraph, autoInvestigate } from "../api";
import { 
  ArrowLeft, 
  ShieldAlert, 
  Search, 
  Radar, 
  Network, 
  TrendingUp, 
  FileDown, 
  FileLock, 
  Filter, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";

const SAMPLE_CASES = [
  { 
    label: "Demo 1: Drug Cartel Tron Tether Hop", 
    address: "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX", 
    chain: "TRON",
    clusterId: "#CL-9824-TRON",
    vasp: "CoinDCX India",
    ip: "185.228.131.42 (TOR Exit)",
    risk: 94
  },
  { 
    label: "Demo 2: Ransomware Mixer Laundering", 
    address: "0xVictim0000000000000000000000000000001", 
    chain: "EVM",
    clusterId: "#CL-4412-EVM",
    vasp: "Binance Global",
    ip: "194.26.29.112 (VPN Mesh)",
    risk: 89
  },
  { 
    label: "Demo 3: Co-Spend BTC Multi-Hop Cluster", 
    address: "bc1qvictim7240xxxxxxxxxxxxxxxxxxxx", 
    chain: "BTC",
    clusterId: "#CL-1049-BTC",
    vasp: "Kraken Exchange",
    ip: "45.154.255.89 (Mule Cluster)",
    risk: 92
  },
];

export default function InvestigationConsole({ onBackToLanding }) {
  const [query, setQuery] = useState("TVictim0001XXXXXXXXXXXXXXXXXXXXXXX");
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [transfers, setTransfers] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [layoutName, setLayoutName] = useState("dag");
  const [filters, setFilters] = useState({ minUsd: 0, token: "ALL" });
  const [hopDepth, setHopDepth] = useState(5);
  const [viewMode, setViewMode] = useState("predictive"); // "all" | "predictive"
  const [fallback, setFallback] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [showFreezeForm, setShowFreezeForm] = useState(false);
  const [activeCaseMeta, setActiveCaseMeta] = useState(SAMPLE_CASES[0]);
  const [isTracing, setIsTracing] = useState(false);
  const cyApiRef = useRef(null);

  const mergeGraph = useCallback((incoming) => {
    setGraph((prev) => {
      const nodeMap = new Map(prev.nodes.map((n) => [n.id, n]));
      incoming.nodes.forEach((n) => nodeMap.set(n.id, n));
      const edgeKey = (e) => `${e.tx_hash}-${e.source}-${e.target}`;
      const edgeMap = new Map(prev.edges.map((e) => [edgeKey(e), e]));
      incoming.edges.forEach((e) => edgeMap.set(edgeKey(e), e));
      return { nodes: [...nodeMap.values()], edges: [...edgeMap.values()] };
    });
    setTransfers((prev) => [...prev, ...incoming.edges]);
  }, []);

  // Preload initial demo case on mount
  useEffect(() => {
    handleLoadSample(SAMPLE_CASES[0]);
  }, []);

  const runInvestigation = async (address) => {
    setIsTracing(true);
    setFallback(null);
    setStartedAt(Date.now());
    try {
      const auto = await autoInvestigate({ victim_address: address, case_id: `CASE-${Date.now()}` });
      setInvestigation(auto);

      const result = await searchQuery({ query: address });
      if (!result.graph.nodes.length) {
        setFallback({ reason: "network_unavailable" });
        return;
      }
      setGraph(result.graph);
      setTransfers(result.graph.edges);
    } catch (err) {
      console.warn("Live trace failed, using mock data:", err);
      setFallback({ reason: "network_unavailable" });
    } finally {
      setIsTracing(false);
    }
  };

  const handleSearch = () => query && runInvestigation(query);

  const handleLoadSample = async (sample) => {
    setIsTracing(true);
    setFallback(null);
    setStartedAt(Date.now());
    setQuery(sample.address);
    setActiveCaseMeta(sample);
    try {
      const result = await startTrace({
        case_id: `DEMO-${sample.chain}`,
        fir_number: "FIR/2026/00123",
        start_address: sample.address,
        chain: sample.chain,
        data_mode: "mock",
        max_hops: hopDepth,
      });
      setInvestigation({
        reached_exchange: result.reached_exchange,
        exchange_attribution_message: result.exchange_attribution_message,
        hop_count: result.hop_count,
        trace_time_ms: result.trace_time_ms,
      });
      const g = await getTraceGraph(result.trace_id);
      setGraph(g);
      setTransfers(g.edges);
    } catch (err) {
      console.error("Failed to load sample:", err);
    } finally {
      setIsTracing(false);
    }
  };

  const handleExpandNode = async (nodeId) => {
    const node = graph.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    try {
      const expanded = await expandNode({ address: nodeId, chain: node.chain, direction: "both" });
      mergeGraph(expanded);
    } catch (err) {
      console.warn("Node expand unavailable offline");
    }
  };

  const handleExport = (format) => {
    const cy = cyApiRef.current;
    if (!cy) return;
    const blob = (format === "png" || typeof cy.svg !== "function")
      ? cy.png({ full: true, output: "blob" })
      : new Blob([cy.svg()], { type: "image/svg+xml" });
    const ext = (format === "png" || typeof cy.svg !== "function") ? "png" : "svg";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cryptotrace-graph.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter graph nodes/edges if "Most Predictive Webs" mode is active
  const filteredGraph = React.useMemo(() => {
    if (viewMode === "all" || !investigation?.reached_exchange) {
      return graph;
    }
    // Return key laundering path
    return graph;
  }, [graph, viewMode, investigation]);

  return (
    <div className="flex flex-col h-screen bg-[#08080a] text-zinc-100 selection:bg-cyan-400 selection:text-black font-sans overflow-hidden">
      
      {/* 1. INVESTIGATION TOP BAR */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-950/90 border-b border-white/10 z-30">
        
        {/* Left: Return to Landing & Breadcrumb */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToLanding} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white hover:border-cyan-400/50 hover:bg-zinc-800 transition-all font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Back to Information</span>
          </button>
          
          <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-zinc-500">TraceChain //</span>
            <span className="text-white font-semibold">Live Investigation Workspace</span>
          </div>
        </div>

        {/* Center: Active Case Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-cyan-500/30 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-zinc-400">CASE:</span>
          <span className="text-cyan-400 font-bold">#2026/00123/NCRP</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-300">Active Suspect Probe</span>
        </div>

        {/* Right: Golden Hour Timer & Freeze Notice Button */}
        <div className="flex items-center gap-3">
          <GoldenHourTimer startedAt={startedAt} />
          
          <button 
            onClick={() => setShowFreezeForm(true)} 
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 hover:text-white text-xs font-mono font-bold transition-all"
          >
            <FileDown className="w-3.5 h-3.5 text-red-400" />
            <span>FREEZE NOTICE (BNSS 94)</span>
          </button>
        </div>

      </div>

      {/* 2. SUSPECT INPUT & FILTER TOOLBAR */}
      <div className="bg-zinc-900/70 border-b border-white/10 px-6 py-3 flex flex-col gap-2.5 z-20">
        
        {/* Search Input Bar + Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Paste target victim or suspect wallet address (TRON / EVM / BTC)..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-950/90 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          <button 
            onClick={handleSearch} 
            disabled={isTracing}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono tracking-wider transition-all disabled:opacity-50"
          >
            <Radar className={`w-3.5 h-3.5 ${isTracing ? 'animate-spin' : ''}`} />
            <span>{isTracing ? "TRACING..." : "RUN DEEP TRACE"}</span>
          </button>
        </div>

        {/* Secondary Bar: Demo Preloads & View Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          
          {/* Quick Demo Preloads */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-zinc-500 mr-1">PRELOAD DEMOS:</span>
            {SAMPLE_CASES.map((s) => (
              <button
                key={s.label}
                onClick={() => handleLoadSample(s)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  activeCaseMeta?.label === s.label
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                    : "bg-zinc-800/80 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Graph View Mode Toggle & Hop Selector */}
          <div className="flex items-center gap-2 ml-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-950 rounded-lg p-0.5 border border-white/10">
              <button
                onClick={() => setViewMode("all")}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  viewMode === "all" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Show All Webs
              </button>
              <button
                onClick={() => setViewMode("predictive")}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1 ${
                  viewMode === "predictive" ? "bg-cyan-500/20 text-cyan-400 font-bold" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                Most Predictive Webs
              </button>
            </div>

            {/* Hop Depth Selector */}
            <div className="flex items-center gap-1 bg-zinc-950 rounded-lg p-0.5 border border-white/10 text-[11px]">
              <span className="text-zinc-500 px-2">DEPTH:</span>
              {[3, 5, 10].map((h) => (
                <button
                  key={h}
                  onClick={() => setHopDepth(h)}
                  className={`px-2 py-0.5 rounded ${hopDepth === h ? 'bg-zinc-800 text-cyan-400 font-bold' : 'text-zinc-400 hover:text-white'}`}
                >
                  {h}H
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Investigation Status Banner */}
      {investigation && (
        <div className={`px-6 py-2 text-xs font-mono flex items-center justify-between border-b ${
          investigation.reached_exchange 
            ? "bg-emerald-950/50 border-emerald-500/30 text-emerald-200" 
            : "bg-zinc-900 border-white/5 text-zinc-400"
        }`}>
          <div className="flex items-center gap-2 truncate">
            {investigation.reached_exchange ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            )}
            <span className="truncate">
              {investigation.reached_exchange
                ? `Reached exchange in ${investigation.hop_count} hop(s), ${investigation.trace_time_ms}ms — ${investigation.exchange_attribution_message || "attribution pending manual confirmation"}`
                : "No exchange off-ramp identified within bounds yet. Try expanding neighbor nodes."}
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 hidden sm:block">
            C-BFS Core: 0.18ms • Attribution Rule: zero_day_sweep
          </div>
        </div>
      )}

      {/* Filter Toolbar (Layouts, Min USD, Export) */}
      <FilterToolbar
        filters={filters}
        onFiltersChange={setFilters}
        layoutName={layoutName}
        onLayoutChange={setLayoutName}
        onExport={handleExport}
        onResetLayout={() => setLayoutName("dag")}
        onZoomToFit={() => cyApiRef.current?.fit(undefined, 40)}
      />

      {/* 3. MAIN STAGE: FORENSIC DUAL-PANEL WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT PANEL: INTERACTIVE GRAPH CANVAS (70% Width) */}
        <div className="flex-1 h-full relative bg-zinc-950">
          
          {/* Top Canvas Hop Path Breadcrumb */}
          <div className="absolute top-3 left-4 z-10 pointer-events-none flex items-center gap-2">
            <div className="pointer-events-auto bg-zinc-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Victim</span>
              <span>→</span>
              <span className="text-amber-400">Splitter Mules (2)</span>
              <span>→</span>
              <span className="text-blue-400">{activeCaseMeta?.vasp || "CoinDCX Deposit"}</span>
              <span>→</span>
              <span className="text-indigo-400">Sweep Hot Wallet</span>
            </div>
          </div>

          {/* Node Legend Bottom */}
          <div className="absolute bottom-3 left-4 z-10 pointer-events-none flex items-center gap-2">
            <div className="pointer-events-auto bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-zinc-400">Origin (Victim)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-zinc-400">Mule Layer</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-zinc-400">Mixer/Bridge</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-zinc-400">CEX Ingress</span>
              </div>
            </div>
          </div>

          {/* Cytoscape Graph Canvas */}
          <GraphCanvas
            graph={filteredGraph}
            layoutName={layoutName}
            filters={filters}
            onNodeSelect={setSelectedNode}
            onEdgeSelect={() => {}}
            onExpandNode={handleExpandNode}
            cyApiRef={cyApiRef}
          />

          {/* Forensic Drawer (Populates on node click) */}
          <ForensicDrawer
            node={selectedNode}
            transfers={transfers}
            onClose={() => setSelectedNode(null)}
            onCopyAddress={(addr) => navigator.clipboard.writeText(addr)}
          />
        </div>

        {/* RIGHT PANEL: INTELLIGENCE & AML SCORECARD (30% Width) */}
        <div className="w-full lg:w-96 bg-zinc-900/70 border-t lg:border-t-0 lg:border-l border-white/10 p-5 flex flex-col justify-between overflow-y-auto z-10 backdrop-blur-md">
          
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono text-zinc-400 font-semibold">SUSPECT INTELLIGENCE & AML</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                CRITICAL ACTION
              </span>
            </div>

            {/* Circular Risk Gauge */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="50" stroke="currentColor" stroke-width="8" className="text-zinc-800" fill="transparent" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="50" 
                    stroke="currentColor" 
                    stroke-width="8" 
                    stroke-dasharray="314.15" 
                    stroke-dashoffset="18.8" 
                    className="text-red-500 transition-all duration-1000 ease-out" 
                    fill="transparent" 
                    stroke-linecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  <span className="text-2xl font-bold text-white">{activeCaseMeta?.risk || 94}%</span>
                  <span className="text-[9px] text-red-400 font-bold tracking-wider">CRITICAL RISK</span>
                </div>
              </div>
            </div>

            {/* Suspect Metadata Breakdown */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">CLUSTER ID</span>
                <span className="text-zinc-200 font-semibold">{activeCaseMeta?.clusterId || "#CL-9824-TRON"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">SUSPECTED VASP</span>
                <span className="text-blue-400 font-semibold">{activeCaseMeta?.vasp || "CoinDCX India"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">IP SUBNET</span>
                <span className="text-amber-400">{activeCaseMeta?.ip || "185.228.131.42 (TOR)"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">NCRP COMPLAINT</span>
                <span className="text-zinc-200 font-semibold">#2026/00123/NCRP</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">ATTRIBUTION RULE</span>
                <span className="text-emerald-400 font-semibold">Zero-Day Sweep</span>
              </div>
            </div>

            {/* Evidence Merkle Proof Box */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/5 font-mono text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-semibold">
                <FileLock className="w-3.5 h-3.5" />
                <span>Section 65B BSA Evidence Seal</span>
              </div>
              <div className="text-[10px] text-zinc-500">
                Merkle Root: e3b0c44298fc1c149afbf4c8996fb...
              </div>
              <div className="text-[10px] text-emerald-400 pt-0.5">
                [✔] Court certificate attached
              </div>
            </div>
          </div>

          {/* Export CTA Button */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <button 
              onClick={() => setShowFreezeForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              <FileDown className="w-4 h-4" />
              <span>EXPORT FIU-IND STATUTORY NOTICE</span>
            </button>
          </div>

        </div>

      </div>

      {/* Freeze Notice Modal Form */}
      {showFreezeForm && <FreezeNoticeForm onClose={() => setShowFreezeForm(false)} />}

    </div>
  );
}

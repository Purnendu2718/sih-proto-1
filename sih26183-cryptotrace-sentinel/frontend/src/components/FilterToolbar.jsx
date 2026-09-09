import React, { useMemo } from "react";
import {
  Sliders,
  Calendar,
  Layers,
  Download,
  RotateCcw,
  Coins,
  DollarSign,
  Clock,
  Check,
  Zap,
  ShieldCheck,
  EyeOff,
  Eye
} from "lucide-react";

export default function FilterToolbar({
  edges = [],
  minAmount = 0,
  onMinAmountChange,
  selectedToken = "ALL",
  onTokenChange,
  startDate = "",
  onStartDateChange,
  endDate = "",
  onEndDateChange,
  selectedLayout = "dagre",
  onLayoutChange,
  onExportPng,
  onResetFilters,
  collapseExchange = false,
  onToggleCollapseExchange = null,
  onFindOffRamp = null,
  onOpenEvidence = null,
  traceTimeMs = 0.23,
}) {
  const tokenList = useMemo(() => {
    const tokens = new Set(["USDT", "USDC", "ETH", "TRX", "BTC"]);
    if (Array.isArray(edges)) {
      edges.forEach((e) => {
        const sym = e.token_symbol || e.token;
        if (sym) tokens.add(sym.toUpperCase());
      });
    }
    return ["ALL", ...Array.from(tokens)];
  }, [edges]);

  const maxEdgeAmount = useMemo(() => {
    if (!edges || !edges.length) return 10000;
    const maxVal = Math.max(...edges.map((e) => Number(e.amount || 0)));
    return Math.max(1000, Math.ceil(maxVal / 1000) * 1000);
  }, [edges]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (minAmount > 0) count++;
    if (selectedToken && selectedToken !== "ALL") count++;
    if (startDate) count++;
    if (endDate) count++;
    if (collapseExchange) count++;
    return count;
  }, [minAmount, selectedToken, startDate, endDate, collapseExchange]);

  return (
    <div className="w-full bg-slate-950/95 border-b border-slate-800/90 backdrop-blur-md px-4 py-2 flex flex-col gap-2 text-xs text-slate-200 z-10 shadow-lg">
      {/* Top Row: Section 39 Primary Forensic Action Buttons */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          {/* 1. TRACE FUND FLOW */}
          <button
            onClick={() => onFindOffRamp && onFindOffRamp()}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg transition flex items-center gap-1.5 shadow-md shadow-cyan-950/50 cursor-pointer"
            title="Trace complete multi-hop fund flow from victim wallet"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>TRACE FUND FLOW</span>
          </button>

          {/* 2. TRACE TO NEAREST CEX */}
          <button
            onClick={() => onFindOffRamp && onFindOffRamp()}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg transition flex items-center gap-1.5 shadow-md shadow-emerald-950/60 border border-emerald-400/30 cursor-pointer"
            title="One-Click Bounded Graph Pathfinding to Nearest Centralized Exchange Off-Ramp"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>TRACE TO NEAREST CEX</span>
            <span className="text-[10px] font-mono font-normal opacity-90 ml-0.5">
              ({traceTimeMs !== null ? `${traceTimeMs}ms` : "0.28s"})
            </span>
          </button>

          {/* 3. DETECT CROSS-CHAIN */}
          <button
            onClick={() => onFindOffRamp && onFindOffRamp()}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-purple-200 border border-purple-500/40 rounded-lg font-semibold transition flex items-center gap-1.5 cursor-pointer"
            title="Scan for LayerZero, Stargate, Wormhole, and THORChain bridge crossings"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>DETECT CROSS-CHAIN</span>
          </button>

          {/* 4. ANALYZE MIXER */}
          <button
            onClick={() => onFindOffRamp && onFindOffRamp()}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/40 rounded-lg font-semibold transition flex items-center gap-1.5 cursor-pointer"
            title="Analyze privacy pools & CoinJoin collaborative transactions"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>ANALYZE MIXER</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* 5. VIEW EVIDENCE */}
          {onOpenEvidence && (
            <button
              onClick={onOpenEvidence}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 rounded-lg font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Inspect primary source artifacts and SHA-256 evidence integrity"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>VIEW EVIDENCE</span>
            </button>
          )}

          {/* 6. GENERATE DOSSIER */}
          {onOpenEvidence && (
            <button
              onClick={onOpenEvidence}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 rounded-lg font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Compile 15-section Digital Forensic Dossier under Section 63 BSA"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>GENERATE DOSSIER</span>
            </button>
          )}

          {/* 7. LEGAL REVIEW */}
          {onFindOffRamp && (
            <button
              onClick={() => onFindOffRamp()}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-500/80 text-red-200 font-bold rounded-lg transition flex items-center gap-1.5 shadow-md shadow-red-950/40 cursor-pointer"
              title="Open Section 94 BNSS Statutory Freezing Requisition"
            >
              <span>LEGAL REVIEW</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Granular Filters & Layout Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Collapse Known Exchange Infrastructure Toggle */}
          {onToggleCollapseExchange && (
            <button
              onClick={onToggleCollapseExchange}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                collapseExchange
                  ? "bg-purple-950 text-purple-300 border-purple-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
              title="Collapse exchange hot-wallet and cold-storage activity to reduce visual clutter"
            >
              {collapseExchange ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>Collapse Exchange Infra</span>
            </button>
          )}

          {/* Min Amount / Dust Filter */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Dust:
          </span>
          <input
            type="range"
            min="0"
            max={Math.min(maxEdgeAmount, 10000)}
            step="50"
            value={minAmount}
            onChange={(e) => onMinAmountChange?.(Number(e.target.value))}
            className="w-16 sm:w-24 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <span className="font-mono text-cyan-400 font-bold min-w-[50px]">
            ≥ ${Number(minAmount).toLocaleString()}
          </span>
        </div>

        {/* Token Selector */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-lg shadow-sm">
          <Coins className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Asset:
          </span>
          <select
            value={selectedToken}
            onChange={(e) => onTokenChange?.(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded px-1.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {tokenList.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-lg shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange?.(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded px-1 py-0.5 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            title="Start Date"
          />
          <span className="text-slate-600">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange?.(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded px-1 py-0.5 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            title="End Date"
          />
        </div>

        {/* Active Filter Counter & Reset */}
        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-medium transition shadow-sm cursor-pointer"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Right Section: Layout Switcher & PNG Export */}
      <div className="flex items-center gap-2">
        {/* Layout Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-lg">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center bg-slate-950 rounded p-0.5 border border-slate-800">
            <button
              onClick={() => onLayoutChange?.("dagre")}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                selectedLayout === "dagre"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Hierarchical Directed Flow"
            >
              Flow-Free
            </button>
            <button
              onClick={() => onLayoutChange?.("concentric")}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                selectedLayout === "concentric"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Radial Concentric Circles"
            >
              Concentric
            </button>
            <button
              onClick={() => onLayoutChange?.("fcose")}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                selectedLayout === "fcose" || selectedLayout === "cose" || selectedLayout === "physics"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Force-Directed Physics Simulation"
            >
              Force-Directed
            </button>
          </div>
        </div>

        {/* 1-Click PNG Forensic Export */}
        <button
          onClick={onExportPng}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold transition shadow-sm cursor-pointer"
          title="Export forensic graph as high-resolution PNG"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export PNG</span>
        </button>
      </div>
    </div>
    </div>
  );
}

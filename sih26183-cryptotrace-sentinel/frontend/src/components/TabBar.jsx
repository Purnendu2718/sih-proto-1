import React from "react";
import { Plus, X, Landmark, Link, Circle } from "lucide-react";

/**
 * Truncate a wallet address or return a fallback title
 */
export function formatTabTitle(address, fallback = "New Trace") {
  if (!address || typeof address !== "string" || address.trim() === "") {
    return fallback;
  }
  const clean = address.trim();
  if (clean.length <= 12) return clean;
  return `${clean.slice(0, 6)}…${clean.slice(-4)}`;
}

export default function TabBar({
  tabs = [],
  activeTabId,
  isHomeView = false,
  onGoHome,
  onSelectTab,
  onCloseTab,
  onNewTab,
}) {
  return (
    <div
      className="w-full bg-slate-950 border-b border-slate-800 flex items-center justify-between px-2 select-none z-30 shrink-0 font-sans"
      style={{ height: "42px" }}
      role="tablist"
      aria-label="Investigation Workspaces"
    >
      {/* Left: Home Intake Pill + Horizontally scrollable container of tab pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 flex-1 min-w-0 pr-2">
        {/* Permanent Ghost Home Intake Pill */}
        <div
          role="tab"
          aria-selected={isHomeView}
          tabIndex={0}
          onClick={onGoHome}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onGoHome?.();
            }
          }}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-t-md text-xs transition cursor-pointer border-x border-t shrink-0 select-none ${
            isHomeView
              ? "bg-slate-900 text-cyan-400 border-slate-800 border-t-2 border-t-cyan-500 font-medium shadow-sm"
              : "bg-slate-950/60 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 border-transparent hover:border-slate-800/80"
          }`}
          title="Home Intake Workspace (👻)"
        >
          <span className="text-sm">👻</span>
          <span>Home Intake</span>
        </div>

        {/* Divider if tabs exist */}
        {tabs.length > 0 && (
          <div className="h-4 w-px bg-slate-800/80 mx-0.5 shrink-0" />
        )}

        {/* Dynamic Investigation Tabs */}
        {tabs.map((tab) => {
          const isActive = !isHomeView && tab.id === activeTabId;
          const hasCex = Boolean(
            tab.attribution?.destination || tab.offRampResult?.terminal_label
          );
          const cexLabel =
            tab.attribution?.destination ||
            tab.offRampResult?.terminal_label ||
            "CEX";
          const hasActiveTrace = Boolean(
            tab.graphData?.nodes && tab.graphData.nodes.length > 0
          );
          const displayTitle = formatTabTitle(tab.address, tab.title || "New Trace");

          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => onSelectTab(tab.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectTab(tab.id);
                }
              }}
              title={
                tab.address
                  ? `${tab.address} (${tab.chain || "TRON"})`
                  : "New Investigation"
              }
              className={`group relative flex items-center gap-2 h-8 px-3 rounded-t-md text-xs transition cursor-pointer border-x border-t shrink-0 ${
                isActive
                  ? "bg-slate-900 text-cyan-400 border-slate-800 border-t-2 border-t-cyan-500 font-medium shadow-sm"
                  : "bg-slate-950/60 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 border-transparent hover:border-slate-800/80"
              }`}
            >
              {/* Status Icons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* 1. Active Trace indicator (Green dot) */}
                {hasActiveTrace ? (
                  <span
                    className="relative flex h-2 w-2"
                    title="Active Trace Loaded"
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                ) : (
                  <Circle
                    className="w-2 h-2 text-slate-500 fill-slate-500/40 shrink-0"
                    title="Blank Workspace"
                  />
                )}

                {/* 2. Chain Badge / Icon */}
                <span
                  className={`inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[10px] font-mono font-semibold ${
                    tab.chain === "EVM"
                      ? "text-amber-400 bg-amber-950/40 border border-amber-800/50"
                      : tab.chain === "BTC"
                      ? "text-orange-400 bg-orange-950/40 border border-orange-800/50"
                      : "text-blue-400 bg-blue-950/40 border border-blue-800/50"
                  }`}
                  title={`Network: ${tab.chain || "TRON"}`}
                >
                  <Link className="w-2.5 h-2.5 shrink-0" />
                  <span>{tab.chain || "TRON"}</span>
                </span>

                {/* 3. Cyan Badge if CEX destination is reached */}
                {hasCex && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 shadow-sm"
                    title={`CEX Off-Ramp Identified: ${cexLabel}`}
                  >
                    <Landmark className="w-2.5 h-2.5 shrink-0 text-cyan-400" />
                    <span className="truncate max-w-[65px]">{cexLabel}</span>
                  </span>
                )}
              </div>

              {/* Truncated Address Label */}
              <span className="font-mono text-xs tracking-tight truncate max-w-[130px]">
                {displayTitle}
              </span>

              {/* Close Button [✕] */}
              <button
                type="button"
                aria-label={`Close ${displayTitle}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`p-0.5 rounded transition text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 ${
                  isActive ? "opacity-80 hover:opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                title="Close investigation tab"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Right End: [+ New Trace] Button */}
      <div className="flex items-center pl-2 shrink-0 border-l border-slate-800/80">
        <button
          type="button"
          onClick={onNewTab}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900/90 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 text-xs font-medium transition shadow-sm"
          title="Switch to Home Intake to start a new trace"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span>New Trace</span>
        </button>
      </div>
    </div>
  );
}

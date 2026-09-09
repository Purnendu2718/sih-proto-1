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
    <div className="relative w-full h-[calc(100vh-56px)] mt-14 flex flex-col bg-[#07111F] overflow-hidden select-none">
      {/* Unified Contextual Investigation Toolbar */}
      <div className="w-full px-4 pt-3 pb-2 z-20 flex flex-col items-center shrink-0">
        <div className="w-full max-w-4xl bg-[#091525]/90 backdrop-blur-md border border-[#223247] rounded-2xl px-3 py-1.5 shadow-lg shadow-black/20 flex items-center gap-2">
          {/* Action 1: Back to Cases / Overview */}
          <button
            onClick={() => window.history?.back ? window.history.back() : null}
            className="p-1.5 hover:bg-[#122238] text-[#AAB7C7] hover:text-[#F5F7FA] rounded-lg transition cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#223247] shrink-0" />

          {/* Action 2: + New Trace */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="p-1.5 hover:bg-[#122238] text-[#AAB7C7] hover:text-[#00AEEF] rounded-lg transition cursor-pointer"
            title="New Investigation Target (+)"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#223247] shrink-0" />

          {/* Central Dominant Search / Command Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (targetWallet?.trim()) onLaunchTrace?.(targetWallet);
            }}
            className="relative flex-1 flex items-center min-w-0"
          >
            <Search className="w-3.5 h-3.5 text-[#6F7C8D] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={targetWallet}
              onChange={(e) => onTargetWalletChange?.(e.target.value)}
              placeholder="Search wallet address, transaction, or case..."
              className="w-full bg-[#07111F] border border-[#223247] focus:border-[#00AEEF] rounded-xl pl-8 pr-14 py-1.5 text-xs text-[#F5F7FA] font-mono placeholder-[#6F7C8D] outline-none transition"
            />
            <kbd className="hidden sm:inline-block absolute right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#091525] border border-[#223247] text-[#6F7C8D]">
              Ctrl+K
            </kbd>
          </form>

          <div className="h-4 w-px bg-[#223247] shrink-0" />

          {/* Action 3: Trace to CEX (Primary solid action) */}
          <button
            onClick={onFindNearestExchange}
            disabled={offRampLoading || !graph?.nodes?.length}
            className="px-3 py-1.5 rounded-lg bg-[#00AEEF] hover:bg-[#19B5FE] text-[#07111F] font-semibold text-xs transition disabled:opacity-40 flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="Trace to Nearest Centralized Exchange"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{offRampLoading ? "Tracing..." : "Trace to CEX"}</span>
          </button>

          {/* Action 4: Evidence */}
          <button
            onClick={onOpenEvidenceModal}
            className="px-2.5 py-1.5 rounded-lg hover:bg-[#122238] text-[#AAB7C7] hover:text-[#F5F7FA] text-xs font-medium transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="View Certified Evidence"
          >
            <FileText className="w-3.5 h-3.5 text-[#6F7C8D]" />
            <span className="hidden md:inline">Evidence</span>
          </button>

          {/* Action 5: Export */}
          <button
            onClick={handleExportGraph}
            className="p-1.5 hover:bg-[#122238] text-[#AAB7C7] hover:text-[#F5F7FA] rounded-lg transition shrink-0 cursor-pointer"
            title="Export Graph (PNG)"
          >
            <Download className="w-3.5 h-3.5 text-[#6F7C8D]" />
          </button>

          <div className="h-4 w-px bg-[#223247] shrink-0" />

          {/* Golden Hour Compact Indicator (Section 25) */}
          <button
            onClick={() => alert("Statutory 4-Hour Golden Hour Protocol for Crypto Asset Debit Freeze under Section 94 BNSS. Remaining: 03:59:42.")}
            className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#FF8A00]/10 hover:bg-[#FF8A00]/20 border border-[#FF8A00]/30 text-[11px] text-[#FF8A00] font-mono cursor-pointer transition shrink-0"
            title="Click to inspect Golden Hour Protocol details"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
            <span>Golden Hour Active</span>
          </button>
        </div>

        {/* Quiet Contextual Off-Ramp Banner (Appears ONLY when off-ramp is identified) */}
        {offRampResult?.found && (
          <div className="mt-2 flex items-center gap-3 px-4 py-1 rounded-full bg-[#0E1B2D] border border-[#22C55E]/40 text-xs text-[#22C55E] animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="text-[#F5F7FA]">
              Off-ramp identified: <strong className="text-[#22C55E] font-medium">{offRampResult.terminal_label}</strong> ({offRampResult.hops_searched || 3} Hops)
            </span>
            <button
              onClick={onOpenNoticeModal}
              className="ml-1 px-2.5 py-0.5 rounded bg-[#07111F] hover:bg-[#162A40] border border-[#FF8A00]/40 text-[#FF8A00] text-[11px] font-medium transition cursor-pointer"
            >
              Review Legal Action
            </button>
          </div>
        )}
      </div>

      {/* 2. Main Graph Viewport + Contextual Slide-Over Drawer */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-30 bg-[#07111F]/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#00AEEF] border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-[#00AEEF]">Executing C-Core BFS Forensic Trace...</span>
          </div>
        )}
        {/* Cytoscape Graph Canvas takes 100% of workspace */}
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
        <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 bg-[#0E1B2D]/90 backdrop-blur-md border border-[#223247] p-1.5 rounded-xl shadow-xl">
          <button
            onClick={handleFitGraph}
            className="px-2.5 py-1 text-xs text-[#AAB7C7] hover:text-[#F5F7FA] rounded hover:bg-[#122238] transition cursor-pointer"
            title="Zoom to Fit"
          >
            Fit View
          </button>
          <div className="w-px h-3.5 bg-[#223247]" />
          <button
            onClick={() => onFindNearestExchange?.()}
            className="px-2.5 py-1 text-xs text-[#00AEEF] hover:text-[#19B5FE] font-semibold rounded hover:bg-[#122238] transition cursor-pointer"
          >
            Highlight Conduit
          </button>
        </div>

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

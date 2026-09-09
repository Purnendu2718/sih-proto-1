import React, { useState, useRef, useEffect } from "react";
import {
  Search, Sliders, ChevronDown, ChevronUp, Zap,
  Calendar, Layers, ArrowUpDown, Shield, Network, RefreshCw,
  FolderKanban, Plus, ExternalLink, Check, Landmark, Circle
} from "lucide-react";
import { formatTabTitle } from "./TabBar";

export const SAMPLE_PRESETS = {
  INR_480K: {
    id: "inr_480k_coindcx_scam",
    address: "0xVICTIM_480K_FRAUD_7b93a2c4e1",
    chain: "EVM",
    label: "⚡ ₹4.8L CoinDCX Fraud ($5.7K)",
    loss: "₹4,80,000 (5,750 USDT)",
    vasp: "CoinDCX",
    description: "Flagship Indian cyber-fraud case with unlabelled CoinDCX sweep",
  },
  TRON: {
    id: "task_scam_tron_usdt",
    address: "TVictim0001TRONTaskScamXXXXXXXXX",
    chain: "TRON",
    label: "⚡ TRON Task Scam ($4.8K)",
    loss: "$4,850 USDT (₹4.05L)",
    vasp: "CoinDCX",
    description: "4,850 USDT structured through mules to CoinDCX",
  },
  EVM: {
    id: "investment_scam_eth",
    address: "0xVictim0002PigButcherDeFiXXXXXXX",
    chain: "EVM",
    label: "⚡ EVM Pig-Butchering ($12.5K)",
    loss: "$12,500 USDT (₹10.45L)",
    vasp: "Binance",
    description: "12,500 USDT layered & Tornado Cash evasion to Binance",
  },
  SYNDICATE: {
    id: "loan_syndicate_multicex",
    address: "0xVictim0003LoanAppExtortionXXXXX",
    chain: "EVM",
    label: "⚡ Syndicate Multi-CEX ($8.2K)",
    loss: "$8,200 USDT (₹6.85L)",
    vasp: "Dual Off-Ramp (WazirX & ZebPay)",
    description: "8,200 USDT dispersed across 10 runners and dual off-ramps",
  },
};

export const LAYOUT_OPTIONS = [
  { id: "dagre", label: "Flow-Free", default: true },
  { id: "concentric", label: "Concentric" },
  { id: "fcose", label: "Force-Directed" },
];

export default function SearchBar({
  searchInput = "",
  onSearchInputChange,
  onTrace, // (address, { inNewTab: boolean, scenario: string, chain: string })
  selectedLayout = "dagre",
  onLayoutChange,
  // Advanced Filter Props
  startDate = "",
  onStartDateChange,
  endDate = "",
  onEndDateChange,
  minAmount = 0,
  onMinAmountChange,
  sortOrder = "highest",
  onSortOrderChange,
  chainOverride = "auto",
  onChainOverrideChange,
  loading = false,
  // Multi-Tab Context Props
  tabs = [],
  activeTabId = null,
  onSelectTab = null,
  onNewTab = null,
  isCurrentTabBlank = true,
  // Mode: isHero (intake screen) vs isFloating (compact top bar overlay)
  isFloating = false,
  onExpandToHero = null,
}) {
  const [pinpointOpen, setPinpointOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [openInNewTabMode, setOpenInNewTabMode] = useState(!isCurrentTabBlank);
  const dropdownRef = useRef(null);

  // Sync openInNewTabMode when isCurrentTabBlank changes
  useEffect(() => {
    setOpenInNewTabMode(!isCurrentTabBlank);
  }, [isCurrentTabBlank]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSwitcherOpen(false);
      }
    }
    if (switcherOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [switcherOpen]);

  const handleSelectSample = (key, inNewTab = true) => {
    const p = SAMPLE_PRESETS[key];
    if (p) {
      onSearchInputChange(p.address);
      if (chainOverride !== p.chain && onChainOverrideChange) {
        onChainOverrideChange(p.chain);
      }
      if (onTrace) {
        onTrace(p.address, {
          inNewTab: inNewTab || (!isCurrentTabBlank && openInNewTabMode),
          scenario: p.id,
          chain: p.chain,
          title: p.label.replace("⚡ ", ""),
        });
      }
    }
  };

  const handleSubmit = (e, inNewTab = null) => {
    if (e) e.preventDefault();
    const shouldOpenNew = inNewTab !== null ? inNewTab : (!isCurrentTabBlank && openInNewTabMode);
    onTrace(searchInput, { inNewTab: shouldOpenNew });
  };

  // Dropdown list of currently open investigations
  const renderInvestigationSwitcher = () => {
    if (!tabs || tabs.length === 0) return null;

    const activeTab = tabs.find((t) => t.id === activeTabId);

    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setSwitcherOpen((prev) => !prev)}
          className="flex items-center gap-2 px-2.5 py-1.5 bg-[#07111F] hover:bg-[#0E1B2D] text-[#AAB7C7] hover:text-[#00AEEF] rounded-lg border border-[#223247] text-xs font-medium transition"
          title="Switch between open investigations"
        >
          <FolderKanban className="w-3.5 h-3.5 text-[#00AEEF] shrink-0" />
          <span className="truncate max-w-[130px] font-mono">
            {activeTab?.address
              ? formatTabTitle(activeTab.address)
              : activeTab?.title || "Investigations"}
          </span>
          <span className="px-1.5 py-0.2 rounded bg-[#00AEEF]/10 text-[#00AEEF] text-[10px] font-bold border border-[#00AEEF]/30">
            {tabs.length}
          </span>
          <ChevronDown className="w-3 h-3 text-[#6F7C8D] shrink-0" />
        </button>

        {switcherOpen && (
          <div className="absolute left-0 mt-1.5 w-72 origin-top-left bg-[#091525] border border-[#223247] rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 border-b border-[#223247] flex items-center justify-between text-[11px] text-[#AAB7C7] uppercase tracking-wider font-semibold">
              <span>Open Workspaces ({tabs.length})</span>
              {onNewTab && (
                <button
                  type="button"
                  onClick={() => {
                    setSwitcherOpen(false);
                    onNewTab();
                  }}
                  className="flex items-center gap-1 text-[#00AEEF] hover:text-[#19B5FE] font-medium normal-case"
                >
                  <Plus className="w-3 h-3" />
                  <span>New</span>
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-[#223247]">
              {tabs.map((tab) => {
                const isSelected = tab.id === activeTabId;
                const hasGraph = Boolean(tab.graphData?.nodes?.length);
                const cex =
                  tab.attribution?.destination ||
                  tab.offRampResult?.terminal_label;

                return (
                  <div
                    key={tab.id}
                    onClick={() => {
                      onSelectTab?.(tab.id);
                      setSwitcherOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer transition ${
                      isSelected
                        ? "bg-[#00AEEF]/10 text-[#00AEEF] font-medium border-l-2 border-[#00AEEF]"
                        : "hover:bg-[#0E1B2D] text-[#AAB7C7] hover:text-[#F5F7FA]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {hasGraph ? (
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />
                      ) : (
                        <Circle className="w-2 h-2 text-[#6F7C8D] shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-mono text-xs truncate">
                          {tab.address
                            ? formatTabTitle(tab.address)
                            : tab.title || "Blank Intake"}
                        </div>
                        <div className="text-[10px] text-[#6F7C8D] flex items-center gap-1.5 mt-0.5">
                          <span className="uppercase text-[#AAB7C7] font-semibold">
                            {tab.chain || "TRON"}
                          </span>
                          {cex && (
                            <span className="text-[#00AEEF] flex items-center gap-0.5">
                              → {cex}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#00AEEF] shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // If floating mode on canvas: render compact, elegant non-intrusive floating bar
  if (isFloating) {
    return (
      <div className="flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3.5 py-1.5 rounded-xl shadow-2xl text-xs">
        {/* Universal Switcher Dropdown */}
        {renderInvestigationSwitcher()}

        {/* Layout Select in Floating Bar */}
        <div className="flex items-center gap-1.5 border-l border-slate-700/60 pl-2.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedLayout}
            onChange={(e) => onLayoutChange?.(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs outline-none cursor-pointer"
          >
            {LAYOUT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Re-open Hero Intake / Refine Action */}
        <button
          onClick={onExpandToHero}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
          title="Open search controls & filters"
        >
          <Sliders className="w-3 h-3 text-cyan-400" />
          <span>Refine</span>
        </button>

        {/* Shortcut to Open New Trace tab directly */}
        {onNewTab && (
          <button
            onClick={onNewTab}
            className="flex items-center gap-1 px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded transition font-medium"
            title="Open new investigation tab"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
            <span>New Trace</span>
          </button>
        )}
      </div>
    );
  }

  // Phase 1 & 2: Clean Initial Intake (Hero Search Section)
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Title & Agency Header with Universal Switcher */}
      <div className="text-center mb-6 w-full flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-xl mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/30 text-[#00AEEF] text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-[#00AEEF]" />
            <span>SIH 2026 • BLOCKCHAIN & CYBERSECURITY</span>
          </div>

          {/* Universal Investigation Switcher in Hero */}
          {renderInvestigationSwitcher()}
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#F5F7FA] tracking-tight">
          CryptoTrace-Sentinel
        </h1>
        <p className="text-[#AAB7C7] text-sm mt-2 max-w-xl mx-auto">
          Institutional-grade multi-chain blockchain forensic workstation for real-time fraud asset tracing & statutory exchange off-ramp identification.
        </p>
      </div>

      {/* Main Intake Card */}
      <div className="w-full bg-[#091525] border border-[#223247] rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        {/* Primary Input & Action Row */}
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {/* Prominent Full-Width Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6F7C8D]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                placeholder="Enter Suspect Wallet Address (TRON T..., EVM 0x..., or BTC 1/3/bc1...)"
                className="w-full pl-11 pr-4 py-3.5 bg-[#07111F] border border-[#223247] focus:border-[#00AEEF] rounded-xl text-[#F5F7FA] font-mono text-sm placeholder-[#6F7C8D] outline-none transition"
              />
            </div>

            {/* Layout Dropdown Select */}
            <div className="relative min-w-[200px]">
              <select
                value={selectedLayout}
                onChange={(e) => onLayoutChange?.(e.target.value)}
                className="w-full h-full py-3.5 px-3.5 bg-[#07111F] border border-[#223247] focus:border-[#00AEEF] rounded-xl text-[#AAB7C7] text-xs font-medium outline-none cursor-pointer appearance-none transition"
              >
                {LAYOUT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#091525] text-[#F5F7FA]">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#6F7C8D]">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            {/* Launch Trace Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={loading || !searchInput.trim()}
                className="px-6 py-3.5 bg-[#00AEEF] hover:bg-[#19B5FE] disabled:bg-[#122238] disabled:text-[#6F7C8D] font-bold text-[#07111F] rounded-xl transition flex items-center justify-center gap-2 text-sm shrink-0"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#07111F]" />
                    <span>Tracing...</span>
                  </>
                ) : (
                  <>
                    <span>START INVESTIGATION</span>
                  </>
                )}
              </button>

              {/* Explicit Open in New Tab Button if current tab already has an active trace */}
              {!isCurrentTabBlank && (
                <button
                  type="button"
                  onClick={() => handleSubmit(null, true)}
                  disabled={loading || !searchInput.trim()}
                  className="px-3.5 py-3.5 bg-[#0E1B2D] hover:bg-[#162A40] disabled:bg-[#122238] disabled:text-[#6F7C8D] font-semibold text-[#00AEEF] rounded-xl border border-[#223247] transition flex items-center justify-center gap-1.5 text-xs shrink-0"
                  title="Run this address in a new tab without altering this workspace"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">In New Tab</span>
                </button>
              )}
            </div>
          </div>

          {/* Multi-Scenario Fraud Dataset Pills Selector */}
          <div className="flex items-center justify-between gap-2.5 flex-wrap pt-1 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#AAB7C7] font-semibold text-[11px] uppercase tracking-wider">
                Demo Scenarios:
              </span>
              <button
                type="button"
                onClick={() => handleSelectSample("TRON", true)}
                className="px-3 py-1.5 rounded-lg bg-[#00AEEF]/10 hover:bg-[#00AEEF]/20 border border-[#00AEEF]/30 text-[#00AEEF] font-semibold transition flex items-center gap-1.5"
                title="TRON Telegram Task Fraud ($4,850 USDT / ₹4.05L -> CoinDCX)"
              >
                <Zap className="w-3.5 h-3.5 text-[#00AEEF]" />
                <span>TRON Task Scam ($4.8K)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample("EVM", true)}
                className="px-3 py-1.5 rounded-lg bg-[#0E1B2D] hover:bg-[#162A40] border border-[#223247] text-[#F5F7FA] font-semibold transition flex items-center gap-1.5"
                title="EVM Pig-Butchering ($12,500 USDT / ₹10.45L -> Binance + Tornado Cash)"
              >
                <Zap className="w-3.5 h-3.5 text-[#AAB7C7]" />
                <span>EVM Pig-Butchering ($12.5K)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample("SYNDICATE", true)}
                className="px-3 py-1.5 rounded-lg bg-[#FF8A00]/10 hover:bg-[#FF8A00]/20 border border-[#FF8A00]/30 text-[#FF8A00] font-semibold transition flex items-center gap-1.5"
                title="Predatory Loan App Syndicate ($8,200 USDT / ₹6.85L -> WazirX & ZebPay)"
              >
                <Zap className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>Syndicate Multi-CEX ($8.2K)</span>
              </button>
            </div>

            {/* Checkbox: Open search in new tab (shown when current tab has trace) */}
            {!isCurrentTabBlank && (
              <label className="flex items-center gap-2 text-[#AAB7C7] cursor-pointer text-xs select-none">
                <input
                  type="checkbox"
                  checked={openInNewTabMode}
                  onChange={(e) => setOpenInNewTabMode(e.target.checked)}
                  className="rounded border-[#223247] bg-[#07111F] text-[#00AEEF] focus:ring-0 focus:outline-none"
                />
                <span>Open results in New Tab</span>
              </label>
            )}
          </div>
        </form>

        {/* Phase 2: Collapsible Pinpoint Search Accordion Toggle */}
        <div className="border-t border-[#223247] pt-4">
          <button
            type="button"
            onClick={() => setPinpointOpen(!pinpointOpen)}
            className="w-full flex items-center justify-between text-xs font-semibold text-[#AAB7C7] hover:text-[#00AEEF] py-1 transition"
          >
            <div className="flex items-center gap-2">
              <span>Pinpoint search with advanced filters (Optional)</span>
              <span className="text-[10px] text-[#6F7C8D] uppercase tracking-wider font-normal">
                [Dust threshold, Date windows, Chain override]
              </span>
            </div>
            {pinpointOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-[#6F7C8D]" />}
          </button>

          {/* Smooth Collapsible Options Card */}
          {pinpointOpen && (
            <div className="mt-4 p-5 bg-[#07111F] border border-[#223247] rounded-xl space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Date Range Filters */}
                <div className="space-y-2">
                  <label className="text-[#AAB7C7] font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#6F7C8D]" />
                    <span>Investigation Date Window</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => onStartDateChange?.(e.target.value)}
                      className="w-full bg-[#0E1B2D] border border-[#223247] rounded-lg px-2.5 py-1.5 text-[#F5F7FA] text-xs outline-none focus:border-[#00AEEF]"
                    />
                    <span className="text-[#6F7C8D]">→</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => onEndDateChange?.(e.target.value)}
                      className="w-full bg-[#0E1B2D] border border-[#223247] rounded-lg px-2.5 py-1.5 text-[#F5F7FA] text-xs outline-none focus:border-[#00AEEF]"
                    />
                  </div>
                </div>

                {/* 2. Amount Threshold & Sorting */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[#AAB7C7] font-medium flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#6F7C8D]" />
                      <span>Min Transfer Dust Threshold</span>
                    </label>
                    <span className="font-mono text-[#00AEEF] font-bold">
                      ${Number(minAmount).toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="50"
                    value={minAmount}
                    onChange={(e) => onMinAmountChange?.(Number(e.target.value))}
                    className="w-full accent-[#00AEEF] cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-[#6F7C8D] font-mono">
                    <span>$0 (All Tx)</span>
                    <span>$5,000</span>
                    <span>$10,000+ (High Value)</span>
                  </div>
                </div>

                {/* 3. Chain Override & Sort Order */}
                <div className="space-y-2">
                  <label className="text-[#AAB7C7] font-medium flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-[#6F7C8D]" />
                    <span>Network & Edge Sorting</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={chainOverride}
                      onChange={(e) => onChainOverrideChange?.(e.target.value)}
                      className="w-full bg-[#0E1B2D] border border-[#223247] rounded-lg px-2.5 py-1.5 text-[#F5F7FA] text-xs outline-none focus:border-[#00AEEF] cursor-pointer"
                    >
                      <option value="auto">Auto-Detect Network</option>
                      <option value="TRON">TRON (TRC-20)</option>
                      <option value="EVM">Ethereum / EVM</option>
                      <option value="BTC">Bitcoin (UTXO)</option>
                    </select>

                    <select
                      value={sortOrder}
                      onChange={(e) => onSortOrderChange?.(e.target.value)}
                      className="w-full bg-[#0E1B2D] border border-[#223247] rounded-lg px-2.5 py-1.5 text-[#F5F7FA] text-xs outline-none focus:border-[#00AEEF] cursor-pointer"
                    >
                      <option value="highest">Highest Amount First</option>
                      <option value="chronological">Chronological</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

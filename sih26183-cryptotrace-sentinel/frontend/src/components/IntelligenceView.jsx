import React, { useState } from "react";
import {
  Search, Plus, ArrowLeft, ChevronDown, ChevronUp, Copy, Check,
  X, Building, Mail, Shield, Clock, Globe, Wallet, AlertCircle
} from "lucide-react";

const INITIAL_EXCHANGES = [
  {
    id: "binance",
    name: "Binance",
    status: "Verified",
    clusters: 24,
    lastVerified: "2026-09-08 22:40 UTC",
    nodalEmail: "case@binance.com",
    sweepRule: "SWEEP_90PCT_24HR (≥95% confidence)",
    hotWallets: [
      { address: "0x28c6c06298d514db089934071355e5743bf21d60", chain: "EVM", label: "Binance Hot 14" },
      { address: "0xdfd5293d8e347dff59e933c1f7315a7b71483793", chain: "EVM", label: "Binance 16" },
      { address: "TMuA6YqfCeX8EhbfYEg5y7S4D1Dc2MSh8z", chain: "TRON", label: "Binance TRC20 Hot" },
    ],
    description:
      "Global VDA exchange. Sweep heuristics monitor automated consolidation scripts forwarding customer deposits into omnibus cold/hot wallets within 120 minutes.",
  },
  {
    id: "coindcx",
    name: "CoinDCX",
    status: "FIU-IND Registered",
    clusters: 12,
    lastVerified: "2026-09-09 01:15 UTC",
    nodalEmail: "compliance@coindcx.com",
    sweepRule: "STATIC_SEED & SWEEP_80PCT",
    hotWallets: [
      { address: "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX", chain: "TRON", label: "CoinDCX Hot Reserve 01" },
      { address: "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX", chain: "TRON", label: "CoinDCX Verified Deposit" },
      { address: "0xCoinDCXHotWallet000000000000000000001", chain: "EVM", label: "CoinDCX EVM Hot 01" },
    ],
    description:
      "Indian FIU-registered VASP. Primary off-ramp destination observed in domestic Telegram task scams and fake investment schemes.",
  },
  {
    id: "wazirx",
    name: "WazirX",
    status: "FIU-IND Registered",
    clusters: 8,
    lastVerified: "2026-09-07 18:30 UTC",
    nodalEmail: "nodal@wazirx.com",
    sweepRule: "STATIC_SEED_CLUSTER",
    hotWallets: [
      { address: "TWazirXHotWallet01XXXXXXXXXXXXXXXXXX", chain: "TRON", label: "WazirX TRC20 Hot" },
      { address: "0xWazirXHotWallet0000000000000000000001", chain: "EVM", label: "WazirX ERC20 Hot" },
    ],
    description:
      "Domestic crypto exchange providing fiat P2P and direct INR settlement for Indian residents.",
  },
  {
    id: "zebpay",
    name: "ZebPay",
    status: "FIU-IND Registered",
    clusters: 6,
    lastVerified: "2026-09-06 14:10 UTC",
    nodalEmail: "compliance@zebpay.com",
    sweepRule: "STATIC_SEED_CLUSTER",
    hotWallets: [
      { address: "TZebPayHotWallet01XXXXXXXXXXXXXXXXXXX", chain: "TRON", label: "ZebPay TRON Hot" },
      { address: "0xZebPayHotWallet00000000000000000000001", chain: "EVM", label: "ZebPay EVM Hot" },
    ],
    description:
      "Established Indian virtual digital asset platform with direct nodal compliance channel.",
  },
];

export default function IntelligenceView({
  onInvestigateAddress,
}) {
  const [exchanges, setExchanges] = useState(INITIAL_EXCHANGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedExchange, setExpandedExchange] = useState("coindcx");
  const [copiedAddr, setCopiedAddr] = useState(null);

  // Modal State for + Add Exchange
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    jurisdiction: "India",
    fiuId: "",
    sla: "2 Hours (Mandatory)",
    nodalEmail: "",
    hotWallet: "",
  });

  const handleOpenModal = () => {
    setFormError("");
    setFormData({
      name: "",
      jurisdiction: "India",
      fiuId: "",
      sla: "2 Hours (Mandatory)",
      nodalEmail: "",
      hotWallet: "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Exchange name is required.");
      return;
    }
    if (!formData.nodalEmail.trim() || !formData.nodalEmail.includes("@")) {
      setFormError("Please enter a valid Legal Nodal Officer Email address.");
      return;
    }
    if (!formData.hotWallet.trim()) {
      setFormError("Master Hot Wallet Address is required.");
      return;
    }

    const trimmedWallet = formData.hotWallet.trim();
    const chainType = trimmedWallet.startsWith("T")
      ? "TRON"
      : trimmedWallet.startsWith("0x")
      ? "EVM"
      : "BTC";

    const newId = formData.name.toLowerCase().replace(/[^a-z0-9]/g, "") + "_" + Date.now().toString().slice(-4);
    const statusLabel = formData.jurisdiction === "India"
      ? (formData.fiuId.trim() ? `FIU-IND Registered (${formData.fiuId.trim()})` : "FIU-IND Registered")
      : "International VASP";

    const newExchangeItem = {
      id: newId,
      name: formData.name.trim(),
      status: statusLabel,
      clusters: 1,
      lastVerified: "2026-09-11 Just Now",
      nodalEmail: formData.nodalEmail.trim(),
      sweepRule: "STATIC_SEED & SWEEP_80PCT",
      hotWallets: [
        {
          address: trimmedWallet,
          chain: chainType,
          label: `${formData.name.trim()} Master Hot Reserve`,
        },
      ],
      description: `${
        formData.jurisdiction === "India" ? "Domestic Indian VASP" : "International Virtual Digital Asset Exchange"
      } registered under Section 94 BNSS statutory nodal liaison protocol. SLA response time: ${formData.sla}. FIU Registration: ${
        formData.fiuId.trim() || "Pending Formal Allocation"
      }.`,
    };

    setExchanges((prev) => [newExchangeItem, ...prev]);
    setExpandedExchange(newId);
    handleCloseModal();
  };

  const handleCopy = (addr) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddr(addr);
    setTimeout(() => setCopiedAddr(null), 1800);
  };

  const filteredExchanges = exchanges.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.nodalEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.hotWallets.some((w) => w.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full min-h-[calc(100vh-56px)] mt-14 bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. Contextual Toolbar */}
      <div className="w-full px-4 pt-4 pb-2 shrink-0 flex justify-center z-20">
        <div className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl px-3 py-1.5 shadow-lg shadow-black/20 flex items-center gap-2">
          {/* Back */}
          <button
            onClick={() => window.history?.back ? window.history.back() : null}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 shrink-0" />

          {/* Search Exchange / Cluster Field */}
          <div className="relative flex-1 flex items-center min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exchange name, cluster, or nodal compliance email..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-8 pr-14 py-1.5 text-xs text-slate-100 font-mono placeholder-slate-500 outline-none transition"
            />
            <kbd className="hidden sm:inline-block absolute right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              Ctrl+K
            </kbd>
          </div>

          <div className="h-4 w-px bg-slate-800 shrink-0" />

          {/* Add Exchange Action */}
          <button
            onClick={handleOpenModal}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Exchange</span>
          </button>
        </div>
      </div>

      {/* 2. Calm, Open Canvas Exchange List */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="divide-y divide-slate-800 border-y border-slate-800">
          {filteredExchanges.map((ex) => {
            const isExpanded = expandedExchange === ex.id;
            return (
              <div key={ex.id} className="py-4 transition">
                <div
                  onClick={() => setExpandedExchange(isExpanded ? null : ex.id)}
                  className="px-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/60 py-2.5 rounded-xl transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-100">
                      {ex.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {ex.status}
                    </span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {ex.nodalEmail}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="hidden sm:inline font-mono">{ex.clusters} {ex.clusters === 1 ? "cluster" : "clusters"}</span>
                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pt-3 pb-2 text-xs space-y-3 animate-in fade-in duration-150">
                    <p className="text-slate-400 leading-relaxed max-w-2xl">
                      {ex.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-mono">
                      <span>Attribution: <strong className="text-cyan-400">{ex.sweepRule}</strong></span>
                      <span>·</span>
                      <span>Verified: {ex.lastVerified}</span>
                      {ex.sla && (
                        <>
                          <span>·</span>
                          <span>SLA: <strong className="text-amber-400">{ex.sla}</strong></span>
                        </>
                      )}
                    </div>

                    {/* Infrastructure Hot Wallets */}
                    <div className="pt-2 space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                        Omnibus Deposit & Hot Reserve Wallets
                      </span>
                      {ex.hotWallets.map((w) => (
                        <div
                          key={w.address}
                          className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 font-mono text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
                              {w.chain}
                            </span>
                            <span className="text-slate-200 truncate">{w.address}</span>
                            <span className="text-[10px] text-slate-500 hidden md:inline">({w.label})</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleCopy(w.address)}
                              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                              title="Copy Address"
                            >
                              {copiedAddr === w.address ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => onInvestigateAddress?.(w.address)}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer transition font-medium"
                            >
                              Trace
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive + Add Exchange Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl relative select-text">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Register New Exchange / VASP
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Add VASP intelligence entity to Section 94 BNSS compliance registry
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Error Banner */}
            {formError && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Field 1: Exchange Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Exchange Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. CoinSwitch Kuber, OKX, Bybit"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl font-mono text-xs text-slate-100 outline-none transition"
                />
              </div>

              {/* Field 2 & 3: Jurisdiction & FIU-IND Registration ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Jurisdiction
                  </label>
                  <select
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl font-mono text-xs text-slate-100 outline-none transition cursor-pointer"
                  >
                    <option value="India">India</option>
                    <option value="International">International</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    FIU-IND Registration ID
                  </label>
                  <input
                    type="text"
                    value={formData.fiuId}
                    onChange={(e) => setFormData({ ...formData, fiuId: e.target.value })}
                    placeholder="e.g. FIU-IND-2024-VASP-089"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl font-mono text-xs text-slate-100 outline-none transition"
                  />
                </div>
              </div>

              {/* Field 4: SLA Response Time */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  SLA Response Time
                </label>
                <select
                  value={formData.sla}
                  onChange={(e) => setFormData({ ...formData, sla: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl font-mono text-xs text-slate-100 outline-none transition cursor-pointer"
                >
                  <option value="2 Hours (Mandatory)">2 Hours (Mandatory)</option>
                  <option value="4 Hours">4 Hours</option>
                  <option value="24 Hours">24 Hours</option>
                </select>
              </div>

              {/* Field 5: Legal Nodal Officer Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Legal Nodal Officer Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.nodalEmail}
                  onChange={(e) => setFormData({ ...formData, nodalEmail: e.target.value })}
                  placeholder="e.g. compliance@exchange.com or nodal@exchange.in"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl font-mono text-xs text-slate-100 outline-none transition"
                />
              </div>

              {/* Field 6: Master Hot Wallet Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Master Hot Wallet Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.hotWallet}
                  onChange={(e) => setFormData({ ...formData, hotWallet: e.target.value })}
                  placeholder="e.g. 0x... (EVM) or T... (TRON)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl font-mono text-xs text-slate-100 outline-none transition"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Register Exchange
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

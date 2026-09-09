import React, { useState } from "react";
import {
  Search, Plus, ArrowLeft, ChevronDown, ChevronUp, Copy, Check
} from "lucide-react";

export default function IntelligenceView({
  onInvestigateAddress,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedExchange, setExpandedExchange] = useState("coindcx");
  const [copiedAddr, setCopiedAddr] = useState(null);

  const exchanges = [
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
    <div className="w-full min-h-[calc(100vh-56px)] mt-14 bg-[#07111F] text-[#F5F7FA] flex flex-col">
      {/* 1. Contextual Toolbar (Section 13: [ ← ] │ [ + ] │ [ Search exchange / cluster ] │ [ Add Exchange ]) */}
      <div className="w-full px-4 pt-4 pb-2 shrink-0 flex justify-center z-20">
        <div className="w-full max-w-4xl bg-[#091525]/90 backdrop-blur-md border border-[#223247] rounded-2xl px-3 py-1.5 shadow-lg shadow-black/20 flex items-center gap-2">
          {/* Back */}
          <button
            onClick={() => window.history?.back ? window.history.back() : null}
            className="p-1.5 hover:bg-[#122238] text-[#AAB7C7] hover:text-[#F5F7FA] rounded-lg transition cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#223247] shrink-0" />

          {/* Search Exchange / Cluster Field */}
          <div className="relative flex-1 flex items-center min-w-0">
            <Search className="w-3.5 h-3.5 text-[#6F7C8D] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exchange name, cluster, or nodal compliance email..."
              className="w-full bg-[#07111F] border border-[#223247] focus:border-[#00AEEF] rounded-xl pl-8 pr-14 py-1.5 text-xs text-[#F5F7FA] font-mono placeholder-[#6F7C8D] outline-none transition"
            />
            <kbd className="hidden sm:inline-block absolute right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#091525] border border-[#223247] text-[#6F7C8D]">
              Ctrl+K
            </kbd>
          </div>

          <div className="h-4 w-px bg-[#223247] shrink-0" />

          {/* Add Exchange Action */}
          <button
            onClick={() => alert("Cluster ingestion dialog: Connect API / RPC feed.")}
            className="px-3 py-1.5 rounded-lg bg-[#00AEEF] hover:bg-[#19B5FE] text-[#07111F] font-semibold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Exchange</span>
          </button>
        </div>
      </div>

      {/* 2. Calm, Open Canvas Exchange List */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="divide-y divide-[#223247] border-y border-[#223247]">
          {filteredExchanges.map((ex) => {
            const isExpanded = expandedExchange === ex.id;
            return (
              <div key={ex.id} className="py-4 transition">
                <div
                  onClick={() => setExpandedExchange(isExpanded ? null : ex.id)}
                  className="px-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#0E1B2D]/40 py-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#F5F7FA]">
                      {ex.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#00AEEF]">
                      {ex.status}
                    </span>
                    <span className="text-[10px] text-[#6F7C8D]">·</span>
                    <span className="text-xs text-[#AAB7C7] font-mono">
                      {ex.nodalEmail}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#6F7C8D]">
                    <span className="hidden sm:inline font-mono">{ex.clusters} clusters</span>
                    <div className="p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pt-3 pb-2 text-xs space-y-3 animate-in fade-in duration-150">
                    <p className="text-[#AAB7C7] leading-relaxed max-w-2xl">
                      {ex.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-[#6F7C8D] font-mono">
                      <span>Attribution: <strong className="text-[#00AEEF]">{ex.sweepRule}</strong></span>
                      <span>·</span>
                      <span>Verified: {ex.lastVerified}</span>
                    </div>

                    {/* Infrastructure Hot Wallets */}
                    <div className="pt-2 space-y-1.5">
                      <span className="text-[10px] font-mono text-[#6F7C8D] uppercase tracking-wider block">
                        Omnibus Deposit & Hot Reserve Wallets
                      </span>
                      {ex.hotWallets.map((w) => (
                        <div
                          key={w.address}
                          className="py-1.5 px-2 rounded bg-[#0E1B2D] border border-[#223247] flex items-center justify-between gap-3 font-mono text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-[10px] text-[#00AEEF]">{w.chain}</span>
                            <span className="text-[#F5F7FA] truncate">{w.address}</span>
                            <span className="text-[10px] text-[#6F7C8D] hidden md:inline">({w.label})</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleCopy(w.address)}
                              className="p-1 text-[#6F7C8D] hover:text-[#F5F7FA] rounded cursor-pointer"
                              title="Copy Address"
                            >
                              {copiedAddr === w.address ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => onInvestigateAddress?.(w.address)}
                              className="px-2 py-0.5 rounded bg-[#07111F] hover:bg-[#122238] border border-[#223247] text-[10px] text-[#00AEEF] cursor-pointer transition"
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
    </div>
  );
}

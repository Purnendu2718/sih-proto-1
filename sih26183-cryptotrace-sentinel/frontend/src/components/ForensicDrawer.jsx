import React, { useState, useMemo } from "react";
import {
  X, Copy, Check, ExternalLink, ChevronDown, ChevronUp,
  Shield, HelpCircle, ArrowRight, ArrowDownLeft, ArrowUpRight
} from "lucide-react";

export default function ForensicDrawer({
  isOpen = false,
  selectedElement = null,
  transactions = [],
  onClose,
  onExpandNode,
  onOpenEvidence,
  onOpenExplain,
}) {
  const [copied, setCopied] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const isNode = selectedElement?.kind === "node";
  const itemData = selectedElement?.data || {};
  const address = isNode ? itemData.id || itemData.address || "" : itemData.tx_hash || "";

  // Chain detection helper
  const chain = useMemo(() => {
    if (address?.startsWith("T") && address.length === 34) return "TRON";
    if (address?.startsWith("0x")) return "EVM";
    if (address?.startsWith("1") || address?.startsWith("3") || address?.startsWith("bc1")) return "BTC";
    return "EVM";
  }, [address]);

  const explorerUrl = useMemo(() => {
    if (!address) return "#";
    if (chain === "TRON") return `https://tronscan.org/#/${isNode ? "address" : "transaction"}/${address}`;
    if (chain === "BTC") return `https://mempool.space/${isNode ? "address" : "tx"}/${address}`;
    return `https://etherscan.io/${isNode ? "address" : "tx"}/${address}`;
  }, [address, chain, isNode]);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Metrics
  const { totalIn, totalOut, netAmount, txCount } = useMemo(() => {
    let tIn = 0;
    let tOut = 0;
    transactions.forEach((tx) => {
      const amt = Number(tx.amount || 0);
      if (tx.source === address) tOut += amt;
      if (tx.target === address) tIn += amt;
    });
    return {
      totalIn: tIn,
      totalOut: tOut,
      netAmount: Math.max(tIn, tOut),
      txCount: transactions.length || itemData.tx_count || 1,
    };
  }, [transactions, address, itemData]);

  const confidence = itemData.label_confidence !== undefined ? Math.round(itemData.label_confidence * 100) : 94;
  const roleLabel = itemData.label || (itemData.role ? itemData.role.replace(/_/g, " ") : "Investigated Address");

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[380px] max-w-[92vw] bg-[#091525] border-l border-[#223247] shadow-2xl z-50 flex flex-col transition-transform duration-200 ${
        isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
      }`}
    >
      {/* 1. Quiet Header */}
      <div className="px-6 py-5 border-b border-[#223247] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#6F7C8D] uppercase tracking-wider">
          {isNode ? "Wallet" : "Transaction"}
        </span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#122238] text-[#6F7C8D] hover:text-[#F5F7FA] rounded-md transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Main Human-Designed Inspector Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs text-[#F5F7FA]">
        {/* Entity Address & Quick Actions */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm font-semibold text-[#F5F7FA] break-all select-all">
              {address ? `${address.slice(0, 10)}…${address.slice(-8)}` : "Unknown Target"}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-[#122238] text-[#6F7C8D] hover:text-[#F5F7FA] rounded cursor-pointer"
                title="Copy full address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-[#122238] text-[#6F7C8D] hover:text-[#00AEEF] rounded"
                title="Inspect on explorer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="mt-2 text-xs text-[#AAB7C7]">
            <span className="font-medium text-[#F5F7FA] capitalize">{roleLabel}</span>
            <span className="mx-1.5 text-[#6F7C8D]">·</span>
            <span className="text-[#00AEEF]">{confidence}% confidence</span>
          </div>
        </div>

        {/* Thin Divider */}
        <div className="h-px bg-[#223247]" />

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] font-mono text-[#6F7C8D] uppercase tracking-wider mb-1">
              Value
            </div>
            <div className="text-sm font-bold font-mono text-[#F5F7FA]">
              {netAmount > 0 ? `$${netAmount.toLocaleString()}` : "₹4.8L (5,000 USDT)"}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-[#6F7C8D] uppercase tracking-wider mb-1">
              Transactions
            </div>
            <div className="text-sm font-bold font-mono text-[#F5F7FA]">
              {txCount}
            </div>
          </div>
        </div>

        {/* Thin Divider */}
        <div className="h-px bg-[#223247]" />

        {/* Why This Matters */}
        <div>
          <div className="text-[10px] font-mono text-[#6F7C8D] uppercase tracking-wider mb-1.5">
            Why This Matters
          </div>
          <p className="text-xs text-[#AAB7C7] leading-relaxed">
            {itemData.role === "exchange_deposit" || itemData.role === "exchange_hotwallet"
              ? "Potential exchange deposit based on observed automated sweep behavior into omnibus cluster."
              : itemData.role === "mule"
              ? "High-velocity conduit node used in rapid structuring to obscure asset origin."
              : itemData.role === "victim"
              ? "Originating victim complainant wallet documented under Section 2 Case Intake."
              : "Intermediate peeling address maintaining high volume preservation toward exit gateway."}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2 pt-1">
          {onOpenEvidence && (
            <button
              onClick={onOpenEvidence}
              className="w-full py-2 px-3 bg-[#0E1B2D] hover:bg-[#162A40] border border-[#223247] text-[#F5F7FA] rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Evidence</span>
            </button>
          )}

          {isNode && onExpandNode && (
            <button
              onClick={() => onExpandNode(address)}
              className="w-full py-2 px-3 bg-[#00AEEF]/10 hover:bg-[#00AEEF]/20 border border-[#00AEEF]/30 text-[#00AEEF] rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>+ Expand Counterparties on Canvas</span>
            </button>
          )}
        </div>

        {/* Progressive Disclosure Section */}
        <div className="pt-2 border-t border-[#223247]">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="w-full flex items-center justify-between text-[11px] text-[#AAB7C7] hover:text-[#F5F7FA] py-1 transition cursor-pointer"
          >
            <span>Forensic Heuristics & Ledger Details</span>
            {detailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {detailsOpen && (
            <div className="mt-3 space-y-3 pt-2 text-xs animate-in fade-in duration-150">
              {/* Volume In/Out */}
              <div className="p-3 bg-[#07111F] rounded-xl border border-[#223247] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#6F7C8D]">Total Inflow:</span>
                  <span className="font-mono text-[#22C55E] font-medium">${totalIn.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#6F7C8D]">Total Outflow:</span>
                  <span className="font-mono text-[#FF8A00] font-medium">${totalOut.toLocaleString()}</span>
                </div>
              </div>

              {/* Transactions Mini-Ledger */}
              {transactions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-[#6F7C8D] uppercase">
                    Associated Transfers ({transactions.length})
                  </span>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
                    {transactions.slice(0, 10).map((tx, idx) => (
                      <div
                        key={tx.tx_hash || idx}
                        className="p-2 rounded-lg bg-[#07111F] border border-[#223247] flex items-center justify-between"
                      >
                        <span className="text-[#AAB7C7] truncate max-w-[150px]">
                          {tx.tx_hash ? `${tx.tx_hash.slice(0, 8)}…` : "Transfer"}
                        </span>
                        <span className="text-[#F5F7FA] font-medium">
                          ${Number(tx.amount || 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

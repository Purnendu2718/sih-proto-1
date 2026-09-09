import React, { useState } from "react";
import { X, Copy, Check, ExternalLink, ShieldAlert, Clock, ArrowUpRight, Award } from "lucide-react";

export default function InspectorDrawer({ selection, onClose, onOpenNoticeModal }) {
  const [copied, setCopied] = useState(false);

  if (!selection) return null;

  const isNode = selection.kind === "node";
  const d = selection.data;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <span className="font-semibold text-sm tracking-wide uppercase text-slate-100">
            {isNode ? "Wallet Entity Intelligence" : "Transaction Hop Forensics"}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs">
        {isNode ? (
          <>
            {/* Role & Risk Score */}
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Classified Role</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                  {d.role_tag}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Risk Score</span>
                <span className={`text-sm font-black ${d.risk_score > 80 ? "text-rose-400" : d.risk_score > 50 ? "text-amber-400" : "text-emerald-400"}`}>
                  {d.risk_score} / 100
                </span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${d.risk_score > 80 ? "bg-rose-500" : d.risk_score > 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${d.risk_score}%` }}
                />
              </div>
            </div>

            {/* Address & Copy */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                On-Chain Address
              </label>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-cyan-300 break-all">
                <span>{d.full_address || d.id}</span>
                <button
                  onClick={() => handleCopy(d.full_address || d.id)}
                  className="ml-2 p-1 text-slate-400 hover:text-cyan-300"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* VASP Status */}
            {(d.type === "exchange_deposit" || d.type === "exchange_hotwallet") && (
              <div className="p-4 rounded-lg bg-cyan-950/40 border border-cyan-600/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span>Attributed VASP Target</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-900/80 text-cyan-200 border border-cyan-700">
                    96% Confidence
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed space-y-1">
                  <div className="font-semibold text-slate-200">Attribution Method:</div>
                  <div className="text-slate-400">Deterministic cluster seed + automated sweep signature detection (batched hot-wallet sweep heuristic).</div>
                </div>
                <button
                  onClick={onOpenNoticeModal}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded shadow-lg shadow-rose-900/30 transition flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Draft Sec 94 BNSS Requisition</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Transaction Hop Detail */}
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Transferred Value</span>
                <span className="text-sm font-bold text-cyan-300 font-mono">
                  {d.token} ${d.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Velocity Elapsed</span>
                <span className="flex items-center gap-1 text-amber-300 font-mono font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>+{d.velocity_mins} mins from victim</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Conduit Status</span>
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${d.is_primary ? "bg-cyan-950 text-cyan-300 border border-cyan-800" : "bg-slate-800 text-slate-400"}`}>
                  {d.is_primary ? "PRIMARY CONDUIT" : "DECOY PEEL CHAIN"}
                </span>
              </div>
            </div>

            {/* TxHash */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                Transaction Hash
              </label>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-cyan-300 break-all">
                <span>{d.tx_hash}</span>
                <button
                  onClick={() => handleCopy(d.tx_hash)}
                  className="ml-2 p-1 text-slate-400 hover:text-cyan-300"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

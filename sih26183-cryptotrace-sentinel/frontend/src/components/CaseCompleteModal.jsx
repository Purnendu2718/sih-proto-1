import React, { useState } from "react";
import {
  CheckCircle2, ShieldCheck, FileText, ArrowRight,
  Download, ExternalLink, Hash, Clock, AlertTriangle, X
} from "lucide-react";

export default function CaseCompleteModal({
  isOpen,
  onClose,
  caseSummary = null,
  onViewCase,
  onVerifyEvidence,
  onExportDossier,
  onExportRequisition,
}) {
  if (!isOpen) return null;

  const data = caseSummary || {
    caseId: "NCRP-2026-480912",
    firNumber: "FIR/CYBER/2026/0480",
    fraudAmount: "₹4,80,000",
    fraudAmountUsd: "$5,750 USDT",
    startingWallet: "0xVICTIM_480K_FRAUD_7b93a2c4e1",
    offRamp: "Probable CoinDCX Deposit Infrastructure",
    terminalHotWallet: "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021",
    hops: 4,
    attributionConfidence: "94%",
    evidenceArtifacts: 27,
    integrityStatus: "VERIFIED",
    forensicDossier: "READY",
    requisitionDraft: "READY FOR LEGAL REVIEW",
    merkleRoot: "771c97e7e61c99aeab28d93bd589164540fa9a4a92438f2c55f2c998c8e9db88",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B0F17] border border-emerald-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 p-6 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wider">
                  GOLDEN HOUR DIRECTIVE COMPLETE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Sec. 94 BNSS / Sec. 63 BSA</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                CASE COMPLETE — OFF-RAMP ATTRIBUTED
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Case / FIR Identifier</span>
              <span className="text-base font-bold text-slate-100 font-mono">{data.caseId}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{data.firNumber}</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Total Fraud Amount Traced</span>
              <span className="text-base font-bold text-emerald-400">{data.fraudAmount}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Equivalent ~ {data.fraudAmountUsd}</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl col-span-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Complainant / Starting Wallet</span>
              <span className="text-xs font-mono text-cyan-300 break-all select-all">{data.startingWallet}</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Identified Off-Ramp</span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-purple-950/80 text-purple-300 border border-purple-500/40 rounded font-semibold">
                  Attribution Confidence: {data.attributionConfidence}
                </span>
              </div>
              <span className="text-sm font-bold text-purple-300 block mt-1">{data.offRamp}</span>
              <span className="text-[11px] text-slate-400 font-mono block mt-0.5 truncate">
                Downstream Sweep Terminal: {data.terminalHotWallet}
              </span>
            </div>
          </div>

          {/* Forensic Badges */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-mono uppercase">Path Hops</span>
              <span className="font-bold text-amber-400 text-sm">{data.hops} Hops</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-mono uppercase">Evidence</span>
              <span className="font-bold text-slate-200 text-sm">{data.evidenceArtifacts} Artifacts</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-mono uppercase">Integrity</span>
              <span className="font-bold text-emerald-400 text-sm flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 inline" /> {data.integrityStatus}
              </span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-mono uppercase">Requisition</span>
              <span className="font-bold text-blue-400 text-xs">READY</span>
            </div>
          </div>

          {/* Cryptographic Merkle Seal */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
              <span className="flex items-center gap-1.5 font-semibold">
                <Hash className="w-3.5 h-3.5 text-emerald-400" />
                Section 63 BSA Cryptographic Merkle Root
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                Tamper-Proof
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 break-all mt-1 bg-slate-950/60 p-1.5 rounded select-all">
              {data.merkleRoot}
            </div>
          </div>
        </div>

        {/* Action Buttons (Section 21 Spec: VIEW CASE, VERIFY EVIDENCE, EXPORT DOSSIER, EXPORT REQUISITION) */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onViewCase?.();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <span>VIEW CASE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              onClose();
              onVerifyEvidence?.();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 text-xs font-semibold rounded-lg border border-emerald-500/30 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VERIFY EVIDENCE</span>
          </button>

          <button
            onClick={() => {
              onExportDossier?.();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-blue-200 text-xs font-semibold rounded-lg border border-blue-500/30 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT DOSSIER</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onExportRequisition?.();
            }}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-900/40 transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>EXPORT REQUISITION</span>
          </button>
        </div>
      </div>
    </div>
  );
}

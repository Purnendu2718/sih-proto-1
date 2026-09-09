import React from "react";
import { X, Shield, Award, Check, AlertCircle } from "lucide-react";

export default function CompetitiveModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const comparison = [
    {
      capability: "Pre-labelled addresses",
      legacy: "Yes (Static ~1B directory)",
      proposed: "Supplemented by dynamic persistent detection",
      highlight: true,
    },
    {
      capability: "Zero-day exchange deposit detection",
      legacy: "Limited (Stays 'Unknown' until human tags)",
      proposed: "Sweep heuristics (Locally persisted & cross-case propagated)",
      highlight: true,
    },
    {
      capability: "Automated off-ramp pathfinding",
      legacy: "AutoTrace / Smart Expand",
      proposed: "One-click bounded BFS with measured latency",
      highlight: false,
    },
    {
      capability: "Indian cyber-fraud workflows",
      legacy: "Generic global SaaS",
      proposed: "Purpose-built (NCRP, Section 94 BNSS, INR valuation)",
      highlight: true,
    },
    {
      capability: "Explainable clustering",
      legacy: "Variable / Proprietary black box",
      proposed: "Explicit confidence + evidence rule breakdown",
      highlight: true,
    },
    {
      capability: "Raw evidence preservation",
      legacy: "Limited to transaction hash lists",
      proposed: "Built-in (Deterministic RFC 8785 JSON)",
      highlight: true,
    },
    {
      capability: "Cryptographic evidence manifest",
      legacy: "Limited / Not statutory sealed",
      proposed: "SHA-256 Merkle Ledger (Section 63 BSA compliant)",
      highlight: true,
    },
    {
      capability: "Investigation audit trail",
      legacy: "Vendor server logs",
      proposed: "Built-in immutable SQLite audit trail",
      highlight: false,
    },
    {
      capability: "Legal document generation",
      legacy: "Third-party manual export",
      proposed: "Integrated Section 94 BNSS ReportLab PDF & draft",
      highlight: true,
    },
    {
      capability: "Sovereign deployment",
      legacy: "Foreign SaaS (US/EU cloud mandatory)",
      proposed: "Self-hostable inside Police Intranet / On-Prem",
      highlight: true,
    },
    {
      capability: "Air-gapped deployment",
      legacy: "Unsupported",
      proposed: "Supported (AIR_GAPPED_MODE=true zero mandatory egress)",
      highlight: true,
    },
    {
      capability: "Open-source architecture",
      legacy: "No (Proprietary closed platform)",
      proposed: "Yes (Self-hostable, verifiable codebase)",
      highlight: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B0F17] border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                COMPETITIVE BENCHMARK & ARCHITECTURAL COMPARISON
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                CryptoTrace-Sentinel vs. Legacy Commercial Blockchain Analytics Platforms (Breadcrumbs / SaaS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="px-5 py-2.5 bg-amber-950/40 border-b border-amber-500/30 flex items-center gap-2 text-xs text-amber-300 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Prototype positioning — requires independent product verification before external publication.
          </span>
        </div>

        {/* Table Container */}
        <div className="p-5 overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-3">Forensic Capability</th>
                <th className="py-3 px-3">Legacy Analytics Platform</th>
                <th className="py-3 px-3 text-emerald-400">CryptoTrace-Sentinel (Proposed)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {comparison.map((row, idx) => (
                <tr key={idx} className={row.highlight ? "bg-slate-900/40 hover:bg-slate-900/70" : "hover:bg-slate-900/30"}>
                  <td className="py-3 px-3 font-semibold text-slate-200">
                    {row.capability}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {row.legacy}
                  </td>
                  <td className="py-3 px-3 text-emerald-300 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {row.proposed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Target Deployment: Ministry of Home Affairs / I4C / State Police Cyber Cells</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
}

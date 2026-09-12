import React from "react";
import { CheckCircle2, UserCheck, GitBranch, ShieldCheck } from "lucide-react";

/**
 * ProvenanceBadge: High-visibility badge for entity attribution provenance.
 * Enum values:
 *  - 'offchain_verified' (Emerald)
 *  - 'analyst_reviewed' (Sky/Blue)
 *  - 'automated_clustering' (Amber)
 */
export default function ProvenanceBadge({ provenance = "automated_clustering", size = "sm", showIcon = true, className = "" }) {
  const norm = (provenance || "automated_clustering").toLowerCase().trim();

  if (norm === "offchain_verified") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono font-semibold tracking-wide shadow-sm select-none ${
          size === "xs" ? "text-[9px] py-0 px-1.5" : size === "md" ? "text-xs px-2.5 py-1" : "text-[10px]"
        } ${className}`}
        title="Attribution Provenance: Off-chain verified via regulatory compliance filings, exchange confirmation, or official registry"
      >
        {showIcon && <ShieldCheck className={size === "xs" ? "w-2.5 h-2.5 text-emerald-400" : "w-3 h-3 text-emerald-400"} />}
        <span>offchain_verified</span>
      </span>
    );
  }

  if (norm === "analyst_reviewed") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/50 text-sky-300 font-mono font-semibold tracking-wide shadow-sm select-none ${
          size === "xs" ? "text-[9px] py-0 px-1.5" : size === "md" ? "text-xs px-2.5 py-1" : "text-[10px]"
        } ${className}`}
        title="Attribution Provenance: Independently audited, tagged, and verified by an investigating officer"
      >
        {showIcon && <UserCheck className={size === "xs" ? "w-2.5 h-2.5 text-sky-400" : "w-3 h-3 text-sky-400"} />}
        <span>analyst_reviewed</span>
      </span>
    );
  }

  // default: automated_clustering
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono font-semibold tracking-wide shadow-sm select-none ${
        size === "xs" ? "text-[9px] py-0 px-1.5" : size === "md" ? "text-xs px-2.5 py-1" : "text-[10px]"
      } ${className}`}
      title="Attribution Provenance: Derived from automated multi-wallet flow & heuristic clustering"
    >
      {showIcon && <GitBranch className={size === "xs" ? "w-2.5 h-2.5 text-amber-400" : "w-3 h-3 text-amber-400"} />}
      <span>automated_clustering</span>
    </span>
  );
}

import React from "react";
import { Building2, Activity, ShieldAlert } from "lucide-react";

/**
 * RiskModeBadge: High-visibility badge for Dual-Mode Risk Engine.
 * Explicitly distinguishes:
 *  - 'static_entity' (Violet): Known/attributed entities (exchanges, mixers, darknet markets)
 *  - 'dynamic_behavioral' (Cyan): Unattributed wallets dynamically scored from behavioral signals
 *
 * Statutory Guarantee: Never silently blended or averaged.
 */
export default function RiskModeBadge({ mode = "dynamic_behavioral", size = "sm", showIcon = true, className = "" }) {
  const norm = (mode || "dynamic_behavioral").toLowerCase().trim();

  if (norm === "static_entity") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/50 text-purple-300 font-mono font-semibold tracking-wide shadow-sm select-none ${
          size === "xs" ? "text-[9px] py-0 px-1.5" : size === "md" ? "text-xs px-2.5 py-1" : "text-[10px]"
        } ${className}`}
        title="Risk Scoring Mode: STATIC ENTITY (Score assigned directly from maintained catalog of regulated exchanges, mixers, or darknet markets without behavioral dilution)"
      >
        {showIcon && <Building2 className={size === "xs" ? "w-2.5 h-2.5 text-purple-400" : "w-3 h-3 text-purple-400"} />}
        <span>STATIC ENTITY</span>
      </span>
    );
  }

  // default: dynamic_behavioral
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono font-semibold tracking-wide shadow-sm select-none ${
        size === "xs" ? "text-[9px] py-0 px-1.5" : size === "md" ? "text-xs px-2.5 py-1" : "text-[10px]"
      } ${className}`}
      title="Risk Scoring Mode: DYNAMIC BEHAVIORAL (Score dynamically computed from active on-chain behavioral signals: mixer interaction, rapid fan-out, sanctioned proximity, age)"
    >
      {showIcon && <Activity className={size === "xs" ? "w-2.5 h-2.5 text-cyan-400" : "w-3 h-3 text-cyan-400"} />}
      <span>DYNAMIC BEHAVIORAL</span>
    </span>
  );
}

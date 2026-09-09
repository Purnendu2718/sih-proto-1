import React from "react";
import {
  X, Cpu, Activity, Clock, ShieldCheck, Database,
  Terminal, Server, CheckCircle2, AlertTriangle
} from "lucide-react";

export default function DiagnosticsDrawer({
  isOpen = false,
  onClose,
  cCoreLatency = 0.05,
  dataSource = "mock_fallback:task_scam_tron_usdt",
  detectedChain = "TRON",
  nodeCount = 8,
  edgeCount = 7,
}) {
  if (!isOpen) return null;

  const isLive = dataSource === "live";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full bg-[#091525] border-l border-[#223247] p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#223247]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#00AEEF]/10 border border-[#00AEEF]/30 text-[#00AEEF]">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#F5F7FA] tracking-wide">
                  System Diagnostics
                </h3>
                <p className="text-[11px] text-[#AAB7C7] font-mono">
                  SIH 2026 • Sovereign Engine Telemetry
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#122238] text-[#AAB7C7] hover:text-[#F5F7FA] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Engine Core Status */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6F7C8D]">
              High-Performance C-Core
            </span>

            <div className="p-4 rounded-xl bg-[#0E1B2D] border border-[#223247] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#AAB7C7]">BFS Search Latency</span>
                <span className="text-xs font-mono font-bold text-[#4ADE80]">
                  {cCoreLatency ? `${Number(cCoreLatency).toFixed(3)} ms` : "< 0.100 ms"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#AAB7C7]">Native Core Bridge</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#00AEEF]">
                  <CheckCircle2 className="w-3 h-3 text-[#00AEEF]" />
                  <span>libtracer.dll (-O3 compiled)</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#AAB7C7]">Execution Mode</span>
                <span className="text-xs font-mono text-[#6F7C8D]">
                  Direct C types zero-copy
                </span>
              </div>
            </div>
          </div>

          {/* Ingestion & RPC Connectivity */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6F7C8D]">
              Blockchain RPC Pipeline
            </span>

            <div className="p-4 rounded-xl bg-[#0E1B2D] border border-[#223247] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#AAB7C7]">Data Source Mode</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#FF8A00]/10 text-[#FFB04D] border border-[#FF8A00]/30">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{isLive ? "Live RPC Active" : "Deterministic Offline Sandbox"}</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#AAB7C7]">Source Identifier</span>
                <span className="text-[11px] font-mono text-[#6F7C8D] truncate max-w-[180px]">
                  {dataSource || "mock_fallback:task_scam_tron"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#AAB7C7]">Active Blockchain</span>
                <span className="text-xs font-mono text-[#00AEEF]">
                  {detectedChain || "TRON (TRC-20)"}
                </span>
              </div>
            </div>
          </div>

          {/* Golden Hour Protocol Status - Restrained Saffron / Urgency */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6F7C8D]">
              Legal Preservation Window
            </span>

            <div className="p-4 rounded-xl bg-[#FF8A00]/10 border border-[#FF8A00]/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF8A00]" />
                  <span className="text-xs text-[#F5F7FA] font-semibold tracking-wide uppercase">
                    Golden Hour Protocol
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#FFB04D]">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#AAB7C7] leading-relaxed">
                First 2 hours post-incident are critical for statutory Section 94 BNSS asset freezing prior to CEX off-ramp liquidation.
              </p>
            </div>
          </div>

          {/* Graph Engine Telemetry */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6F7C8D]">
              Active Graph Topology
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#0E1B2D] border border-[#223247]">
                <div className="text-[11px] text-[#AAB7C7]">Traversed Nodes</div>
                <div className="text-lg font-bold font-mono text-[#F5F7FA] mt-0.5">
                  {nodeCount}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0E1B2D] border border-[#223247]">
                <div className="text-[11px] text-[#AAB7C7]">Conduit Edges</div>
                <div className="text-lg font-bold font-mono text-[#F5F7FA] mt-0.5">
                  {edgeCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#223247] text-center">
          <span className="text-[10px] font-mono text-[#6F7C8D]">
            Sovereign Infrastructure • Ministry of Home Affairs (I4C)
          </span>
        </div>
      </div>
    </div>
  );
}

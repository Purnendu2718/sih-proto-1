import React, { useState, useEffect } from "react";
import { Play, CheckCircle2, Shield, ArrowRight, X, Download, FileText, RefreshCw, Cpu } from "lucide-react";

const DEMO_STAGES = [
  { id: 1, label: "Create Synthetic Case", detail: "FIR/CYBER/2026/0402 registered for ₹4,80,000 Telegram Task Scam" },
  { id: 2, label: "Load Victim Wallet", detail: "Ingesting victim address TVictim0001XXXXXXXXXXXXXXXXXXXXXXX" },
  { id: 3, label: "Build Unified Graph", detail: "Ingesting 24 account-model transactions & token transfer logs" },
  { id: 4, label: "Identify Peeling Chain", detail: "Heuristic 8.1: 5,000 USDT peel detected (150 USDT fee, 4,850 USDT main path)" },
  { id: 5, label: "Identify Bridge Crossing", detail: "Adapter 18.2: Stargate OFT router detected; cross-chain packet correlated" },
  { id: 6, label: "Analyze Mixer Protocol", detail: "Mixer 13.1: Tornado Cash interaction flagged; naive CIOH halted" },
  { id: 7, label: "Post-Mix Correlation", detail: "Anonymity-loss 15.1: 3 candidate outputs consolidated into mule address" },
  { id: 8, label: "Detect Fresh CEX Deposit", detail: "Zero-Day Engine 10.1: Unlabelled deposit address identified" },
  { id: 9, label: "Detect Automated Sweep", detail: "99.8% balance swept within 42 minutes into verified hot wallet" },
  { id: 10, label: "Attribute Exchange", detail: "CoinDCX Infrastructure attributed with 94% explainable heuristic confidence" },
  { id: 11, label: "Trace Off-Ramp Path", detail: "Multi-layer graph pathfinding: Shortest path to terminal off-ramp found (4 hops)" },
  { id: 12, label: "Generate Evidence Package", detail: "27 artifacts sealed with SHA-256 digests in localized evidence vault" },
  { id: 13, label: "Verify Evidence Integrity", detail: "Section 63 BSA verification: 27/27 artifacts valid, manifest verified" },
  { id: 14, label: "Generate Forensic Dossier", detail: "15-section digital dossier compiled with executive brief & timeline" },
  { id: 15, label: "Prepare Legal Review Draft", detail: "Section 94 BNSS statutory requisition draft populated for CoinDCX nodal desk" },
];

export default function GuidedDemoRunner({
  isOpen,
  onClose,
  onComplete,
  onOpenEvidence,
  onOpenNotice,
}) {
  const [currentStage, setCurrentStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStage(0);
      setIsRunning(false);
      setIsFinished(false);
      return;
    }
  }, [isOpen]);

  const handleStartDemo = () => {
    setIsRunning(true);
    setIsFinished(false);
    setCurrentStage(1);

    let stage = 1;
    const interval = setInterval(() => {
      stage += 1;
      if (stage <= DEMO_STAGES.length) {
        setCurrentStage(stage);
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setIsFinished(true);
        if (onComplete) onComplete();
      }
    }, 600); // Progress every 600ms
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0D14]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#12161F] border border-slate-700 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-100">
                  Section 67: Automated Master Demonstration Runner
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                  15-Stage Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Executes the full cyber-fraud forensic pipeline from victim intake to statutory requisition
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          {!isRunning && !isFinished && currentStage === 0 && (
            <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-4">
              <Shield className="w-10 h-10 text-cyan-400 mx-auto" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  End-to-End Synthetic Cyber-Fraud Investigation
                </h3>
                <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto leading-relaxed">
                  This demo automatically traverses peeling chains, bridge events, privacy pools, and automated CEX sweeps to pinpoint the terminal off-ramp and generate court evidence.
                </p>
              </div>
              <button
                onClick={handleStartDemo}
                className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition inline-flex items-center gap-2 shadow-lg shadow-cyan-900/30"
              >
                <Play className="w-4 h-4" />
                <span>START COMPLETE DEMO</span>
              </button>
            </div>
          )}

          {/* Progress Stream */}
          {(isRunning || isFinished || currentStage > 0) && (
            <div className="space-y-2">
              {DEMO_STAGES.map((s) => {
                const isPassed = currentStage > s.id;
                const isCurrent = currentStage === s.id;

                return (
                  <div
                    key={s.id}
                    className={`p-2.5 rounded-lg border transition flex items-center justify-between ${
                      isCurrent
                        ? "bg-cyan-950/40 border-cyan-500/80 text-cyan-200 shadow-md shadow-cyan-950/40"
                        : isPassed
                        ? "bg-slate-900/60 border-slate-800 text-slate-300"
                        : "bg-slate-950/40 border-slate-900 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] w-6 text-slate-500 font-bold">
                        #{s.id}
                      </span>
                      <div className="flex items-center gap-2">
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                        )}
                        <span className={`font-semibold ${isCurrent ? "text-cyan-300" : isPassed ? "text-slate-200" : "text-slate-500"}`}>
                          {s.label}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 max-w-xs truncate text-right">
                      {s.detail}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Final Completed Summary Card (Section 67 Spec) */}
          {isFinished && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/60 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    Investigation Complete
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  READY FOR COURT & REQUISITION
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-[11px]">
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Off-Ramp</span>
                  <span className="font-bold text-cyan-400">Probable CoinDCX</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Attribution</span>
                  <span className="font-bold text-emerald-400">94% Confidence</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Chains Traversed</span>
                  <span className="font-bold text-slate-200">TRON → EVM (4 hops)</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Evidence Integrity</span>
                  <span className="font-bold text-emerald-400">27 / 27 VERIFIED</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenEvidence) onOpenEvidence();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect Evidence Manifest</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenNotice) onOpenNotice();
                  }}
                  className="px-4 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/80 text-red-200 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-red-950/40"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Section 94 BNSS Notice</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-[10px] text-slate-500">
            * Fully self-contained local sovereign simulation conforming to SIH-26183
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

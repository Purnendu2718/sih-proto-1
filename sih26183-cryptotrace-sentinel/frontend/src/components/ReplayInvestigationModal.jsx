import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, Clock, X, Shield, ArrowRight } from "lucide-react";

const REPLAY_STEPS = [
  {
    time: "00:00.00",
    elapsedMs: 0,
    title: "Victim Address Ingested",
    description: "FIR complaint intake: Victim wallet TVictim0001XXXXXXXXXXXXXXXXXXXXXXX submitted for automated forensic tracing.",
    entity: "Victim Wallet",
    status: "COMPLETE",
    chain: "TRON",
  },
  {
    time: "00:00.18",
    elapsedMs: 180,
    title: "Transaction Graph Ingestion & Indexing",
    description: "Account model graph normalized. 24 raw transaction receipts and 8 token transfer events retrieved into localized analytical store.",
    entity: "Scam Layer #1",
    status: "COMPLETE",
    chain: "TRON",
  },
  {
    time: "00:00.42",
    elapsedMs: 420,
    title: "Peeling Chain & Splitting Detected",
    description: "Heuristic 8.1 triggered: 5,000 USDT peeled into 150 USDT mule fee and 4,850 USDT continuation path (87% velocity).",
    entity: "Peel Wallet #1",
    status: "COMPLETE",
    chain: "TRON",
  },
  {
    time: "00:00.86",
    elapsedMs: 860,
    title: "Cross-Chain State Transition Detected",
    description: "Adapter 18.2 parsed: Stargate OFT router detected on EVM; cross-chain packet message ID matched with destination credit.",
    entity: "Stargate Bridge",
    status: "COMPLETE",
    chain: "EVM",
  },
  {
    time: "00:01.12",
    elapsedMs: 1120,
    title: "Privacy Protocol / Mixer Interaction Detected",
    description: "Mixer engine 13.1 flagged: Deposit into Tornado Cash 100 ETH pool. Naive common-input heuristic suppressed. Candidate set size: 47.",
    entity: "Privacy Pool",
    status: "COMPLETE",
    chain: "Ethereum",
  },
  {
    time: "00:01.44",
    elapsedMs: 1440,
    title: "Post-Mix Consolidation & Candidate Linkage",
    description: "Anonymity-loss analysis 15.1: 3 candidate outputs observed consolidating into single withdrawal address within 4-hour window.",
    entity: "Mule Consolidation",
    status: "COMPLETE",
    chain: "Polygon",
  },
  {
    time: "00:01.68",
    elapsedMs: 1680,
    title: "Fresh Unlabelled Exchange Deposit Detected",
    description: "Zero-Day CEX Engine 10.1: Address 0xDEPOSIT... has NO prior public labels. Single incoming transfer of 4,850 USDT received.",
    entity: "Unknown Deposit",
    status: "COMPLETE",
    chain: "Polygon",
  },
  {
    time: "00:01.82",
    elapsedMs: 1820,
    title: "Automated Exchange Balance Sweep Observed",
    description: "99.8% balance swept within 42 minutes into verified CoinDCX master hot wallet cluster (tx: 0x9f1a...482c).",
    entity: "Hot Wallet Sweep",
    status: "COMPLETE",
    chain: "Polygon",
  },
  {
    time: "00:01.94",
    elapsedMs: 1940,
    title: "Nearest Off-Ramp Attributed (CoinDCX)",
    description: "Multi-layer graph pathfinding completed: Off-ramp confirmed as CoinDCX Infrastructure with 94% explainable heuristic confidence.",
    entity: "CoinDCX Off-Ramp",
    status: "COMPLETE",
    chain: "Polygon",
  },
  {
    time: "00:02.10",
    elapsedMs: 2100,
    title: "Cryptographic Evidence Package Generated",
    description: "27 artifacts sealed with SHA-256 hashes. Merkle root computed. Evidence Manifest signed under Section 63 BSA standards.",
    entity: "Evidence Ledger",
    status: "COMPLETE",
    chain: "OMNICHAIN",
  },
  {
    time: "00:02.24",
    elapsedMs: 2240,
    title: "Section 94 BNSS Legal Requisition Ready",
    description: "Statutory preservation notice draft auto-populated with CoinDCX compliance nodal contact, transaction hashes, and evidence IDs.",
    entity: "Legal Review",
    status: "COMPLETE",
    chain: "OMNICHAIN",
  },
];

export default function ReplayInvestigationModal({ isOpen, onClose, onFinishReplay }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < REPLAY_STEPS.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1200 / speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed]);

  if (!isOpen) return null;

  const currentStep = REPLAY_STEPS[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0D14]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#12161F] border border-slate-700 rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-100">
                  Section 57: Investigation Replay Console
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold">
                  Chronological Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Step-by-step forensic reconstruction from victim complaint intake to statutory off-ramp requisition
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

        {/* Current Step Spotlight Card */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                T + {currentStep.time}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Step {currentStepIndex + 1} of {REPLAY_STEPS.length}
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
              {currentStep.chain}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
            <span>{currentStep.title}</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-mono text-xs">{currentStep.entity}</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">
            {currentStep.description}
          </p>
        </div>

        {/* Timeline Track */}
        <div className="p-6 max-h-64 overflow-y-auto space-y-2 text-xs">
          {REPLAY_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;

            return (
              <div
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? "bg-purple-950/40 border-purple-500/80 text-purple-200 shadow-md shadow-purple-950/30"
                    : isPast
                    ? "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    : "bg-slate-950/40 border-slate-900 text-slate-600 hover:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] w-14 text-slate-500 font-semibold">
                    {step.time}
                  </span>
                  <div className="flex items-center gap-2">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span className={`font-semibold ${isCurrent ? "text-purple-200" : isPast ? "text-slate-300" : "text-slate-500"}`}>
                      {step.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">{step.entity}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {step.chain}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Playback Controls Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-900/30 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? "Pause" : "Play Replay"}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset Timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              {[1, 2, 4].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpeed(sp)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition ${
                    speed === sp
                      ? "bg-purple-950 border-purple-500/50 text-purple-300"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {sp}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Close
            </button>
            {currentStepIndex === REPLAY_STEPS.length - 1 && onFinishReplay && (
              <button
                onClick={() => {
                  onClose();
                  onFinishReplay();
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition flex items-center gap-1 shadow-lg shadow-emerald-900/30"
              >
                <span>Inspect Evidence Manifest</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

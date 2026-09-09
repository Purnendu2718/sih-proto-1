import React, { useState } from "react";
import {
  ArrowRight, Shield, Zap, Lock, Terminal, Cpu,
  CheckCircle2, ArrowUpRight, Activity, Layers, Database,
  FileCheck, ShieldCheck, ChevronRight
} from "lucide-react";
import { SAMPLE_PRESETS } from "./SearchBar";

export default function LandingView({
  onStartInvestigation,
  onRunDemo,
  onSelectPreset,
}) {
  const [activePreviewNode, setActivePreviewNode] = useState("cex_deposit");

  const previewNodes = [
    {
      id: "victim",
      label: "Victim Wallet",
      role: "Victim / Complainant",
      amount: "5,000 USDT",
      detail: "Loss reported at Cyber Crime Police Station under Section 94 BNSS",
      color: "border-[#22C55E]/40 text-[#4ADE80] bg-[#22C55E]/10",
    },
    {
      id: "mule1",
      label: "Layer 1 Mule",
      role: "Structuring Conduit",
      amount: "4,950 USDT",
      detail: "Rapid velocity transfer dispatched within 4 minutes of victim loss",
      color: "border-[#FF8A00]/40 text-[#FFB04D] bg-[#FF8A00]/10",
    },
    {
      id: "mule2",
      label: "Peeling Outlet",
      role: "Change Peel / Decoy",
      amount: "4,850 USDT (80%+)",
      detail: "Peeling chain detected: 80%+ pushed to primary leg, 100 USDT peeled",
      color: "border-[#6F7C8D]/40 text-[#AAB7C7] bg-[#162A40]/40",
    },
    {
      id: "cex_deposit",
      label: "CoinDCX Deposit",
      role: "Verified Off-Ramp",
      amount: "4,850 USDT",
      detail: "Attributed via 90%+ 24-hr sweep rule to CoinDCX hot wallet (≥95% confidence)",
      color: "border-[#00AEEF]/50 text-[#00AEEF] bg-[#00AEEF]/10",
    },
  ];

  const selectedPreview = previewNodes.find((n) => n.id === activePreviewNode) || previewNodes[3];

  return (
    <div className="relative w-full min-h-screen bg-[#07111F] text-[#F5F7FA] pt-14 overflow-hidden">
      {/* Subtle Ambient Background - Restrained SIH Blue Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-radial-ambient pointer-events-none opacity-70" />
      <div className="absolute top-40 inset-x-0 h-96 bg-grid-subtle pointer-events-none opacity-30" />

      {/* ============================================================ */}
      {/* SECTION 01: HERO                                              */}
      {/* ============================================================ */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-28 flex flex-col items-center text-center">
        {/* Eyebrow: SIH 2026 • BLOCKCHAIN & CYBERSECURITY */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1B2D] border border-[#223247] text-[11px] font-mono tracking-[0.22em] text-[#00AEEF] uppercase mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF] animate-pulse" />
          <span>SIH 2026 • BLOCKCHAIN & CYBERSECURITY</span>
        </div>

        {/* Clean Headline: Warm White, No Gradient */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-normal tracking-[-0.03em] leading-[0.96] text-[#F5F7FA] max-w-5xl mb-8 select-none">
          TRACE THE MONEY.<br />
          <span className="text-[#00AEEF]">PRESERVE THE EVIDENCE.</span>
        </h1>

        {/* Short Supporting Description */}
        <p className="text-[#AAB7C7] text-lg md:text-xl font-normal max-w-2xl leading-relaxed mb-12">
          An omnichain cyber-fraud investigation engine built to follow illicit fund flows across wallets, mixers, bridges and exchanges under Indian law enforcement standards.
        </p>

        {/* Primary and Secondary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <button
            onClick={() => onStartInvestigation?.()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#00AEEF] hover:bg-[#19B5FE] text-[#07111F] font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#00AEEF]/20 group cursor-pointer"
          >
            <span>START INVESTIGATION</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onRunDemo?.()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0E1B2D] hover:bg-[#122238] border border-[#223247] text-[#F5F7FA] font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#FF8A00]" />
            <span>RUN DEMO</span>
          </button>
        </div>

        {/* Sovereign Proof Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl pt-8 border-t border-[#223247] text-left">
          <div className="space-y-1">
            <div className="text-2xl lg:text-3xl font-mono font-bold text-[#F5F7FA] tracking-tight">
              &lt; 0.10 ms
            </div>
            <div className="text-xs text-[#AAB7C7] font-medium">
              C-Core BFS Graph Latency
            </div>
            <p className="text-[11px] text-[#6F7C8D] leading-normal">
              Compiled with GCC -O3 native C bridge for instantaneous off-ramp discovery.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl lg:text-3xl font-mono font-bold text-[#00AEEF] tracking-tight">
              ≥ 95% Confidence
            </div>
            <div className="text-xs text-[#AAB7C7] font-medium">
              Sweep Heuristic Attribution
            </div>
            <p className="text-[11px] text-[#6F7C8D] leading-normal">
              Statistically attributes unlabelled deposit wallets via 90%+ 24-hr sweep rules.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl lg:text-3xl font-mono font-bold text-[#4ADE80] tracking-tight">
              Sec 63 BSA & 94 BNSS
            </div>
            <div className="text-xs text-[#AAB7C7] font-medium">
              Statutory Evidentiary Seals
            </div>
            <p className="text-[11px] text-[#6F7C8D] leading-normal">
              RFC 8785 canonical JSON hashing and ReportLab PDF preservation notices.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 02: "FROM CHAOS TO CLARITY"                           */}
      {/* ============================================================ */}
      <section className="relative max-w-6xl mx-auto px-6 py-28 border-t border-[#223247]">
        <div className="max-w-3xl mb-14 space-y-3">
          <span className="text-xs font-mono text-[#00AEEF] tracking-[0.2em] uppercase">
            From Chaos to Clarity
          </span>
          <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-[#F5F7FA] leading-[1.05]">
            ONE INVESTIGATION.<br />
            EVERY CHAIN.<br />
            ONE ACTIONABLE PATH.
          </h2>
          <p className="text-[#AAB7C7] text-base leading-relaxed">
            Criminal syndicates structure illicit transfers across dozens of hops and peel chains. Sentinel collapses the graph into the single deterministically proven off-ramp conduit.
          </p>
        </div>

        {/* Animated Network Conduit Visual */}
        <div className="w-full rounded-2xl bg-[#0E1B2D] border border-[#223247] p-8 md:p-12 relative overflow-hidden shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            {/* Step 1 */}
            <div className="flex-1 w-full p-5 rounded-xl bg-[#07111F] border border-[#223247] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#4ADE80]">
                  Origin (Hop 0)
                </span>
                <span className="text-[10px] text-[#6F7C8D] font-mono">03:00 UTC</span>
              </div>
              <div className="text-sm font-bold text-[#F5F7FA]">Victim Deposit</div>
              <div className="text-xs font-mono text-[#AAB7C7] truncate">
                TVictim0001…XXXXX
              </div>
              <div className="text-xs text-[#4ADE80] font-mono font-semibold">
                -$5,000.00 USDT
              </div>
            </div>

            <div className="hidden lg:flex items-center text-[#6F7C8D]">
              <div className="w-8 h-px bg-[#223247]" />
              <ChevronRight className="w-4 h-4 text-[#00AEEF] -ml-1" />
            </div>

            {/* Step 2 */}
            <div className="flex-1 w-full p-5 rounded-xl bg-[#07111F] border border-[#223247] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFB04D]">
                  Structuring (Hop 1-2)
                </span>
                <span className="text-[10px] text-[#6F7C8D] font-mono">03:04 UTC</span>
              </div>
              <div className="text-sm font-bold text-[#F5F7FA]">Peeling Mule Cluster</div>
              <div className="text-xs font-mono text-[#AAB7C7] truncate">
                TMule000001…XXXXX
              </div>
              <div className="text-xs text-[#FFB04D] font-mono font-semibold">
                Peel: $100 | Primary: $4,900
              </div>
            </div>

            <div className="hidden lg:flex items-center text-[#6F7C8D]">
              <div className="w-8 h-px bg-[#223247]" />
              <ChevronRight className="w-4 h-4 text-[#00AEEF] -ml-1" />
            </div>

            {/* Step 3 */}
            <div className="flex-1 w-full p-5 rounded-xl bg-[#122238] border border-[#00AEEF]/40 space-y-2 shadow-md shadow-[#00AEEF]/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00AEEF] font-bold">
                  Terminal (Hop 3)
                </span>
                <span className="text-[10px] text-[#00AEEF] font-mono">03:12 UTC</span>
              </div>
              <div className="text-sm font-bold text-[#F5F7FA] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#00AEEF]" />
                <span>CoinDCX User Deposit</span>
              </div>
              <div className="text-xs font-mono text-[#AAB7C7] truncate">
                TCoinDCXDeposit0001…XXXXX
              </div>
              <div className="text-xs text-[#4ADE80] font-mono font-semibold">
                +$4,850.00 USDT (Target)
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#223247] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#AAB7C7] font-mono">
              Actionable Off-Ramp Identified in 0.067ms • Golden Hour Protocol Triggered
            </span>
            <button
              onClick={() => onSelectPreset?.("TRON")}
              className="text-xs text-[#00AEEF] hover:text-[#19B5FE] font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <span>Explore full DAG graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 03: THREE LARGE FEATURE BLOCKS                        */}
      {/* ============================================================ */}
      <section className="relative max-w-6xl mx-auto px-6 py-24 border-t border-[#223247] space-y-24">
        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="max-w-md space-y-4">
            <span className="text-xs font-mono text-[#00AEEF] tracking-[0.2em] uppercase">
              Capability 01
            </span>
            <h3 className="text-3xl sm:text-4xl font-normal text-[#F5F7FA] tracking-tight leading-tight">
              ZERO-DAY CEX DETECTION
            </h3>
            <p className="text-[#AAB7C7] text-sm sm:text-base leading-relaxed">
              Discover previously unlabelled exchange deposit infrastructure through observed sweep behavior. When 90%+ of funds are swept into a verified exchange hot wallet within 24 hours, Sentinel attributes the address at ≥95% confidence without waiting for external API labels.
            </p>
          </div>

          <div className="flex-1 w-full max-w-lg p-6 rounded-2xl bg-[#0E1B2D] border border-[#223247] space-y-4 font-mono text-xs shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#223247]">
              <span className="text-[#AAB7C7]">Sweep Attribution Rule</span>
              <span className="text-[#00AEEF] font-bold">SWEEP_90PCT_24HR</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#6F7C8D]">Observed Sweep Ratio:</span>
                <span className="text-[#F5F7FA] font-bold">96.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F7C8D]">Destination Hot Wallet:</span>
                <span className="text-[#00AEEF]">0x28c6c0629… (Binance Hot 14)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F7C8D]">Confidence Score:</span>
                <span className="text-[#4ADE80] font-bold">0.96 (Static Endorsement)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="max-w-md space-y-4">
            <span className="text-xs font-mono text-[#FF8A00] tracking-[0.2em] uppercase">
              Capability 02
            </span>
            <h3 className="text-3xl sm:text-4xl font-normal text-[#F5F7FA] tracking-tight leading-tight">
              OMNICHAIN TRACE
            </h3>
            <p className="text-[#AAB7C7] text-sm sm:text-base leading-relaxed">
              Follow illicit fund flows across chains, bridges, and mixers. Native support for TRON (TRC-20 USDT task scams), Ethereum EVM (ERC-20 pig-butchering and DeFi laundering), and Bitcoin UTXO peel chains.
            </p>
          </div>

          <div className="flex-1 w-full max-w-lg p-6 rounded-2xl bg-[#0E1B2D] border border-[#223247] space-y-4 text-xs shadow-md">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-xl bg-[#07111F] border border-[#223247] space-y-1">
                <div className="text-[#00AEEF] font-bold font-mono text-sm">TRON</div>
                <div className="text-[10px] text-[#AAB7C7]">TRC-20 USDT</div>
              </div>
              <div className="p-4 rounded-xl bg-[#07111F] border border-[#223247] space-y-1">
                <div className="text-[#FF8A00] font-bold font-mono text-sm">EVM</div>
                <div className="text-[10px] text-[#AAB7C7]">ETH & Tokens</div>
              </div>
              <div className="p-4 rounded-xl bg-[#07111F] border border-[#223247] space-y-1">
                <div className="text-[#4ADE80] font-bold font-mono text-sm">BTC</div>
                <div className="text-[10px] text-[#AAB7C7]">UTXO & Peels</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="max-w-md space-y-4">
            <span className="text-xs font-mono text-[#4ADE80] tracking-[0.2em] uppercase">
              Capability 03
            </span>
            <h3 className="text-3xl sm:text-4xl font-normal text-[#F5F7FA] tracking-tight leading-tight">
              FORENSIC EVIDENCE
            </h3>
            <p className="text-[#AAB7C7] text-sm sm:text-base leading-relaxed">
              Preserve source artifacts with verifiable evidentiary integrity under Section 63 of Bharatiya Sakshya Adhiniyam (BSA), 2023. Generates Section 94 BNSS statutory freezing notices with cryptographic SHA-256 seal certificates.
            </p>
          </div>

          <div className="flex-1 w-full max-w-lg p-6 rounded-2xl bg-[#0E1B2D] border border-[#223247] space-y-4 text-xs shadow-md">
            <div className="flex items-center gap-2 text-[#4ADE80] font-semibold pb-3 border-b border-[#223247]">
              <ShieldCheck className="w-4 h-4" />
              <span>Section 63 BSA Cryptographic Seal</span>
            </div>
            <div className="font-mono text-[11px] text-[#AAB7C7] break-all bg-[#07111F] p-3 rounded-lg border border-[#223247]">
              SHA256: 532163c7010e8208f2ec34e608d127d9e7ba19ae1f2c089818ee46115f53082a
            </div>
            <div className="text-[11px] text-[#6F7C8D]">
              Deterministic RFC 8785 canonical hash admissible in Indian court proceedings.
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 04: INTERACTIVE INVESTIGATION PREVIEW                 */}
      {/* ============================================================ */}
      <section className="relative max-w-6xl mx-auto px-6 py-24 border-t border-[#223247]">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono text-[#00AEEF] tracking-[0.2em] uppercase">
            Live Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#F5F7FA] tracking-tight">
            Interactive Conduit Flow
          </h2>
          <p className="text-[#AAB7C7] text-sm sm:text-base">
            Click any node below to inspect real-time forensic attribution and entity roles.
          </p>
        </div>

        {/* Node Selection Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
          {previewNodes.map((n) => (
            <button
              key={n.id}
              onClick={() => setActivePreviewNode(n.id)}
              className={`p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                activePreviewNode === n.id
                  ? `${n.color} shadow-md`
                  : "border-[#223247] bg-[#0E1B2D] text-[#AAB7C7] hover:text-[#F5F7FA] hover:bg-[#122238]"
              }`}
            >
              <div className="text-xs font-bold truncate">{n.label}</div>
              <div className="text-[10px] font-mono mt-1 opacity-80">{n.amount}</div>
            </button>
          ))}
        </div>

        {/* Selected Entity Card */}
        <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-[#0E1B2D] border border-[#223247] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wide">
                {selectedPreview.role}
              </span>
              <span className="text-[11px] font-mono text-[#00AEEF]">
                {selectedPreview.amount}
              </span>
            </div>
            <p className="text-xs text-[#AAB7C7] max-w-xl leading-relaxed">
              {selectedPreview.detail}
            </p>
          </div>

          <button
            onClick={() => onStartInvestigation?.()}
            className="px-5 py-2.5 rounded-xl bg-[#00AEEF] hover:bg-[#19B5FE] text-[#07111F] font-semibold text-xs transition shrink-0 shadow-sm cursor-pointer"
          >
            Open in Workspace
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 05: EVIDENCE INTEGRITY                                */}
      {/* ============================================================ */}
      <section className="relative max-w-6xl mx-auto px-6 py-24 border-t border-[#223247]">
        <div className="max-w-3xl space-y-3 mb-12">
          <span className="text-xs font-mono text-[#4ADE80] tracking-[0.2em] uppercase">
            Legal Admissibility
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#F5F7FA] tracking-tight leading-tight">
            EVIDENTIARY INTEGRITY
          </h2>
          <p className="text-[#AAB7C7] text-base leading-relaxed">
            Forensic reports are useless if they cannot withstand defense scrutiny in court. Sentinel enforces strict cryptographic seals under Section 63 BSA, producing timestamped PDF directives recognized by Indian Cyber Crime Coordination Centre (I4C).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#0E1B2D] border border-[#223247] space-y-3 shadow-md">
            <div className="text-xs font-mono text-[#00AEEF] uppercase tracking-wider">
              1. RFC 8785 Canonical JSON Serialization
            </div>
            <p className="text-xs text-[#AAB7C7] leading-relaxed">
              All raw graph entities, counterparties, and transfer timelines are sorted and serialized with zero key-order variance, guaranteeing reproducible hash generation across independent law enforcement nodes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E1B2D] border border-[#223247] space-y-3 shadow-md">
            <div className="text-xs font-mono text-[#00AEEF] uppercase tracking-wider">
              2. Section 94 BNSS ReportLab Directive
            </div>
            <p className="text-xs text-[#AAB7C7] leading-relaxed">
              Generates legal freezing directives with watermarked draft controls, official IO review checklists, and designated nodal officer routing for CoinDCX, Binance, WazirX, and ZebPay.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 06: SOVEREIGN ARCHITECTURE                            */}
      {/* ============================================================ */}
      <section className="relative max-w-6xl mx-auto px-6 py-24 border-t border-[#223247]">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono text-[#00AEEF] tracking-[0.2em] uppercase">
            Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#F5F7FA] tracking-tight">
            Sovereign Infrastructure
          </h2>
          <p className="text-[#AAB7C7] text-sm sm:text-base">
            Zero cloud telemetry leakage. Runs entirely within designated law enforcement perimeters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-[#0E1B2D] border border-[#223247] space-y-2 shadow-md">
            <Cpu className="w-6 h-6 text-[#00AEEF] mx-auto" />
            <div className="text-sm font-bold text-[#F5F7FA]">Local C-Core Engine</div>
            <p className="text-xs text-[#AAB7C7]">
              Native DLL compiled with GCC -O3 executes multi-hop BFS in under 100 microseconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E1B2D] border border-[#223247] space-y-2 shadow-md">
            <Lock className="w-6 h-6 text-[#FF8A00] mx-auto" />
            <div className="text-sm font-bold text-[#F5F7FA]">Zero External Leakage</div>
            <p className="text-xs text-[#AAB7C7]">
              No suspect wallets or victim complaint data are shared with public third-party analytics APIs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E1B2D] border border-[#223247] space-y-2 shadow-md">
            <Database className="w-6 h-6 text-[#4ADE80] mx-auto" />
            <div className="text-sm font-bold text-[#F5F7FA]">Deterministic Sandbox</div>
            <p className="text-xs text-[#AAB7C7]">
              Instant offline simulation fallback ensures seamless training and uninterrupted demo operations.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 07: FINAL CTA                                         */}
      {/* ============================================================ */}
      <section className="relative max-w-6xl mx-auto px-6 py-28 border-t border-[#223247] text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#F5F7FA] mb-8 select-none">
          TRACE THE MONEY.<br />
          <span className="text-[#00AEEF]">START AN INVESTIGATION.</span>
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onStartInvestigation?.()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#00AEEF] hover:bg-[#19B5FE] text-[#07111F] font-semibold text-sm tracking-wide transition shadow-lg shadow-[#00AEEF]/20 cursor-pointer"
          >
            START INVESTIGATION
          </button>
          <button
            onClick={() => onRunDemo?.()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0E1B2D] hover:bg-[#122238] border border-[#223247] text-[#F5F7FA] font-semibold text-sm tracking-wide transition cursor-pointer"
          >
            RUN GUIDED DEMO
          </button>
        </div>

        <div className="mt-16 text-xs text-[#6F7C8D] font-mono">
          CryptoTrace-Sentinel • Smart India Hackathon • SIH26183 • I4C / Ministry of Home Affairs
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Shield, Activity, Layers, FileText, CheckCircle2, Clock,
  ArrowRight, Search, Plus, ExternalLink, Hash, Coins, ShieldCheck,
  AlertTriangle, Cpu, Globe, Zap, Award
} from "lucide-react";
import apiClient from "../services/api";

export default function DashboardView({
  onSelectCase,
  onNewCase,
  onRunDemo,
  onOpenEvidence,
  onOpenCompetitive,
  onOpenVasp,
}) {
  const [stats, setStats] = useState({
    active_cases: 18,
    total_cases: 24,
    funds_under_trace_inr: 28400000.0,
    funds_under_trace_usd: 324571.43,
    cex_attributions: 12,
    cross_chain_events: 31,
    mixer_interactions: 6,
    evidence_packages: 41,
    pending_legal_reviews: 7,
  });

  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const statsRes = await apiClient.get("/cases/dashboard/stats");
        if (statsRes.data) setStats(statsRes.data);

        const casesRes = await apiClient.get("/cases");
        if (casesRes.data && casesRes.data.length > 0) {
          setRecentCases(casesRes.data);
        }
      } catch (err) {
        console.warn("Using offline dashboard fallback:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const demoPresets = [
    {
      id: "inr_480k_coindcx_scam",
      caseId: "NCRP-2026-480912",
      title: "Case 4: ₹4.8L CoinDCX Zero-Day Sweep",
      wallet: "0xVICTIM_480K_FRAUD_7b93a2c4e1",
      typology: "Cyber Task Fraud / Mule Layering",
      amount: "₹4,80,000 (~$5,750)",
      chain: "EVM",
      badgeColor: "purple",
    },
    {
      id: "synthetic_master_case",
      caseId: "NCRP-2026-901124",
      title: "Case 1: Omnichain Master Fraud Syndicate",
      wallet: "0xVictimMasterCyberFraud_01124a",
      typology: "Peeling Chain → Stargate Bridge → Tornado Cash",
      amount: "₹20,50,000 (~$24,500)",
      chain: "EVM / POLYGON",
      badgeColor: "rose",
    },
    {
      id: "coinjoin_forensics_case",
      caseId: "NCRP-2026-610492",
      title: "Case 2: Bitcoin Ransom Extortion / CoinJoin",
      wallet: "1VictimBtcExtortionWallet_9941a",
      typology: "Whirlpool CoinJoin / Post-Mix Consolidation",
      amount: "₹15,20,000 (0.28 BTC)",
      chain: "BTC",
      badgeColor: "amber",
    },
    {
      id: "cross_chain_dex_case",
      caseId: "NCRP-2026-724810",
      title: "Case 3: Cross-Chain DEX Swap / Wormhole",
      wallet: "0xVictimCrossChainBridge_1944a",
      typology: "Wormhole Bridge → PancakeSwap Swap",
      amount: "₹12,50,000 (~$15,000)",
      chain: "EVM / BSC",
      badgeColor: "cyan",
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6 bg-[#0A0D14] text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#121824] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                MHA / I4C SOVEREIGN WORKSTATION
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Sec. 94 BNSS • Sec. 63 BSA</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-1">
              BLOCKCHAIN CYBER-FRAUD FORENSIC INTELLIGENCE CONSOLE
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Rapid Golden-Hour Fund Flow Tracing, Zero-Day CEX Sweep Attribution, and Cryptographic Evidence Sealing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNewCase}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>NEW INVESTIGATION</span>
          </button>
          <button
            onClick={onRunDemo}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/60 transition flex items-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>RUN COMPLETE DEMO</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid (Section 37 Specifications) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Active Cases</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">{stats.active_cases}</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Live Under Inquiry</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Funds Under Trace</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">
            ₹{(stats.funds_under_trace_inr / 10000000).toFixed(2)} Cr
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Equivalent ~ ${stats.funds_under_trace_usd?.toLocaleString()} USD
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30">
          <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider block">CEX Attributions</span>
          <span className="text-2xl font-bold text-purple-300 font-mono mt-1 block">{stats.cex_attributions}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Zero-Day Sweeps</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30">
          <span className="text-[10px] font-mono text-blue-300 uppercase tracking-wider block">Cross-Chain</span>
          <span className="text-2xl font-bold text-blue-300 font-mono mt-1 block">{stats.cross_chain_events}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Bridges / DEXs</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30">
          <span className="text-[10px] font-mono text-rose-300 uppercase tracking-wider block">Mixer Intercepts</span>
          <span className="text-2xl font-bold text-rose-300 font-mono mt-1 block">{stats.mixer_interactions}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">CoinJoin / Pools</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
          <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider block">Evidence Sealed</span>
          <span className="text-2xl font-bold text-emerald-300 font-mono mt-1 block">{stats.evidence_packages}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Sec. 63 BSA Merkle</span>
        </div>
      </div>

      {/* Quick Intake Scenarios (Sections 53-56) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>INSTITUTIONAL INVESTIGATION PRESETS & SYNTHETIC BENCHMARKS</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">Select any case to open full 4-panel forensic workstation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {demoPresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onSelectCase(preset)}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-900/90 transition cursor-pointer shadow-md group relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-cyan-400">{preset.caseId}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                  {preset.chain}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                {preset.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{preset.typology}</p>
              
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 font-mono">{preset.amount}</span>
                <span className="text-xs font-semibold text-slate-400 group-hover:text-white flex items-center gap-1">
                  <span>Investigate</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forensic Intelligence Quick Launch Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={onOpenVasp}
          className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition cursor-pointer flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">VASP & Exchange Directory</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Verified Compliance contacts, Nodal Officer registry, and FIU-IND entities.
            </p>
          </div>
        </div>

        <div
          onClick={onOpenEvidence}
          className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Evidence Ledger & BSA Sealing</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Section 63 BSA Merkle tree root verification and court-admissible ZIP export.
            </p>
          </div>
        </div>

        <div
          onClick={onOpenCompetitive}
          className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Competitive Benchmark Matrix</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Section 20 comparative analysis vs legacy commercial SaaS (Arkham/Breadcrumbs).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

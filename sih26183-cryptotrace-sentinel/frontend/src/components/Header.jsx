import React from "react";
import {
  Shield,
  FileText,
  Cpu,
  Activity,
  ShieldCheck,
  Award,
  CheckCircle2,
  User,
  LayoutDashboard,
  FolderKanban,
  GitBranch,
  Building2,
  History,
  Play,
  Clock,
  PlusCircle,
} from "lucide-react";
import GoldenHourTimer from "./GoldenHourTimer";

export const ROLES = [
  "Investigator (IO)",
  "Cyber Analyst",
  "Supervisor (ACP)",
  "Legal Reviewer",
  "Auditor",
  "Administrator",
];

export default function Header({
  detectedChain = "TRON",
  dataSource = null,
  traceTimeMs = null,
  activeView = "investigate",
  onSelectView = null,
  onOpenNoticeModal = null,
  onGoHome = null,
  onOpenHistory = null,
  historyCount = 0,
  isHomeView = false,
  goldenHourStartedAt = null,
  onOpenCaseComplete = null,
  onOpenEvidenceModal = null,
  onOpenCompetitive = null,
  onOpenNewCase = null,
  onOpenDemoRunner = null,
  onOpenReplay = null,
  currentRole = "Investigator (IO)",
  onChangeRole = null,
}) {
  const isMock = dataSource && dataSource.startsWith("mock_fallback:");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "cases", label: "Cases", icon: FolderKanban },
    { id: "investigate", label: "Investigate", icon: GitBranch },
    { id: "vasp", label: "CEX Intel", icon: Building2 },
    { id: "evidence", label: "Evidence", icon: ShieldCheck },
    { id: "audit", label: "Audit Log", icon: History },
  ];

  return (
    <header className="flex flex-col bg-[#12161F] border-b border-slate-800 shrink-0 z-30 font-sans text-xs">
      {/* Top Main Bar */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Brand, Home, History */}
        <div className="flex items-center gap-3">
          {/* Ghost (👻) Home Button */}
          <button
            type="button"
            onClick={onGoHome}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border text-base cursor-pointer transition ${
              isHomeView
                ? "bg-cyan-950/60 border-cyan-500 shadow-lg shadow-cyan-900/30"
                : "bg-slate-900 border-slate-700 hover:border-slate-600 text-slate-300"
            }`}
            title="Home / Intake Console"
          >
            👻
          </button>

          {/* History Counter Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-slate-100 transition font-medium"
            title="Open Recent Searches & Case Organizer"
          >
            <span>History</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
              {historyCount}
            </span>
          </button>

          {/* System Title */}
          <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 tracking-tight text-xs">
                  CryptoTrace-Sentinel
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 font-semibold">
                  MHA / I4C Sovereign
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    detectedChain === "TRON"
                      ? "bg-cyan-950 text-cyan-300 border-cyan-500/40"
                      : detectedChain === "EVM"
                      ? "bg-amber-950 text-amber-300 border-amber-500/40"
                      : "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {detectedChain}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Omnichain Cyber-Fraud Forensic Engine • Indian Law Enforcement
              </div>
            </div>
          </div>
        </div>

        {/* Center: Golden Hour Timer & Performance Telemetry */}
        <div className="flex items-center gap-3">
          <GoldenHourTimer startedAt={goldenHourStartedAt} />

          {/* Latency Telemetry */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>BFS: {traceTimeMs !== null ? `${traceTimeMs}ms` : "< 1ms"}</span>
          </div>

          {/* Mode Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono">
            <Activity className={`w-3.5 h-3.5 ${isMock ? "text-amber-400" : "text-emerald-400"}`} />
            <span>{isMock ? "Sovereign Air-Gapped" : "Live RPC"}</span>
          </div>

          {/* Role Selector */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300 font-mono text-[10px]">
            <User className="w-3 h-3 text-purple-400" />
            <select
              value={currentRole}
              onChange={(e) => onChangeRole && onChangeRole(e.target.value)}
              className="bg-transparent text-purple-200 border-none outline-none cursor-pointer text-[10px]"
            >
              {ROLES.map((r) => (
                <option key={r} value={r} className="bg-slate-900 text-slate-200">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Quick Action Launchers */}
        <div className="flex items-center gap-2">
          {/* New Case Button */}
          <button
            onClick={onOpenNewCase}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-semibold transition flex items-center gap-1"
            title="Register New FIR / NCRP Cyber-Fraud Case"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Case</span>
          </button>

          {/* One-Click Complete Demo */}
          <button
            onClick={onOpenDemoRunner}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 text-xs font-bold transition flex items-center gap-1 shadow"
            title="Run Complete 15-Stage Master Demo"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Demo</span>
          </button>

          {/* Replay Investigation */}
          <button
            onClick={onOpenReplay}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 text-xs font-semibold transition flex items-center gap-1"
            title="Replay Investigation Telemetry Step-by-Step"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          {/* Competitive Benchmark */}
          <button
            onClick={onOpenCompetitive}
            className="px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold transition"
            title="Compare vs Legacy Commercial Analytics"
          >
            <Award className="w-3.5 h-3.5 text-blue-400" />
          </button>

          {/* Sec 94 BNSS Freezing Notice */}
          <button
            onClick={onOpenNoticeModal}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950/70 border border-red-500/80 text-red-300 hover:text-red-200 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-950/40"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sec 94 BNSS</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar (§37 Navigation Specification) */}
      <div className="flex items-center gap-1 px-4 py-1 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView && onSelectView(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition whitespace-nowrap ${
                isActive
                  ? "bg-slate-800 text-cyan-400 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

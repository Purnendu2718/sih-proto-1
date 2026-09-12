import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  ArrowRight,
  ExternalLink,
  Lock,
  RefreshCw,
  Home,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  Info
} from "lucide-react";
import { publicLookup } from "../api";

const PRESET_LOOKUPS = [
  {
    title: "Sanctioned Mixer (OFAC)",
    query: "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
    chain: "EVM",
    badge: "CRITICAL",
    badgeColor: "bg-rose-950 text-rose-300 border-rose-800"
  },
  {
    title: "VASP Exchange Deposit",
    query: "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
    chain: "TRON",
    badge: "VASP DEPOSIT",
    badgeColor: "bg-amber-950 text-amber-300 border-amber-800"
  },
  {
    title: "Standard Unflagged Wallet",
    query: "TVictim0001TRONTaskScamXXXXXXXXX",
    chain: "TRON",
    badge: "CLEAN",
    badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-800"
  },
  {
    title: "On-Chain Transaction Hash",
    query: "0x8f4c010000000000000000000000000000000000000000000000000000000001",
    chain: "EVM",
    badge: "TX HASH",
    badgeColor: "bg-blue-950 text-blue-300 border-blue-800"
  }
];

export default function PublicLookupView({ onBackToLanding, onLaunchConsole }) {
  const [queryInput, setQueryInput] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  const handleSearch = async (overrideQuery = null, overrideChain = null) => {
    const q = (overrideQuery !== null ? overrideQuery : queryInput).trim();
    const c = overrideChain !== null ? overrideChain : (selectedChain || null);
    if (!q) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await publicLookup(q, c);
      setResult(data);
      if (data.rate_limit) {
        setRateLimitInfo(data.rate_limit);
      }
    } catch (err) {
      if (err.status === 429 || err.message?.includes("429") || err.message?.includes("Rate limit")) {
        setErrorMsg("Rate limit exceeded (30 queries per minute per IP). Please wait 60 seconds before retrying.");
      } else {
        setErrorMsg(err.message || "Failed to perform public lookup.");
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (preset) => {
    setQueryInput(preset.query);
    setSelectedChain(preset.chain);
    handleSearch(preset.query, preset.chain);
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return {
          badgeBg: "bg-red-950/80 text-red-300 border-red-700/80",
          gaugeColor: "text-red-500",
          cardBorder: "border-red-800/60 bg-red-950/10"
        };
      case "HIGH":
        return {
          badgeBg: "bg-rose-950/80 text-rose-300 border-rose-700/80",
          gaugeColor: "text-rose-400",
          cardBorder: "border-rose-800/50 bg-rose-950/10"
        };
      case "MODERATE":
        return {
          badgeBg: "bg-amber-950/80 text-amber-300 border-amber-700/80",
          gaugeColor: "text-amber-400",
          cardBorder: "border-amber-800/50 bg-amber-950/10"
        };
      case "LOW":
        return {
          badgeBg: "bg-blue-950/80 text-blue-300 border-blue-700/80",
          gaugeColor: "text-blue-400",
          cardBorder: "border-blue-800/50 bg-blue-950/10"
        };
      default:
        return {
          badgeBg: "bg-emerald-950/80 text-emerald-300 border-emerald-700/80",
          gaugeColor: "text-emerald-400",
          cardBorder: "border-emerald-800/50 bg-emerald-950/10"
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans relative flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]"></div>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#08080a]/85 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBackToLanding}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="font-bold text-base text-white tracking-wide font-mono flex items-center gap-2">
                <span>CryptoTrace Public Scanner</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  NO LOGIN REQUIRED
                </span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                Public Safety & Citizen Threat Verification
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {rateLimitInfo && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700/80 font-mono text-[11px] text-zinc-300">
                <Clock size={12} className="text-cyan-400" />
                <span>Quota: <strong className="text-emerald-400">{rateLimitInfo.remaining}</strong>/30 queries left</span>
              </div>
            )}

            <button
              onClick={onBackToLanding}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Home size={13} />
              <span>Home</span>
            </button>

            {onLaunchConsole && (
              <button
                onClick={() => onLaunchConsole()}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1"
              >
                <span>Police Console</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col items-center">
        {/* Banner Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono mb-6">
          <ShieldCheck size={14} className="text-cyan-400" />
          <span>Strict Zero-Case-Creation Guarantee • Rate-Limited by IP</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center tracking-tight mb-3 font-mono">
          Public Blockchain Risk Lookup
        </h1>
        <p className="text-sm text-zinc-400 text-center max-w-xl mb-8 leading-relaxed">
          Verify suspect crypto addresses or transaction hashes across <strong>TRON</strong>, <strong>EVM (Ethereum/BSC/Polygon)</strong>, and <strong>Bitcoin</strong>. Identify international sanctions, verified exchange terminals, and illicit mule patterns instantly without logging in.
        </p>

        {/* Search Input Bar */}
        <div className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md mb-4 flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 flex-1 w-full">
            <Search className="text-zinc-500 w-4 h-4 flex-shrink-0" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Paste wallet address (T..., 0x..., bc1...) or 64-char transaction hash..."
              className="bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none w-full font-mono"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end px-2">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="bg-zinc-950 border border-zinc-700/80 rounded-lg px-2.5 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="">Auto Chain</option>
              <option value="TRON">TRON</option>
              <option value="EVM">EVM</option>
              <option value="BTC">BTC</option>
            </select>

            <button
              onClick={() => handleSearch()}
              disabled={loading || !queryInput.trim()}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
              <span>Check Risk</span>
            </button>
          </div>
        </div>

        {/* Preset Sample Chips */}
        <div className="w-full flex items-center flex-wrap gap-2 mb-8 justify-center">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Try Examples:</span>
          {PRESET_LOOKUPS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePreset(preset)}
              disabled={loading}
              className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span className={`text-[9px] px-1 py-0.2 rounded border font-bold ${preset.badgeColor}`}>
                {preset.badge}
              </span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="w-full p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs font-mono flex items-start gap-2.5 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{errorMsg}</p>
              <p className="text-zinc-400 text-[11px] mt-1">
                Public rate limiting protects the forensic infrastructure from automated abuse.
              </p>
            </div>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Sanctions Warning Banner if applicable */}
            {result.sanctions_match && (
              <div className="p-4 rounded-xl bg-red-950/80 border-2 border-red-600 text-red-100 flex items-start gap-3 shadow-[0_0_25px_rgba(220,38,38,0.4)]">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-sm text-red-200 uppercase tracking-wider font-mono">
                    ⚠️ Official International Sanctions Designation
                  </div>
                  <p className="text-red-200 leading-relaxed font-sans">
                    This address is designated on the <strong>{result.sanctions_details?.authority || "US OFAC SDN"}</strong> watch list under program <strong>{result.sanctions_details?.program || "CYBER"}</strong>. Any transaction involves extreme legal, criminal, and regulatory liability.
                  </p>
                </div>
              </div>
            )}

            {/* Main Details Card */}
            {(() => {
              const styles = getSeverityStyle(result.severity);
              return (
                <div className={`p-6 rounded-2xl border ${styles.cardBorder} bg-zinc-900/80 backdrop-blur-md space-y-5 shadow-2xl`}>
                  {/* Top Bar with Score & Badges */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                          Query: {result.query_type === "address" ? "Wallet Address" : "Transaction Hash"}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 font-mono font-bold">
                          {result.chain}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                          {result.risk_mode}
                        </span>
                      </div>
                      <div className="font-mono text-sm text-white break-all select-all font-semibold">
                        {result.query}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Risk Score</div>
                        <div className={`text-2xl font-black font-mono ${styles.gaugeColor}`}>
                          {result.risk_score}<span className="text-xs text-zinc-500 font-normal">/100</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold ${styles.badgeBg}`}>
                        {result.severity}
                      </div>
                    </div>
                  </div>

                  {/* Top Verified Labels */}
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Verified Entity & Forensic Labels:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.top_labels?.map((label, lIdx) => (
                        <span
                          key={lIdx}
                          className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-700/80 text-xs font-mono text-zinc-200 flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Plain Language Summary */}
                  <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
                    <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                      <Info size={12} /> Forensic Intelligence Assessment:
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {result.summary}
                    </p>
                  </div>

                  {/* Non-Investigator Disclaimer Strip */}
                  <div className="pt-2 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>Zero Case Creation • No Data Logged • Read-Only Inspection</span>
                    </div>
                    {result.rate_limit && (
                      <div>
                        Rate Limit: {result.rate_limit.remaining}/30 left (resets in {result.rate_limit.reset_seconds}s)
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Police Help CTA Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-800/40 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                  <span>Victim of cryptocurrency fraud or task scam?</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Call the National Cyber Crime Helpline at <strong>1930</strong> or register an online complaint at <strong>cybercrime.gov.in</strong>.
                </p>
              </div>

              {onLaunchConsole && (
                <button
                  onClick={() => onLaunchConsole(result.query, result.chain)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Open in Police Tracing Canvas</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/80 py-6 px-6 text-center text-xs font-mono text-zinc-500">
        CryptoTrace Sentinel Public Verification Portal • Ministry of Home Affairs / I4C Framework • Section 63 BSA & 94 BNSS Compliant
      </footer>
    </div>
  );
}

import React, { useState } from "react";
import {
  Search, ArrowLeft, Download, ShieldCheck, Copy, Check, CheckCircle2, RefreshCw
} from "lucide-react";
import { generateFreezeNotice } from "../services/api";

export default function EvidenceView({
  caseId = "CASE-SIH-2026",
  brief = null,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const evidenceDigest = "532163c7010e8208f2ec34e608d127d9e7ba19ae1f2c089818ee46115f53082a";

  const artifacts = [
    {
      id: "ART-01",
      title: "RFC 8785 Canonical Graph Topology Snapshot",
      type: "application/json",
      sha256: "0x8f2d9c1b4e6a7350129fec8714b35029e8471c039581a62048fbc927160359da",
      timestamp: "2026-09-08 22:30:14 UTC",
      status: "Verified",
    },
    {
      id: "ART-02",
      title: "TRON Grid Deterministic RPC Transfer Stream",
      type: "application/json",
      sha256: "0x7a7bad434a78269e768f62cfdd6e44be03da731bc0533613cd79ca15ba080e6f",
      timestamp: "2026-09-08 22:30:16 UTC",
      status: "Verified",
    },
    {
      id: "ART-03",
      title: "Section 94 BNSS Statutory Freezing Requisition",
      type: "application/pdf",
      sha256: "0x3b91c828d11ef628a9b2075a0248c081e8471c039581a62048fbc927160381ea",
      timestamp: "2026-09-08 22:31:02 UTC",
      status: "Verified",
    },
    {
      id: "ART-04",
      title: "CoinDCX VASP Attribution Heuristic Endorsement",
      type: "text/plain",
      sha256: "0x28c6c06298d514db089934071355e5743bf21d600184b2c0918efba7109283fa",
      timestamp: "2026-09-08 22:31:45 UTC",
      status: "Verified",
    },
  ];

  const handleCopyHash = () => {
    navigator.clipboard.writeText(evidenceDigest);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 1800);
  };

  const handleVerifyAll = () => {
    setVerifying(true);
    setTimeout(() => setVerifying(false), 500);
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const payload = {
        case_id: caseId || "CASE-SIH-2026",
        fir_number: "FIR/CYBER/2026/0402",
        investigating_officer: "Insp. Vikram Rathore",
        police_station: "Cyber Crime Police Station",
        exchange_name: brief?.identified_vasp || "CoinDCX",
        compliance_email: "compliance@coindcx.com",
        frozen_addresses: ["TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"],
        transaction_hashes: ["0x8f2d9c1b4e6a7350129fec8714b35029e8471c039581a62048fbc927160359da"],
        victim_amount_inr: 437500.0,
        narrative: "Multi-hop structuring into exchange terminal under Golden Hour Protocol.",
      };
      const blob = await generateFreezeNotice(payload);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Evidence_Dossier_${caseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error generating dossier: " + (err.message || err));
    } finally {
      setDownloading(false);
    }
  };

  const filteredArtifacts = artifacts.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.sha256.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-[calc(100vh-56px)] mt-14 bg-[#07111F] text-[#F5F7FA] flex flex-col">
      {/* 1. Contextual Evidence Toolbar (Section 14: [ ← ] │ [ Search evidence / hash ] │ [ Verify All ] │ [ Export ]) */}
      <div className="w-full px-4 pt-4 pb-2 shrink-0 flex justify-center z-20">
        <div className="w-full max-w-4xl bg-[#091525]/90 backdrop-blur-md border border-[#223247] rounded-2xl px-3 py-1.5 shadow-lg shadow-black/20 flex items-center gap-2">
          {/* Back */}
          <button
            onClick={() => window.history?.back ? window.history.back() : null}
            className="p-1.5 hover:bg-[#122238] text-[#AAB7C7] hover:text-[#F5F7FA] rounded-lg transition cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#223247] shrink-0" />

          {/* Search Evidence / Hash Field */}
          <div className="relative flex-1 flex items-center min-w-0">
            <Search className="w-3.5 h-3.5 text-[#6F7C8D] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evidence artifact, digest hash, or file type..."
              className="w-full bg-[#07111F] border border-[#223247] focus:border-[#00AEEF] rounded-xl pl-8 pr-14 py-1.5 text-xs text-[#F5F7FA] font-mono placeholder-[#6F7C8D] outline-none transition"
            />
            <kbd className="hidden sm:inline-block absolute right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#091525] border border-[#223247] text-[#6F7C8D]">
              Ctrl+K
            </kbd>
          </div>

          <div className="h-4 w-px bg-[#223247] shrink-0" />

          {/* Verify All Action */}
          <button
            onClick={handleVerifyAll}
            disabled={verifying}
            className="px-2.5 py-1.5 rounded-lg hover:bg-[#122238] text-[#AAB7C7] hover:text-[#F5F7FA] text-xs font-medium transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#6F7C8D] ${verifying ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Verify All</span>
          </button>

          <div className="h-4 w-px bg-[#223247] shrink-0" />

          {/* Export PDF Action */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="px-3 py-1.5 rounded-lg bg-[#00AEEF] hover:bg-[#19B5FE] text-[#07111F] font-semibold text-xs transition flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{downloading ? "Exporting..." : "Export"}</span>
          </button>
        </div>
      </div>

      {/* 2. Open Canvas Evidence Manifest */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Master Seal Digest Line */}
        <div className="py-4 px-3 bg-[#0E1B2D]/40 border border-[#223247] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0" />
            <span className="text-[#6F7C8D] uppercase text-[10px]">Master SHA-256 Digest:</span>
            <span className="text-[#22C55E] truncate select-all">{evidenceDigest}</span>
          </div>

          <button
            onClick={handleCopyHash}
            className="self-end sm:self-auto px-2 py-1 rounded bg-[#07111F] hover:bg-[#122238] border border-[#223247] text-[11px] text-[#AAB7C7] hover:text-[#F5F7FA] transition cursor-pointer flex items-center gap-1 shrink-0"
          >
            {copiedHash ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3" />}
            <span>{copiedHash ? "Copied" : "Copy"}</span>
          </button>
        </div>

        {/* Artifacts List (Unboxed, thin dividers) */}
        <div className="divide-y divide-[#223247] border-y border-[#223247]">
          {filteredArtifacts.map((art) => (
            <div key={art.id} className="py-4 px-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#0E1B2D]/30 transition rounded-lg">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-[#00AEEF]">
                    {art.id}
                  </span>
                  <span className="text-sm text-[#F5F7FA]">
                    {art.title}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-[#6F7C8D] truncate max-w-xl">
                  {art.sha256}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#6F7C8D] shrink-0 self-end sm:self-auto">
                <span>{art.timestamp}</span>
                <span className="text-[#22C55E] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>
            </div>
          ))}

          {filteredArtifacts.length === 0 && (
            <div className="py-16 text-center text-[#6F7C8D] text-xs">
              No artifacts match your query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

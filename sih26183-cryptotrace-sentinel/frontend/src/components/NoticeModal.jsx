import React, { useState, useEffect } from "react";
import {
  X, ShieldAlert, Download, Copy, Check, FileText,
  UserCheck, AlertTriangle, Landmark, ShieldCheck, Scale
} from "lucide-react";
import { generateFreezeNotice, generateFreezeNoticeV2, generateFreezeNoticeText } from "../services/api";

export default function NoticeModal({
  isOpen,
  onClose,
  brief,
  currentChain = "TRON",
  caseId = "CASE-SIH-2026",
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [noticeText, setNoticeText] = useState("");
  const [evidenceSeal, setEvidenceSeal] = useState("");
  const [statutoryMode, setStatutoryMode] = useState("BNSS_94"); // "BNSS_94" | "CRPC_91"

  // Officer Credentials State
  const [ioName, setIoName] = useState("Insp. Rajesh Kumar");
  const [beltNo, setBeltNo] = useState("CCPS-4091");
  const [policeStation, setPoliceStation] = useState("Cyber Crime Police Station, State Headquarters");
  const [firNumber, setFirNumber] = useState("FIR/CYBER/2026/0480");
  const [ncrpAckNumber, setNcrpAckNumber] = useState("NCRP-ACK-99214-IN");
  const [victimAmountInr, setVictimAmountInr] = useState(
    brief?.stolen_amount_usd ? Math.round(brief.stolen_amount_usd * 87.5) : 480000.0
  );

  const targetVasp = brief?.identified_vasp || "CoinDCX";
  const nodalEmail = targetVasp.toLowerCase().includes("binance")
    ? "case@binance.com"
    : targetVasp.toLowerCase().includes("wazirx")
    ? "nodal@wazirx.com"
    : targetVasp.toLowerCase().includes("zebpay")
    ? "compliance@zebpay.com"
    : "compliance@coindcx.com";

  const targetDepositWallet =
    brief?.target_deposit_wallet || "0xUnknownDeposit_3e4f5a6b7c8d";

  const buildPayloadV1 = () => ({
    case_id: caseId || "NCRP-2026-480912",
    fir_number: firNumber,
    investigating_officer: `${ioName} (Belt No: ${beltNo})`,
    police_station: policeStation,
    exchange_name: targetVasp,
    compliance_email: nodalEmail,
    frozen_addresses: [targetDepositWallet],
    transaction_hashes: [
      "0xabc480dcx9923eef108745671239847120398417230498172039481230498123",
    ],
    victim_amount_inr: Number(victimAmountInr) || 480000.0,
    narrative:
      brief?.narrative ||
      "Automated multi-hop fraud proceeds traced and consolidated into target exchange deposit wallet under Golden Hour Protocol.",
  });

  const buildPayloadV2 = () => ({
    case_id: caseId || "NCRP-2026-480912",
    fir_number: firNumber,
    ncrp_ack_number: ncrpAckNumber,
    investigating_officer: `${ioName} (Belt No: ${beltNo})`,
    police_station: policeStation,
    exchange_name: targetVasp,
    compliance_email: nodalEmail,
    frozen_addresses: [targetDepositWallet],
    transaction_hashes: [
      "0xabc480dcx9923eef108745671239847120398417230498172039481230498123",
    ],
    victim_amount_inr: Number(victimAmountInr) || 480000.0,
    narrative:
      brief?.narrative ||
      "Automated multi-hop fraud proceeds traced and consolidated into target exchange deposit wallet under Golden Hour Protocol.",
    fraud_date_ddmmyyyy: "09-09-2026",
    primary_token_symbol: currentChain === "BTC" ? "BTC" : "USDT",
  });

  useEffect(() => {
    if (!isOpen) return;
    const fetchNotice = async () => {
      try {
        const payload = buildPayloadV1();
        const res = await generateFreezeNoticeText(payload);
        if (res?.notice_text) setNoticeText(res.notice_text);
        if (res?.evidence_digest_sha256) setEvidenceSeal(res.evidence_digest_sha256);
      } catch (err) {
        console.warn("Could not fetch structured notice text:", err);
      }
    };
    fetchNotice();
  }, [isOpen, targetVasp, firNumber, ioName, victimAmountInr, targetDepositWallet]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(nodalEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyNoticeText = () => {
    if (!noticeText) return;
    navigator.clipboard.writeText(noticeText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  const handleDownloadPdfV2 = async () => {
    setDownloading(true);
    try {
      const payload = buildPayloadV2();
      const blob = await generateFreezeNoticeV2(payload);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Section_94_BNSS_Directive_${targetVasp}_${caseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("Failed to generate PDF v2:", err);
      // Fallback to v1
      try {
        const payload = buildPayloadV1();
        const blob = await generateFreezeNotice(payload);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Section_94_BNSS_Directive_${targetVasp}_${caseId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } catch (err2) {
        alert("Failed to render PDF: " + err2.message);
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#091525] border border-[#223247] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#07111F] p-5 border-b border-[#223247] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00AEEF]/10 border border-[#00AEEF]/30 flex items-center justify-center text-[#00AEEF]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F5F7FA]">
                  STATUTORY ASSET FREEZING & PRESERVATION DIRECTIVE
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#00AEEF]/10 text-[#00AEEF] border border-[#00AEEF]/30 text-[10px] font-mono font-bold">
                  {statutoryMode === "BNSS_94" ? "Sec. 94 BNSS, 2023" : "Sec. 91 CrPC (Legacy)"}
                </span>
              </div>
              <p className="text-xs text-[#AAB7C7] font-mono mt-0.5">
                Digitally Integrity-Sealed Forensic Evidence Package — For Legal Review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#122238] text-[#AAB7C7] hover:text-[#F5F7FA] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form and Preview Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Statutory Provision Switcher */}
          <div className="flex items-center justify-between bg-[#07111F] p-3 rounded-xl border border-[#223247] text-xs font-mono">
            <span className="text-[#AAB7C7]">Applicable Statutory Framework:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatutoryMode("BNSS_94")}
                className={`px-3 py-1 rounded-lg transition font-semibold cursor-pointer ${
                  statutoryMode === "BNSS_94"
                    ? "bg-[#00AEEF] text-[#07111F] shadow-sm"
                    : "bg-[#0E1B2D] text-[#AAB7C7] hover:text-[#F5F7FA]"
                }`}
              >
                Section 94 BNSS, 2023 (Active)
              </button>
              <button
                type="button"
                onClick={() => setStatutoryMode("CRPC_91")}
                className={`px-3 py-1 rounded-lg transition font-semibold cursor-pointer ${
                  statutoryMode === "CRPC_91"
                    ? "bg-[#00AEEF] text-[#07111F] shadow-sm"
                    : "bg-[#0E1B2D] text-[#AAB7C7] hover:text-[#F5F7FA]"
                }`}
              >
                Section 91 CrPC (Legacy Proceeding)
              </button>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[#AAB7C7] block mb-1 font-mono">FIR / Diary Number</label>
              <input
                type="text"
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
                className="w-full bg-[#07111F] border border-[#223247] rounded-lg px-3 py-2 text-[#F5F7FA] font-mono text-xs focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
            <div>
              <label className="text-[#AAB7C7] block mb-1 font-mono">NCRP Ack. Number</label>
              <input
                type="text"
                value={ncrpAckNumber}
                onChange={(e) => setNcrpAckNumber(e.target.value)}
                className="w-full bg-[#07111F] border border-[#223247] rounded-lg px-3 py-2 text-[#F5F7FA] font-mono text-xs focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
            <div>
              <label className="text-[#AAB7C7] block mb-1 font-mono">Fraud Amount (INR)</label>
              <input
                type="number"
                value={victimAmountInr}
                onChange={(e) => setVictimAmountInr(e.target.value)}
                className="w-full bg-[#07111F] border border-[#223247] rounded-lg px-3 py-2 text-[#4ADE80] font-mono text-xs focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
            <div>
              <label className="text-[#AAB7C7] block mb-1 font-mono">Investigating Officer</label>
              <input
                type="text"
                value={ioName}
                onChange={(e) => setIoName(e.target.value)}
                className="w-full bg-[#07111F] border border-[#223247] rounded-lg px-3 py-2 text-[#F5F7FA] text-xs focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
            <div>
              <label className="text-[#AAB7C7] block mb-1 font-mono">Belt / Rank Number</label>
              <input
                type="text"
                value={beltNo}
                onChange={(e) => setBeltNo(e.target.value)}
                className="w-full bg-[#07111F] border border-[#223247] rounded-lg px-3 py-2 text-[#F5F7FA] font-mono text-xs focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
            <div>
              <label className="text-[#AAB7C7] block mb-1 font-mono">Police Station / Unit</label>
              <input
                type="text"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                className="w-full bg-[#07111F] border border-[#223247] rounded-lg px-3 py-2 text-[#F5F7FA] text-xs focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
          </div>

          {/* VASP Compliance Nodal Destination Card */}
          <div className="bg-[#0E1B2D] border border-[#223247] p-3.5 rounded-xl flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#00AEEF]" />
                <span className="font-bold text-[#F5F7FA]">{targetVasp} Nodal Compliance Office</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF8A00]/10 text-[#FFB04D] border border-[#FF8A00]/30 font-mono">
                  SLA: 2 Hours
                </span>
              </div>
              <div className="font-mono text-[#AAB7C7] text-[11px] mt-1">
                Designated Email: <span className="text-[#F5F7FA]">{nodalEmail}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3 py-1.5 bg-[#07111F] hover:bg-[#122238] border border-[#223247] text-[#AAB7C7] hover:text-[#F5F7FA] rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
            </button>
          </div>

          {/* Live Draft Notice Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs text-[#AAB7C7] font-mono">
              <span>STATUTORY REQUISITION NOTICE DRAFT</span>
              <button
                type="button"
                onClick={handleCopyNoticeText}
                className="text-[#00AEEF] hover:text-[#19B5FE] flex items-center gap-1 cursor-pointer"
              >
                {copiedNotice ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNotice ? "Notice Copied" : "Copy Notice Text"}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#07111F] border border-[#223247] rounded-xl font-mono text-[11px] text-[#AAB7C7] max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
              {noticeText || "Loading structured Section 94 BNSS statutory directive..."}
            </pre>
          </div>

          {/* Section 63 BSA Evidence Seal */}
          {evidenceSeal && (
            <div className="p-3 bg-[#0E1B2D] border border-[#223247] rounded-xl flex items-center justify-between text-xs font-mono text-[#4ADE80]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
                Section 63 BSA Digital Seal: {evidenceSeal.slice(0, 24)}…
              </span>
              <span className="text-[10px] text-[#4ADE80] font-bold">INTEGRITY SEALED</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#07111F] p-4 border-t border-[#223247] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#0E1B2D] hover:bg-[#122238] border border-[#223247] text-[#AAB7C7] hover:text-[#F5F7FA] rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownloadPdfV2}
            disabled={downloading}
            className="px-5 py-2 bg-[#00AEEF] hover:bg-[#19B5FE] text-[#07111F] rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? "Generating Certified Notice..." : "Generate Section 94 BNSS PDF (v2)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

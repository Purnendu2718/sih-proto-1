import React, { useState } from "react";
import { generateFreezeNotice } from "../api";
import ProvenanceBadge from "./ProvenanceBadge";

const TYPE_CONFIG = {
  victim: { label: "Victim Reported", bg: "#450a0a", text: "#f87171", border: "#b91c1c" },
  mule: { label: "Mule / Layering Hop", bg: "#431407", text: "#fb923c", border: "#c2410c" },
  exchange_deposit: { label: "Exchange Deposit Wallet", bg: "#082f49", text: "#38bdf8", border: "#0369a1" },
  exchange_hotwallet: { label: "Exchange Hot Wallet", bg: "#3b0764", text: "#c084fc", border: "#7e22ce" },
  unknown: { label: "Unlabelled Address", bg: "#1e293b", text: "#94a3b8", border: "#475569" },
};

export default function NodeInspector({ selectedNode, traceMeta, currentChain }) {
  const [downloading, setDownloading] = useState(false);
  const [noticeResult, setNoticeResult] = useState(null);

  if (!selectedNode) {
    return (
      <div style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "8px", border: "1px dashed var(--border-light)", color: "var(--text-muted)", fontSize: "12px", textAlign: "center" }}>
        Tap any node on the graph topology to inspect forensic attribution & evidence.
      </div>
    );
  }

  const typeMeta = TYPE_CONFIG[selectedNode.type] || TYPE_CONFIG.unknown;
  const isExchange = selectedNode.type === "exchange_deposit" || selectedNode.type === "exchange_hotwallet";
  const nodeProvenance = selectedNode.provenance || (selectedNode.type === "victim" || isExchange ? "offchain_verified" : "automated_clustering");

  const handleDownloadNotice = async () => {
    setDownloading(true);
    try {
      const exchangeName = selectedNode.label.includes("CoinDCX") ? "CoinDCX" : "Binance";
      const complianceEmail = selectedNode.label.includes("CoinDCX") ? "compliance@coindcx.com" : "compliance@binance.com";
      const payload = {
        case_id: "CASE-2026-SIH-981",
        fir_number: "FIR/CYBER/2026/0402",
        investigating_officer: "Inspector Vikram Rathore",
        police_station: "Cyber Crime Police Station, Central Command",
        exchange_name: exchangeName,
        compliance_email: complianceEmail,
        frozen_addresses: [selectedNode.id],
        transaction_hashes: [
          "0x8f2d9c1b4e6a7350129fec8714b35029e8471c039581a62048fbc927160359da",
          "0x4e9c7a2b1f8d3056238ab9102c74819d65203fa189c2547b91238475920148ab"
        ],
        victim_amount_inr: 450000.0,
        narrative: `Trace forward from victim reported address identified fraudulent funds routed into suspect account at ${exchangeName} within Golden Hour window.`
      };
      const blob = await generateFreezeNotice(payload);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Section_94_BNSS_Notice_${exchangeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setNoticeResult("Generated & Sealed PDF successfully downloaded!");
    } catch (err) {
      console.error(err);
      setNoticeResult("Error generating notice: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "12px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "var(--text-muted)" }}>
          Forensic Inspection
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ProvenanceBadge provenance={nodeProvenance} size="xs" />
          <span
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "12px",
              background: typeMeta.bg,
              color: typeMeta.text,
              border: `1px solid ${typeMeta.border}`,
              fontWeight: 500,
            }}
          >
            {typeMeta.label}
          </span>
        </div>
      </div>

      <div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
          {selectedNode.label}
        </div>
        <div style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--accent-cyan)", wordBreak: "break-all" }}>
          {selectedNode.id}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "11px" }}>
        <div style={{ padding: "6px 8px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
          <div style={{ color: "var(--text-muted)" }}>Network</div>
          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{currentChain}</div>
        </div>
        <div style={{ padding: "6px 8px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
          <div style={{ color: "var(--text-muted)" }}>Status</div>
          <div style={{ fontWeight: 600, color: isExchange ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
            {isExchange ? "VASP TARGET HIT" : "INTERMEDIARY"}
          </div>
        </div>
      </div>

      {isExchange && (
        <div style={{ marginTop: "4px" }}>
          <button
            type="button"
            onClick={handleDownloadNotice}
            disabled={downloading}
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "var(--accent-rose)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            {downloading ? "Sealing Evidence..." : "📜 Issue Sec 94 BNSS Freeze Notice (PDF)"}
          </button>
          {noticeResult && (
            <div style={{ fontSize: "11px", color: "var(--accent-emerald)", marginTop: "6px", textAlign: "center" }}>
              {noticeResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

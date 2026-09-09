import React from "react";
import { BrainCircuit, Clock, ShieldAlert, ArrowRight, FileCheck, Landmark } from "lucide-react";

export default function TypologyCard({ brief, onOpenNoticeModal }) {
  if (!brief) return null;

  return (
    <div
      style={{
        margin: "8px 18px",
        padding: "12px 16px",
        background: "linear-gradient(135deg, #171B22 0%, #1A2230 50%, #0E2238 100%)",
        border: "1px solid #2A3B55",
        borderRadius: "8px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "12px",
        color: "#E6E9EF",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        {/* Left: Modus Operandi & Typology Badges */}
        <div style={{ flex: "1 1 600px", minWidth: "280px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#5AC8FA", fontWeight: 700 }}>
              <BrainCircuit size={15} color="#5AC8FA" />
              <span style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "11px" }}>
                Forensic Typology Analysis
              </span>
            </div>

            <span
              style={{
                backgroundColor: "#F5A62322",
                color: "#F5A623",
                border: "1px solid #F5A62366",
                padding: "1px 7px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "10.5px",
              }}
            >
              {brief.typology}
            </span>

            <span
              style={{
                backgroundColor: "#34D39915",
                color: "#34D399",
                border: "1px solid #34D39944",
                padding: "1px 6px",
                borderRadius: "10px",
                fontSize: "10px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Clock size={10} />
              <span>{brief.time_to_exchange_mins} mins to CEX off-ramp</span>
            </span>

            <span
              style={{
                backgroundColor: "#2A2F3A",
                color: "#9AA3B2",
                padding: "1px 6px",
                borderRadius: "10px",
                fontSize: "10px",
              }}
            >
              {brief.intermediary_mules_count} intermediary mule layer(s)
            </span>
          </div>

          {/* Plain-English Modus Operandi Narrative */}
          <p style={{ margin: "0 0 6px 0", color: "#D1D5DB", lineHeight: 1.5, fontSize: "12px" }}>
            {brief.narrative}
          </p>

          {/* Police Intervention Recommendation */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F5A623", fontSize: "11px" }}>
            <ShieldAlert size={13} color="#F5A623" style={{ shrink: 0 }} />
            <span>
              <strong>Immediate Police Intervention:</strong> {brief.recommended_legal_action}
            </span>
          </div>
        </div>

        {/* Right: Target VASP & Sec 94 BNSS Action */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", shrink: 0 }}>
          <div
            style={{
              textAlign: "right",
              backgroundColor: "#0E1116",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #2A2F3A",
            }}
          >
            <div style={{ fontSize: "10px", color: "#9AA3B2", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
              <Landmark size={11} color="#5AC8FA" />
              <span>Attributed Destination VASP</span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#5AC8FA", marginTop: "1px" }}>
              {brief.identified_vasp}
            </div>
          </div>

          <button
            onClick={onOpenNoticeModal}
            style={{
              backgroundColor: "#E5484D",
              border: "none",
              borderRadius: "6px",
              padding: "8px 14px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 10px rgba(229, 72, 77, 0.4)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F2555A")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E5484D")}
          >
            <span>Draft Sec 94 BNSS Requisition</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function TraceControls({
  startAddress,
  setStartAddress,
  chain,
  setChain,
  maxHops,
  setMaxHops,
  dataMode,
  setDataMode,
  onTrace,
  loading,
  onSelectPreset,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
          Demo Scenarios
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          <button
            type="button"
            onClick={() => onSelectPreset("TRON")}
            style={{
              padding: "6px 8px",
              fontSize: "11px",
              backgroundColor: chain === "TRON" ? "#0284c7" : "var(--bg-card)",
              color: "#fff",
              border: "1px solid var(--border-light)",
            }}
          >
            ⚡ TRON Task Scam
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset("EVM")}
            style={{
              padding: "6px 8px",
              fontSize: "11px",
              backgroundColor: chain === "EVM" ? "#7c3aed" : "var(--bg-card)",
              color: "#fff",
              border: "1px solid var(--border-light)",
            }}
          >
            💎 EVM Pig-Butcher
          </button>
        </div>
      </div>

      <div>
        <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
          Suspect Wallet Address
        </label>
        <input
          value={startAddress}
          onChange={(e) => setStartAddress(e.target.value)}
          placeholder="Victim-reported address"
          style={{ width: "100%", fontSize: "12px", fontFamily: "monospace" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div>
          <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
            Network Chain
          </label>
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            style={{ width: "100%", fontSize: "12px" }}
          >
            <option value="TRON">TRON (TRC-20)</option>
            <option value="EVM">EVM (ETH/BSC/Polygon)</option>
            <option value="BTC">Bitcoin (UTXO)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
            Max Hops
          </label>
          <input
            type="number"
            min="1"
            max="8"
            value={maxHops}
            onChange={(e) => setMaxHops(Number(e.target.value))}
            style={{ width: "100%", fontSize: "12px" }}
          />
        </div>
      </div>

      <button
        type="button"
        disabled={loading || !startAddress}
        onClick={onTrace}
        style={{
          marginTop: "4px",
          padding: "10px",
          backgroundColor: loading ? "var(--bg-card-hover)" : "var(--accent-cyan)",
          color: loading ? "var(--text-muted)" : "#0f172a",
          fontWeight: 600,
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {loading ? "Tracing BFS Core..." : "🚀 Trace Forward to Exchange"}
      </button>
    </div>
  );
}

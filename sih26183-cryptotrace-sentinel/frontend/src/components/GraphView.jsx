import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

const NODE_COLORS = {
  victim: "#ef4444",           // Crimson
  mule: "#f59e0b",             // Amber
  peel_outlet: "#64748b",      // Slate Grey
  exchange_deposit: "#0284c7",  // Ocean Blue
  exchange_hotwallet: "#9333ea"// Royal Purple
};

export default function GraphView({
  graph,
  minAmount = 0,
  selectedToken = "ALL",
  layoutName = "breadthfirst",
  onNodeSelect,
  cyRefOut,
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!graph || !containerRef.current) return;

    // Filter edges by token and min threshold
    const filteredEdges = graph.edges.filter((e) => {
      const matchToken = selectedToken === "ALL" || e.token === selectedToken;
      const matchAmount = e.amount >= minAmount;
      return matchToken && matchAmount;
    });

    const activeNodeIds = new Set();
    filteredEdges.forEach((e) => {
      activeNodeIds.add(e.source);
      activeNodeIds.add(e.target);
    });

    const filteredNodes = graph.nodes.filter(
      (n) => activeNodeIds.has(n.id) || n.node_type === "victim"
    );

    const elements = [
      ...filteredNodes.map((n) => ({
        data: {
          id: n.id,
          label: `${n.label}\n${n.id.slice(0, 6)}...${n.id.slice(-4)}`,
          full_address: n.id,
          type: n.node_type,
          role_tag: n.role_tag,
          risk_score: n.risk_score,
          is_primary: n.is_on_primary_path ? 1 : 0,
        },
      })),
      ...filteredEdges.map((e, idx) => ({
        data: {
          id: `e_${idx}`,
          source: e.source,
          target: e.target,
          label: `${e.token} $${e.amount.toLocaleString()}\n${e.time_str}`,
          amount: e.amount,
          token: e.token,
          tx_hash: e.tx_hash,
          is_primary: e.is_primary ? 1 : 0,
          velocity_mins: e.velocity_mins,
        },
      })),
    ];

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        // Default Node Style (Card Pill)
        {
          selector: "node",
          style: {
            shape: "round-rectangle",
            width: 140,
            height: 48,
            "background-color": "#0f172a",
            "border-width": 2,
            "border-color": (ele) => NODE_COLORS[ele.data("type")] || "#475569",
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
            "font-size": 10,
            "font-family": "JetBrains Mono, monospace",
            color: "#f8fafc",
            "text-outline-width": 2,
            "text-outline-color": "#090d16",
          },
        },
        // Highlighted Primary Path Nodes
        {
          selector: "node[is_primary = 1]",
          style: {
            "border-width": 3,
            "shadow-blur": 12,
            "shadow-color": (ele) => NODE_COLORS[ele.data("type")],
            "shadow-opacity": 0.8,
          },
        },
        // Default Edge Style
        {
          selector: "edge",
          style: {
            width: 2,
            "curve-style": "bezier",
            "control-point-step-size": 40,
            "line-color": "#334155",
            "target-arrow-color": "#475569",
            "target-arrow-shape": "triangle",
            "arrow-scale": 1.2,
            label: "data(label)",
            "text-wrap": "wrap",
            "font-size": 9,
            "font-family": "JetBrains Mono, monospace",
            color: "#94a3b8",
            "text-background-color": "#090d16",
            "text-background-opacity": 0.85,
            "text-background-padding": 3,
            "text-background-shape": "roundrectangle",
            "text-border-color": "#1e293b",
            "text-border-width": 1,
            "text-border-opacity": 0.8,
          },
        },
        // Active Primary Laundering Conduit (Glowing Cyan / Amber)
        {
          selector: "edge[is_primary = 1]",
          style: {
            width: 3.5,
            "line-color": "#06b6d4",
            "target-arrow-color": "#06b6d4",
            "line-style": "solid",
            color: "#38bdf8",
            "font-weight": "bold",
            "shadow-blur": 8,
            "shadow-color": "#0891b2",
            "shadow-opacity": 0.7,
          },
        },
      ],
      layout: {
        name: layoutName,
        directed: true,
        padding: 50,
        spacingFactor: 1.4,
      },
    });

    if (cyRefOut) {
      cyRefOut.current = cyRef.current;
    }

    cyRef.current.on("tap", "node", (evt) => {
      onNodeSelect?.({ kind: "node", data: evt.target.data() });
    });

    cyRef.current.on("tap", "edge", (evt) => {
      onNodeSelect?.({ kind: "edge", data: evt.target.data() });
    });

    return () => cyRef.current?.destroy();
  }, [graph, minAmount, selectedToken, layoutName, onNodeSelect]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#070a11] relative overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
  );
}

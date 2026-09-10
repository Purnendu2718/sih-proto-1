import { useEffect, useRef, useCallback } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

cytoscape.use(dagre);

const NODE_TYPE_COLORS = {
  origin: "#10b981",
  mule: "#f59e0b",
  mixer_bridge: "#dc2626",
  cex: "#2563eb",
  unknown: "#6b7280",
};

const LAYOUTS = {
  dag: { name: "dagre", rankDir: "LR", nodeSep: 40, rankSep: 90, animate: true },
  radial: { name: "concentric", concentric: (n) => n.degree(), levelWidth: () => 2, animate: true },
  force: { name: "cose", animate: true, nodeRepulsion: 8000, idealEdgeLength: 120 },
};

export default function GraphCanvas({ graph, layoutName = "dag", filters, onNodeSelect, onEdgeSelect, onExpandNode, cyApiRef }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const animRef = useRef(null);

  const applyFilters = useCallback((cy) => {
    if (!cy) return;
    cy.edges().forEach((edge) => {
      let visible = true;
      if (filters?.minUsd != null && (edge.data("usd_value") ?? 0) < filters.minUsd) visible = false;
      if (filters?.token && filters.token !== "ALL" && edge.data("token_symbol") !== filters.token) visible = false;
      if (filters?.startTs && edge.data("timestamp_utc") < filters.startTs) visible = false;
      if (filters?.endTs && edge.data("timestamp_utc") > filters.endTs) visible = false;
      edge.style("display", visible ? "element" : "none");
    });
  }, [filters]);

  useEffect(() => {
    if (!graph || !containerRef.current) return;

    const elements = [
      ...graph.nodes.map((n) => ({ data: { id: n.id, label: n.display_label, type: n.node_type, chain: n.chain } })),
      ...graph.edges.map((e) => ({
        data: {
          id: `${e.tx_hash}-${e.source}-${e.target}`,
          source: e.source, target: e.target,
          token_symbol: e.token_symbol, amount: e.amount, usd_value: e.usd_value,
          timestamp_utc: e.timestamp_utc, tx_hash: e.tx_hash,
          label: `${e.token_symbol} ${e.amount.toLocaleString()}${e.usd_value ? " ($" + e.usd_value.toLocaleString() + ")" : ""}`,
          highValue: (e.usd_value ?? 0) >= 10000,
        },
        classes: e.is_likely_change ? "change-edge" : "",
      })),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": (ele) => NODE_TYPE_COLORS[ele.data("type")] || NODE_TYPE_COLORS.unknown,
            label: "data(label)", "font-size": 10, color: "#f9fafb",
            "text-outline-width": 2, "text-outline-color": "#111827",
            width: 34, height: 34, "border-width": 2, "border-color": "#1f2937",
          },
        },
        {
          selector: "edge",
          style: {
            width: 2, "line-color": "#4b5563", "target-arrow-color": "#4b5563",
            "target-arrow-shape": "triangle", "curve-style": "bezier",
            label: "data(label)", "font-size": 8, color: "#d1d5db",
            "text-background-color": "#111827", "text-background-opacity": 0.85, "text-background-padding": 2,
          },
        },
        { selector: "edge.change-edge", style: { "line-style": "dashed", "line-color": "#9ca3af" } },
        { selector: "edge[?highValue]", style: { "line-color": "#facc15", "target-arrow-color": "#facc15", "line-style": "dashed", width: 3 } },
        { selector: "node:selected", style: { "border-color": "#f9fafb", "border-width": 3 } },
      ],
      layout: LAYOUTS[layoutName] || LAYOUTS.dag,
      wheelSensitivity: 0.3,
    });

    cy.on("tap", "node", (evt) => onNodeSelect?.(evt.target.data()));
    cy.on("tap", "edge", (evt) => onEdgeSelect?.(evt.target.data()));
    cy.on("dbltap", "node", (evt) => onExpandNode?.(evt.target.data("id")));

    let offset = 0;
    const animate = () => {
      offset = (offset + 1) % 20;
      cy.edges("[?highValue]").style("line-dash-offset", -offset);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    applyFilters(cy);
    cyRef.current = cy;
    if (cyApiRef) cyApiRef.current = cy;

    return () => {
      cancelAnimationFrame(animRef.current);
      cy.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, layoutName]);

  useEffect(() => { applyFilters(cyRef.current); }, [filters, applyFilters]);

  return <div ref={containerRef} className="w-full h-full bg-gray-900" />;
}

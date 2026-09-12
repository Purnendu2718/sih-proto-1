import React, { useEffect, useRef, useCallback } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

cytoscape.use(dagre);

// 1. STRICT LEFT-TO-RIGHT DAGRE CONFIGURATION
const DAGRE_OPTIONS = {
  name: "dagre",
  rankDir: "LR",              // Strict Left-to-Right layout
  align: "DR",                // Align along dominant flow
  nodeSep: 45,                // Vertical separation between branching peel nodes
  rankSep: 90,                // Horizontal distance between consecutive hops
  edgeWeight: function (edge) {
    // Heavily weight core-path edges so main highway stays in a dead-straight horizontal line
    return edge.data("isCorePath") ? 100 : 1;
  },
  animate: true,
  animationDuration: 400,
};

const LAYOUTS = {
  dagre: DAGRE_OPTIONS,
  concentric: {
    name: "concentric",
    concentric: (n) => (n.data("isCorePath") ? 10 : n.degree()),
    levelWidth: () => 2,
    animate: true,
  },
  cose: {
    name: "cose",
    animate: true,
    nodeRepulsion: 9000,
    idealEdgeLength: 130,
  },
};

export default function GraphCanvas({
  graph,
  layoutName = "dagre",
  viewMode = "predictive", // "predictive" | "all"
  filters,
  onNodeSelect,
  onEdgeSelect,
  onExpandNode,
  cyApiRef,
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  // Apply filters and dual-view visibility
  const applyViewModeAndFilters = useCallback(
    (cy) => {
      if (!cy) return;

      cy.batch(() => {
        // Mode A: Most Predictive Web vs Mode B: Show All Webs
        if (viewMode === "predictive") {
          // Display only nodes and edges where isCorePath === true
          cy.elements().forEach((ele) => {
            const isCore = ele.data("isCorePath");
            if (isCore) {
              ele.show();
            } else {
              ele.hide();
            }
          });
        } else {
          // Show all nodes and edges
          cy.elements().show();
        }

        // Apply any user filter overrides (min USD, token, etc.)
        if (filters) {
          cy.edges(":visible").forEach((edge) => {
            let visible = true;
            if (filters.minUsd != null && (edge.data("usd_value") ?? 0) < filters.minUsd) visible = false;
            if (filters.token && filters.token !== "ALL" && edge.data("token_symbol") !== filters.token) visible = false;
            if (filters.startTs && edge.data("timestamp_utc") < filters.startTs) visible = false;
            if (filters.endTs && edge.data("timestamp_utc") > filters.endTs) visible = false;
            if (!visible) edge.hide();
          });
        }
      });

      // Re-run layout to ensure clean alignment
      const activeLayout = layoutName === "dagre" ? DAGRE_OPTIONS : (LAYOUTS[layoutName] || DAGRE_OPTIONS);
      cy.layout(activeLayout).run();
      cy.fit(null, 40);
    },
    [viewMode, layoutName, filters]
  );

  useEffect(() => {
    if (!graph || !containerRef.current) return;

    // Transform Nodes & Edges to match the approved 2-line role-based visual format
    const elements = [
      ...graph.nodes.map((n) => {
        const isCore = n.is_core_path ?? n.isCorePath ?? (n.node_type !== "peel_dust" && n.node_type !== "gas_fee");
        let nodeType = n.node_type || "mule";
        let roleHeader = n.role_header || n.roleHeader;

        if (!roleHeader) {
          if (nodeType === "origin" || n.is_victim) roleHeader = "Victim Reported Wallet";
          else if (nodeType === "cex" || nodeType === "cex_deposit" || n.cex_role === "deposit") roleHeader = `${n.exchange_name || "CoinDCX"} User Deposit`;
          else if (nodeType === "cex_hotwallet" || n.cex_role === "hotwallet") roleHeader = `${n.exchange_name || "CoinDCX"} Hot Wallet`;
          else if (nodeType === "peel_dust") roleHeader = "Peel Decoy Dust";
          else if (nodeType === "gas_fee") roleHeader = "Gas Energy Inbound";
          else roleHeader = `[Mule] ${n.id.slice(0, 8)}`;
        }

        const truncated = n.truncated_address || (n.id.length > 14 ? `${n.id.slice(0, 6)}...${n.id.slice(-4)}` : n.id);
        const label = `[${roleHeader}]\n${truncated}`;

        return {
          data: {
            id: n.id,
            label,
            roleHeader,
            truncatedAddress: truncated,
            fullAddress: n.id,
            nodeType,
            isCorePath: isCore,
            chain: n.chain || "TRON",
            balance: n.balance || "0.00 USDT",
            taint: n.taint || (isCore ? "98.4%" : "12.0%"),
            inflow: n.inflow || "14,850 USDT",
            outflow: n.outflow || "14,800 USDT",
            exchange: n.exchange_name,
          },
          classes: [
            isCore ? "core-node" : "branch-node",
            `type-${nodeType}`,
          ].join(" "),
        };
      }),

      ...graph.edges.map((e) => {
        const isCore = e.is_core_path ?? e.isCorePath ?? (e.token_symbol !== "TRX" && (e.amount ?? 0) >= 100);
        const amtText = e.token_symbol ? `${e.token_symbol} ${Number(e.amount || 0).toLocaleString()}` : (e.label || "USDT");

        return {
          data: {
            id: e.id || `${e.tx_hash || "tx"}-${e.source}-${e.target}`,
            source: e.source,
            target: e.target,
            label: amtText,
            amount: e.amount || 0,
            token_symbol: e.token_symbol || "USDT",
            usd_value: e.usd_value,
            timestamp_utc: e.timestamp_utc,
            tx_hash: e.tx_hash,
            isCorePath: isCore,
          },
          classes: isCore ? "core-edge" : "branch-edge",
        };
      }),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        // BASE NODE STYLING: Clean Rounded Rectangle, #07111f Fill, 2-line Centered Text
        {
          selector: "node",
          style: {
            shape: "round-rectangle",
            "background-color": "#07111f",
            width: 150,
            height: 48,
            "border-width": 2,
            "border-color": "#334155",
            label: "data(label)",
            "text-wrap": "wrap",
            "text-max-width": 140,
            "text-valign": "center",
            "text-halign": "center",
            "font-size": 10,
            "font-family": "Inter, sans-serif",
            "font-weight": 600,
            color: "#ffffff",
            "transition-property": "background-color, border-color, width, height, shadow-blur",
            "transition-duration": "0.2s",
          },
        },

        // 1. VICTIM / ORIGIN NODE: 2px solid #10b981 (Emerald)
        {
          selector: "node.type-origin, node[nodeType = 'origin']",
          style: {
            "border-color": "#10b981",
            "border-width": 2.2,
            color: "#ffffff",
          },
        },

        // 2. MULE / LAYERING NODES (CORE PATH): 2px solid #f59e0b (Amber / Orange)
        {
          selector: "node.type-mule, node[nodeType = 'mule']",
          style: {
            "border-color": "#f59e0b",
            "border-width": 2,
            color: "#ffffff",
          },
        },

        // 3. CEX USER DEPOSIT NODE: 2px solid #06b6d4 (Cyan)
        {
          selector: "node.type-cex_deposit, node[nodeType = 'cex_deposit'], node[nodeType = 'cex']",
          style: {
            "border-color": "#06b6d4",
            "border-width": 2.2,
            color: "#ffffff",
          },
        },

        // 4. CEX MASTER HOT WALLET NODE: 2px solid #3b82f6 (Royal Blue)
        {
          selector: "node.type-cex_hotwallet, node[nodeType = 'cex_hotwallet']",
          style: {
            "border-color": "#3b82f6",
            "border-width": 2.2,
            color: "#ffffff",
          },
        },

        // 5. PEEL DUST / DECOY NODES: 1.5px dashed #475569, #94a3b8 text, smaller box
        {
          selector: "node.type-peel_dust, node[nodeType = 'peel_dust']",
          style: {
            "border-color": "#475569",
            "border-style": "dashed",
            "border-width": 1.5,
            width: 115,
            height: 38,
            "font-size": 9,
            color: "#94a3b8",
          },
        },

        // 6. GAS / ENERGY / INBOUND NODES: 1.5px solid #0284c7 (Subdued Sky Blue)
        {
          selector: "node.type-gas_fee, node[nodeType = 'gas_fee']",
          style: {
            "border-color": "#0284c7",
            "border-width": 1.5,
            width: 130,
            height: 40,
            "font-size": 9,
            color: "#93c5fd",
          },
        },

        // SELECTED NODE HIGHLIGHT
        {
          selector: "node:selected",
          style: {
            "border-color": "#00F0FF",
            "border-width": 3.5,
            "shadow-blur": 16,
            "shadow-color": "#00F0FF",
            "shadow-opacity": 0.85,
          },
        },

        // CORE PATH EDGES (THE HIGHWAY): 3px Vibrant Emerald Green #10b981
        {
          selector: "edge.core-edge, edge[?isCorePath]",
          style: {
            width: 3,
            "line-color": "#10b981",
            "target-arrow-color": "#10b981",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": 10,
            "font-family": "JetBrains Mono, monospace",
            "font-weight": 700,
            color: "#10b981",
            "text-background-color": "#07111f",
            "text-background-opacity": 0.95,
            "text-background-padding": 3,
            "text-border-color": "#10b981",
            "text-border-width": 1,
            "text-border-opacity": 0.5,
          },
        },

        // DECOY / PEEL DUST EDGES: 1.2px Muted Dark Slate #334155, 9px #64748b Text
        {
          selector: "edge.branch-edge, edge[!isCorePath]",
          style: {
            width: 1.2,
            "line-color": "#334155",
            "target-arrow-color": "#475569",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": 9,
            "font-family": "JetBrains Mono, monospace",
            color: "#64748b",
            "text-background-color": "#07111f",
            "text-background-opacity": 0.85,
            "text-background-padding": 2,
          },
        },

        // SELECTED EDGE
        {
          selector: "edge:selected",
          style: {
            "line-color": "#00F0FF",
            "target-arrow-color": "#00F0FF",
            width: 3.5,
          },
        },
      ],
      layout: DAGRE_OPTIONS,
      wheelSensitivity: 0.3,
    });

    // Interaction Events
    cy.on("tap", "node", (evt) => onNodeSelect?.(evt.target.data()));
    cy.on("tap", "edge", (evt) => onEdgeSelect?.(evt.target.data()));
    cy.on("dbltap", "node", (evt) => onExpandNode?.(evt.target.data("id")));

    cyRef.current = cy;
    if (cyApiRef) cyApiRef.current = cy;

    applyViewModeAndFilters(cy);

    return () => {
      cy.destroy();
    };
  }, [graph, onNodeSelect, onEdgeSelect, onExpandNode, cyApiRef]);

  // React to viewMode or layout changes
  useEffect(() => {
    applyViewModeAndFilters(cyRef.current);
  }, [viewMode, layoutName, applyViewModeAndFilters]);

  return <div ref={containerRef} className="w-full h-full bg-[#08080a]" />;
}

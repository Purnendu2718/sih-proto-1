import { useState, useRef, useCallback } from "react";
import GraphCanvas from "./components/GraphCanvas";
import FilterToolbar from "./components/FilterToolbar";
import ForensicDrawer from "./components/ForensicDrawer";
import GoldenHourTimer from "./components/GoldenHourTimer";
import FreezeNoticeForm from "./components/FreezeNoticeForm";
import { searchQuery, expandNode, startTrace, getTraceGraph, autoInvestigate } from "./api";

const SAMPLE_CASES = [
  { label: "Task Scam (TRON/USDT)", address: "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX", chain: "TRON" },
  { label: "Investment Scam (EVM/USDT)", address: "0xVictim0000000000000000000000000000001", chain: "EVM" },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [transfers, setTransfers] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [layoutName, setLayoutName] = useState("dag");
  const [filters, setFilters] = useState({ minUsd: 0, token: "ALL" });
  const [fallback, setFallback] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [showFreezeForm, setShowFreezeForm] = useState(false);
  const cyApiRef = useRef(null);

  const mergeGraph = useCallback((incoming) => {
    setGraph((prev) => {
      const nodeMap = new Map(prev.nodes.map((n) => [n.id, n]));
      incoming.nodes.forEach((n) => nodeMap.set(n.id, n));
      const edgeKey = (e) => `${e.tx_hash}-${e.source}-${e.target}`;
      const edgeMap = new Map(prev.edges.map((e) => [edgeKey(e), e]));
      incoming.edges.forEach((e) => edgeMap.set(edgeKey(e), e));
      return { nodes: [...nodeMap.values()], edges: [...edgeMap.values()] };
    });
    setTransfers((prev) => [...prev, ...incoming.edges]);
  }, []);

  const runInvestigation = async (address) => {
    setFallback(null);
    setStartedAt(Date.now());
    const auto = await autoInvestigate({ victim_address: address, case_id: `CASE-${Date.now()}` });
    setInvestigation(auto);

    const result = await searchQuery({ query: address });
    if (!result.graph.nodes.length) {
      setFallback({ reason: "network_unavailable" });
      return;
    }
    setGraph(result.graph);
    setTransfers(result.graph.edges);
  };

  const handleSearch = () => query && runInvestigation(query);

  const handleLoadSample = async (sample) => {
    setFallback(null);
    setStartedAt(Date.now());
    const result = await startTrace({
      case_id: `DEMO-${sample.chain}`, fir_number: "FIR/2026/00123",
      start_address: sample.address, chain: sample.chain, data_mode: "mock",
    });
    setInvestigation({
      reached_exchange: result.reached_exchange,
      exchange_attribution_message: result.exchange_attribution_message,
      hop_count: result.hop_count, trace_time_ms: result.trace_time_ms,
    });
    const g = await getTraceGraph(result.trace_id);
    setGraph(g);
    setTransfers(g.edges);
  };

  const handleExpandNode = async (nodeId) => {
    const node = graph.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const expanded = await expandNode({ address: nodeId, chain: node.chain, direction: "both" });
    mergeGraph(expanded);
  };

  const handleExport = (format) => {
    const cy = cyApiRef.current;
    if (!cy) return;
    const blob = (format === "png" || typeof cy.svg !== "function")
      ? cy.png({ full: true, output: "blob" })
      : new Blob([cy.svg()], { type: "image/svg+xml" });
    const ext = (format === "png" || typeof cy.svg !== "function") ? "png" : "svg";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cryptotrace-graph.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
        <h1 className="text-lg font-semibold mr-2">CryptoTrace-Sentinel</h1>
        <GoldenHourTimer startedAt={startedAt} />
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Victim-reported address or tx hash (TRON / EVM / BTC)"
          className="flex-1 bg-gray-800 rounded px-3 py-2 text-sm"
        />
        <button onClick={handleSearch} className="bg-blue-600 px-4 py-2 rounded text-sm">Investigate</button>
        <button onClick={() => setShowFreezeForm(true)} className="bg-red-700 px-4 py-2 rounded text-sm">
          Freeze Notice
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 text-xs">
        <span className="text-gray-400">Offline demo cases:</span>
        {SAMPLE_CASES.map((s) => (
          <button key={s.address} onClick={() => handleLoadSample(s)} className="bg-gray-700 px-2 py-1 rounded">
            {s.label}
          </button>
        ))}
      </div>

      {investigation && (
        <div className={`text-sm px-4 py-2 ${investigation.reached_exchange ? "bg-emerald-900/40 text-emerald-200" : "bg-gray-800 text-gray-300"}`}>
          {investigation.reached_exchange
            ? `Reached exchange in ${investigation.hop_count} hop(s), ${investigation.trace_time_ms}ms — ${investigation.exchange_attribution_message || "attribution pending manual confirmation"}`
            : "No exchange off-ramp found within the configured hop/time bounds yet."}
        </div>
      )}

      {fallback && (
        <div className="bg-amber-900/40 text-amber-200 text-sm px-4 py-2">
          Live data source unavailable. Use one of the offline demo cases above for a reliable walkthrough.
        </div>
      )}

      <FilterToolbar
        filters={filters} onFiltersChange={setFilters}
        layoutName={layoutName} onLayoutChange={setLayoutName}
        onExport={handleExport}
        onResetLayout={() => setLayoutName("dag")}
        onZoomToFit={() => cyApiRef.current?.fit(undefined, 40)}
      />

      <div className="flex-1 relative">
        <GraphCanvas
          graph={graph} layoutName={layoutName} filters={filters}
          onNodeSelect={setSelectedNode} onEdgeSelect={() => {}}
          onExpandNode={handleExpandNode} cyApiRef={cyApiRef}
        />
        <ForensicDrawer
          node={selectedNode} transfers={transfers}
          onClose={() => setSelectedNode(null)}
          onCopyAddress={(addr) => navigator.clipboard.writeText(addr)}
        />
      </div>

      {showFreezeForm && <FreezeNoticeForm onClose={() => setShowFreezeForm(false)} />}
    </div>
  );
}

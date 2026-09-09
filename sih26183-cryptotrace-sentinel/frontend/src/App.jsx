import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import LandingView from "./components/LandingView";
import InvestigateView from "./components/InvestigateView";
import CasesView from "./components/CasesView";
import IntelligenceView from "./components/IntelligenceView";
import EvidenceView from "./components/EvidenceView";
import CommandPalette from "./components/CommandPalette";
import DiagnosticsDrawer from "./components/DiagnosticsDrawer";
import NoticeModal from "./components/NoticeModal";
import NewCaseModal from "./components/NewCaseModal";
import EvidenceModal from "./components/EvidenceModal";

import {
  startTrace,
  getTraceGraph,
  getOffRamp,
  expandNode,
  getVaspAttribution,
} from "./services/api";
import { SAMPLE_PRESETS } from "./components/SearchBar";
import { mockScenarios } from "./data/mockScenarios.js";

const defaultScenario = mockScenarios.task_scam_tron;

export default function App() {
  // Navigation View State: "overview" | "investigate" | "cases" | "intelligence" | "evidence"
  const [activeView, setActiveView] = useState("overview");

  // Investigation & Target State: Pre-hydrated with default scenario to prevent black screen
  const [targetWallet, setTargetWallet] = useState(SAMPLE_PRESETS.TRON.address);
  const [caseId, setCaseId] = useState(defaultScenario.case_id);
  const [detectedChain, setDetectedChain] = useState(defaultScenario.detected_chain);
  const [dataSource, setDataSource] = useState("standalone_cloud_preview");
  const [traceTimeMs, setTraceTimeMs] = useState(0.045);
  const [graph, setGraph] = useState(defaultScenario.graph);
  const [filteredEdges, setFilteredEdges] = useState(defaultScenario.graph.edges || []);
  const [layoutName, setLayoutName] = useState("dagre");
  const [loading, setLoading] = useState(false);

  // Inspector & Off-Ramp State
  const [selectedElement, setSelectedElement] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [highlightedTxHashes, setHighlightedTxHashes] = useState(
    defaultScenario.off_ramp?.path?.map((p) => p.tx_hash).filter(Boolean) || []
  );
  const [offRampResult, setOffRampResult] = useState(defaultScenario.off_ramp);
  const [offRampLoading, setOffRampLoading] = useState(false);

  // Modals & Panels State
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  // Cytoscape Reference
  const cyRef = useRef(null);

  // Execute Forensic Trace
  const handleLaunchTrace = async (addressToTrace = targetWallet) => {
    const queryAddr = (addressToTrace || "").trim();
    if (!queryAddr) return;

    setLoading(true);
    setSelectedElement(null);
    setDrawerOpen(false);

    try {
      const startRes = await startTrace({
        address: queryAddr,
        fir_number: "FIR/CYBER/2026/0402",
        use_mock_fallback: true,
      });

      const activeCase = startRes.case_id || startRes.trace_id || "CASE-SIH-2026";
      setCaseId(activeCase);
      setDetectedChain(startRes.detected_chain || "TRON");
      setDataSource(startRes.data_source);
      setTraceTimeMs(startRes.trace_time_ms || 0.05);

      // Fetch Graph Data
      const graphData = await getTraceGraph(activeCase);
      setGraph(graphData);
      setFilteredEdges(graphData.edges || []);

      // Auto-Search Nearest CEX Off-Ramp
      try {
        setOffRampLoading(true);
        const offRampRes = await getOffRamp(activeCase, 50);
        setOffRampResult(offRampRes);
        if (offRampRes?.found && offRampRes?.path?.length > 0) {
          const hashes = offRampRes.path.map((p) => p.tx_hash).filter(Boolean);
          setHighlightedTxHashes(hashes);
        } else {
          setHighlightedTxHashes([]);
        }
      } catch (err) {
        console.warn("Off-ramp query notice:", err);
      } finally {
        setOffRampLoading(false);
      }

      // Switch to Investigate View
      setActiveView("investigate");
    } catch (err) {
      console.error("Trace failure:", err);
      alert(`Forensic trace failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Run Guided Demo on Mount or Click
  const handleRunDemo = () => {
    setTargetWallet(SAMPLE_PRESETS.TRON.address);
    handleLaunchTrace(SAMPLE_PRESETS.TRON.address);
  };

  // Trigger Trace for specific presets
  const handleSelectPreset = (presetKey) => {
    const p = SAMPLE_PRESETS[presetKey];
    if (p) {
      setTargetWallet(p.address);
      handleLaunchTrace(p.address);
    }
  };

  // Node Selection Handler
  const handleNodeSelect = (item) => {
    setSelectedElement(item);
    setDrawerOpen(true);
  };

  // Edge Selection Handler
  const handleEdgeSelect = (item) => {
    setSelectedElement(item);
    setDrawerOpen(true);
  };

  // Dynamic Counterparty Expansion
  const handleExpandNode = async (address) => {
    if (!caseId || !address) return;
    try {
      const res = await expandNode(caseId, address, "both");
      if (res && res.new_nodes && res.new_nodes.length > 0) {
        setGraph((prev) => {
          if (!prev) return prev;
          const existingNodeIds = new Set(prev.nodes.map((n) => n.id));
          const existingEdgeKeys = new Set(
            prev.edges.map((e) => `${e.source}_${e.target}_${e.tx_hash}`)
          );

          const addedNodes = res.new_nodes.filter((n) => !existingNodeIds.has(n.id));
          const addedEdges = res.new_edges.filter(
            (e) => !existingEdgeKeys.has(`${e.source}_${e.target}_${e.tx_hash}`)
          );

          const updatedGraph = {
            ...prev,
            nodes: [...prev.nodes, ...addedNodes],
            edges: [...prev.edges, ...addedEdges],
          };

          setFilteredEdges(updatedGraph.edges);
          return updatedGraph;
        });
      }
    } catch (err) {
      console.warn("Dynamic node expansion failed:", err);
    }
  };


  return (
    <div className="min-h-screen w-full bg-[#07111F] text-[#F5F7FA] flex flex-col selection:bg-[#00AEEF]/25 selection:text-[#F5F7FA]">
      {/* 1. Slim, Elegant, Reference-Style Top Navigation */}
      <Navbar
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenNewCase={() => setNewCaseModalOpen(true)}
        onOpenDiagnostics={() => setDiagnosticsOpen(true)}
        cCoreLatency={traceTimeMs}
        hasActiveCase={Boolean(caseId)}
      />

      {/* 2. Main Viewport Content Switching */}
      <main className="flex-1 w-full">
        {activeView === "overview" && (
          <LandingView
            onStartInvestigation={() => setActiveView("investigate")}
            onRunDemo={handleRunDemo}
            onSelectPreset={handleSelectPreset}
          />
        )}

        {activeView === "investigate" && (
          <InvestigateView
            targetWallet={targetWallet}
            onTargetWalletChange={setTargetWallet}
            onLaunchTrace={handleLaunchTrace}
            loading={loading}
            graph={graph}
            filteredEdges={filteredEdges}
            layoutName={layoutName}
            onLayoutChange={setLayoutName}
            highlightedTxHashes={highlightedTxHashes}
            onFindNearestExchange={() => handleLaunchTrace(targetWallet)}
            offRampLoading={offRampLoading}
            offRampResult={offRampResult}
            onNodeSelect={handleNodeSelect}
            onEdgeSelect={handleEdgeSelect}
            selectedElement={selectedElement}
            drawerOpen={drawerOpen}
            onCloseDrawer={() => {
              setDrawerOpen(false);
              setSelectedElement(null);
            }}
            onExpandNode={handleExpandNode}
            onOpenNoticeModal={() => setNoticeModalOpen(true)}
            onOpenEvidenceModal={() => setEvidenceModalOpen(true)}
            caseId={caseId}
            detectedChain={detectedChain}
            traceTimeMs={traceTimeMs}
            cyRef={cyRef}
          />
        )}

        {activeView === "cases" && (
          <CasesView
            onOpenCase={(addr, cid) => {
              setTargetWallet(addr);
              setCaseId(cid);
              handleLaunchTrace(addr);
            }}
            onOpenNewCase={() => setNewCaseModalOpen(true)}
          />
        )}

        {activeView === "intelligence" && (
          <IntelligenceView
            onInvestigateAddress={(addr) => {
              setTargetWallet(addr);
              handleLaunchTrace(addr);
            }}
          />
        )}

        {activeView === "evidence" && (
          <EvidenceView
            caseId={caseId}
            brief={graph?.brief}
            graph={graph}
            onOpenNoticeModal={() => setNoticeModalOpen(true)}
          />
        )}
      </main>

      {/* 3. Global Command Palette (⌘K / Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectAction={(act) => {
          if (act.type === "navigate") setActiveView(act.view);
          if (act.type === "open_notice") setNoticeModalOpen(true);
          if (act.type === "open_palette") setCommandPaletteOpen(true);
        }}
        onStartTrace={(addr) => {
          setTargetWallet(addr);
          handleLaunchTrace(addr);
        }}
      />

      {/* 4. Diagnostics & Sovereign Infrastructure Drawer */}
      <DiagnosticsDrawer
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
        cCoreLatency={traceTimeMs}
        dataSource={dataSource}
        detectedChain={detectedChain}
        nodeCount={graph?.nodes?.length || 8}
        edgeCount={graph?.edges?.length || 7}
      />

      {/* 5. Statutory Preservation Directive Modal (Section 94 BNSS) */}
      <NoticeModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
        brief={graph?.brief}
        currentChain={detectedChain}
        caseId={caseId}
      />

      {/* 6. New Case Modal */}
      {newCaseModalOpen && (
        <NewCaseModal
          isOpen={newCaseModalOpen}
          onClose={() => setNewCaseModalOpen(false)}
          onCaseCreated={(newCase) => {
            if (newCase?.targetAddress) {
              setTargetWallet(newCase.targetAddress);
              handleLaunchTrace(newCase.targetAddress);
            }
            setNewCaseModalOpen(false);
          }}
        />
      )}

      {/* 7. Digital Evidence Modal */}
      {evidenceModalOpen && (
        <EvidenceModal
          isOpen={evidenceModalOpen}
          onClose={() => setEvidenceModalOpen(false)}
          caseId={caseId}
        />
      )}
    </div>
  );
}

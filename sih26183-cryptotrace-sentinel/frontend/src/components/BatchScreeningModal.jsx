import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Download, 
  Search, 
  Filter, 
  Copy, 
  RefreshCw, 
  Layers, 
  ExternalLink, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Building2,
  Sparkles
} from "lucide-react";
import ProvenanceBadge from "./ProvenanceBadge";
import RiskModeBadge from "./RiskModeBadge";
import { 
  startBatchScreening, 
  uploadScreeningFile, 
  getBatchJobStatus, 
  getSampleScreeningAddresses,
  getBatchCsvDownloadUrl 
} from "../api";

export default function BatchScreeningModal({ isOpen, onClose, onTraceAddress }) {
  const [activeTab, setActiveTab] = useState("upload"); // "upload" | "processing" | "results"
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Job execution states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState("idle"); // "idle" | "queued" | "processing" | "completed" | "failed"
  const [progressPct, setProgressPct] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [summary, setSummary] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedAddr, setCopiedAddr] = useState(null);

  // Table filtering & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "sanctions" | "critical" | "high" | "clean"
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const pollIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && jobStatus === "idle") {
      setActiveTab("upload");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // Address Extraction Heuristics for Input Preview
  // ---------------------------------------------------------------------------
  const countEstimatedAddresses = () => {
    if (selectedFile) {
      return selectedFile.name;
    }
    if (!pastedText.trim()) return 0;
    const lines = pastedText.split(/[\n,;\t]/).filter(s => s.trim().length > 10);
    return lines.length;
  };

  // ---------------------------------------------------------------------------
  // Drag & Drop Handlers
  // ---------------------------------------------------------------------------
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPastedText("");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setPastedText("");
    }
  };

  // ---------------------------------------------------------------------------
  // Load 1,000 Sample Addresses (Instant LEO Demo)
  // ---------------------------------------------------------------------------
  const handleLoadSampleData = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const data = await getSampleScreeningAddresses(1000);
      setSelectedFile(null);
      setPastedText(data.addresses.join("\n"));
    } catch (err) {
      console.error("Failed to fetch sample addresses:", err);
      // Fallback: generate local list
      const samples = [
        "0xlazarus0000000000000000000000000000000001",
        "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
        "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc",
        "0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936",
        "0xgarantex000000000000000000000000000000001",
        "0xblender0000000000000000000000000000000001",
        "0xsinbad00000000000000000000000000000000001",
        "0xhydramarket00000000000000000000000000001",
        "tlazarustronhotwallet00000000000000",
        "1silkroad00000000000000000000000000001",
        "bc1qlazarus0000000000000000000000000000001",
        "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
        "TCoinDCXHotWallet0001XXXXXXXXXXXXX",
        "0xBinanceHotWallet000000000000000000001",
        "0xBinanceDeposit0000000000000000000001",
        "TVictim0001TRONTaskScamXXXXXXXXX",
      ];
      for (let i = 16; i < 1000; i++) {
        samples.push(i % 2 === 0 
          ? `0x${i.toString(16).padStart(8, '0')}abcdef0123456789abcdef0123456789`
          : `T${i.toString().padStart(6, '0')}TronAddressTestingSyntheticXXXXX`
        );
      }
      setSelectedFile(null);
      setPastedText(samples.join("\n"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Download Sample CSV Template
  // ---------------------------------------------------------------------------
  const handleDownloadTemplate = () => {
    const templateContent = [
      "address,notes,case_reference",
      "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b,Tornado Cash Router (OFAC Sanctioned),FIR-2026-001",
      "0xlazarus0000000000000000000000000000000001,Lazarus Group DPRK Conduit,FIR-2026-002",
      "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX,Suspect CoinDCX Off-Ramp Deposit,FIR-2026-003",
      "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021,CoinDCX Regulated Hot Wallet,FIU-IND-REG",
      "TVictim0001TRONTaskScamXXXXXXXXX,Complainant Victim Origin,FIR-2026-004",
      "1silkroad00000000000000000000000000001,Seized Darknet Asset,US-DOJ-SEIZED",
      "bc1qlazarus0000000000000000000000000000001,Bitcoin Ransomware Conduit,FIR-2026-005"
    ].join("\n");

    const blob = new Blob([templateContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "screening_address_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ---------------------------------------------------------------------------
  // Start Asynchronous Screening Job
  // ---------------------------------------------------------------------------
  const handleStartScreening = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setProgressPct(0);
    setProcessedCount(0);
    setAllResults([]);

    try {
      let submitRes;
      if (selectedFile) {
        submitRes = await uploadScreeningFile(selectedFile);
      } else {
        const lines = pastedText
          .split(/[\n,;\t]/)
          .map(s => s.trim().replace(/^["']|["']$/g, ""))
          .filter(s => s.length > 10 && !s.toLowerCase().startsWith("address"));
        
        if (lines.length === 0) {
          throw new Error("Please upload a file or paste at least one valid address.");
        }

        submitRes = await startBatchScreening({
          addresses: lines,
          file_name: "pasted_addresses.txt",
        });
      }

      setJobId(submitRes.job_id);
      setJobStatus(submitRes.status || "processing");
      setTotalCount(submitRes.total || 0);
      setActiveTab("processing");

      // Begin background non-blocking polling
      startPolling(submitRes.job_id);
    } catch (err) {
      console.error("Screening start error:", err);
      setErrorMessage(err.message || "Failed to start screening job.");
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Background Job Polling
  // ---------------------------------------------------------------------------
  const startPolling = (targetJobId) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        // Fetch status with limit 1000 to acquire results
        const statusData = await getBatchJobStatus(targetJobId, 0, 5000);
        setJobStatus(statusData.status);
        setProgressPct(statusData.progress_pct || 0);
        setProcessedCount(statusData.processed || 0);
        setTotalCount(statusData.total || 0);
        setDurationMs(statusData.duration_ms || 0);

        if (statusData.summary) {
          setSummary(statusData.summary);
        }

        if (statusData.status === "completed") {
          clearInterval(pollIntervalRef.current);
          setIsSubmitting(false);
          setAllResults(statusData.results || []);
          setActiveTab("results");
        } else if (statusData.status === "failed") {
          clearInterval(pollIntervalRef.current);
          setIsSubmitting(false);
          setErrorMessage(statusData.error || "Batch screening job failed.");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 450);
  };

  // ---------------------------------------------------------------------------
  // Filter & Pagination Logic
  // ---------------------------------------------------------------------------
  const filteredResults = allResults.filter(item => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchAddr = item.address.toLowerCase().includes(q);
      const matchEntity = (item.sanctions_entity || item.entity_label || "").toLowerCase().includes(q);
      const matchCat = (item.category || "").toLowerCase().includes(q);
      if (!matchAddr && !matchEntity && !matchCat) return false;
    }

    // Filter type
    if (filterType === "sanctions") return item.sanctions_match;
    if (filterType === "critical") return item.risk_score >= 85;
    if (filterType === "high") return item.risk_score >= 60 && item.risk_score < 85;
    if (filterType === "clean") return item.risk_score < 35 && !item.sanctions_match;
    return true;
  });

  const totalPages = Math.ceil(filteredResults.length / rowsPerPage) || 1;
  const paginatedRows = filteredResults.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAddr(text);
    setTimeout(() => setCopiedAddr(null), 2000);
  };

  // ---------------------------------------------------------------------------
  // CSV Export Handler
  // ---------------------------------------------------------------------------
  const handleDownloadCsv = () => {
    if (!jobId) return;
    const url = getBatchCsvDownloadUrl(jobId);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CryptoTrace_Batch_Screening_${jobId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trace address action
  const handleTraceClick = (address, chain) => {
    if (onTraceAddress) {
      onTraceAddress(address, chain);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#0c0c0e] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-sans text-zinc-200">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono tracking-tight">
                  High-Throughput Bulk Address Screening
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                  P0 BATCH ENGINE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300">
                  DUAL-MODE RISK DB
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Screen thousands of TRON, EVM, and Bitcoin addresses against OFAC/UN Sanctions & Fraud Typology Models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Tabs (when job exists) */}
            {jobId && (
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-xs font-mono">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "upload" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Upload
                </button>
                {jobStatus === "processing" && (
                  <button
                    onClick={() => setActiveTab("processing")}
                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                      activeTab === "processing" ? "bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                    Queue ({progressPct}%)
                  </button>
                )}
                {allResults.length > 0 && (
                  <button
                    onClick={() => setActiveTab("results")}
                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                      activeTab === "results" ? "bg-indigo-900/60 text-indigo-300 font-bold border border-indigo-500/40" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Results ({allResults.length})
                  </button>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ================================================================= */}
          {/* TAB 1: UPLOAD & CONFIGURE */}
          {/* ================================================================= */}
          {activeTab === "upload" && (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
              
              {/* Quick Preset Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>Ready to screen against 1,000+ OFAC SDN records & behavioral models</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors flex items-center gap-1.5"
                    title="Download sample CSV template format"
                  >
                    <Download className="w-3.5 h-3.5 text-zinc-400" />
                    <span>CSV Template</span>
                  </button>

                  <button
                    onClick={handleLoadSampleData}
                    disabled={isSubmitting}
                    className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    title="Load 1,000 synthetic LEO forensic addresses for instant performance benchmark"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Load 1,000 Sample Addresses</span>
                  </button>
                </div>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  isDragOver
                    ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                    : selectedFile
                    ? "border-emerald-500/60 bg-emerald-950/20"
                    : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/30 hover:bg-zinc-900/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2 text-emerald-300 font-mono">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="font-bold text-sm text-white">{selectedFile.name}</span>
                    <span className="text-xs text-emerald-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready for asynchronous batch screening
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="mt-2 text-xs text-zinc-400 hover:text-rose-400 underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="font-bold text-sm text-white font-mono">
                      Drop CSV or TXT address list here, or click to browse
                    </span>
                    <p className="text-xs text-zinc-400 max-w-sm">
                      Supports comma, tab, or newline-delimited lists. Automatically ignores headers and extracts EVM, TRON, and Bitcoin addresses.
                    </p>
                  </div>
                )}
              </div>

              {/* Or Direct Paste Area */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>OR PASTE ADDRESSES DIRECTLY (ONE PER LINE OR COMMA-SEPARATED):</span>
                  {pastedText.trim() && (
                    <span className="text-cyan-400 font-bold">
                      ~{countEstimatedAddresses()} items detected
                    </span>
                  )}
                </div>
                <textarea
                  value={pastedText}
                  onChange={(e) => {
                    setPastedText(e.target.value);
                    if (selectedFile) setSelectedFile(null);
                  }}
                  placeholder="0xd90e2f925da726b50c4ed8d0fb90ad053324f31b&#10;TCoinDCXDeposit0001XXXXXXXXXXXXXXXX&#10;bc1qlazarus0000000000000000000000000000001&#10;0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021&#10;..."
                  rows={6}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Error Display */}
              {errorMessage && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-center gap-2 text-rose-300 text-xs font-mono">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Launch Batch Screening Button */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartScreening}
                  disabled={isSubmitting || (!selectedFile && !pastedText.trim())}
                  className="px-6 py-2.5 text-xs font-mono font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-slate-950" />
                  )}
                  <span>Start Batch Screening Job</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: LIVE ASYNC QUEUE PROGRESS */}
          {/* ================================================================= */}
          {activeTab === "processing" && (
            <div className="flex flex-col items-center justify-center py-12 max-w-2xl mx-auto text-center gap-6 font-mono">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center animate-pulse shadow-[0_0_35px_rgba(6,182,212,0.25)]">
                  <Layers className="w-10 h-10 text-cyan-400" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Processing Batch Screening Job ({jobId})
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Evaluating addresses concurrently against Sanctions Catalog & Dual-Mode Risk Engine without blocking UI thread.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-900 border border-zinc-800 rounded-full h-4 overflow-hidden p-0.5">
                <div 
                  className="bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(5, progressPct)}%` }}
                ></div>
              </div>

              {/* Progress Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                  <span className="text-[10px] text-zinc-500">PROCESSED</span>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {processedCount} / {totalCount}
                  </div>
                </div>
                <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                  <span className="text-[10px] text-zinc-500">PROGRESS</span>
                  <div className="text-sm font-bold text-cyan-400 mt-0.5">
                    {progressPct}%
                  </div>
                </div>
                <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                  <span className="text-[10px] text-zinc-500">QUEUE STATUS</span>
                  <div className="text-sm font-bold text-amber-400 mt-0.5 capitalize">
                    {jobStatus}
                  </div>
                </div>
                <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                  <span className="text-[10px] text-zinc-500">SANCTIONS HITS</span>
                  <div className={`text-sm font-bold mt-0.5 ${
                    summary?.sanctions_hits > 0 ? "text-rose-400 animate-pulse" : "text-emerald-400"
                  }`}>
                    {summary?.sanctions_hits || 0}
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-500">
                Non-blocking worker thread yielding CPU slices • Average latency &lt;0.05ms/address
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: AUDIT RESULTS TABLE */}
          {/* ================================================================= */}
          {activeTab === "results" && (
            <div className="flex flex-col gap-5">
              
              {/* Top Summary Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl font-mono">
                  <span className="text-[10px] text-zinc-500">TOTAL SCREENED</span>
                  <div className="text-lg font-extrabold text-white mt-0.5">
                    {summary?.total_screened || allResults.length}
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    {durationMs ? `Completed in ${durationMs}ms` : "Instant audit"}
                  </span>
                </div>

                <div className="p-3 bg-rose-950/30 border border-rose-500/40 rounded-xl font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-rose-400 font-bold">SANCTIONS MATCHES</span>
                    {summary?.sanctions_hits > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    )}
                  </div>
                  <div className="text-lg font-extrabold text-rose-300 mt-0.5">
                    {summary?.sanctions_hits || allResults.filter(r => r.sanctions_match).length}
                  </div>
                  <span className="text-[10px] text-rose-400/80">OFAC / UN / Blacklist</span>
                </div>

                <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl font-mono">
                  <span className="text-[10px] text-red-400">CRITICAL RISK (85-100)</span>
                  <div className="text-lg font-extrabold text-red-300 mt-0.5">
                    {summary?.critical_risk || allResults.filter(r => r.risk_score >= 85).length}
                  </div>
                  <span className="text-[10px] text-red-400/80">Sec 94 BNSS targets</span>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl font-mono">
                  <span className="text-[10px] text-amber-400">HIGH RISK (60-84)</span>
                  <div className="text-lg font-extrabold text-amber-300 mt-0.5">
                    {summary?.high_risk || allResults.filter(r => r.risk_score >= 60 && r.risk_score < 85).length}
                  </div>
                  <span className="text-[10px] text-amber-400/80">Mules / Layering</span>
                </div>

                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl font-mono col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-emerald-400">REGULATED / CLEAN</span>
                  <div className="text-lg font-extrabold text-emerald-300 mt-0.5">
                    {summary?.clean_count || allResults.filter(r => r.risk_score < 35 && !r.sanctions_match).length}
                  </div>
                  <span className="text-[10px] text-emerald-400/80">Low Risk Baseline</span>
                </div>
              </div>

              {/* Table Controls (Search, Filters, Export Button) */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
                
                {/* Left: Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                  <button
                    onClick={() => { setFilterType("all"); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterType === "all" ? "bg-zinc-800 text-white font-bold border border-zinc-700" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    All ({allResults.length})
                  </button>

                  <button
                    onClick={() => { setFilterType("sanctions"); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterType === "sanctions" 
                        ? "bg-rose-950 text-rose-300 font-bold border border-rose-500/50" 
                        : "text-rose-400/80 hover:text-rose-300"
                    }`}
                  >
                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                    <span>Sanctions ({allResults.filter(r => r.sanctions_match).length})</span>
                  </button>

                  <button
                    onClick={() => { setFilterType("critical"); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterType === "critical" 
                        ? "bg-red-950 text-red-300 font-bold border border-red-500/50" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Critical ({allResults.filter(r => r.risk_score >= 85).length})
                  </button>

                  <button
                    onClick={() => { setFilterType("clean"); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterType === "clean" 
                        ? "bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/50" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Clean ({allResults.filter(r => r.risk_score < 35 && !r.sanctions_match).length})
                  </button>
                </div>

                {/* Right: Search Input & Download Button */}
                <div className="flex items-center gap-2.5 ml-auto">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder="Search address or entity..."
                      className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 w-52"
                    />
                  </div>

                  <button
                    onClick={handleDownloadCsv}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_14px_rgba(99,102,241,0.3)] flex items-center gap-1.5 cursor-pointer"
                    title="Download Court-Ready RFC-4180 Results CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>

              </div>

              {/* DATA TABLE */}
              <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-950/60 shadow-inner">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] text-zinc-400">
                      <th className="py-2.5 px-3 w-12 text-center">#</th>
                      <th className="py-2.5 px-4">Address</th>
                      <th className="py-2.5 px-3">Chain</th>
                      <th className="py-2.5 px-3">Risk Score</th>
                      <th className="py-2.5 px-3">Risk Mode</th>
                      <th className="py-2.5 px-4">Sanctions Match</th>
                      <th className="py-2.5 px-3">Provenance</th>
                      <th className="py-2.5 px-4">Category / Attribution</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850/60">
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-zinc-500 text-xs font-mono">
                          No screened records match the current filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((item, index) => {
                        const globalIndex = (currentPage - 1) * rowsPerPage + index + 1;
                        const isSanctioned = Boolean(item.sanctions_match);
                        
                        return (
                          <tr 
                            key={item.address + index} 
                            className={`hover:bg-zinc-900/60 transition-colors ${
                              isSanctioned ? "bg-rose-950/20" : ""
                            }`}
                          >
                            {/* 1. Index */}
                            <td className="py-2.5 px-3 text-center text-zinc-500 font-mono text-[11px]">
                              {globalIndex}
                            </td>

                            {/* 2. Address */}
                            <td className="py-2.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <span 
                                  className="font-mono text-zinc-200 hover:text-cyan-400 transition-colors cursor-pointer"
                                  title={item.address}
                                  onClick={() => copyToClipboard(item.address)}
                                >
                                  {item.address.length > 20 
                                    ? `${item.address.slice(0, 8)}...${item.address.slice(-6)}` 
                                    : item.address
                                  }
                                </span>
                                <button
                                  onClick={() => copyToClipboard(item.address)}
                                  className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
                                  title="Copy address"
                                >
                                  {copiedAddr === item.address ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* 3. Chain */}
                            <td className="py-2.5 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                item.chain === "TRON" 
                                  ? "bg-red-950/60 text-red-300 border border-red-500/30" 
                                  : item.chain === "BTC"
                                  ? "bg-amber-950/60 text-amber-300 border border-amber-500/30"
                                  : "bg-blue-950/60 text-blue-300 border border-blue-500/30"
                              }`}>
                                {item.chain}
                              </span>
                            </td>

                            {/* 4. Risk Score */}
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                                item.risk_score >= 85 
                                  ? "bg-rose-950/80 border border-rose-500/50 text-rose-300"
                                  : item.risk_score >= 60
                                  ? "bg-amber-950/80 border border-amber-500/50 text-amber-300"
                                  : item.risk_score >= 35
                                  ? "bg-yellow-950/80 border border-yellow-500/50 text-yellow-300"
                                  : "bg-emerald-950/80 border border-emerald-500/50 text-emerald-300"
                              }`}>
                                {item.risk_score}/100
                              </span>
                            </td>

                            {/* 5. Risk Mode */}
                            <td className="py-2.5 px-3">
                              <RiskModeBadge mode={item.risk_mode} size="xs" />
                            </td>

                            {/* 6. Sanctions Match */}
                            <td className="py-2.5 px-4">
                              {isSanctioned ? (
                                <div className="flex flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/60 text-rose-300 font-bold text-[10px] shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                                    <span>CRITICAL MATCH (YES)</span>
                                  </span>
                                  {item.sanctions_entity && (
                                    <span className="text-[10px] text-rose-400/90 font-mono truncate max-w-[200px]" title={item.sanctions_entity}>
                                      {item.sanctions_entity}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px]">
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                  <span>CLEAN (NO)</span>
                                </span>
                              )}
                            </td>

                            {/* 7. Provenance Tag */}
                            <td className="py-2.5 px-3">
                              <ProvenanceBadge provenance={item.provenance} size="xs" />
                            </td>

                            {/* 8. Category / Label */}
                            <td className="py-2.5 px-4 text-zinc-300 text-[11px]">
                              <div className="truncate max-w-[220px]" title={item.explanation}>
                                <span className="text-zinc-200 font-medium">
                                  {item.entity_label || item.category || "Unattributed Wallet"}
                                </span>
                                {item.sanctions_authority && (
                                  <span className="block text-[10px] text-zinc-500 font-mono">
                                    {item.sanctions_authority}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 9. Action Button */}
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => handleTraceClick(item.address, item.chain)}
                                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-cyan-950 text-zinc-300 hover:text-cyan-300 border border-zinc-700 hover:border-cyan-500/40 text-[11px] font-mono transition-all flex items-center gap-1 ml-auto"
                                title="Load address into Tracing Canvas and initiate trace"
                              >
                                <span>Trace</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span>Showing {filteredResults.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredResults.length)} of {filteredResults.length} records</span>
                  <span className="text-zinc-600">|</span>
                  <span>Per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-200 focus:outline-none focus:border-cyan-500 text-xs"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="px-2 text-zinc-300">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span>Free & Open for Law Enforcement (Section 94 BNSS / 63 BSA Audit)</span>
            <span className="text-zinc-700">•</span>
            <span>Non-blocking Async Job Queue</span>
          </div>
          <div>
            CryptoTrace-Sentinel Batch Screening v3.0
          </div>
        </div>

      </div>
    </div>
  );
}

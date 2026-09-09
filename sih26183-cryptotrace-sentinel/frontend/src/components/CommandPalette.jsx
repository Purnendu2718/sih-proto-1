import React, { useState, useEffect, useRef } from "react";
import {
  Search, Shield, Zap, ArrowRight, X, ExternalLink,
  Layers, FileText, Cpu, Database, Check, History
} from "lucide-react";
import { SAMPLE_PRESETS } from "./SearchBar";

export default function CommandPalette({
  isOpen = false,
  onClose,
  onSelectAction,
  onStartTrace,
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction?.({ type: "open_palette" });
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  const handleLaunchSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onStartTrace?.(query.trim());
    onClose();
  };

  const actions = [
    {
      id: "sample_tron",
      category: "Quick Scenarios",
      icon: Zap,
      label: "Sample TRON Task Scam",
      sublabel: "5,000 USDT structured across mules to CoinDCX terminal",
      action: () => {
        onStartTrace?.(SAMPLE_PRESETS.TRON.address);
        onClose();
      },
    },
    {
      id: "sample_evm",
      category: "Quick Scenarios",
      icon: Zap,
      label: "Sample EVM Pig-Butchering",
      sublabel: "12,000 USDT layered & swept into Binance deposit cluster",
      action: () => {
        onStartTrace?.(SAMPLE_PRESETS.EVM.address);
        onClose();
      },
    },
    {
      id: "nav_investigate",
      category: "Navigation",
      icon: Layers,
      label: "Go to Investigation Canvas",
      sublabel: "Full-screen interactive forensic graph",
      action: () => {
        onSelectAction?.({ type: "navigate", view: "investigate" });
        onClose();
      },
    },
    {
      id: "nav_cases",
      category: "Navigation",
      icon: Database,
      label: "View Active Case Dossiers",
      sublabel: "Case files, FIR numbers, and suspect targets",
      action: () => {
        onSelectAction?.({ type: "navigate", view: "cases" });
        onClose();
      },
    },
    {
      id: "nav_intelligence",
      category: "Navigation",
      icon: Shield,
      label: "CEX Intelligence & Cluster Directory",
      sublabel: "Binance, CoinDCX, WazirX, ZebPay sweep heuristics",
      action: () => {
        onSelectAction?.({ type: "navigate", view: "intelligence" });
        onClose();
      },
    },
    {
      id: "nav_evidence",
      category: "Navigation",
      icon: FileText,
      label: "Section 63 BSA Evidence Manifest",
      sublabel: "Cryptographic SHA-256 seal verification",
      action: () => {
        onSelectAction?.({ type: "navigate", view: "evidence" });
        onClose();
      },
    },
    {
      id: "action_notice",
      category: "Forensic Tools",
      icon: FileText,
      label: "Draft Section 94 BNSS Freezing Notice",
      sublabel: "Statutory requisition directive with ReportLab PDF export",
      action: () => {
        onSelectAction?.({ type: "open_notice" });
        onClose();
      },
    },
  ];

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.sublabel.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#091525] border border-[#223247] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Field */}
        <form
          onSubmit={handleLaunchSearch}
          className="flex items-center gap-3 px-5 py-4 border-b border-[#223247] bg-[#07111F]"
        >
          <Search className="w-5 h-5 text-[#AAB7C7] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wallet address (T..., 0x..., bc1...), case ID, or command..."
            className="w-full bg-transparent text-sm text-[#F5F7FA] placeholder-[#6F7C8D] outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 hover:bg-[#122238] rounded text-[#AAB7C7] hover:text-[#F5F7FA] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded bg-[#0E1B2D] border border-[#223247] text-[10px] text-[#6F7C8D] font-mono">
            ESC
          </kbd>
        </form>

        {/* Results / Command Options */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {query.trim().length >= 10 && (
            <button
              onClick={handleLaunchSearch}
              className="w-full text-left flex items-center justify-between p-3 rounded-xl hover:bg-[#00AEEF]/10 border border-transparent hover:border-[#00AEEF]/30 transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00AEEF]/10 text-[#00AEEF]">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#F5F7FA]">
                    Execute Forensic Trace on Address
                  </div>
                  <div className="text-[11px] font-mono text-[#00AEEF] truncate max-w-md">
                    {query}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[#00AEEF] font-mono group-hover:translate-x-0.5 transition">
                Press Enter ↵
              </span>
            </button>
          )}

          {filteredActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full text-left flex items-center justify-between p-3 rounded-xl hover:bg-[#0E1B2D] border border-transparent hover:border-[#223247] transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#07111F] border border-[#223247] text-[#AAB7C7] group-hover:text-[#00AEEF] transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#AAB7C7] group-hover:text-[#F5F7FA] transition">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#6F7C8D]">
                      {item.sublabel}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-[#6F7C8D] uppercase tracking-wider font-mono">
                  {item.category}
                </span>
              </button>
            );
          })}

          {filteredActions.length === 0 && !query.trim() && (
            <div className="p-6 text-center text-xs text-[#6F7C8D]">
              No matching commands or actions.
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-5 py-2.5 bg-[#07111F] border-t border-[#223247] flex items-center justify-between text-[10px] text-[#6F7C8D] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#00AEEF]/80">SENTINEL • SIH 2026</span>
        </div>
      </div>
    </div>
  );
}

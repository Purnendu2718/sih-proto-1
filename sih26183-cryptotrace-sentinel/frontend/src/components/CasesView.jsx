import React, { useState } from "react";
import { Search, Plus, ChevronRight, Check } from "lucide-react";
import { SAMPLE_PRESETS } from "./SearchBar";

export default function CasesView({
  onOpenCase,
  onOpenNewCase,
}) {
  const [filterQuery, setFilterQuery] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");

  const cases = [
    {
      caseId: "TEST-TRON-001",
      firNumber: "FIR/CYBER/2026/0402",
      title: "Telegram Task Scam Syndicate",
      chain: "TRON",
      victimLoss: "$5,000.00 USDT",
      terminalVasp: "CoinDCX",
      status: "Off-Ramp Found",
      statusColor: "text-[#22C55E]",
      investigator: "Insp. Vikram Rathore",
      date: "2026-09-08",
      hops: 4,
      targetAddress: SAMPLE_PRESETS.TRON.address,
    },
    {
      caseId: "TEST-EVM-002",
      firNumber: "FIR/CYBER/2026/0518",
      title: "Pig-Butchering Investment Fraud",
      chain: "EVM",
      victimLoss: "$12,000.00 USDT",
      terminalVasp: "Binance",
      status: "Off-Ramp Found",
      statusColor: "text-[#22C55E]",
      investigator: "Insp. Priya Sharma",
      date: "2026-09-07",
      hops: 4,
      targetAddress: SAMPLE_PRESETS.EVM.address,
    },
    {
      caseId: "CASE-SIH-2026",
      firNumber: "FIR/CYBER/2026/0991",
      title: "Multi-Tier Mule Structuring",
      chain: "TRON",
      victimLoss: "$4,850.00 USDT",
      terminalVasp: "CoinDCX",
      status: "Notice Drafted",
      statusColor: "text-[#00AEEF]",
      investigator: "Insp. Vikram Rathore",
      date: "2026-09-08",
      hops: 3,
      targetAddress: "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
    },
  ];

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.caseId.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.firNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.terminalVasp.toLowerCase().includes(filterQuery.toLowerCase());

    if (activeStatusFilter === "all") return matchesSearch;
    if (activeStatusFilter === "off_ramp") return matchesSearch && c.status === "Off-Ramp Found";
    if (activeStatusFilter === "notice") return matchesSearch && c.status === "Notice Drafted";
    return matchesSearch;
  });

  return (
    <div className="w-full min-h-[calc(100vh-56px)] mt-14 bg-[#07111F] text-[#F5F7FA] flex flex-col">
      {/* 1. Unified Cases Contextual Toolbar (Section 15: [ + New Case ] │ [ Search cases ] │ [ Filter ]) */}
      <div className="w-full px-4 pt-4 pb-2 shrink-0 flex justify-center z-20">
        <div className="w-full max-w-4xl bg-[#091525]/90 backdrop-blur-md border border-[#223247] rounded-2xl px-3 py-1.5 shadow-lg shadow-black/20 flex items-center gap-2">
          {/* Action 1: + New Case */}
          <button
            onClick={onOpenNewCase}
            className="px-3 py-1.5 rounded-lg bg-[#00AEEF] hover:bg-[#19B5FE] text-[#07111F] font-semibold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Case</span>
          </button>

          <div className="h-4 w-px bg-[#223247] shrink-0" />

          {/* Central Dominant Search Input */}
          <div className="relative flex-1 flex items-center min-w-0">
            <Search className="w-3.5 h-3.5 text-[#6F7C8D] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search cases by ID, FIR number, title, or exchange..."
              className="w-full bg-[#07111F] border border-[#223247] focus:border-[#00AEEF] rounded-xl pl-8 pr-14 py-1.5 text-xs text-[#F5F7FA] font-mono placeholder-[#6F7C8D] outline-none transition"
            />
            <kbd className="hidden sm:inline-block absolute right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#091525] border border-[#223247] text-[#6F7C8D]">
              Ctrl+K
            </kbd>
          </div>

          <div className="h-4 w-px bg-[#223247] shrink-0" />

          {/* Filter Segment */}
          <div className="flex items-center gap-1 text-xs shrink-0">
            {["all", "off_ramp", "notice"].map((st) => (
              <button
                key={st}
                onClick={() => setActiveStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
                  activeStatusFilter === st
                    ? "bg-[#0E1B2D] text-[#F5F7FA] font-medium border border-[#223247]"
                    : "text-[#6F7C8D] hover:text-[#AAB7C7]"
                }`}
              >
                {st === "all" ? "All" : st === "off_ramp" ? "Off-Ramps" : "Notices"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Open Canvas Cases Workspace (Fewer cards, clean subtle rows, thin dividers) */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="divide-y divide-[#223247] border-y border-[#223247]">
          {filteredCases.map((c) => (
            <div
              key={c.caseId}
              onClick={() => onOpenCase?.(c.targetAddress, c.caseId)}
              className="py-4 px-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#0E1B2D]/40 transition rounded-lg cursor-pointer group"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-[#F5F7FA]">
                    {c.caseId}
                  </span>
                  <span className="text-[10px] text-[#6F7C8D] font-mono">
                    {c.firNumber}
                  </span>
                  <span className="text-[10px] text-[#6F7C8D]">·</span>
                  <span className={`text-[11px] font-medium ${c.statusColor}`}>
                    {c.status}
                  </span>
                </div>

                <div className="text-sm text-[#AAB7C7] group-hover:text-[#F5F7FA] transition">
                  {c.title}
                </div>

                <div className="flex items-center gap-3 text-xs text-[#6F7C8D]">
                  <span>{c.chain}</span>
                  <span>·</span>
                  <span>{c.investigator}</span>
                  <span>·</span>
                  <span>{c.hops} Hops</span>
                </div>
              </div>

              <div className="flex items-center gap-6 self-end md:self-auto shrink-0">
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-[#F5F7FA]">
                    {c.victimLoss}
                  </div>
                  <div className="text-[11px] text-[#00AEEF] font-mono">
                    {c.terminalVasp}
                  </div>
                </div>

                <div className="p-1.5 text-[#6F7C8D] group-hover:text-[#00AEEF] transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}

          {filteredCases.length === 0 && (
            <div className="py-16 text-center text-[#6F7C8D] text-xs">
              No cases matching your query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

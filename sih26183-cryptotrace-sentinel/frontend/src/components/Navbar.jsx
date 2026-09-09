import React from "react";
import { Shield, Search, User } from "lucide-react";

export default function Navbar({
  activeView = "overview",
  onViewChange,
  onOpenCommandPalette,
  onOpenDiagnostics,
}) {
  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "cases", label: "Cases" },
    { id: "investigate", label: "Investigate" },
    { id: "intelligence", label: "Intelligence" },
    { id: "evidence", label: "Evidence" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#07111F]/90 backdrop-blur-md border-b border-[#223247] transition-all duration-200">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* LEFT: Clean Logo Wordmark */}
        <div
          onClick={() => onViewChange?.("overview")}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#00AEEF]/10 border border-[#00AEEF]/30 flex items-center justify-center text-[#00AEEF] transition group-hover:border-[#00AEEF]">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-wide text-xs text-[#F5F7FA]">
              CryptoTrace
            </span>
            <span className="text-[10px] font-mono text-[#6F7C8D]">
              Sentinel
            </span>
          </div>
        </div>

        {/* CENTER: Clean Simple Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange?.(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "text-[#F5F7FA] bg-[#0E1B2D] border border-[#223247]"
                    : "text-[#AAB7C7] hover:text-[#F5F7FA] hover:bg-[#0E1B2D]/50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Search (⌘K) & Profile / Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0E1B2D] hover:bg-[#122238] border border-[#223247] text-[#AAB7C7] hover:text-[#F5F7FA] text-xs font-medium transition cursor-pointer"
            title="Search command (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#6F7C8D]" />
            <span className="hidden sm:inline text-xs">Search</span>
            <kbd className="hidden sm:inline font-mono text-[9px] text-[#6F7C8D] px-1 py-0.5 bg-[#07111F] rounded border border-[#223247]">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenDiagnostics}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0E1B2D] hover:bg-[#122238] border border-[#223247] text-[#AAB7C7] hover:text-[#F5F7FA] text-xs transition cursor-pointer"
            title="System Status & Inspector"
          >
            <User className="w-3.5 h-3.5 text-[#6F7C8D]" />
            <span className="hidden sm:inline text-[11px]">Officer Sharma</span>
          </button>
        </div>
      </div>
    </header>
  );
}

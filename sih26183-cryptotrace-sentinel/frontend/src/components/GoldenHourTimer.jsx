import React, { useEffect, useState } from "react";

const GOLDEN_HOUR_SECONDS = 4 * 60 * 60; // 4-hour statutory outer bound per SIH26183 / Indian Police standard

export default function GoldenHourTimer({ startedAt }) {
  const [remaining, setRemaining] = useState(GOLDEN_HOUR_SECONDS);

  useEffect(() => {
    if (!startedAt) return;
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(Math.max(GOLDEN_HOUR_SECONDS - elapsed, 0));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  if (!startedAt) return null;

  const hrs = Math.floor(remaining / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = remaining % 60;
  const urgent = remaining < 3600;

  return (
    <div
      className={`text-xs font-mono px-3 py-1.5 rounded-md flex items-center gap-2.5 transition-all ${
        urgent
          ? "bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#F5F7FA]"
          : "bg-[#FF8A00]/10 border border-[#FF8A00]/30 text-[#F5F7FA]"
      }`}
      title="Statutory 4-Hour Golden Hour Protocol for Crypto Asset Debit Freeze under Section 94 BNSS"
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${urgent ? "bg-[#EF4444]" : "bg-[#FF8A00]"}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${urgent ? "bg-[#EF4444]" : "bg-[#FF8A00]"}`}></span>
      </span>
      <span className="font-semibold tracking-wider text-[10px] uppercase text-[#AAB7C7]">
        GOLDEN HOUR ACTIVE:
      </span>
      <span className="font-bold text-[#F5F7FA]">
        {String(hrs).padStart(2, "0")}:{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}

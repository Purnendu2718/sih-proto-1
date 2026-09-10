import { useEffect, useState } from "react";

const GOLDEN_HOUR_SECONDS = 4 * 60 * 60;

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
    <div className={`text-xs font-mono px-3 py-1 rounded ${urgent ? "bg-red-700 text-white" : "bg-gray-700 text-gray-200"}`}>
      Golden Hour: {String(hrs).padStart(2, "0")}:{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")} remaining
    </div>
  );
}

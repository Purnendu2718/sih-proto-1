import React, { useMemo } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, 
  FastForward, Clock, Activity, ShieldAlert, CheckCircle2, 
  ArrowRight, X, Repeat
} from "lucide-react";

export default function TimelineScrubber({
  snapshots = [],
  currentStep = 0,
  onStepChange,
  isPlaying = false,
  onTogglePlay,
  speed = 1,
  onSpeedChange,
  isLooping = true,
  onToggleLoop,
  onClose,
}) {
  if (!snapshots || snapshots.length === 0) return null;

  const totalSteps = snapshots.length;
  const currentSnapshot = snapshots[currentStep] || snapshots[0];
  const progressPct = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 100;

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && onStepChange) {
      onStepChange(val);
    }
  };

  const handleStepBack = () => {
    if (onStepChange && currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleStepForward = () => {
    if (onStepChange && currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1);
    }
  };

  const handleJumpToStart = () => {
    if (onStepChange) onStepChange(0);
  };

  const handleJumpToEnd = () => {
    if (onStepChange) onStepChange(totalSteps - 1);
  };

  // Extract key milestone steps for tick markers
  const milestoneTicks = useMemo(() => {
    return snapshots.map((s, idx) => {
      let shortLabel = `T${idx}`;
      if (idx === 0) shortLabel = "Genesis";
      else if (idx === totalSteps - 1) shortLabel = "Terminal";
      else if (s.fired_edges && s.fired_edges[0]) {
        const amt = s.fired_edges[0].amount;
        shortLabel = amt >= 1000 ? `${Math.round(amt / 1000)}k` : `${Math.round(amt)}`;
      }
      return {
        stepIndex: idx,
        percent: totalSteps > 1 ? (idx / (totalSteps - 1)) * 100 : 100,
        shortLabel,
        description: s.event_description,
      };
    });
  }, [snapshots, totalSteps]);

  const metrics = currentSnapshot.metrics || {};

  return (
    <div className="w-full bg-zinc-950/95 border-b border-cyan-500/40 backdrop-blur-xl shadow-2xl z-30 px-4 py-2.5 flex flex-col gap-2 font-mono select-none animate-in slide-in-from-top-2 duration-200">
      
      {/* Top Header Row: Title, Step, Clock Readout, Speed & Controls */}
      <div className="flex items-center justify-between gap-3 text-xs">
        
        {/* Left: Title & Step Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
            <Clock className={`w-3.5 h-3.5 ${isPlaying ? "text-cyan-400 animate-spin" : "text-zinc-400"}`} />
            <span>Time Travel Playback</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            <span>Milestone</span>
            <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-200 font-semibold border border-zinc-700">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
        </div>

        {/* Center: Live UTC Timestamp & Relative Time Offset */}
        <div className="flex items-center gap-2 bg-zinc-900/90 px-3 py-1 rounded-lg border border-zinc-800 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-zinc-200 font-bold tracking-wider">
            {currentSnapshot.formatted_date || "2026-03-08 14:00:00 UTC"}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 font-semibold border border-zinc-700">
            {currentSnapshot.relative_time || "T + 00:00:00"}
          </span>
        </div>

        {/* Right: Speed Multipliers, Repeat Toggle, Close */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[10px]">
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange && onSpeedChange(s)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  speed === s
                    ? "bg-cyan-500/25 border border-cyan-500/50 text-cyan-200 font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                title={`Playback Speed ${s}x`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Auto Loop Toggle */}
          <button
            onClick={onToggleLoop}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              isLooping 
                ? "bg-purple-950/60 border-purple-500/50 text-purple-300" 
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
            title={isLooping ? "Auto-Loop: Enabled (repeats at end)" : "Auto-Loop: Disabled (stops at end)"}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          {/* Close Time Travel Bar */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Exit Time Travel Mode"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Playback Buttons + Timeline Scrubber Track */}
      <div className="flex items-center gap-3">
        
        {/* Playback Buttons Group */}
        <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 flex-shrink-0">
          <button
            onClick={handleJumpToStart}
            disabled={currentStep === 0}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Jump to Genesis (T0)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleStepBack}
            disabled={currentStep === 0}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Step Backward"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              isPlaying
                ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            }`}
            title={isPlaying ? "Pause Playback" : "Play Timeline Animation"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            disabled={currentStep === totalSteps - 1}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleJumpToEnd}
            disabled={currentStep === totalSteps - 1}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Jump to Terminal Sweep (TN)"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrubber Slider Track with Milestone Markers */}
        <div className="relative flex-1 flex flex-col justify-center">
          
          {/* Milestone Tick Markers */}
          <div className="relative w-full h-3 mb-1">
            {milestoneTicks.map((tick) => (
              <button
                key={tick.stepIndex}
                onClick={() => onStepChange && onStepChange(tick.stepIndex)}
                style={{ left: `${tick.percent}%` }}
                className={`absolute top-0 -translate-x-1/2 flex flex-col items-center cursor-pointer group transition-all`}
                title={`${tick.shortLabel}: ${tick.description}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    tick.stepIndex <= currentStep 
                      ? "bg-cyan-400 scale-125 shadow-[0_0_6px_rgba(6,182,212,0.8)]" 
                      : "bg-zinc-700 group-hover:bg-zinc-500"
                  }`}
                />
                <span className="text-[8.5px] text-zinc-500 group-hover:text-cyan-300 mt-0.5 leading-none">
                  {tick.shortLabel}
                </span>
              </button>
            ))}
          </div>

          {/* Range Input Slider */}
          <input
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={handleSliderChange}
            className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-zinc-800 focus:outline-none focus:border-cyan-400 transition-all"
            style={{
              background: `linear-gradient(to right, #06b6d4 0%, #3b82f6 ${progressPct}%, #18181b ${progressPct}%, #18181b 100%)`
            }}
          />
        </div>
      </div>

      {/* Bottom Telemetry Strip: Active Event Description & Real-Time Metrics */}
      <div className="flex items-center justify-between gap-4 pt-1 border-t border-zinc-800/80 text-[11px]">
        
        {/* Active Transfer Description */}
        <div className="flex items-center gap-2 truncate flex-1">
          <Activity className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 animate-pulse" />
          <span className="text-zinc-300 truncate font-semibold">
            {currentSnapshot.event_description || "Cluster state stable."}
          </span>
        </div>

        {/* Real-Time Snapshot Metrics Badges */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            <span>Active:</span>
            <strong className="text-zinc-200 font-normal">
              {metrics.active_nodes_count || 0} nodes · {metrics.active_links_count || 0} links
            </strong>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            <span>In Motion:</span>
            <strong className="text-amber-300 font-normal">
              {metrics.funds_in_motion ? `${Number(metrics.funds_in_motion).toLocaleString()} USDT` : "0.00 USDT"}
            </strong>
          </div>

          <div className={`flex items-center gap-1 px-2 py-0.5 rounded border ${
            (metrics.offramp_exposure_pct || 0) > 50
              ? "bg-rose-950/70 border-rose-500/50 text-rose-300 font-bold"
              : (metrics.offramp_exposure_pct || 0) > 0
              ? "bg-cyan-950/60 border-cyan-500/40 text-cyan-300"
              : "bg-zinc-900 border-zinc-800 text-zinc-400"
          }`}>
            <ShieldAlert className="w-3 h-3" />
            <span>Off-Ramp Exposure: <strong>{metrics.offramp_exposure_pct || 0}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

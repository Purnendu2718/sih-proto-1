import React, { useEffect, useRef } from "react";

export default function DotGridBackground() {
  const containerRef = useRef(null);
  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const animFrameId = useRef(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!hasMoved.current) {
        currentPos.current = { x: e.clientX, y: e.clientY };
        hasMoved.current = true;
      }
    };

    const handleMouseLeave = () => {
      targetPos.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Smooth 60fps lerp animation for flashlight decay and lag-free feel
    const updatePosition = () => {
      // Lerp factor (0.18 gives snappy responsiveness with smooth deceleration)
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.18;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.18;

      if (containerRef.current) {
        containerRef.current.style.setProperty("--mouse-x", `${currentPos.current.x.toFixed(1)}px`);
        containerRef.current.style.setProperty("--mouse-y", `${currentPos.current.y.toFixed(1)}px`);
      }

      animFrameId.current = requestAnimationFrame(updatePosition);
    };

    animFrameId.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        "--mouse-x": "-1000px",
        "--mouse-y": "-1000px",
      }}
      aria-hidden="true"
    >
      {/* 1. Base Layer: Stealth Dark Contrast Dot Grid (Resting State) */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* 2. Active Overlay: Vibrant Cyan/White Illuminated Dots within Cursor Radius */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: "radial-gradient(rgba(0, 240, 255, 0.85) 1.4px, transparent 1.4px)",
          backgroundSize: "26px 26px",
          WebkitMaskImage: "radial-gradient(circle 280px at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)",
          maskImage: "radial-gradient(circle 280px at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)",
        }}
      />

      {/* 3. Flashlight Radial Ambient Glow (Google Stitch illumination effect) */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle 300px at var(--mouse-x) var(--mouse-y), rgba(0, 240, 255, 0.07) 0%, rgba(0, 240, 255, 0.02) 50%, transparent 100%)",
        }}
      />

      {/* 4. Bottom Vignette Fade to seamlessly blend into lower sections */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#08080a]"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}

import React from "react";

/**
 * Unified Contextual Toolbar
 * Follows the reference design:
 * - One contained horizontal toolbar
 * - Subtle dark surface, thin border, compact controls
 * - Clear vertical separators
 * - Dominant central search/command input
 * - Generous empty space around it (~60-75% width, centered)
 */
export function ToolbarSeparator() {
  return <div className="h-4 w-px bg-[#223247] shrink-0 mx-0.5" />;
}

export function ToolbarButton({
  children,
  onClick,
  icon: Icon,
  variant = "secondary", // "primary" | "secondary" | "subtle" | "danger"
  disabled = false,
  title,
  className = "",
}) {
  const base =
    "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all duration-150 shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none";

  let styles = "";
  if (variant === "primary") {
    styles = "bg-[#00AEEF] hover:bg-[#19B5FE] text-[#07111F] font-semibold shadow-sm";
  } else if (variant === "secondary") {
    styles = "bg-[#0E1B2D] hover:bg-[#162A40] text-[#AAB7C7] hover:text-[#F5F7FA] border border-[#223247]";
  } else if (variant === "subtle") {
    styles = "bg-transparent hover:bg-[#122238] text-[#AAB7C7] hover:text-[#F5F7FA]";
  } else if (variant === "warning") {
    styles = "bg-[#FF8A00]/10 hover:bg-[#FF8A00]/20 text-[#FF8A00] border border-[#FF8A00]/30 font-semibold";
  } else if (variant === "danger") {
    styles = "bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${base} ${styles} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </button>
  );
}

export default function Toolbar({
  children,
  className = "",
}) {
  return (
    <div className="w-full px-4 py-2 shrink-0 flex justify-center z-20">
      <div
        className={`w-full max-w-4xl bg-[#091525]/90 backdrop-blur-md border border-[#223247] rounded-2xl px-3 py-1.5 shadow-lg shadow-black/20 flex items-center gap-2 transition-all ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

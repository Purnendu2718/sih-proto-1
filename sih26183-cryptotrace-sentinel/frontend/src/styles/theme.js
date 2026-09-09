/**
 * theme.js - Centralized SIH 2026 Visual Identity Design System
 * 
 * Palette: SIH-inspired Indian government technology & national cybersecurity.
 * Deep midnight navy dominant (70%), blue-charcoal surfaces (20%), SIH blue/cyan (7%),
 * and restrained saffron/orange accent (2%).
 */

export const SIH_THEME = {
  // Dominant Backgrounds (Approx 70%)
  BACKGROUND: {
    PRIMARY: "#07111F",   // Deep midnight navy (dominant canvas/body)
    SECONDARY: "#091525", // Subtle section contrast
    TERTIARY: "#0B1728",  // Elevated background layer
  },

  // Secondary Surfaces (Approx 20%)
  SURFACE: {
    CARD: "#0E1B2D",      // Default card surface
    ELEVATED: "#122238",  // Hover/Active card surface
    PANEL: "#162A40",     // Drawer / modal surface
    SUBTLE: "rgba(22, 42, 64, 0.4)",
  },

  // Primary Accent (Approx 7%)
  ACCENT: {
    PRIMARY: "#00AEEF",   // SIH-inspired vibrant blue
    LIGHT: "#19B5FE",     // Lighter blue for hover
    DARK: "#0088CC",      // Active state blue
    GLOW: "rgba(0, 174, 239, 0.2)",
    SUBTLE: "rgba(0, 174, 239, 0.1)",
  },

  // Secondary Urgency Accent (Approx 2% - Used ONLY for urgency, alerts, Golden Hour)
  WARNING: {
    SAFFRON: "#FF8A00",   // Restrained Indian/SIH saffron
    AMBER: "#F59E0B",     // Warm amber
    SURFACE: "rgba(255, 138, 0, 0.12)",
    BORDER: "rgba(255, 138, 0, 0.35)",
    TEXT: "#FFB04D",
  },

  // Success / Evidentiary Confirmation (Approx 1%)
  SUCCESS: {
    DEFAULT: "#22C55E",   // Restrained green
    SURFACE: "rgba(34, 197, 94, 0.12)",
    BORDER: "rgba(34, 197, 94, 0.35)",
    TEXT: "#4ADE80",
  },

  // Danger / Critical Alerts
  DANGER: {
    DEFAULT: "#EF4444",   // Restrained red
    SURFACE: "rgba(239, 68, 68, 0.12)",
    BORDER: "rgba(239, 68, 68, 0.35)",
    TEXT: "#F87171",
  },

  // Typography Palette
  TEXT: {
    PRIMARY: "#F5F7FA",   // Warm crisp white
    SECONDARY: "#AAB7C7", // Soft gray-blue
    MUTED: "#6F7C8D",     // Muted slate-blue
    INVERSE: "#07111F",   // Dark navy text for white/accent buttons
  },

  // Structural Dividers & Borders
  BORDER: {
    SUBTLE: "#223247",    // Main SIH navy-slate border
    FAINT: "rgba(34, 50, 71, 0.6)",
    ACTIVE: "#00AEEF",    // Selected element border
  },

  // Investigation Graph Visual Colors
  GRAPH: {
    CANVAS_BG: "#07111F",
    NODE_DEFAULT_BG: "#0E1B2D",
    NODE_DEFAULT_BORDER: "#223247",
    NODE_SELECTED_BORDER: "#00AEEF",
    NODE_TEXT: "#F5F7FA",
    
    // Role-specific graph accents
    ROLE_VICTIM: "#22C55E",          // Green
    ROLE_MULE: "#F59E0B",            // Saffron/Amber
    ROLE_MIXER: "#EF4444",           // Red
    ROLE_CEX_DEPOSIT: "#00AEEF",     // SIH Blue
    ROLE_CEX_HOTWALLET: "#19B5FE",   // Light SIH Blue + Green verified badge
    ROLE_PEEL_OUTLET: "#6F7C8D",     // Muted slate
    ROLE_UNKNOWN: "#4B5563",
    
    // Edges
    EDGE_DEFAULT: "#223247",
    EDGE_PRIMARY_CONDUIT: "#00AEEF", // Bright SIH blue
    EDGE_SECONDARY: "#162A40",
    EDGE_OFFRAMP_HIGHLIGHT: "#22C55E", // Verified green off-ramp
  },
};

export default SIH_THEME;

/**
 * 2026 Theme Configurations for VaniEdge
 */

export type VaniTheme = "emerald" | "cyan" | "violet" | "amber";

export interface ThemeColors {
  id: VaniTheme;
  name: string;
  tagline: string;
  primaryHex: string;
  secondaryHex: string;
  particleColors: [string, string, string];
  accentClass: string;
  bgGradient: string;
  borderClass: string;
  badgeClass: string;
}

export const VANI_THEMES: Record<VaniTheme, ThemeColors> = {
  emerald: {
    id: "emerald",
    name: "Emerald Matrix",
    tagline: "Bio-Digital High Velocity",
    primaryHex: "#10b981",
    secondaryHex: "#34d399",
    particleColors: ["#10b981", "#06b6d4", "#6366f1"],
    accentClass: "text-emerald-400",
    bgGradient: "from-emerald-500 to-teal-400",
    borderClass: "border-emerald-500/40",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  cyan: {
    id: "cyan",
    name: "Aurora Cyan",
    tagline: "Deep Space Quantum Edge",
    primaryHex: "#06b6d4",
    secondaryHex: "#38bdf8",
    particleColors: ["#06b6d4", "#38bdf8", "#818cf8"],
    accentClass: "text-cyan-400",
    bgGradient: "from-cyan-500 to-blue-500",
    borderClass: "border-cyan-500/40",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
  violet: {
    id: "violet",
    name: "Cyber Violet",
    tagline: "Neural Matrix Hyperdrive",
    primaryHex: "#8b5cf6",
    secondaryHex: "#c084fc",
    particleColors: ["#8b5cf6", "#ec4899", "#3b82f6"],
    accentClass: "text-purple-400",
    bgGradient: "from-purple-500 to-pink-500",
    borderClass: "border-purple-500/40",
    badgeClass: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  },
  amber: {
    id: "amber",
    name: "Solar Amber",
    tagline: "High Reliability PSTN Carrier",
    primaryHex: "#f59e0b",
    secondaryHex: "#fbbf24",
    particleColors: ["#f59e0b", "#f97316", "#ef4444"],
    accentClass: "text-amber-400",
    bgGradient: "from-amber-500 to-orange-500",
    borderClass: "border-amber-500/40",
    badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  },
};

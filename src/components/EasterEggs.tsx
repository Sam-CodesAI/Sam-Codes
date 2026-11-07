"use client";

import React, { useState, useEffect } from "react";
import { soundFx } from "@/utils/sound";
import { useDeveloperShortcut } from "@/hooks/useDeveloperShortcut";
import {
  Terminal,
  X,
  Activity,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";

export default function EasterEggs() {
  const [isOpen, setIsOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scrollPercent, setScrollPercent] = useState(0);
  const [themeMode, setThemeMode] = useState<"midnight" | "matrix">("midnight");

  // Custom hook connecting Shift + D shortcut
  useDeveloperShortcut({
    onToggleModal: () => {
      setIsOpen((prev) => !prev);
      soundFx.playChime(660, 0.08);
    },
  });

  const toggleTheme = () => {
    soundFx.playChime(720, 0.06);
    const newTheme = themeMode === "midnight" ? "matrix" : "midnight";
    setThemeMode(newTheme);

    if (typeof document !== "undefined") {
      if (newTheme === "matrix") {
        document.documentElement.classList.add("theme-matrix");
      } else {
        document.documentElement.classList.remove("theme-matrix");
      }
    }
  };

  useEffect(() => {
    const handleCustomToggle = () => {
      setIsOpen((prev) => !prev);
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollPercent(Math.round((window.scrollY / totalScroll) * 100));
      }
    };

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    handleScroll();

    window.addEventListener("toggle-telemetry", handleCustomToggle);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("toggle-telemetry", handleCustomToggle);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Developer Telemetry Console"
      className="fixed inset-x-4 bottom-4 sm:bottom-6 sm:right-6 sm:left-auto sm:w-96 z-50 rounded-2xl bg-[#1A1D24]/95 border border-[#4D7CFE]/40 p-5 shadow-2xl backdrop-blur-xl font-mono text-xs text-[#E8EAF0] animate-fade-in"
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[#4D7CFE] min-w-0">
          <Terminal size={14} className="shrink-0" />
          <span className="font-bold truncate break-all">DEV_TELEMETRY // CONSOLE</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="p-1 rounded text-[#9299A8] hover:text-[#E8EAF0] transition-colors cursor-pointer shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2.5 text-[11px]">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[#9299A8] shrink-0">Core Runtime:</span>
          <span className="text-[#E8EAF0] truncate break-all">Next.js 16 (App Router)</span>
        </div>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[#9299A8] shrink-0">UI Architecture:</span>
          <span className="text-emerald-400 truncate break-all">React 19 Server Components</span>
        </div>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[#9299A8] shrink-0">CSS Engine:</span>
          <span className="text-[#4D7CFE] truncate break-all">Tailwind CSS v4 (Oxide)</span>
        </div>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[#9299A8] shrink-0">Audio Engine:</span>
          <span className="text-indigo-400 truncate break-all">
            {soundFx.enabled ? "Active (Web Audio API)" : "Muted"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[#9299A8] shrink-0">Viewport:</span>
          <span className="text-[#E8EAF0] truncate break-all">
            {dimensions.width}px × {dimensions.height}px
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[#9299A8] shrink-0">Scroll Depth:</span>
          <span className="text-amber-400 truncate break-all">{scrollPercent}%</span>
        </div>
        <div className="flex items-center justify-between gap-2 min-w-0 pt-2 border-t border-white/[0.06]">
          <span className="text-[#9299A8] shrink-0">Theme Mode:</span>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-2.5 py-1 rounded-lg bg-[#222630] hover:bg-[#282d39] border border-white/[0.1] text-[10px] text-[#4D7CFE] hover:text-[#E8EAF0] transition-all flex items-center gap-1.5 cursor-pointer truncate break-all"
          >
            {themeMode === "midnight" ? <Moon size={11} /> : <Sun size={11} />}
            <span className="capitalize">{themeMode}</span>
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#9299A8] min-w-0">
        <span className="flex items-center gap-1 shrink-0">
          <Activity size={12} className="text-[#ccff00] animate-pulse" />
          SYSTEM_ONLINE
        </span>
        <span className="truncate break-all">Press Shift+D to toggle</span>
      </div>
    </div>
  );
}

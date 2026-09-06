"use client";

import React, { useState, useEffect } from "react";
import { soundFx } from "@/utils/sound";
import {
  Terminal,
  X,
  Activity,
} from "lucide-react";

export default function EasterEggs() {
  const [isOpen, setIsOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        soundFx.playChime(660, 0.08);
      }
    };

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

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toggle-telemetry", handleCustomToggle);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
      className="fixed inset-x-4 bottom-4 sm:bottom-6 sm:right-6 sm:left-auto sm:w-96 z-50 rounded-2xl bg-[#090d1c]/95 border border-sky-500/40 p-5 shadow-2xl backdrop-blur-xl font-mono text-xs text-slate-300 animate-fade-in"
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-sky-400">
          <Terminal size={14} />
          <span className="font-bold">DEV_TELEMETRY // CONSOLE</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2 text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-500">Core Runtime:</span>
          <span className="text-white">Next.js 16 (App Router)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">UI Architecture:</span>
          <span className="text-emerald-400">React 19 Server Components</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">CSS Engine:</span>
          <span className="text-sky-400">Tailwind CSS v4 (Oxide)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Audio Engine:</span>
          <span className="text-indigo-400">
            {soundFx.enabled ? "Active (Web Audio API)" : "Muted"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Viewport:</span>
          <span className="text-slate-200">
            {dimensions.width}px × {dimensions.height}px
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Scroll Depth:</span>
          <span className="text-amber-400">{scrollPercent}%</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Activity size={12} className="text-emerald-400 animate-pulse" />
          SYSTEM_ONLINE
        </span>
        <span>Press Shift+D to toggle</span>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { soundFx } from "@/utils/sound";

export default function CinematicIntro() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Check if user already saw the intro during this session
    const hasSeenIntro = sessionStorage.getItem("samcodes_intro_seen");
    if (hasSeenIntro) {
      return;
    }

    setVisible(true);

    const t1 = setTimeout(() => {
      setStep(1);
      soundFx.playChime(320, 0.08);
    }, 400);

    const t2 = setTimeout(() => {
      setStep(2);
      soundFx.playChime(480, 0.08);
    }, 1100);

    const t3 = setTimeout(() => {
      setStep(3);
      soundFx.playChime(640, 0.12);
    }, 1800);

    const t4 = setTimeout(() => {
      dismissIntro();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const dismissIntro = () => {
    setVisible(false);
    sessionStorage.setItem("samcodes_intro_seen", "true");
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label="System Initializing"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#06080f] px-6 transition-opacity duration-700 select-none"
    >
      <div className="relative flex flex-col items-center text-center max-w-md w-full">
        {/* Subtle grid line accent */}
        <div className="absolute -top-16 w-32 h-[1px] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-sky-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>SYSTEM_BOOT // KERNEL v1.0</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
          SAM CODES
        </h1>

        <p className="text-xs sm:text-sm font-mono text-slate-400 tracking-wider uppercase h-6">
          {step === 0 && "Initializing Neural Substrates..."}
          {step === 1 && "Calibrating Agentic Pipelines..."}
          {step === 2 && "Synchronizing Digital Identity..."}
          {step >= 3 && "Environment Ready."}
        </p>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-white/[0.08] rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>

        {/* Skip button */}
        <button
          onClick={dismissIntro}
          className="mt-8 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-4 cursor-pointer"
        >
          [ Skip to Content ]
        </button>
      </div>
    </div>
  );
}

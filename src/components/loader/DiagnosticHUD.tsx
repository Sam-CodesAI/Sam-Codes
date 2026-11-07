"use client";

import React from "react";
import { useLoaderStore } from "@/store/useLoaderStore";
import { sound } from "@/utils/sound";
import { Volume2, VolumeX, Check } from "lucide-react";

export function DiagnosticHUD({ onSkip }: { onSkip: () => void }) {
  const progress = useLoaderStore((s) => s.progress);
  const phaseNumber = useLoaderStore((s) => s.phaseNumber);
  const phaseLabel = useLoaderStore((s) => s.phaseLabel);
  const coords = useLoaderStore((s) => s.coords);
  const diagnostics = useLoaderStore((s) => s.diagnostics);
  const isMuted = useLoaderStore((s) => s.isMuted);
  const toggleMute = useLoaderStore((s) => s.toggleMute);

  // SVG Circular Gauge calculation
  const circleRadius = 52;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-8 md:p-10 z-20 font-mono select-none overflow-hidden text-[#E8EAF0]">
      {/* ================= TOP SECTION ================= */}
      <header className="flex items-start justify-between gap-4">
        {/* Top-Left: Brand & System Label (Matching Reference) */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            {/* Cyan Chevron Monogram Mark */}
            <svg
              className="w-5 h-5 text-[#00e5ff] drop-shadow-[0_0_8px_#00e5ff]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 6 12 14 20 6" />
              <polyline points="4 12 12 20 20 12" />
            </svg>

            <span className="font-heading font-black text-lg sm:text-xl tracking-[0.15em] text-[#E8EAF0]">
              SAM CODES
            </span>
          </div>

          <div className="text-[11px] sm:text-xs text-[#00e5ff] tracking-[0.25em] font-medium">
            QUANTUM CORE SYSTEM
          </div>
          <div className="text-[9px] sm:text-[10px] text-[#9299A8] tracking-[0.2em]">
            INITIALIZATION SEQUENCE v1.0
          </div>
        </div>

        {/* Top-Right: SC-001 Coordinates HUD Bracket (Matching Reference) */}
        <div className="flex items-start gap-3 pointer-events-auto">
          {/* Audio & Skip Controls */}
          <button
            type="button"
            onClick={() => {
              sound.playTelemetryTick(700, isMuted);
              toggleMute();
            }}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-[#161b24]/80 hover:bg-[#222a38] border border-white/10 text-[#9299A8] hover:text-[#00e5ff] transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center backdrop-blur-md"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-[#00e5ff]" />}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="px-3 py-1.5 rounded-lg bg-[#161b24]/80 hover:bg-[#00e5ff]/20 border border-white/10 hover:border-[#00e5ff]/50 text-[#9299A8] hover:text-[#E8EAF0] text-[10px] tracking-wider transition-all cursor-pointer backdrop-blur-md min-h-[38px] flex items-center justify-center"
          >
            SKIP [ESC]
          </button>

          {/* SC-001 HUD Bracket */}
          <div className="relative p-3 rounded-lg bg-[#10141d]/75 border border-cyan-500/30 backdrop-blur-md text-[10px] sm:text-[11px] leading-tight space-y-0.5 min-w-[105px]">
            {/* Corner Cyber Brackets */}
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#00e5ff]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#00e5ff]" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#00e5ff]" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#00e5ff]" />

            <div className="text-[#9299A8] text-right font-bold tracking-wider">- SC-001</div>
            <div className="flex justify-between gap-3 text-[#9299A8]">
              <span>X:</span>
              <span className="text-[#E8EAF0]">{coords.x.toFixed(4)}</span>
            </div>
            <div className="flex justify-between gap-3 text-[#9299A8]">
              <span>Y:</span>
              <span className="text-[#E8EAF0]">{coords.y.toFixed(4)}</span>
            </div>
            <div className="flex justify-between gap-3 text-[#9299A8]">
              <span>Z:</span>
              <span className="text-[#E8EAF0]">{coords.z.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MIDDLE SECTION (LEFT DIAGNOSTICS & RIGHT RADIAL GAUGE) ================= */}
      <div className="flex items-center justify-between w-full pointer-events-none">
        {/* Left-Center: SYSTEM DIAGNOSTICS Card (Matching Reference) */}
        <div className="relative p-4 sm:p-5 rounded-xl bg-[#10141d]/80 border border-cyan-500/25 backdrop-blur-md text-xs space-y-2.5 min-w-[210px] sm:min-w-[240px]">
          {/* Cyber Corner Notches */}
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#00e5ff]" />
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#00e5ff]" />
          <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#00e5ff]" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#00e5ff]" />

          <div className="text-[11px] font-bold text-[#E8EAF0] tracking-[0.2em] pb-1.5 border-b border-white/[0.08]">
            SYSTEM DIAGNOSTICS
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#9299A8]">Core Reactor</span>
              <span
                className={`flex items-center gap-1 font-semibold ${
                  diagnostics.coreReactor ? "text-[#00e5ff]" : "text-[#9299A8]/40"
                }`}
              >
                <Check size={12} />
                <span>ONLINE</span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-[#9299A8]">Particle Engine</span>
              <span
                className={`flex items-center gap-1 font-semibold ${
                  diagnostics.particleEngine ? "text-[#00e5ff]" : "text-[#9299A8]/40"
                }`}
              >
                <Check size={12} />
                <span>ONLINE</span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-[#9299A8]">Render Pipeline</span>
              <span
                className={`flex items-center gap-1 font-semibold ${
                  diagnostics.renderPipeline ? "text-[#00e5ff]" : "text-[#9299A8]/40"
                }`}
              >
                <Check size={12} />
                <span>ONLINE</span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-[#9299A8]">UI Framework</span>
              <span
                className={`flex items-center gap-1 font-semibold ${
                  diagnostics.uiFramework ? "text-[#00e5ff]" : "text-[#9299A8]/40"
                }`}
              >
                <Check size={12} />
                <span>ONLINE</span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/[0.05]">
              <span className="text-[#9299A8]">System Integrity</span>
              <span
                className={`flex items-center gap-1 font-semibold ${
                  diagnostics.systemIntegrity ? "text-[#00e5ff]" : "text-[#9299A8]/60"
                }`}
              >
                <Check size={12} />
                <span>{progress >= 95 ? "99.8%" : `${(progress * 0.998).toFixed(1)}%`}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right-Center: Circular Radial Progress Meter (Matching Reference) */}
        <div className="relative p-5 sm:p-6 rounded-xl bg-[#10141d]/80 border border-cyan-500/25 backdrop-blur-md flex flex-col items-center justify-center min-w-[150px] sm:min-w-[170px]">
          {/* Cyber Corner Notches */}
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#00e5ff]" />
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#00e5ff]" />
          <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#00e5ff]" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#00e5ff]" />

          {/* Radial Gauge SVG */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
              {/* Outer Dashed Track */}
              <circle
                cx="60"
                cy="60"
                r={circleRadius}
                fill="transparent"
                stroke="#1e2430"
                strokeWidth="5"
                strokeDasharray="3 3"
              />
              {/* Active Progress Arc */}
              <circle
                cx="60"
                cy="60"
                r={circleRadius}
                fill="transparent"
                stroke="#00e5ff"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-150 ease-out"
                style={{
                  filter: "drop-shadow(0 0 8px #00e5ff)",
                }}
              />
            </svg>

            {/* Inner Percentage & Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-heading font-black text-[#E8EAF0] tracking-tight">
                {Math.round(progress)}%
              </span>
              <span className="text-[9px] text-[#00e5ff] tracking-widest uppercase font-bold">
                INITIALIZING
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <footer className="space-y-4">
        {/* Center Bottom: SAM CODES // INTELLIGENCE IN MOTION */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black tracking-[0.18em] text-[#E8EAF0] drop-shadow-[0_0_35px_rgba(0,229,255,0.45)]">
            SAM CODES
          </h2>
          <div className="text-xs sm:text-sm text-[#00e5ff] tracking-[0.38em] font-medium uppercase">
            INTELLIGENCE IN MOTION
          </div>
        </div>

        {/* Bottom Horizontal Progress Bar with Audio Equalizers on sides */}
        <div className="flex items-center justify-center gap-4 w-full max-w-4xl mx-auto">
          {/* Left Audio Equalizer Waveform */}
          <div className="hidden sm:flex items-end gap-1 h-5 w-16 opacity-75">
            <span className="w-1 bg-[#00e5ff] animate-pulse h-3" />
            <span className="w-1 bg-[#00e5ff] animate-pulse h-5" />
            <span className="w-1 bg-[#00e5ff] animate-pulse h-2" />
            <span className="w-1 bg-[#00e5ff] animate-pulse h-4" />
            <span className="w-1 bg-[#00e5ff] animate-pulse h-1" />
          </div>

          {/* Central Progress Bar Track */}
          <div className="flex-1 max-w-xl">
            <div className="w-full h-2 rounded-full bg-[#161b24] border border-cyan-500/25 p-0.5 overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0051ff] via-[#00e5ff] to-[#ffffff] transition-all duration-100 ease-out shadow-[0_0_12px_#00e5ff]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Phase Subtitle */}
            <div className="text-center text-[10px] sm:text-[11px] text-[#9299A8] tracking-[0.25em] font-bold mt-2 uppercase">
              PHASE {phaseNumber} &nbsp;—&nbsp; {phaseLabel}
            </div>
          </div>

          {/* Right Audio Equalizer Waveform */}
          <div className="hidden sm:flex items-end gap-1 h-5 w-16 opacity-75">
            <span className="w-1 bg-[#00e5ff] animate-pulse h-2" />
            <span className="w-1 bg-[#00e5ff] animate-pulse h-4" />
            <span className="w-1 bg-[#00e5ff] animate-pulse h-5" />
            <span className="w-1 bg-[#00e5ff] animate-pulse h-3" />
            <span className="w-1 bg-[#00e5ff] animate-pulse h-1" />
          </div>
        </div>
      </footer>
    </div>
  );
}

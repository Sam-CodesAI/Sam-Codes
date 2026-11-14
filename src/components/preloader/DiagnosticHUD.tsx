"use client";

import React from "react";
import { Activity, Cpu, ShieldCheck, Terminal } from "lucide-react";

export interface DiagnosticProps {
  progress: number; // 0 to 100
  phase: string;
  renderEngine: string;
  assetCount: number;
  coreStatus: string;
  fps: number;
  phaseNumber: string;
  isReady: boolean;
}

export default function DiagnosticHUD({
  progress,
  phase,
  renderEngine,
  assetCount,
  coreStatus,
  fps,
  phaseNumber,
  isReady,
}: DiagnosticProps) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden"
    >
      {/* Top Bar HUD */}
      <div className="flex items-center justify-between border-b border-[#292E38] pb-3 text-xs tracking-wider">
        {/* Top-Left: SAM CODES Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4D7CFE] shadow-[0_0_8px_#4D7CFE] animate-pulse" />
            <span className="quantum-brand-text font-bold text-sm text-[#E8EAF0] tracking-widest">
              SAM CODES
            </span>
          </div>
          <span className="hidden sm:inline-block text-[#6F7786]">|</span>
          <span className="hidden sm:inline-block quantum-hud-text text-[11px] text-[#9299A8]">
            ARCH: HYBRID QUANTUM RUNTIME
          </span>
        </div>

        {/* Top-Right: System Model */}
        <div className="flex items-center gap-2.5">
          <span className="quantum-hud-text text-[11px] font-medium text-[#4D7CFE]">
            QUANTUM CORE SYSTEM
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1A1D24] border border-[#292E38] text-[#9299A8]">
            v2.6.4
          </span>
        </div>
      </div>

      {/* Middle Diagnostic Layer (Left Telemetry + Right Progress) */}
      <div className="flex flex-1 items-center justify-between py-6">
        {/* Left Diagnostic Panel */}
        <div className="flex flex-col gap-3 max-w-[240px] sm:max-w-[280px]">
          <div className="quantum-corner-tl p-3.5 bg-[#101216]/80 backdrop-blur-md rounded-br-lg border-r border-b border-[#292E38]">
            <div className="flex items-center gap-2 mb-2.5 text-[10px] uppercase font-mono tracking-wider text-[#4D7CFE]">
              <Terminal size={12} />
              <span>Diagnostic Telemetry</span>
            </div>

            <div className="space-y-1.5 quantum-hud-text text-[11px]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#6F7786]">ENGINE</span>
                <span className="text-[#E8EAF0] font-medium truncate">{renderEngine}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#6F7786]">ROUTES</span>
                <span className="text-[#E8EAF0] font-mono">{assetCount} VERIFIED</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#6F7786]">CORE</span>
                <span className="text-[#4D7CFE] font-bold">{coreStatus}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#6F7786]">FPS</span>
                <span className="text-[#9299A8] font-mono">{fps > 0 ? fps : 60}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Loading Progress Indicator */}
        <div className="flex flex-col items-end gap-2 text-right">
          <div className="quantum-corner-tr p-3.5 bg-[#101216]/80 backdrop-blur-md rounded-bl-lg border-l border-b border-[#292E38] min-w-[140px] sm:min-w-[170px]">
            <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono text-[#9299A8] mb-1 uppercase tracking-wider">
              <Activity size={12} className="text-[#4D7CFE]" />
              <span>INITIALIZING</span>
            </div>

            <div className="quantum-hud-text text-2xl sm:text-3xl font-extrabold text-[#E8EAF0] tracking-tight">
              {Math.floor(progress)}
              <span className="text-xs sm:text-sm font-normal text-[#4D7CFE] ml-0.5">%</span>
            </div>

            {/* Micro Gauge Track */}
            <div className="w-full h-1 bg-[#1A1D24] rounded-full overflow-hidden mt-2 border border-[#292E38]">
              <div
                className="h-full bg-gradient-to-r from-[#4D7CFE] to-[#6990FF] transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status & Phase Indicator */}
      <div className="flex items-center justify-between border-t border-[#292E38] pt-3 text-[11px] quantum-hud-text">
        <div className="flex items-center gap-2 text-[#9299A8]">
          <span className="px-1.5 py-0.5 rounded bg-[#1A1D24] border border-[#292E38] text-[10px] text-[#4D7CFE] font-bold">
            {phaseNumber}
          </span>
          <span className="tracking-wider uppercase text-[#E8EAF0]">{phase}</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#6F7786]">
          <span className="hidden sm:inline">READINESS:</span>
          <span
            className={`font-semibold ${
              isReady ? "text-emerald-400" : "text-[#4D7CFE]"
            }`}
          >
            {isReady ? "SYNCHRONIZED" : "ALLOCATING"}
          </span>
        </div>
      </div>
    </div>
  );
}

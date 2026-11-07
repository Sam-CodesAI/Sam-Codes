"use client";

import React, { useState } from "react";
import QuantumLoader from "@/components/loader/QuantumLoader";
import { useLoaderStore } from "@/store/useLoaderStore";
import { Sparkles, RotateCcw, ExternalLink, Layers, Cpu, Shield, Zap } from "lucide-react";

export default function HomePage() {
  const isLoaded = useLoaderStore((s) => s.isLoaded);
  const resetLoading = useLoaderStore((s) => s.resetLoading);
  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = () => {
    resetLoading();
    setReplayKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#101216] text-[#E8EAF0] relative overflow-hidden flex flex-col justify-between selection:bg-[#4D7CFE]/30 selection:text-white">
      {/* 1. Initial 3D Quantum Reactor & Diagnostic Particle Genesis Preloader */}
      <QuantumLoader key={replayKey} />

      {/* Background Volumetric Ambient Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-10vw] left-[15vw] w-[50vw] h-[40vw] rounded-full glow-orb-cobalt blur-[140px] opacity-30 z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-10vw] right-[10vw] w-[45vw] h-[45vw] rounded-full glow-orb-cyan blur-[160px] opacity-20 z-0"
      />

      {/* Main Landing Preview Shell */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 sm:py-28 flex flex-col items-center text-center space-y-10">
        {/* Eyebrow Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D24] border border-white/[0.08] text-xs font-mono text-[#85A6FF]">
          <span className="w-2 h-2 rounded-full bg-[#4D7CFE] shadow-[0_0_10px_#4D7CFE] animate-pulse" />
          <span>3D QUANTUM PRELOADER // DEPLOYED &amp; OPERATIONAL</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-[#E8EAF0] leading-[1.08]">
            Architectural Precision in <span className="text-[#4D7CFE]">3D WebGL</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#9299A8] font-sans font-normal max-w-2xl mx-auto leading-relaxed">
            The initial loading animation features an interactive Quantum Reactor, 1,200 magnetic particles, and gyroscopic gimbal physics engineered with Three.js, React Three Fiber, and Postprocessing Bloom.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleReplay}
            className="px-8 py-3.5 rounded-full bg-[#4D7CFE] hover:bg-[#3D6DEE] text-[#E8EAF0] font-sans font-semibold text-sm flex items-center gap-2.5 transition-all shadow-lg shadow-[#4D7CFE]/30 cursor-pointer min-h-[48px]"
          >
            <RotateCcw size={16} />
            <span>Replay 3D Quantum Loader</span>
          </button>

          <a
            href="https://github.com/Sam-CodesAI/Sam-Codes"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3.5 rounded-full bg-[#1A1D24] hover:bg-[#222630] border border-white/[0.08] hover:border-[#4D7CFE]/40 text-[#E8EAF0] font-sans font-medium text-sm flex items-center gap-2.5 transition-all cursor-pointer min-h-[48px]"
          >
            <ExternalLink size={16} className="text-[#9299A8]" />
            <span>View Source on GitHub</span>
          </a>
        </div>

        {/* 3D Preloader Architecture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-8 text-left">
          <div className="p-5 rounded-2xl bg-[#1A1D24]/80 border border-white/[0.08] backdrop-blur-md space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#4D7CFE]/15 text-[#4D7CFE] flex items-center justify-center">
              <Cpu size={16} />
            </div>
            <div className="font-heading font-bold text-sm text-[#E8EAF0]">Quantum Core</div>
            <p className="text-xs text-[#9299A8] leading-relaxed">
              Fluid chromatic distorted energy nucleus powered by Three.js MeshDistortMaterial.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1A1D24]/80 border border-white/[0.08] backdrop-blur-md space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#85A6FF]/15 text-[#85A6FF] flex items-center justify-center">
              <Layers size={16} />
            </div>
            <div className="font-heading font-bold text-sm text-[#E8EAF0]">Gyroscopic Gimbals</div>
            <p className="text-xs text-[#9299A8] leading-relaxed">
              Double counter-rotating wireframe rings that snap into planar alignment on 100%.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1A1D24]/80 border border-white/[0.08] backdrop-blur-md space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#4D7CFE]/15 text-[#4D7CFE] flex items-center justify-center">
              <Zap size={16} />
            </div>
            <div className="font-heading font-bold text-sm text-[#E8EAF0]">Magnetic Cloud</div>
            <p className="text-xs text-[#9299A8] leading-relaxed">
              1,200 particle atoms with simplex noise that magnetically contract into the core.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1A1D24]/80 border border-white/[0.08] backdrop-blur-md space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#85A6FF]/15 text-[#85A6FF] flex items-center justify-center">
              <Shield size={16} />
            </div>
            <div className="font-heading font-bold text-sm text-[#E8EAF0]">Aperture Bloom</div>
            <p className="text-xs text-[#9299A8] leading-relaxed">
              Postprocessing bloom and camera flythrough with zero-cut transition into the page.
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#101216]/80 px-6 py-6 text-center text-xs font-mono text-[#9299A8]">
        SAM CODES // Built with Next.js 16, Three.js, React Three Fiber &amp; Tailwind CSS v4
      </footer>
    </div>
  );
}

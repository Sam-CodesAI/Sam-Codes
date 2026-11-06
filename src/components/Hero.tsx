"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowDownRight, Send, Terminal, Sparkles, ShieldCheck } from "lucide-react";
import { profileData, ProfileData } from "@/data/profile";
import { soundFx } from "@/utils/sound";
import { motion, AnimatePresence } from "motion/react";
import MagneticButton from "@/components/MagneticButton";

// Dynamically load 3D Vector Core to guarantee sub-2s initial load and zero SSR issues
const VectorCore3D = dynamic(() => import("@/components/3d/VectorCore3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[320px] flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border border-blue-500/20 animate-pulse" />
    </div>
  ),
});

const ROLES = [
  "AI Systems Engineer",
  "Vector Engine Author",
  "Edge Telephony Builder",
  "Modern Web Designer",
  "Autonomous Agent Architect",
] as const;

export default function Hero({ profile = profileData }: { profile?: ProfileData }) {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Side: Minimalist Headline & Action Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          {/* Eyebrow: Location & Age */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#080d1a] border border-[#1e293b] backdrop-blur-md mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />
            </span>
            <span className="text-xs font-mono tracking-wider text-slate-300">
              Karnataka, India <span className="text-blue-500">//</span> 17yo Builder
            </span>
          </motion.div>

          {/* Minimalist Headline with Dynamic Flip Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 w-full"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Hi, I am Samarth.
              <br />
              <span className="text-slate-400 font-semibold text-3xl sm:text-4xl md:text-5xl xl:text-6xl">
                I am a{" "}
              </span>
              <span className="inline-block relative min-h-[1.2em] overflow-hidden align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIndex}
                    initial={{ y: 35, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -35, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-300 font-extrabold drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  >
                    {ROLES[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </motion.div>

          {/* Subheadline description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed mb-8"
          >
            Engineering zero-dependency vector retrieval engines, real-time edge telephony pipelines, and autonomous agent loops from first principles. Fast, verifiable, and free of fluff.
          </motion.p>

          {/* Dual Magnetic Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto"
          >
            <MagneticButton pullFactor={0.2}>
              <motion.a
                href="#lab"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => soundFx.playChime(520, 0.08)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
              >
                <span>Explore Projects</span>
                <ArrowDownRight size={17} className="text-blue-200" />
              </motion.a>
            </MagneticButton>

            <MagneticButton pullFactor={0.2}>
              <motion.a
                href="https://t.me/Samarth1306"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => soundFx.playChime(640, 0.08)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#080d1a] hover:bg-[#0f172a] border border-[#1e293b] hover:border-blue-500/40 text-slate-200 hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
              >
                <Send size={15} className="text-blue-400" />
                <span>Talk on Telegram</span>
              </motion.a>
            </MagneticButton>
          </motion.div>

          {/* High-Voltage Micro Telemetry Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg font-mono text-[11px]"
          >
            <div className="p-2.5 rounded-xl bg-[#080d1a]/80 border border-[#1e293b] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
              <div>
                <span className="text-slate-500 text-[9px] uppercase block">SutraDB P50</span>
                <span className="text-white font-bold">0.36ms SIMD</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#080d1a]/80 border border-[#1e293b] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <div>
                <span className="text-slate-500 text-[9px] uppercase block">Edge Voice</span>
                <span className="text-white font-bold">&lt;300ms WebRTC</span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-[#080d1a]/80 border border-[#1e293b] flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#ccff00]" />
              <div>
                <span className="text-slate-500 text-[9px] uppercase block">Code Standard</span>
                <span className="text-white font-bold">Zero Fluff</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Cinematic Portrait & 3D Vector Core (5 cols) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Subtle Electric Cobalt Volumetric Backlight */}
          <div
            aria-hidden="true"
            className="absolute inset-0 w-full h-full rounded-full bg-blue-600/25 blur-[90px] pointer-events-none -z-10"
          />

          {/* 3D WebGL Vector Core Canvas behind/around the portrait */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70">
            <VectorCore3D />
          </div>

          {/* Cinematic Founder Portrait Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[340px] sm:max-w-[400px] aspect-[4/5] flex items-center justify-center"
          >
            {/* The Image with smooth gradient dissolve so shoulders dissolve into Midnight Black */}
            <div
              className="relative w-full h-full rounded-3xl overflow-hidden"
              style={{
                maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
              }}
            >
              <Image
                src="/images/samarth-founder.webp"
                alt="Samarth Nimangre - AI Systems Engineer & Founder"
                fill
                priority
                sizes="(max-width: 768px) 340px, 400px"
                className="object-cover object-top filter contrast-[1.05] brightness-[0.98]"
              />

              {/* Subtle glass reflection edge */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
            </div>

            {/* Floating Glass Holographic Ability Card with Acid Lime Pulsing Dot */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="absolute -bottom-4 left-4 right-4 sm:-bottom-6 sm:left-6 sm:right-6 p-4 rounded-2xl bg-[#080d1a]/85 backdrop-blur-xl border border-[#1e293b] shadow-2xl shadow-blue-950/40 z-20"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-80" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#ccff00] uppercase">
                    AVAILABLE FOR BUILDS
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-400">
                  EST // 2026
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#1e293b]">
                <div className="text-slate-300">
                  <span className="text-slate-500 text-[10px] block">SYSTEM ARCHITECTURE</span>
                  Vector DB · Voice Agents · Web MVPs
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">VELOCITY</span>
                  <span className="text-blue-400 font-bold">Days, Not Months</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

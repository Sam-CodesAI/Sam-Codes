"use client";

import React, { useState, useEffect } from "react";
import { soundFx } from "@/utils/sound";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Shield, Zap } from "lucide-react";

const BOOT_LOGS = [
  { text: "BOOTING SAM_CODES NEURAL INTERFACE v2.0...", status: "OK", color: "text-blue-400" },
  { text: "SUTRA_KERNEL: ONLINE [0.36ms SIMD BLAS]", status: "MOUNTED", color: "text-[#ccff00]" },
  { text: "VANI_EDGE: MOUNTED [WEBRTC_PIPELINE]", status: "ACTIVE", color: "text-blue-400" },
  { text: "AEGIS_AGENT: ACTIVE [AST10_GUARDRAILS]", status: "SECURE", color: "text-[#ccff00]" },
  { text: "TELEFLOW_ROUTER: SYNCHRONIZED [24/7_EDGE]", status: "ONLINE", color: "text-blue-400" },
  { text: "PORTAL APERTURE: ENGAGED [BURST_READY]", status: "READY", color: "text-[#ccff00]" },
];

export default function CinematicIntro() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [bursting, setBursting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenIntro = sessionStorage.getItem("samcodes_intro_seen");
    if (hasSeenIntro) {
      return;
    }

    setVisible(true);

    // Sequence through logs
    const interval = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev < BOOT_LOGS.length - 1) {
          soundFx.playChime(320 + (prev + 1) * 60, 0.05);
          return prev + 1;
        } else {
          clearInterval(interval);
          // Trigger hexagonal aperture portal burst
          setTimeout(() => {
            soundFx.playChime(720, 0.12);
            setBursting(true);
            setTimeout(() => {
              dismissIntro();
            }, 750);
          }, 350);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const dismissIntro = () => {
    setVisible(false);
    sessionStorage.setItem("samcodes_intro_seen", "true");
  };

  if (!mounted || !visible) return null;

  return (
    <motion.div
      role="dialog"
      aria-label="System Initializing"
      animate={{ opacity: bursting ? 0 : 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030509] px-6 select-none overflow-hidden"
    >
      {/* Background Matrix/Hexagon Grid Gridlines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Cyber Console Card (Fades out when portal burst initiates) */}
      <motion.div
        animate={{
          opacity: bursting ? 0 : 1,
          scale: bursting ? 0.92 : 1,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#080d1a]/95 border border-[#1e293b] shadow-2xl shadow-blue-950/60 font-mono text-xs"
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse" />
            <span className="text-white font-bold tracking-wider text-xs sm:text-sm">
              SAM_CODES // CYBER_CONSOLE
            </span>
          </div>
          <span className="text-[10px] text-[#ccff00] px-2 py-0.5 rounded bg-[#ccff00]/10 border border-[#ccff00]/30 font-bold">
            DIAGNOSTIC_READOUT
          </span>
        </div>

        {/* Readout Stream */}
        <div className="space-y-2.5 min-h-[170px] mb-6">
          {BOOT_LOGS.slice(0, currentLine + 1).map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between text-[11px] sm:text-xs"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="text-blue-500 font-bold">&gt;</span>
                <span className="text-slate-300 truncate">{log.text}</span>
              </div>
              <span className={`font-bold shrink-0 text-[10px] ${log.color}`}>
                [{log.status}]
              </span>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#1e293b] rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-[#ccff00] transition-all duration-200"
            style={{ width: `${((currentLine + 1) / BOOT_LOGS.length) * 100}%` }}
          />
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>PORTAL: STANDBY</span>
          <button
            onClick={dismissIntro}
            className="text-slate-400 hover:text-[#ccff00] transition-colors underline underline-offset-4 cursor-pointer"
          >
            [ Skip Initialization ]
          </button>
        </div>
      </motion.div>

      {/* Hexagonal Aperture Portal Burst Overlay (Scale: 0 -> 1.8 -> opacity: 0) */}
      <AnimatePresence>
        {bursting && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 0.9, 1.8], opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            {/* High-Resolution SVG Hexagonal Aperture with Electric Cobalt & Acid Lime Iris Reticles */}
            <svg
              viewBox="-200 -200 400 400"
              className="w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] filter drop-shadow-[0_0_80px_#2563eb]"
            >
              <defs>
                <linearGradient id="hexGradCobalt" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <filter id="glowHex" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Primary Outer Hexagon Aperture Blade */}
              <polygon
                points="0,-170 147.2,-85 147.2,85 0,170 -147.2,85 -147.2,-85"
                fill="none"
                stroke="url(#hexGradCobalt)"
                strokeWidth="5"
                filter="url(#glowHex)"
              />

              {/* Concentric Mid Hexagon */}
              <polygon
                points="0,-130 112.6,-65 112.6,65 0,130 -112.6,65 -112.6,-65"
                fill="rgba(37, 99, 235, 0.12)"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray="16 8"
              />

              {/* High-Voltage Acid Lime Core Hexagon */}
              <polygon
                points="0,-85 73.6,-42.5 73.6,42.5 0,85 -73.6,42.5 -73.6,-42.5"
                fill="none"
                stroke="#ccff00"
                strokeWidth="3.5"
                filter="url(#glowHex)"
              />

              {/* Six Radial Aperture Energy Rays */}
              <line x1="0" y1="-85" x2="0" y2="-190" stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="147.2" y1="-85" x2="190" y2="-110" stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="147.2" y1="85" x2="190" y2="110" stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="0" y1="85" x2="0" y2="190" stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="-147.2" y1="85" x2="-190" y2="110" stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="-147.2" y1="-85" x2="-190" y2="-110" stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 4" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

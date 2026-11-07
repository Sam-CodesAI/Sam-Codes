"use client";

import React, { useState, useEffect } from "react";
import { soundFx } from "@/utils/sound";
import { motion, AnimatePresence } from "motion/react";

const BOOT_LOGS = [
  { text: "INITIALIZING SAM_CODES NEURAL ARCHITECTURE v2.0...", status: "OK", color: "text-[#4D7CFE]" },
  { text: "SUTRA_KERNEL: MOUNTED [0.36ms SIMD HYBRID VECTOR BLAS]", status: "ONLINE", color: "text-[#85A6FF]" },
  { text: "VANI_EDGE: FULL-DUPLEX WEBRTC TELEPHONY SYNCHRONIZED", status: "ACTIVE", color: "text-[#4D7CFE]" },
  { text: "AEGIS_AGENT: AST10 VERIFICATION & SELF-HEALING ARMED", status: "SECURE", color: "text-[#85A6FF]" },
  { text: "TELEFLOW_ROUTER: 24/7 AUTONOMOUS WEBHOOK RUNTIME", status: "ONLINE", color: "text-[#4D7CFE]" },
  { text: "PORTAL APERTURE: ENGAGED [APERTURE BURST READY]", status: "BURST", color: "text-[#85A6FF]" },
];

export default function CinematicIntro() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [bursting, setBursting] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show intro on initial page load
    setVisible(true);

    const interval = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev < BOOT_LOGS.length - 1) {
          soundFx.playChime(320 + (prev + 1) * 60, 0.04);
          return prev + 1;
        } else {
          clearInterval(interval);
          // Trigger hexagonal aperture portal burst
          setTimeout(() => {
            soundFx.playChime(760, 0.12);
            setBursting(true);
            setTimeout(() => {
              setVisible(false);
            }, 600);
          }, 280);
          return prev;
        }
      });
    }, 220);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        dismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const dismiss = () => {
    setBursting(true);
    setTimeout(() => {
      setVisible(false);
    }, 200);
  };

  if (!mounted || !visible) return null;

  return (
    <motion.div
      role="dialog"
      aria-label="System Initializing"
      animate={{ opacity: bursting ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101216] px-6 select-none overflow-hidden"
    >
      {/* Background Matrix/Hexagon Grid Gridlines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #4D7CFE 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Cyber Console Card */}
      <motion.div
        animate={{
          opacity: bursting ? 0 : 1,
          scale: bursting ? 0.94 : 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#1A1D24]/95 border border-white/10 shadow-2xl shadow-black/80 font-mono text-xs backdrop-blur-2xl"
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4D7CFE] shadow-[0_0_8px_#4D7CFE] animate-pulse" />
            <span className="text-[#E8EAF0] font-heading font-bold tracking-wider text-xs sm:text-sm">
              SAM_CODES // CYBER_BOOT
            </span>
          </div>
          <span className="text-[10px] text-[#4D7CFE] px-2 py-0.5 rounded bg-[#4D7CFE]/10 border border-[#4D7CFE]/30 font-bold">
            NEURAL_CORE
          </span>
        </div>

        {/* Readout Stream */}
        <div className="space-y-2.5 min-h-[160px] mb-6">
          {BOOT_LOGS.slice(0, currentLine + 1).map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center justify-between gap-3 text-[#9299A8]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[#4D7CFE] text-[10px]">&gt;&gt;</span>
                <span className="truncate text-[11px] sm:text-xs text-[#9299A8] font-mono">{log.text}</span>
              </div>
              <span className={`text-[10px] font-bold shrink-0 font-mono ${log.color}`}>
                [{log.status}]
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom Status & Skip Action */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-[11px] text-[#9299A8]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4D7CFE] animate-ping" />
            <span className="font-mono text-[#9299A8] text-[11px]">
              {currentLine === BOOT_LOGS.length - 1 ? "PORTAL READY" : "LOADING SYSTEMS..."}
            </span>
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="px-3 py-1 rounded bg-[#222630] hover:bg-[#4D7CFE]/20 text-[#9299A8] hover:text-[#E8EAF0] border border-white/[0.08] hover:border-[#4D7CFE]/40 transition-colors font-mono cursor-pointer text-[11px]"
          >
            SKIP [ESC]
          </button>
        </div>
      </motion.div>

      {/* Hexagonal Aperture Portal Burst (Expanding anime portal warp) */}
      <AnimatePresence>
        {bursting && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ scale: 3.5, opacity: 1, rotate: 90 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute z-20 w-[420px] h-[420px] sm:w-[580px] sm:h-[580px] flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#4D7CFE] drop-shadow-[0_0_50px_#4D7CFE]">
              {/* Outer Hexagon Aperture */}
              <polygon
                points="50,2 93,25 93,75 50,98 7,75 7,25"
                fill="none"
                stroke="url(#portalGradient)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {/* Middle Aperture Ring */}
              <circle cx="50" cy="50" r="30" fill="none" stroke="#4D7CFE" strokeWidth="1" opacity="0.8" />
              {/* Inner Portal Core */}
              <circle cx="50" cy="50" r="14" fill="#4D7CFE" opacity="0.4" />
              <circle cx="50" cy="50" r="4" fill="#85A6FF" />
              <defs>
                <linearGradient id="portalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4D7CFE" />
                  <stop offset="50%" stopColor="#85A6FF" />
                  <stop offset="100%" stopColor="#3D6DEE" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

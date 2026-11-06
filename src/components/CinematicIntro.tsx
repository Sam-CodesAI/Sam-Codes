"use client";

import React, { useState, useEffect } from "react";
import { soundFx } from "@/utils/sound";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Shield, Zap, Sparkles } from "lucide-react";

const BOOT_LOGS = [
  { text: "INITIALIZING SAM_CODES NEURAL ARCHITECTURE v2.0...", status: "OK", color: "text-blue-400" },
  { text: "SUTRA_KERNEL: MOUNTED [0.36ms SIMD HYBRID VECTOR BLAS]", status: "ONLINE", color: "text-[#ccff00]" },
  { text: "VANI_EDGE: FULL-DUPLEX WEBRTC TELEPHONY SYNCHRONIZED", status: "ACTIVE", color: "text-blue-400" },
  { text: "AEGIS_AGENT: AST10 VERIFICATION & SELF-HEALING ARMED", status: "SECURE", color: "text-[#ccff00]" },
  { text: "TELEFLOW_ROUTER: 24/7 AUTONOMOUS WEBHOOK RUNTIME", status: "ONLINE", color: "text-blue-400" },
  { text: "PORTAL APERTURE: ENGAGED [APERTURE BURST READY]", status: "BURST", color: "text-[#ccff00]" },
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030509] px-6 select-none overflow-hidden"
    >
      {/* Background Matrix/Hexagon Grid Gridlines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)`,
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
        className="relative z-10 w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#080d1a]/95 border border-[#1e293b] shadow-2xl shadow-blue-950/80 font-mono text-xs backdrop-blur-2xl"
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse" />
            <span className="text-white font-bold tracking-wider text-xs sm:text-sm">
              SAM_CODES // CYBER_BOOT
            </span>
          </div>
          <span className="text-[10px] text-[#ccff00] px-2 py-0.5 rounded bg-[#ccff00]/10 border border-[#ccff00]/30 font-bold">
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
              className="flex items-center justify-between gap-3 text-slate-300"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-blue-500 text-[10px]">&gt;&gt;</span>
                <span className="truncate text-[11px] sm:text-xs text-slate-300">{log.text}</span>
              </div>
              <span className={`text-[10px] font-bold shrink-0 font-mono ${log.color}`}>
                [{log.status}]
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom Status & Skip Action */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1e293b] text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-ping" />
            <span className="font-mono text-slate-400">
              {currentLine === BOOT_LOGS.length - 1 ? "PORTAL READY" : "LOADING SYSTEMS..."}
            </span>
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="px-3 py-1 rounded bg-[#0f172a] hover:bg-blue-600/20 text-slate-400 hover:text-white border border-[#1e293b] hover:border-blue-500/40 transition-colors font-mono cursor-pointer"
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
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500 drop-shadow-[0_0_50px_#3b82f6]">
              {/* Outer Hexagon Aperture */}
              <polygon
                points="50,2 93,25 93,75 50,98 7,75 7,25"
                fill="none"
                stroke="url(#portalGradient)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {/* Middle Aperture Ring */}
              <circle cx="50" cy="50" r="30" fill="none" stroke="#ccff00" strokeWidth="1" opacity="0.8" />
              {/* Inner Portal Core */}
              <circle cx="50" cy="50" r="14" fill="#2563eb" opacity="0.4" />
              <circle cx="50" cy="50" r="4" fill="#ccff00" />
              <defs>
                <linearGradient id="portalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#ccff00" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

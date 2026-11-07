"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { useLoaderStore } from "@/store/useLoaderStore";
import { DiagnosticHUD } from "./DiagnosticHUD";
import { sound } from "@/utils/sound";

// Dynamic import with SSR false to prevent WebGL window errors during static Next.js compilation
const QuantumReactorScene = dynamic(
  () => import("@/components/3d/QuantumReactorScene"),
  { ssr: false }
);

interface QuantumLoaderProps {
  onComplete?: () => void;
}

export default function QuantumLoader({ onComplete }: QuantumLoaderProps) {
  const progress = useLoaderStore((s) => s.progress);
  const phase = useLoaderStore((s) => s.phase);
  const isLoaded = useLoaderStore((s) => s.isLoaded);
  const isMuted = useLoaderStore((s) => s.isMuted);
  const setProgress = useLoaderStore((s) => s.setProgress);
  const completeLoading = useLoaderStore((s) => s.completeLoading);

  const reqIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Skip handler
  const handleSkip = () => {
    sound.playApertureWarp(isMuted);
    completeLoading();
    onComplete?.();
  };

  useEffect(() => {
    // Start ambient reactor audio
    sound.startReactorHum(isMuted);

    // Keyboard shortcut handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Smooth progressive loading timeline (~2.8 seconds total)
    const duration = 2800;

    const animateProgress = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const linearProgress = Math.min(1, elapsed / duration);

      // Cubic ease-in-out curve
      const easedProgress =
        linearProgress < 0.5
          ? 4 * linearProgress * linearProgress * linearProgress
          : 1 - Math.pow(-2 * linearProgress + 2, 3) / 2;

      const currentPercent = Math.min(100, Math.round(easedProgress * 1000) / 10);
      setProgress(currentPercent);
      sound.updateReactorFrequency(currentPercent, isMuted);

      if (linearProgress < 1) {
        reqIdRef.current = requestAnimationFrame(animateProgress);
      } else {
        // 100% Reached: Trigger Aperture Warp & Complete
        sound.playApertureWarp(isMuted);
        setTimeout(() => {
          completeLoading();
          onComplete?.();
        }, 650);
      }
    };

    reqIdRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      sound.stopReactorHum();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="quantum-loader-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 bg-[#101216] overflow-hidden select-none"
        >
          {/* Background Matrix Starfield & Gridlines */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #4D7CFE 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* 3D WebGL Reactor Scene */}
          <QuantumReactorScene />

          {/* Real-time Telemetry HUD Layer */}
          <DiagnosticHUD onSkip={handleSkip} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

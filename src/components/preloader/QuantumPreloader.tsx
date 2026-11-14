"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import DiagnosticHUD from "./DiagnosticHUD";
import "./preloader.css";

// Dynamically load QuantumScene to keep main bundle lean and SSR-safe
const QuantumScene = dynamic(() => import("./QuantumScene"), {
  ssr: false,
});

const PHASES = [
  { number: "PHASE 01", label: "AWAKENING", threshold: 25 },
  { number: "PHASE 02", label: "PARTICLE GENESIS", threshold: 50 },
  { number: "PHASE 03", label: "REACTOR ACTIVATION", threshold: 75 },
  { number: "PHASE 04", label: "SYSTEM CALIBRATION", threshold: 92 },
  { number: "PHASE 05", label: "SYNCHRONIZED", threshold: 100 },
];

export default function QuantumPreloader() {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(PHASES[0]);
  const [renderEngine, setRenderEngine] = useState("INITIALIZING...");
  const [fps, setFps] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [webGLFailed, setWebGLFailed] = useState(false);

  // Lifecyle and Timer Tracking Refs
  const isMountedRef = useRef(true);
  const exitingRef = useRef(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const failSafeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const domReadyRef = useRef(false);
  const fontsReadyRef = useRef(false);
  const rendererReadyRef = useRef(false);
  const webGLFailedRef = useRef(false);

  // Helper to clear active progress and fail-safe timers immediately
  const clearActiveTimers = useCallback(() => {
    if (progressIntervalRef.current !== null) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (failSafeTimeoutRef.current !== null) {
      clearTimeout(failSafeTimeoutRef.current);
      failSafeTimeoutRef.current = null;
    }
  }, []);

  // Stabilize callback identities so QuantumScene never reinitializes
  const handleFpsUpdate = useCallback((fpsValue: number) => {
    if (isMountedRef.current) {
      setFps(fpsValue);
    }
  }, []);

  const handleRendererReady = useCallback((name: string) => {
    rendererReadyRef.current = true;
    if (isMountedRef.current) {
      setRenderEngine(name);
    }
  }, []);

  const handleWebGLFail = useCallback(() => {
    webGLFailedRef.current = true;
    if (isMountedRef.current) {
      setWebGLFailed(true);
    }
  }, []);

  // Central dismissal handler: clears all active timers immediately,
  // prevents duplicate dismissals, and manages exit animation safely
  const dismiss = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;

    // 1. Immediately cancel active timers
    clearActiveTimers();

    // 2. Persist session token to suppress preloader on reload
    try {
      sessionStorage.setItem("sam_codes_quantum_init", "true");
    } catch {
      // Ignore storage restrictions
    }

    // 3. Mark ready and cap progress to 100%
    if (isMountedRef.current) {
      setIsReady(true);
      setProgress(100);
    }

    // 4. Safely schedule exit transition
    if (exitAnimationTimeoutRef.current !== null) {
      clearTimeout(exitAnimationTimeoutRef.current);
    }

    exitAnimationTimeoutRef.current = setTimeout(() => {
      exitAnimationTimeoutRef.current = null;
      if (isMountedRef.current) {
        setVisible(false);
      }
    }, 450);
  }, [clearActiveTimers]);

  useEffect(() => {
    isMountedRef.current = true;

    // 1. Client-Side Session Storage Gate (Only on initial entry)
    try {
      const hasLoaded = sessionStorage.getItem("sam_codes_quantum_init");
      if (hasLoaded) {
        setShouldRender(false);
        return;
      }
    } catch {
      // Ignore storage read failures
    }

    // 2. Prefers-Reduced-Motion Accessibility Check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      try {
        sessionStorage.setItem("sam_codes_quantum_init", "true");
      } catch {}
      setShouldRender(false);
      return;
    }

    setShouldRender(true);

    // 3. Track Actual Application Readiness
    domReadyRef.current = document.readyState === "complete";

    const onWindowLoad = () => {
      domReadyRef.current = true;
    };

    if (!domReadyRef.current) {
      window.addEventListener("load", onWindowLoad, { once: true });
    }

    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontsReadyRef.current = true;
      });
    } else {
      fontsReadyRef.current = true;
    }

    // 4. Deterministic Progress Curve Connected to Real Readiness
    // Requirements:
    // - Zero random increments
    // - Paced across minimum visual duration (1400ms)
    // - Capped at 85% until actual readiness (DOM + Fonts + Renderer) is satisfied
    // - Fail-safe maximum duration (3800ms) prevents infinite loading
    const startTime = performance.now();
    const MIN_VISUAL_DURATION = 1400; // Pacing target to allow reactor to initialize smoothly
    const MAX_FAILSAFE_DURATION = 3800; // Fail-safe ceiling

    progressIntervalRef.current = setInterval(() => {
      if (exitingRef.current || !isMountedRef.current) return;

      const elapsed = performance.now() - startTime;
      const isActualReady =
        domReadyRef.current &&
        fontsReadyRef.current &&
        (rendererReadyRef.current || webGLFailedRef.current);

      let nextProgress: number;

      if (!isActualReady) {
        // While waiting for real readiness conditions, smoothly progress up to 85% cap
        nextProgress = Math.min(85, (elapsed / MIN_VISUAL_DURATION) * 85);
      } else {
        // Real readiness conditions are satisfied
        if (elapsed < MIN_VISUAL_DURATION) {
          // Progress smoothly towards 90% until visual pacing is achieved
          nextProgress = (elapsed / MIN_VISUAL_DURATION) * 90;
        } else {
          // Smoothly advance from 90% to 100% over 250ms
          const completionFactor = Math.min(1, (elapsed - MIN_VISUAL_DURATION) / 250);
          nextProgress = 90 + completionFactor * 10;
        }
      }

      if (isMountedRef.current) {
        setProgress(nextProgress);

        // Update Phase deterministically
        const matchedPhase =
          PHASES.find((p) => nextProgress <= p.threshold) || PHASES[PHASES.length - 1];
        setCurrentPhase(matchedPhase);
      }

      if (nextProgress >= 100) {
        dismiss();
      }
    }, 35);

    // 5. Fail-Safe Timeout (Guarantees user is never trapped)
    failSafeTimeoutRef.current = setTimeout(() => {
      if (!exitingRef.current) {
        dismiss();
      }
    }, MAX_FAILSAFE_DURATION);

    // 6. Keyboard dismiss shortcut (Escape stops all timers and exits)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      isMountedRef.current = false;

      // Clean up all timers on unmount
      clearActiveTimers();

      if (exitAnimationTimeoutRef.current !== null) {
        clearTimeout(exitAnimationTimeoutRef.current);
        exitAnimationTimeoutRef.current = null;
      }

      window.removeEventListener("load", onWindowLoad);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [clearActiveTimers, dismiss]);

  if (!shouldRender || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-label="Quantum Core System Initializing"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, filter: "blur(8px)" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="quantum-preloader fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden"
      >
        {/* Subtle Ambient Scanline Overlay */}
        <div aria-hidden="true" className="quantum-scanline pointer-events-none absolute inset-0 z-10 opacity-30" />

        {/* 3D Quantum Reactor Canvas or 2D CSS Fallback */}
        {!webGLFailed ? (
          <QuantumScene
            progress={progress}
            onFpsUpdate={handleFpsUpdate}
            onRendererReady={handleRendererReady}
            onWebGLFail={handleWebGLFail}
          />
        ) : (
          <div aria-hidden="true" className="relative flex items-center justify-center w-64 h-64 z-0">
            {/* High-Tech 2D Fallback Reactor */}
            <div className="absolute w-36 h-36 rounded-full bg-[#4D7CFE]/25 blur-2xl animate-pulse" />
            <div className="w-24 h-24 rounded-full border-2 border-[#4D7CFE] border-dashed animate-spin" />
            <div className="absolute w-12 h-12 rounded-full bg-[#4D7CFE] shadow-[0_0_24px_#4D7CFE]" />
          </div>
        )}

        {/* Diagnostic Technical HUD */}
        <DiagnosticHUD
          progress={progress}
          phase={currentPhase.label}
          phaseNumber={currentPhase.number}
          renderEngine={renderEngine}
          pipelineStatus={webGLFailed ? "2D FALLBACK" : "3D HARDWARE"}
          systemStatus={isReady ? "SYNCHRONIZED" : progress >= 85 ? "VERIFYING" : "INITIALIZING"}
          fps={fps}
          isReady={isReady}
          onSkip={dismiss}
        />
      </motion.div>
    </AnimatePresence>
  );
}

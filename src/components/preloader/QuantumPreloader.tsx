"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import DiagnosticHUD from "./DiagnosticHUD";
import "./preloader.css";

// Dynamically load QuantumScene to keep main bundle lean and SSR-safe
const QuantumScene = dynamic(() => import("./QuantumScene"), {
  ssr: false,
});

const PHASES = [
  { number: "PHASE 01", label: "AWAKENING", threshold: 20 },
  { number: "PHASE 02", label: "PARTICLE GENESIS", threshold: 45 },
  { number: "PHASE 03", label: "REACTOR ACTIVATION", threshold: 75 },
  { number: "PHASE 04", label: "SYSTEM DIAGNOSTICS", threshold: 92 },
  { number: "PHASE 05", label: "CORE SYNCHRONIZED", threshold: 100 },
];

export default function QuantumPreloader() {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(PHASES[0]);
  const [renderEngine, setRenderEngine] = useState("INITIALIZING...");
  const [fps, setFps] = useState(60);
  const [isReady, setIsReady] = useState(false);
  const [webGLFailed, setWebGLFailed] = useState(false);

  const exitingRef = useRef(false);

  useEffect(() => {
    // 1. Client-Side Session Storage Gate (Only on initial entry)
    const hasLoaded = sessionStorage.getItem("sam_codes_quantum_init");
    if (hasLoaded) {
      setShouldRender(false);
      return;
    }

    // 2. Prefers-Reduced-Motion Accessibility Check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      sessionStorage.setItem("sam_codes_quantum_init", "true");
      setShouldRender(false);
      return;
    }

    setShouldRender(true);

    // 3. Track Actual Application Readiness
    let domReady = document.readyState === "complete";
    let fontsReady = false;

    const checkDomReady = () => {
      domReady = true;
    };

    if (!domReady) {
      window.addEventListener("load", checkDomReady);
    }

    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontsReady = true;
      });
    } else {
      fontsReady = true;
    }

    // 4. Smooth Coordinated Progress Loop
    const startTime = performance.now();
    const minDuration = 1800; // Pacing target to allow reactor to initialize smoothly without jarring jump
    const maxFailSafeDuration = 4000; // Fail-safe ceiling

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const actualReady = domReady && fontsReady;

      setProgress((prev) => {
        let increment = 1.8 + Math.random() * 2.2;
        if (actualReady && elapsed > minDuration) {
          increment = 5.0 + Math.random() * 4.0;
        }

        const next = Math.min(100, prev + increment);

        // Update Phase
        const matchedPhase =
          PHASES.find((p) => next <= p.threshold) || PHASES[PHASES.length - 1];
        setCurrentPhase(matchedPhase);

        if (next >= 100 && !exitingRef.current) {
          exitingRef.current = true;
          setIsReady(true);
          clearInterval(interval);

          sessionStorage.setItem("sam_codes_quantum_init", "true");

          // Premium exit transition delay
          setTimeout(() => {
            setVisible(false);
          }, 450);
        }

        return next;
      });
    }, 45);

    // 5. Absolute Safety Fail-safe (Guarantees user is never blocked)
    const failSafeTimeout = setTimeout(() => {
      if (!exitingRef.current) {
        exitingRef.current = true;
        sessionStorage.setItem("sam_codes_quantum_init", "true");
        setVisible(false);
      }
    }, maxFailSafeDuration);

    // 6. Keyboard dismiss shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        sessionStorage.setItem("sam_codes_quantum_init", "true");
        setVisible(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      clearTimeout(failSafeTimeout);
      window.removeEventListener("load", checkDomReady);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
            onFpsUpdate={(fpsValue) => setFps(fpsValue)}
            onRendererReady={(name) => setRenderEngine(name)}
            onWebGLFail={() => setWebGLFailed(true)}
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
          assetCount={55}
          coreStatus="OPERATIONAL"
          fps={fps}
          isReady={isReady}
        />
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import React, { useState } from "react";
import { processStepsData, ProcessStep } from "@/data/process";
import { soundFx } from "@/utils/sound";
import { motion, AnimatePresence } from "motion/react";
import MotionReveal from "@/components/MotionReveal";
import { GitCommit, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ProcessSection() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const activeStep: ProcessStep | undefined = processStepsData[activeStepIndex] || processStepsData[0];

  const handleSelectStep = (idx: number) => {
    soundFx.playHover();
    setActiveStepIndex(idx);
  };

  if (!activeStep) {
    return null;
  }

  return (
    <section
      id="process"
      aria-label="Engineering Process"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1e293b]"
    >
      <MotionReveal className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080d1a] border border-[#1e293b] text-xs font-mono text-blue-400 mb-4 uppercase tracking-wider">
          <GitCommit size={13} className="text-[#ccff00]" />
          <span>The Engineering Pipeline</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
          From Raw Concept to Autonomous System
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          A disciplined 7-stage methodology combining velocity with strict software engineering rigor.
        </p>
      </MotionReveal>

      {/* Interactive Step Navigator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
        {processStepsData.map((s, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => handleSelectStep(idx)}
              className={`relative p-3 sm:p-4 rounded-2xl text-left border transition-all cursor-pointer overflow-hidden ${
                isActive
                  ? "bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                  : "bg-[#080d1a] border-[#1e293b] text-slate-400 hover:text-white hover:bg-[#0f172a]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeProcessHighlight"
                  className="absolute inset-0 bg-blue-600/[0.1] pointer-events-none"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center justify-between font-mono text-[10px] mb-1.5">
                <span className={isActive ? "text-blue-400 font-bold" : "text-slate-500"}>
                  0{s.step}
                </span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-ping" />}
              </div>
              <div className="relative z-10 font-bold text-xs sm:text-sm tracking-wide">{s.label}</div>
            </button>
          );
        })}
      </div>

      {/* Active Step Feature Display Card */}
      <div className="rounded-3xl bg-[#080d1a] border border-[#1e293b] p-6 sm:p-10 relative overflow-hidden min-h-[320px] flex flex-col justify-between backdrop-blur-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full relative"
          >
            <div className="absolute top-0 right-0 font-mono text-7xl sm:text-9xl font-black text-white/[0.02] select-none pointer-events-none -mt-4">
              0{activeStep.step}
            </div>

            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/15 text-blue-400 border border-blue-500/30 font-mono text-xs mb-4 font-bold">
                <span>STAGE 0{activeStep.step} // {activeStep.label}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                {activeStep.tagline}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
                {activeStep.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-4 border-t border-[#1e293b]">
                <span className="flex items-center gap-1.5 text-[#ccff00]">
                  <CheckCircle2 size={14} />
                  Validated Milestone
                </span>
                <span className="text-slate-600">|</span>
                <span>Zero Slop Guarantee</span>
                <span className="text-slate-600">|</span>
                <span>High Speed Turnaround</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step Progression Buttons */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-[#1e293b] relative z-10">
          <button
            type="button"
            disabled={activeStepIndex === 0}
            onClick={() => handleSelectStep(Math.max(0, activeStepIndex - 1))}
            className="px-4 py-2 rounded-full bg-[#0f172a] border border-[#1e293b] text-xs font-mono text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer min-h-[44px]"
          >
            ← Previous Stage
          </button>

          <button
            type="button"
            disabled={activeStepIndex === processStepsData.length - 1}
            onClick={() => handleSelectStep(Math.min(processStepsData.length - 1, activeStepIndex + 1))}
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-md shadow-blue-600/25 min-h-[44px]"
          >
            <span>Next Stage</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}

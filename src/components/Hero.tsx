"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowDownRight, ArrowRight, Sparkles } from "lucide-react";
import { profileData, ProfileData } from "@/data/profile";
import { soundFx } from "@/utils/sound";
import { motion, AnimatePresence } from "motion/react";
import MagneticButton from "@/components/MagneticButton";

// Dynamically load 3D Vector Core to guarantee sub-2s initial load and zero SSR issues
const VectorCore3D = dynamic(() => import("@/components/3d/VectorCore3D"), {
  ssr: false,
  loading: () => null,
});

const ROLES = [
  "Web Designer",
  "AI Systems Engineer",
  "Creative Developer",
  "Vector Engine Creator",
  "Autonomous Agent Builder",
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
      className="relative min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 lg:px-12 pt-28 pb-16 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Editorial Typography & Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          {/* Eyebrow: Minimal Location & Identity */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />
            <span className="text-xs font-mono tracking-wider text-slate-300">
              Karnataka, India <span className="text-blue-500">•</span> 17yo Builder
            </span>
          </motion.div>

          {/* Minimalist Headline with Smooth Dynamic Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 w-full"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Hi, I am Samarth.
              <br />
              <span className="text-slate-400 font-semibold text-3xl sm:text-4xl md:text-5xl xl:text-6xl">
                I am a{" "}
              </span>
              <span className="inline-block relative min-h-[1.25em] overflow-hidden align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIndex}
                    initial={{ y: 35, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -35, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-300 font-extrabold drop-shadow-[0_0_24px_rgba(37,99,235,0.4)]"
                  >
                    {ROLES[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </motion.div>

          {/* Subheadline description: Clean, breathable, single thought */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed mb-10"
          >
            Engineering clean-room vector retrieval engines, real-time edge telephony pipelines, and modern web applications from first principles.
          </motion.p>

          {/* Minimalist Action Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <MagneticButton pullFactor={0.15}>
              <motion.a
                href="#lab"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => soundFx.playChime(520, 0.08)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 cursor-pointer border border-blue-400/40"
              >
                <span>Explore Projects</span>
                <ArrowDownRight size={16} className="text-blue-200" />
              </motion.a>
            </MagneticButton>

            <MagneticButton pullFactor={0.15}>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => soundFx.playChime(640, 0.08)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.12] hover:border-white/[0.25] text-slate-200 hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
              >
                <span>Reach Me</span>
                <ArrowRight size={15} className="text-[#ccff00]" />
              </motion.a>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right Side: Editorial Founder Portrait (5 cols) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Subtle Warm & Electric Blue Ambient Rim Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 w-full h-full rounded-full bg-blue-600/20 blur-[100px] pointer-events-none -z-10"
          />

          {/* 3D WebGL Vector Core floating gently behind portrait */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50">
            <VectorCore3D />
          </div>

          {/* Editorial Founder Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[340px] sm:max-w-[400px] aspect-[4/5] flex items-center justify-center"
          >
            {/* The Image with natural gradient dissolve into canvas */}
            <div
              className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
              style={{
                maskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
              }}
            >
              <Image
                src="/images/samarth-founder.webp"
                alt="Samarth Nimangre - Systems Builder & Designer"
                fill
                priority
                sizes="(max-width: 768px) 340px, 400px"
                className="object-cover object-top filter contrast-[1.05] brightness-[0.98]"
              />

              {/* Ultra-subtle specular border */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
            </div>

            {/* Quiet, Elegant Ability Status Pill (Rishi Thakor Style) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="absolute -bottom-3 sm:-bottom-4 left-auto right-auto px-4 py-2 rounded-full bg-[#080d1a]/85 backdrop-blur-xl border border-white/10 shadow-2xl z-20 flex items-center gap-2.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />
              </span>
              <span className="text-xs font-mono font-medium text-slate-200 tracking-wide">
                Available for builds &amp; systems
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

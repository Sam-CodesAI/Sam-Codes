"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { profileData, ProfileData } from "@/data/profile";
import { soundFx } from "@/utils/sound";
import { motion, AnimatePresence } from "motion/react";
import MagneticButton from "@/components/MagneticButton";

const ROLES = [
  "Web Designer",
  "AI Systems Engineer",
  "Creative Developer",
  "Vector Engine Creator",
  "AI Agent Architect",
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
      className="relative min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 lg:px-12 pt-28 pb-16 sm:pb-24 lg:pb-32 mb-12 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Editorial Typography & Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          {/* Eyebrow: Minimal Location & Identity */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1A1D24]/80 border border-white/[0.08] backdrop-blur-md mb-8 max-w-full min-w-0"
          >
            <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00] shrink-0" />
            <span className="text-xs font-mono tracking-wider text-[#9299A8] truncate break-all">
              Karnataka, India <span className="text-[#4D7CFE]">•</span> 17yo Builder
            </span>
          </motion.div>

          {/* Minimalist Headline with Stable Dynamic Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 sm:mb-10 w-full"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#E8EAF0] leading-tight">
              <span className="block">Hi, I am Samarth.</span>
              <div className="text-[#9299A8] font-medium text-xl sm:text-2xl md:text-3xl lg:text-[2rem] mt-2 sm:mt-3 flex items-center gap-x-2 sm:gap-x-3 h-[1.35em] overflow-hidden">
                <span className="text-[#9299A8] shrink-0">I am a</span>
                <div className="relative flex-1 min-w-0 h-[1.35em] overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={roleIndex}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 flex items-center whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#4D7CFE] via-[#85A6FF] to-[#E8EAF0] font-extrabold"
                    >
                      {ROLES[roleIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </h1>
          </motion.div>

          {/* Minimalist Action Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <MagneticButton pullFactor={0.15}>
              <motion.a
                href="#lab"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => soundFx.playChime(520, 0.08)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#4D7CFE] hover:bg-[#3D6DEE] text-[#E8EAF0] font-medium text-sm transition-all shadow-xl shadow-[#4D7CFE]/25 hover:shadow-[#4D7CFE]/45 flex items-center justify-center gap-2 cursor-pointer border border-[#4D7CFE]/50"
              >
                <span>Explore Projects</span>
                <ArrowDownRight size={16} className="text-[#E8EAF0]" />
              </motion.a>
            </MagneticButton>

            <MagneticButton pullFactor={0.15}>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => soundFx.playChime(640, 0.08)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1A1D24] hover:bg-[#222630] border border-white/[0.12] hover:border-[#4D7CFE]/40 text-[#E8EAF0] hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
              >
                <span>Reach Me</span>
                <ArrowRight size={15} className="text-[#ccff00]" />
              </motion.a>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right Side: Editorial Founder Portrait (5 cols) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Editorial Founder Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[390px] aspect-[4/5] flex items-center justify-center"
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
              className="absolute -bottom-3 sm:-bottom-4 left-auto right-auto px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#1A1D24]/90 backdrop-blur-xl border border-white/10 shadow-2xl z-20 flex items-center gap-2 max-w-[95%] min-w-0"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />
              </span>
              <span className="text-[11px] sm:text-xs font-mono font-medium text-[#E8EAF0] tracking-tight sm:tracking-wide whitespace-nowrap">
                Available for builds &amp; systems
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

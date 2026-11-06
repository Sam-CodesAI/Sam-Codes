"use client";

import React, { useState } from "react";
import { soundFx } from "@/utils/sound";
import { motion } from "motion/react";
import {
  NextjsIcon,
  ReactIcon,
  TypeScriptIcon,
  PythonIcon,
  TailwindIcon,
  SupabaseIcon,
  PostgresIcon,
  ThreejsIcon,
  DockerIcon,
  GithubIcon,
} from "@/components/TechLogos";

const STACK = [
  { name: "Next.js 16", icon: NextjsIcon },
  { name: "React 19", icon: ReactIcon },
  { name: "TypeScript", icon: TypeScriptIcon },
  { name: "Python 3", icon: PythonIcon },
  { name: "Tailwind CSS", icon: TailwindIcon },
  { name: "Supabase", icon: SupabaseIcon },
  { name: "PostgreSQL", icon: PostgresIcon },
  { name: "Three.js", icon: ThreejsIcon },
  { name: "Docker", icon: DockerIcon },
  { name: "Git", icon: GithubIcon },
];

// Triplicate for seamless 100% infinite marquee loop
const MARQUEE_STACK = [...STACK, ...STACK, ...STACK];

export default function TechEcosystem() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      aria-label="Core Technology Wave"
      className="relative py-10 px-0 max-w-7xl mx-auto border-y border-white/[0.06] overflow-hidden"
    >
      {/* Top Header Label */}
      <div className="flex items-center justify-between px-4 sm:px-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            CORE STACK // DYNAMIC WAVE STREAM
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider hidden sm:inline">
          Right → Left Continuous Flow
        </span>
      </div>

      {/* Infinite Wave Marquee Track with Edge Dissolve Masks */}
      <div
        className="relative w-full overflow-hidden py-4"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          animate={{ x: isPaused ? undefined : ["0%", "-33.333%"] }}
          transition={{
            x: {
              duration: 26,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          className="flex items-center gap-4 sm:gap-6 w-max"
        >
          {MARQUEE_STACK.map((tech, idx) => {
            const Icon = tech.icon;
            // Harmonic wave offset based on index to create continuous undulating sine wave
            const waveDelay = (idx % STACK.length) * 0.35;

            return (
              <motion.div
                key={`${tech.name}-${idx}`}
                animate={{
                  y: [-8, 8, -8],
                  rotate: [-1.2, 1.2, -1.2],
                }}
                transition={{
                  duration: 4.0,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: waveDelay,
                }}
                onMouseEnter={() => soundFx.playHover()}
                className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-blue-400/50 transition-colors duration-300 shadow-lg shadow-black/40 backdrop-blur-md cursor-default shrink-0 select-none"
              >
                <div className="text-slate-400 group-hover:text-blue-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-medium text-slate-300 group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

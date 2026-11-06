"use client";

import React from "react";
import Image from "next/image";
import { soundFx } from "@/utils/sound";
import MotionReveal from "@/components/MotionReveal";
import {
  MapPin,
  User,
  CheckCircle2,
  Cpu,
  Terminal,
  Heart,
  Code2,
  Sparkles,
} from "lucide-react";

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Samarth"
      className="relative py-28 px-4 sm:px-6 max-w-5xl mx-auto"
    >
      {/* 
        Sticky Pinned Founder Portrait
        Pinned in place with 70% dark fade (opacity ~25-30%) into Midnight Black.
        Text narrative smoothly scrolls over it until the story concludes.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none sticky top-28 h-[550px] sm:h-[700px] w-full max-w-xl mx-auto z-0 opacity-25 sm:opacity-30 select-none overflow-hidden"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Subtle Electric Cobalt Rim Backlight */}
          <div className="absolute w-72 h-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

          {/* Portrait with Radial Fade Edge Dissolve */}
          <div
            className="relative w-full h-full"
            style={{
              maskImage:
                "radial-gradient(ellipse at center, black 45%, rgba(0,0,0,0.6) 70%, transparent 95%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 45%, rgba(0,0,0,0.6) 70%, transparent 95%)",
            }}
          >
            <Image
              src="/images/samarth-founder.webp"
              alt="Samarth Nimangre background portrait"
              fill
              sizes="(max-width: 768px) 90vw, 650px"
              className="object-cover object-top filter grayscale contrast-125"
              priority={false}
            />
          </div>
        </div>
      </div>

      {/* Foreground Narrative Stream (Scrolls smoothly UP and OVER the pinned portrait) */}
      <div className="relative z-10 -mt-[480px] sm:-mt-[620px] space-y-12 pb-16">
        {/* Header HUD */}
        <MotionReveal className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080d1a]/90 border border-[#1e293b] text-xs font-mono text-blue-400 mb-4 uppercase tracking-wider backdrop-blur-md">
            <User size={13} className="text-[#ccff00]" />
            <span>The Builder // First-Principles Narrative</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            About Samarth
          </h2>

          <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md">
            17-year-old software builder from Karnataka, India. Driven by curiosity for what happens beneath the surface.
          </p>
        </MotionReveal>

        {/* Narrative Chapter 1: The Origin & The Drive */}
        <MotionReveal>
          <div className="p-7 sm:p-10 rounded-3xl bg-[#080d1a]/80 border border-[#1e293b] backdrop-blur-xl shadow-2xl shadow-black/80 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] pb-4">
              <span className="text-xl sm:text-2xl font-black text-white">
                Samarth Nimangre
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold">
                  17 Years Old
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <MapPin size={13} className="text-[#ccff00]" />
                  <span>Karnataka, India</span>
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              I have always been fascinated by what happens under the hood of computers. While it is easy to assemble high-level wrappers, my instinct has always been to open the casing and understand the foundational physics—how bytes align in memory, how vectors traverse hardware cache lines, and how network packets synchronize without delay.
            </p>
          </div>
        </MotionReveal>

        {/* Narrative Chapter 2: Real Systems, Not Placeholders */}
        <MotionReveal>
          <div className="p-7 sm:p-10 rounded-3xl bg-[#080d1a]/80 border border-[#1e293b] backdrop-blur-xl shadow-2xl shadow-black/80 space-y-5">
            <div className="flex items-center gap-2.5 text-xs font-mono text-blue-400 uppercase tracking-wider font-bold">
              <Terminal size={14} className="text-[#ccff00]" />
              <span>01 // Clean-Room Engineering</span>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              That curiosity led me to engineer <strong className="text-white font-semibold">SutraDB</strong> from scratch in pure Python with NumPy BLAS—discovering firsthand how pre-normalizing unit vectors simplifies cosine similarity to raw SIMD dot-products for sub-0.4ms retrieval. It also drove me to build <strong className="text-white font-semibold">VaniEdge</strong>, routing full-duplex WebRTC audio directly to speech reasoning models to eliminate awkward telephony pauses.
            </p>
          </div>
        </MotionReveal>

        {/* Narrative Chapter 3: Humility & Respect */}
        <MotionReveal>
          <div className="p-7 sm:p-10 rounded-3xl bg-[#080d1a]/80 border border-[#1e293b] backdrop-blur-xl shadow-2xl shadow-black/80 space-y-5">
            <div className="flex items-center gap-2.5 text-xs font-mono text-blue-400 uppercase tracking-wider font-bold">
              <Heart size={14} className="text-[#ccff00]" />
              <span>02 // Humility, High Craft & Respect</span>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              I approach engineering with humility, honesty, and deep respect for every builder. I don&apos;t believe in vanity metrics or putting anyone down. Velocity isn&apos;t about cutting corners; it comes from having a crystal-clear architectural specification before writing code, testing relentlessly, and building software that founders and teams can rely on with complete confidence.
            </p>
          </div>
        </MotionReveal>

        {/* Narrative Chapter 4: The Vision */}
        <MotionReveal>
          <div className="p-7 sm:p-10 rounded-3xl bg-[#080d1a]/80 border border-[#1e293b] backdrop-blur-xl shadow-2xl shadow-black/80 space-y-5">
            <div className="flex items-center gap-2.5 text-xs font-mono text-blue-400 uppercase tracking-wider font-bold">
              <Sparkles size={14} className="text-[#ccff00]" />
              <span>03 // AI as a Force Multiplier</span>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              I use modern AI tools not to generate filler or shallow apps, but as a genuine force multiplier to compress build cycles, verify edge cases, and eliminate repetitive work. Whether it is an autonomous lead qualifier, an edge telephony pipeline, or a full-stack Bento web application, my focus is always the same: make it work flawlessly, make it fast, and make it honest.
            </p>

            <div className="pt-4 border-t border-[#1e293b] flex flex-wrap gap-2">
              {[
                "FirstPrinciples",
                "SimdVectorMath",
                "EdgeTelephony",
                "AutonomousAgents",
                "ModernWebCraft",
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono px-3 py-1 rounded-full bg-[#0f172a] border border-[#1e293b] text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

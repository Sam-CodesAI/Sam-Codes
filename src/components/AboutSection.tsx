"use client";

import React from "react";
import Image from "next/image";
import MotionReveal from "@/components/MotionReveal";
import { User, MapPin } from "lucide-react";

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Samarth"
      className="relative py-32 sm:py-44 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.06]"
    >
      {/* 
        Sticky Pinned Founder Portrait
        Pinned in place with 70% dark fade (opacity ~25-30%) into Midnight Black (#030509).
        Text narrative smoothly scrolls over it like cinematic editorial text.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none sticky top-28 h-[550px] sm:h-[700px] w-full max-w-lg mx-auto z-0 opacity-20 sm:opacity-25 select-none overflow-hidden"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Subtle Electric Cobalt Rim Backlight */}
          <div className="absolute w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

          {/* Portrait with Radial Fade Edge Dissolve */}
          <div
            className="relative w-full h-full"
            style={{
              maskImage:
                "radial-gradient(ellipse at center, black 40%, rgba(0,0,0,0.5) 65%, transparent 90%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 40%, rgba(0,0,0,0.5) 65%, transparent 90%)",
            }}
          >
            <Image
              src="/images/samarth-founder.webp"
              alt="Samarth Nimangre portrait"
              fill
              sizes="(max-width: 768px) 90vw, 650px"
              className="object-cover object-top filter grayscale contrast-125"
              priority={false}
            />
          </div>
        </div>
      </div>

      {/* Foreground Narrative Stream (Glides smoothly OVER the pinned portrait with zero heavy card boxes) */}
      <div className="relative z-10 -mt-[480px] sm:-mt-[600px] space-y-20 pb-20 max-w-3xl mx-auto">
        {/* Editorial Eyebrow */}
        <MotionReveal className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-blue-400 mb-6 uppercase tracking-wider backdrop-blur-md">
            <User size={13} className="text-[#ccff00]" />
            <span>The Builder // First Principles</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            Curious about what happens beneath the surface.
          </h2>

          <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
            <span>Samarth Nimangre</span>
            <span className="text-blue-500">•</span>
            <span>17 Years Old</span>
            <span className="text-blue-500">•</span>
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-[#ccff00]" />
              <span>Karnataka, India</span>
            </span>
          </div>
        </MotionReveal>

        {/* Narrative Flow 1: Origin & Physics */}
        <MotionReveal className="text-center">
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-200 font-light leading-relaxed drop-shadow-md">
            I have always been fascinated by how computers actually function at the foundational layer. While it is easy to assemble high-level wrappers, my instinct has always been to open the casing and understand the physics—<span className="text-white font-medium">how bytes align in memory</span>, how vectors traverse cache lines, and how network packets synchronize without delay.
          </p>
        </MotionReveal>

        {/* Narrative Flow 2: Clean-Room Systems */}
        <MotionReveal className="text-center">
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-200 font-light leading-relaxed drop-shadow-md">
            That drive led me to engineer <strong className="text-white font-medium">SutraDB</strong> from scratch in Python with NumPy BLAS—discovering firsthand how pre-normalizing unit vectors simplifies cosine similarity into pure <span className="text-white font-medium">SIMD dot-products</span> for sub-0.4ms retrieval. It also drove me to build <strong className="text-white font-medium">VaniEdge</strong>, routing full-duplex WebRTC audio directly to speech reasoning models to eliminate telephony pauses.
          </p>
        </MotionReveal>

        {/* Narrative Flow 3: Humility & High Craft */}
        <MotionReveal className="text-center">
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-200 font-light leading-relaxed drop-shadow-md">
            I build with <span className="text-white font-medium">humility, honesty, and deep respect</span> for every builder. Zero vanity metrics. True speed doesn’t come from cutting corners; it comes from having an airtight architectural specification before touching code, testing relentlessly, and delivering systems that founders can trust.
          </p>
        </MotionReveal>

        {/* Narrative Flow 4: Velocity Multiplier */}
        <MotionReveal className="text-center">
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-200 font-light leading-relaxed drop-shadow-md">
            I use modern AI tools not to produce filler, but as a <span className="text-white font-medium">genuine force multiplier</span> to compress iteration cycles, verify edge cases, and eliminate repetitive toil. Whether it is an autonomous lead qualifier, an edge telephony engine, or a full-stack Bento web application, my focus is always the same: <span className="text-[#ccff00] font-medium">make it fast, make it work, and make it honest</span>.
          </p>
        </MotionReveal>
      </div>
    </section>
  );
}

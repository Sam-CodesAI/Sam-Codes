"use client";

import React from "react";
import Image from "next/image";
import { profileData, ProfileData } from "@/data/profile";
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

export default function AboutSection({ profile = profileData }: { profile?: ProfileData }) {
  return (
    <section
      id="about"
      aria-label="About Sam"
      className="relative py-28 sm:py-36 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1e293b] overflow-hidden"
    >
      {/* Sticky Pinned Founder Portrait with 60%-80% Dark Fade into Midnight Black */}
      <div
        aria-hidden="true"
        className="pointer-events-none sticky top-24 -mt-24 h-[550px] sm:h-[650px] w-full max-w-3xl mx-auto z-0 opacity-30 select-none overflow-hidden"
      >
        <div
          className="relative w-full h-full"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, black 40%, rgba(0,0,0,0.6) 65%, transparent 95%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 40%, rgba(0,0,0,0.6) 65%, transparent 95%)",
          }}
        >
          <Image
            src="/images/samarth-founder.webp"
            alt="Samarth Nimangre background portrait"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover object-top filter grayscale contrast-125"
          />
        </div>
      </div>

      {/* Foreground Narrative Container smoothly scrolling over pinned portrait */}
      <div className="relative z-10 -mt-[480px] sm:-mt-[580px]">
        {/* Section Header */}
        <MotionReveal className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080d1a] border border-[#1e293b] text-xs font-mono text-blue-400 mb-4 uppercase tracking-wider">
            <User size={13} className="text-[#ccff00]" />
            <span>The Builder Behind SAM CODES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Meet Sam
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            A 17-year-old builder from Karnataka, India driven by genuine curiosity for how complex systems work under the hood.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Narrative Story (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <MotionReveal>
              <div className="p-8 sm:p-10 rounded-3xl bg-[#080d1a]/90 border border-[#1e293b] backdrop-blur-2xl space-y-6 shadow-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-black text-white tracking-wide">
                    {profile.fullName}
                  </span>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold">
                    17 Years Old · Karnataka, India
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 ml-auto">
                    <MapPin size={13} className="text-[#ccff00]" />
                    <span>IST (UTC+5:30)</span>
                  </div>
                </div>

                {/* Positive and humble narrative */}
                <div className="space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  <p>
                    I have always been deeply fascinated by what happens beneath the surface of software. While modern AI frameworks make it easy to assemble high-level wrappers, my instinct has always been to open the casing and understand the foundational physics—how bytes align in memory, how vectors traverse hardware cache lines, and how network packets synchronize without delay.
                  </p>

                  <p>
                    That curiosity led me to build <strong className="text-white font-semibold">SutraDB</strong> from scratch in pure Python with NumPy BLAS—discovering firsthand how pre-normalizing vectors simplifies cosine similarity to raw SIMD matrix dot products and enables sub-0.4ms retrieval. It also drove me to engineer <strong className="text-white font-semibold">VaniEdge</strong>, exploring how full-duplex WebSockets and voice activity detection can eliminate the awkward latency in telephony agents.
                  </p>

                  <p>
                    I approach engineering with humility, high craft, and intense respect for the craft. For me, velocity isn&apos;t about cutting corners; it comes from having a crystal-clear architectural specification before touching the keyboard, testing relentlessly, and building software that founders and teams can rely on with complete confidence.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1e293b] flex flex-wrap gap-2">
                  {[
                    "FirstPrinciplesBuilder",
                    "VectorEngines",
                    "EdgeTelephony",
                    "ModernWebCraft",
                    "HighVelocity",
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

          {/* Builder Profile Specs Card (5 cols) */}
          <div className="lg:col-span-5">
            <MotionReveal delay={0.15}>
              <div
                onMouseEnter={() => soundFx.playHover()}
                className="rounded-3xl bg-[#080d1a]/95 border border-[#1e293b] p-6 sm:p-7 shadow-2xl font-mono text-xs text-slate-300 relative backdrop-blur-2xl group"
              >
                {/* Header HUD */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1e293b]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                    <span className="text-[11px] text-white font-bold tracking-wider">
                      SAMARTH // BUILDER_SPEC
                    </span>
                  </div>
                  <span className="text-[10px] text-[#ccff00] font-semibold">
                    STATUS: READY
                  </span>
                </div>

                {/* Body Specs */}
                <div className="space-y-3.5 text-[11px]">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold select-none">❯</span>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Focus</span>
                      <span className="text-white font-semibold">
                        Vector Search · Edge Telephony · Modern Web
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold select-none">❯</span>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Primary Languages</span>
                      <span className="text-blue-300">
                        Python 3.12+, TypeScript Strict, SQL, Rust Basics
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold select-none">❯</span>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Infrastructure</span>
                      <span className="text-[#ccff00]">
                        Next.js 16, Supabase RLS, Docker, Cloudflare Workers
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold select-none">❯</span>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Direct Lines</span>
                      <span className="text-slate-200">
                        Telegram: @Samarth1306 · Email: samarthknimangre@gmail.com
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold select-none">❯</span>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Work Standard</span>
                      <span className="text-white">
                        Zero fluff · Verifiable proof · Sub-2s loads
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Assurance */}
                <div className="mt-5 pt-4 border-t border-[#1e293b] flex items-center justify-between text-slate-400 text-[10px]">
                  <span className="flex items-center gap-1.5 text-[#ccff00]">
                    <CheckCircle2 size={13} />
                    <span>DIRECT BUILDER ACCESS</span>
                  </span>
                  <span className="text-blue-400">AVAILABLE FOR BUILDS</span>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

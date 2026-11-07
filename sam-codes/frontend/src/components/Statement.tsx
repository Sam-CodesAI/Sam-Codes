"use client";

import React from "react";
import { profileData, ProfileData } from "@/data/profile";
import { soundFx } from "@/utils/sound";
import SpotlightCard from "@/components/SpotlightCard";
import MotionReveal from "@/components/MotionReveal";
import { Zap, Compass, ShieldCheck, Layers, Sparkles } from "lucide-react";

export default function Statement({ profile = profileData }: { profile?: ProfileData }) {
  const PILLAR_ICONS = [Zap, Compass, ShieldCheck, Layers];

  return (
    <section
      id="statement"
      aria-label="Why Work With Sam"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.08]"
    >
      <MotionReveal className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1D24] border border-white/[0.08] text-xs font-mono text-[#4D7CFE] mb-6 uppercase tracking-wider">
          <Sparkles size={13} className="text-[#ccff00]" />
          <span>Approach &amp; Principles</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#E8EAF0] leading-[1.15] max-w-3xl mb-4">
          {profile.statementHeadline}
        </h2>

        <p className="text-base sm:text-lg text-[#9299A8] max-w-2xl font-normal leading-relaxed">
          {profile.statementDescription}
        </p>
      </MotionReveal>

      {/* 4 Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {profile.whyWorkWithMe.map((item, idx) => {
          const Icon = PILLAR_ICONS[idx] || Sparkles;
          return (
            <MotionReveal key={idx} delay={idx * 0.08}>
              <SpotlightCard
                onMouseEnter={() => soundFx.playHover()}
                spotlightColor="rgba(77, 124, 254, 0.15)"
                className="p-6 h-full flex flex-col justify-between group cursor-default bg-[#1A1D24] border-white/[0.08]"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#4D7CFE]/15 border border-[#4D7CFE]/30 text-[#4D7CFE] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#222630] text-[#9299A8] border border-white/[0.08]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#E8EAF0] mb-2 group-hover:text-[#4D7CFE] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#9299A8] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#9299A8]">
                  <span>PRINCIPLE // 0{idx + 1}</span>
                  <span className="text-[#ccff00] font-semibold">CORE STANDARD</span>
                </div>
              </SpotlightCard>
            </MotionReveal>
          );
        })}
      </div>

      {/* Compact Builder Note */}
      <MotionReveal delay={0.2} className="rounded-3xl bg-[#1A1D24] border border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-[#9299A8] backdrop-blur-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-[#E8EAF0] font-bold text-sm">
            Have an idea you want to test or automate?
          </div>
          <div className="text-[#9299A8] text-xs">
            Start directly with the builder who writes the code. Fast turnaround, clear scope, and zero agency overhead.
          </div>
        </div>

        <a
          href="/contact"
          onClick={() => soundFx.playChime(520, 0.08)}
          className="px-6 py-3 rounded-full bg-[#4D7CFE] hover:bg-[#3D6DEE] text-[#E8EAF0] font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-lg shadow-[#4D7CFE]/25 min-h-[44px] flex items-center justify-center"
        >
          Start a conversation
        </a>
      </MotionReveal>
    </section>
  );
}

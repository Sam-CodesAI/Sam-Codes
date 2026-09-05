"use client";

import React from "react";
import { profileData } from "@/data/profile";
import { soundFx } from "@/utils/sound";
import SpotlightCard from "@/components/SpotlightCard";
import MotionReveal from "@/components/MotionReveal";
import { Zap, Compass, ShieldCheck, Layers, Sparkles } from "lucide-react";

export default function Statement() {
  const PILLAR_ICONS = [Zap, Compass, ShieldCheck, Layers];

  return (
    <section
      id="statement"
      aria-label="Why Work With Sam"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]"
    >
      <MotionReveal className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-sky-400 mb-6 uppercase tracking-wider">
          <Sparkles size={13} className="text-sky-400" />
          Approach &amp; Principles
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15] max-w-3xl mb-4">
          {profileData.statementHeadline}
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
          {profileData.statementDescription}
        </p>
      </MotionReveal>

      {/* 4 Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {profileData.whyWorkWithMe.map((item, idx) => {
          const Icon = PILLAR_ICONS[idx] || Sparkles;
          return (
            <MotionReveal key={idx} delay={idx * 0.08}>
              <SpotlightCard
                onMouseEnter={() => soundFx.playHover()}
                spotlightColor="rgba(56, 189, 248, 0.12)"
                className="p-6 h-full flex flex-col justify-between group cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>PRINCIPLE // 0{idx + 1}</span>
                  <span className="text-emerald-400">CORE STANDARD</span>
                </div>
              </SpotlightCard>
            </MotionReveal>
          );
        })}
      </div>

      {/* Compact Builder Note */}
      <MotionReveal delay={0.2} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-slate-400">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-white font-bold text-sm">
            Have an idea you want to test or automate?
          </div>
          <div className="text-slate-400 text-xs">
            Start directly with the person who builds it. Fast turnaround, clear scope, and no agency overhead.
          </div>
        </div>

        <a
          href="#contact"
          onClick={() => soundFx.playChime(520, 0.08)}
          className="px-6 py-3 rounded-full bg-white hover:bg-sky-300 text-slate-950 font-medium text-xs transition-colors shrink-0 cursor-pointer shadow-md min-h-[44px] flex items-center justify-center"
        >
          Start a conversation
        </a>
      </MotionReveal>
    </section>
  );
}

"use client";

import React from "react";
import { profileData } from "@/data/profile";
import { soundFx } from "@/utils/sound";
import SpotlightCard from "@/components/SpotlightCard";
import MotionReveal from "@/components/MotionReveal";
import { Zap, UserCheck, ShieldCheck, Sparkles } from "lucide-react";

export default function Statement() {
  const PILLARS = [
    {
      icon: UserCheck,
      title: profileData.whyWorkWithMe[0].title,
      description: profileData.whyWorkWithMe[0].description,
      tag: profileData.whyWorkWithMe[0].tag,
    },
    {
      icon: Zap,
      title: profileData.whyWorkWithMe[1].title,
      description: profileData.whyWorkWithMe[1].description,
      tag: profileData.whyWorkWithMe[1].tag,
    },
    {
      icon: ShieldCheck,
      title: profileData.whyWorkWithMe[2].title,
      description: profileData.whyWorkWithMe[2].description,
      tag: profileData.whyWorkWithMe[2].tag,
    },
  ];

  return (
    <section
      id="statement"
      aria-label="Why Work With Sam"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]"
    >
      <MotionReveal className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-sky-400 mb-6 uppercase tracking-wider">
          <Sparkles size={13} className="text-sky-400" />
          The Independent Advantage
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15] max-w-3xl mb-6">
          {profileData.statementHeadline}
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
          {profileData.statementDescription}
        </p>
      </MotionReveal>

      {/* 3 Core Advantage Bento Cards with Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PILLARS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <MotionReveal key={idx} delay={idx * 0.1}>
              <SpotlightCard
                onMouseEnter={() => soundFx.playHover()}
                spotlightColor="rgba(56, 189, 248, 0.12)"
                className="p-8 h-full flex flex-col justify-between group cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>ADVANTAGE // 0{idx + 1}</span>
                  <span className="text-emerald-400">DIRECT ACCESS</span>
                </div>
              </SpotlightCard>
            </MotionReveal>
          );
        })}
      </div>

      {/* Direct Contrast Strip */}
      <MotionReveal delay={0.25} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-slate-400">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-white font-bold text-sm">
            Tired of agency bureaucracy and inflated retainer invoices?
          </div>
          <div className="text-slate-400 text-xs">
            Skip the middle layers. Let&apos;s hop on a quick chat, agree on clear deliverables, and ship your build.
          </div>
        </div>

        <a
          href="#contact"
          onClick={() => soundFx.playChime(520, 0.08)}
          className="px-6 py-3 rounded-full bg-white hover:bg-sky-300 text-slate-950 font-medium text-xs transition-colors shrink-0 cursor-pointer shadow-md"
        >
          Message Sam directly
        </a>
      </MotionReveal>
    </section>
  );
}

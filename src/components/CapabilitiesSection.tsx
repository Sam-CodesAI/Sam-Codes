"use client";

import React from "react";
import { capabilitiesData, Capability } from "@/data/capabilities";
import { soundFx } from "@/utils/sound";
import SpotlightCard from "@/components/SpotlightCard";
import MotionReveal from "@/components/MotionReveal";
import {
  Brain,
  Zap,
  Bot,
  GitBranch,
  Globe,
  Network,
  Flame,
  Sparkles,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Zap,
  Bot,
  GitFork: GitBranch,
  Globe,
  Network,
  Flame,
  Sparkles,
};

export default function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      aria-label="Capabilities"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]"
    >
      <MotionReveal className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400 mb-4 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          Technical Arsenal
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Capabilities &amp; Systems
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
          From multi-agent reasoning loops to sub-second web platforms, here is how I translate technical capability into tangible leverage.
        </p>
      </MotionReveal>

      {/* Grid of 8 Capabilities with Dynamic Spotlight Effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {capabilitiesData.map((cap: Capability, idx: number) => {
          const Icon = ICON_MAP[cap.icon] || Sparkles;

          return (
            <MotionReveal key={cap.id} delay={idx * 0.06}>
              <SpotlightCard
                onMouseEnter={() => soundFx.playHover()}
                spotlightColor="rgba(56, 189, 248, 0.15)"
                className="h-full flex flex-col justify-between group cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-500/20 transition-all duration-300">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400">
                      {cap.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {cap.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    {cap.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.04]">
                    {cap.highlights.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05] text-slate-400 group-hover:text-slate-300 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { profileData } from "@/data/profile";
import { soundFx } from "@/utils/sound";
import { Compass, Sparkles, Layers } from "lucide-react";

const PRINCIPLES = [
  {
    icon: Sparkles,
    title: "AI as a Force Multiplier",
    description:
      "Leveraging language models and agentic runtimes not as gimmicks, but to augment capability and compress build cycles.",
  },
  {
    icon: Layers,
    title: "Disciplined Systems",
    description:
      "Building resilient architectures that fail gracefully, protect privacy, and scale predictably without unnecessary complexity.",
  },
  {
    icon: Compass,
    title: "Practical Curiosity",
    description:
      "Exploring frontier machine intelligence with hands-on code — shipping functional experiments rather than passive theory.",
  },
];

export default function Statement() {
  return (
    <section
      id="statement"
      aria-label="Vision and Philosophy"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.06]"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-400 mb-6 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          The Philosophy
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15] max-w-3xl mb-6">
          {profileData.statementHeadline}
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
          {profileData.statementDescription}
        </p>
      </div>

      {/* 3 Core Principles Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRINCIPLES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onMouseEnter={() => soundFx.playHover()}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-sky-500/30 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>0{idx + 1} // PILLAR</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

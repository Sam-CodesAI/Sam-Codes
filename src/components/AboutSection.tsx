"use client";

import React from "react";
import { profileData } from "@/data/profile";
import { soundFx } from "@/utils/sound";
import { Terminal, MapPin, Sparkles, User, Code, Server, Cpu } from "lucide-react";

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Sam"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-sky-400 mb-4 uppercase tracking-wider">
          <User size={13} className="text-sky-400" />
          The Builder
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Meet Sam
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
          A young, curious, AI-native developer engineering systems that bridge the gap between imagination and functional reality.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Story Content (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-5 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xl font-bold text-white tracking-wide">
                {profileData.fullName}
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Known as {profileData.preferredName}
              </span>
              <div className="flex items-center gap-1 text-xs font-mono text-slate-400 ml-auto">
                <MapPin size={13} className="text-emerald-400" />
                <span>{profileData.location}</span>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {profileData.aboutStory.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-2">
              {profileData.identityTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal Tech Specs (5 cols) */}
        <div className="lg:col-span-5">
          <div
            onMouseEnter={() => soundFx.playHover()}
            className="rounded-3xl bg-[#090d1a] border border-white/[0.1] p-6 shadow-2xl font-mono text-xs text-slate-300 relative overflow-hidden group"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] text-slate-500 ml-2">sam@system:~</span>
              </div>
              <span className="text-[10px] text-sky-400/80">spec.json</span>
            </div>

            {/* Terminal Body */}
            <div className="space-y-3 text-[11px]">
              <div className="flex items-start gap-2">
                <span className="text-sky-400 select-none">❯</span>
                <div>
                  <span className="text-slate-500">runtime.origin: </span>
                  <span className="text-white">&quot;Karnataka, India&quot;</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sky-400 select-none">❯</span>
                <div>
                  <span className="text-slate-500">languages: </span>
                  <span className="text-sky-300">[&quot;TypeScript&quot;, &quot;Python&quot;, &quot;SQL&quot;, &quot;Modern CSS&quot;]</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sky-400 select-none">❯</span>
                <div>
                  <span className="text-slate-500">frameworks: </span>
                  <span className="text-emerald-300">[&quot;Next.js 16&quot;, &quot;React 19&quot;, &quot;Tailwind v4&quot;, &quot;FastAPI&quot;]</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sky-400 select-none">❯</span>
                <div>
                  <span className="text-slate-500">ai_toolchain: </span>
                  <span className="text-indigo-300">[&quot;Claude 3.7&quot;, &quot;GPT-4o&quot;, &quot;Ollama / SLMs&quot;, &quot;MCP&quot;]</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sky-400 select-none">❯</span>
                <div>
                  <span className="text-slate-500">deployment: </span>
                  <span className="text-amber-300">[&quot;Vercel Global Edge&quot;, &quot;Cloudflare&quot;, &quot;Docker&quot;]</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sky-400 select-none">❯</span>
                <div>
                  <span className="text-slate-500">operating_mode: </span>
                  <span className="text-emerald-400">&quot;Autonomous Velocity &amp; High Rigor&quot;</span>
                </div>
              </div>
            </div>

            {/* Prompt Pulse */}
            <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center gap-2 text-slate-500 text-[10px]">
              <span className="text-emerald-400 animate-pulse">●</span>
              <span>LISTENING FOR NEXT BUILD COMMAND</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

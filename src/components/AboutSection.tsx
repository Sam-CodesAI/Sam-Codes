"use client";

import React from "react";
import { profileData, ProfileData } from "@/data/profile";
import { soundFx } from "@/utils/sound";
import MotionReveal from "@/components/MotionReveal";
import {
  MapPin,
  User,
  CheckCircle2,
} from "lucide-react";

export default function AboutSection({ profile = profileData }: { profile?: ProfileData }) {
  return (
    <section
      id="about"
      aria-label="About Sam"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]"
    >
      <MotionReveal className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-sky-400 mb-4 uppercase tracking-wider">
          <User size={13} className="text-sky-400" />
          The Builder Behind SAM CODES
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Meet Sam
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
          An ambitious 17-year-old AI developer from Karnataka, India building high-leverage digital systems with velocity and craft.
        </p>
      </MotionReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Story Content (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <MotionReveal>
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-5 backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xl font-bold text-white tracking-wide">
                  {profile.fullName}
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {profile.age} Years Old · Known as {profile.preferredName}
                </span>
                <div className="flex items-center gap-1 text-xs font-mono text-slate-400 ml-auto">
                  <MapPin size={13} className="text-emerald-400" />
                  <span>{profile.location}</span>
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {profile.aboutStory.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-2">
                {profile.identityTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </MotionReveal>
        </div>

        {/* Terminal Tech Specs (5 cols) */}
        <div className="lg:col-span-5">
          <MotionReveal delay={0.15}>
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
                  <span className="text-[11px] text-slate-500 ml-2">sam@workspace:~</span>
                </div>
                <span className="text-[10px] text-sky-400/80">builder_profile.json</span>
              </div>

              {/* Terminal Body */}
              <div className="space-y-3 text-[11px]">
                <div className="flex items-start gap-2">
                  <span className="text-sky-400 select-none">❯</span>
                  <div>
                    <span className="text-slate-500">builder: </span>
                    <span className="text-white">&quot;Samarth Nimangre (Sam)&quot;</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-sky-400 select-none">❯</span>
                  <div>
                    <span className="text-slate-500">demographics: </span>
                    <span className="text-sky-300">&quot;17 years old · Karnataka, India&quot;</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-sky-400 select-none">❯</span>
                  <div>
                    <span className="text-slate-500">primary_stack: </span>
                    <span className="text-emerald-300">[&quot;Next.js 16&quot;, &quot;TypeScript&quot;, &quot;Python&quot;, &quot;Tailwind v4&quot;]</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-sky-400 select-none">❯</span>
                  <div>
                    <span className="text-slate-500">ai_tools: </span>
                    <span className="text-indigo-300">[&quot;Claude 3.7&quot;, &quot;Cursor&quot;, &quot;OpenAI API&quot;, &quot;Ollama&quot;]</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-sky-400 select-none">❯</span>
                  <div>
                    <span className="text-slate-500">communication: </span>
                    <span className="text-amber-300">&quot;Direct DMs (X / Insta / LinkedIn) &amp; Email&quot;</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-sky-400 select-none">❯</span>
                  <div>
                    <span className="text-slate-500">availability: </span>
                    <span className="text-emerald-400">&quot;Ready for select builds &amp; MVPs&quot;</span>
                  </div>
                </div>
              </div>

              {/* Prompt Pulse */}
              <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center justify-between text-slate-500 text-[10px]">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 size={12} />
                  <span>DIRECT ACCESS GUARANTEE</span>
                </span>
                <span className="text-sky-400">STATUS: READY</span>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

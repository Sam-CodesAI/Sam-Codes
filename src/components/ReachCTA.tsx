"use client";

import React from "react";
import Link from "next/link";
import { soundFx } from "@/utils/sound";
import { Send, ArrowRight, Sparkles } from "lucide-react";
import {
  GmailIcon,
  TelegramIcon,
  InstagramIcon,
  XIcon,
  GithubIcon,
} from "@/components/TechLogos";

export default function ReachCTA() {
  return (
    <section
      id="reach"
      aria-label="Reach Me"
      className="relative py-28 sm:py-36 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.06]"
    >
      <div className="relative rounded-3xl bg-gradient-to-b from-[#080d1a] to-[#04060a] border border-white/[0.08] p-8 sm:p-14 overflow-hidden shadow-2xl">
        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-blue-400 mb-6 uppercase tracking-wider backdrop-blur-md">
            <Send size={13} className="text-[#ccff00]" />
            <span>Direct Dispatch // Zero Friction</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Have a system to build or a problem to solve?
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-10 max-w-2xl">
            Direct collaboration with Samarth. Send a brief directly through the dedicated reach portal or connect instantly on <strong className="text-white">Telegram</strong> and <strong className="text-white">Gmail</strong>.
          </p>

          {/* Direct Social Channels */}
          <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3 mb-10">
            <a
              href="mailto:samarthknimangre@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playHover()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] hover:border-blue-500/40 transition-all text-xs font-mono min-h-[44px]"
            >
              <GmailIcon className="w-4 h-4 text-red-400" />
              <span>Gmail</span>
            </a>

            <a
              href="https://t.me/Samarth1306"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playHover()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] hover:border-blue-500/40 transition-all text-xs font-mono min-h-[44px]"
            >
              <TelegramIcon className="w-4 h-4 text-blue-400" />
              <span>Telegram (@Samarth1306)</span>
            </a>

            <a
              href="https://www.instagram.com/samarth.buildss/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playHover()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] hover:border-blue-500/40 transition-all text-xs font-mono min-h-[44px]"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400" />
              <span>Instagram</span>
            </a>

            <a
              href="https://x.com/Sam_CodeAI"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playHover()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] hover:border-blue-500/40 transition-all text-xs font-mono min-h-[44px]"
            >
              <XIcon className="w-4 h-4 text-slate-200" />
              <span>X (Twitter)</span>
            </a>

            <a
              href="https://github.com/Sam-CodesAI"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playHover()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] hover:border-blue-500/40 transition-all text-xs font-mono min-h-[44px]"
            >
              <GithubIcon className="w-4 h-4 text-slate-200" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Primary Action Button: Enter Dedicated Contact Portal */}
          <Link
            href="/contact"
            onClick={() => soundFx.playChime(620, 0.1)}
            className="group px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm sm:text-base transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 cursor-pointer border border-blue-400/40 min-h-[48px]"
          >
            <span>Open Reach Brief &amp; 3D Portal</span>
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

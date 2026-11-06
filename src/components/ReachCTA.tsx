"use client";

import React from "react";
import Link from "next/link";
import { soundFx } from "@/utils/sound";
import MotionReveal from "@/components/MotionReveal";
import {
  Send,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ExternalLink,
} from "lucide-react";
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
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1e293b]"
    >
      <div className="relative rounded-3xl bg-gradient-to-b from-[#080d1a] to-[#04060a] border border-[#1e293b] p-8 sm:p-14 overflow-hidden shadow-2xl shadow-blue-950/40">
        {/* Subtle Cyber Glowing Grid Background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-xs font-mono text-blue-400 mb-6 uppercase tracking-wider">
            <Send size={13} className="text-[#ccff00] animate-pulse" />
            <span>Dedicated Reach Portal // Zero Friction</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
            Have a system to build or a problem to solve?
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-8 max-w-2xl">
            Reach out directly. Choose between direct dispatch from the website or a 1-click launch straight inside your real <strong className="text-white">Gmail App</strong>, <strong className="text-white">Telegram</strong>, or verified channels.
          </p>

          {/* Social Logo Strip (Clickable Aesthetic Monochrome Logos) */}
          <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-4 mb-10">
            <a
              href="mailto:samarthknimangre@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playHover()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-600/20 text-slate-300 hover:text-white border border-[#1e293b] hover:border-blue-500/40 transition-all text-xs font-mono"
            >
              <GmailIcon className="w-4 h-4 text-red-400" />
              <span>Gmail</span>
            </a>

            <a
              href="https://t.me/Samarth1306"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playHover()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-600/20 text-slate-300 hover:text-white border border-[#1e293b] hover:border-blue-500/40 transition-all text-xs font-mono"
            >
              <TelegramIcon className="w-4 h-4 text-blue-400" />
              <span>Telegram (@Samarth1306)</span>
            </a>

            <a
              href="https://www.instagram.com/samarth.buildss/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playHover()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-600/20 text-slate-300 hover:text-white border border-[#1e293b] hover:border-blue-500/40 transition-all text-xs font-mono"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400" />
              <span>Instagram</span>
            </a>

            <a
              href="https://x.com/Sam_CodeAI"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playHover()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-600/20 text-slate-300 hover:text-white border border-[#1e293b] hover:border-blue-500/40 transition-all text-xs font-mono"
            >
              <XIcon className="w-4 h-4 text-slate-200" />
              <span>X (Twitter)</span>
            </a>

            <a
              href="https://github.com/Sam-CodesAI"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playHover()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-600/20 text-slate-300 hover:text-white border border-[#1e293b] hover:border-blue-500/40 transition-all text-xs font-mono"
            >
              <GithubIcon className="w-4 h-4 text-slate-200" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Primary Action Button: Enter Dedicated Contact Portal */}
          <Link
            href="/contact"
            onClick={() => soundFx.playChime(620, 0.1)}
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm sm:text-base transition-all shadow-xl shadow-blue-600/40 hover:shadow-blue-500/60 flex items-center justify-center gap-3 cursor-pointer border border-blue-400/40"
          >
            <Sparkles size={17} className="text-[#ccff00]" />
            <span>Enter Reach Portal &amp; 3D Data Highway</span>
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

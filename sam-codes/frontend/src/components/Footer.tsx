"use client";

import React from "react";
import Link from "next/link";
import { profileData } from "@/data/profile";
import { soundFx } from "@/utils/sound";
import { ArrowUp, Terminal, Send } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    soundFx.playChime(520, 0.06);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const triggerTelemetry = () => {
    soundFx.playChime(660, 0.08);
    window.dispatchEvent(new CustomEvent("toggle-telemetry"));
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#101216]/95 backdrop-blur-xl px-4 sm:px-6 py-12 text-xs font-mono text-[#9299A8]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Location */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />
            <span className="font-black text-[#E8EAF0] tracking-wider">SAM CODES</span>
            <span className="text-white/20">/</span>
            <span className="text-[#9299A8]">{profileData.fullName}</span>
          </div>
          <div className="text-[11px] text-[#9299A8]">
            {profileData.location} · 17yo AI Systems Builder
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] uppercase tracking-wider text-[#9299A8]">
          <a href="/#lab" className="hover:text-[#E8EAF0] transition-colors">
            The Lab
          </a>
          <a href="/#about" className="hover:text-[#E8EAF0] transition-colors">
            About
          </a>
          <a href="/#services" className="hover:text-[#E8EAF0] transition-colors">
            Services
          </a>
          <Link href="/contact" className="text-[#ccff00] hover:text-[#E8EAF0] transition-colors">
            Reach Me [Portal]
          </Link>
        </div>

        {/* Actions: Telemetry Trigger & Back to Top */}
        <div className="flex items-center gap-3">
          <a
            href="https://t.me/Samarth1306"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#4D7CFE]/15 border border-[#4D7CFE]/30 text-[#E8EAF0] hover:text-white text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send size={12} />
            <span>@Samarth1306</span>
          </a>

          <button
            type="button"
            onClick={triggerTelemetry}
            title="Toggle Developer Telemetry (Shift + D)"
            className="px-2.5 py-1.5 rounded-lg bg-[#1A1D24] hover:bg-[#222630] border border-white/[0.08] text-[#9299A8] hover:text-[#4D7CFE] text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Terminal size={12} />
            <span>Shift+D</span>
          </button>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            className="p-2 rounded-lg bg-[#1A1D24] hover:bg-[#222630] border border-white/[0.08] text-[#9299A8] hover:text-[#E8EAF0] transition-colors cursor-pointer"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#9299A8] gap-2">
        <div>
          © {new Date().getFullYear()} {profileData.brandName}. Zero hypothetical claims. Verified production code.
        </div>
        <div className="text-[#9299A8]">
          Engineered with Next.js 16, React 19, Three.js WebGL &amp; Tailwind CSS v4
        </div>
      </div>
    </footer>
  );
}

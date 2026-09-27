"use client";

import React from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Cpu,
  FileText,
  Mail,
  Send,
  Database,
  Layers,
} from "lucide-react";
import { profileData, ProfileData } from "@/data/profile";
import { CONTACT_CONFIG } from "@/data/socials";
import { soundFx } from "@/utils/sound";
import { motion } from "motion/react";
import MagneticButton from "@/components/MagneticButton";
import TextScramble from "@/components/TextScramble";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Hero({ profile = profileData }: { profile?: ProfileData }) {
  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 pt-28 pb-16 text-center max-w-6xl mx-auto"
    >
      {/* Availability Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#060914]/80 border border-white/[0.08] backdrop-blur-xl mb-8 shadow-sm"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
        </span>
        <span className="text-[11px] sm:text-xs font-mono tracking-wider text-slate-300">
          <TextScramble text={profile.availabilityStatus} scrambleOnHover={false} />
        </span>
      </motion.div>

      {/* Headline: Full-Stack Developer & Cloud Automation Engineer */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] mb-6 max-w-5xl"
      >
        Full-Stack Developer &amp;{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400">
          Cloud Automation
        </span>{" "}
        Engineer
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-base sm:text-xl text-slate-300 max-w-3xl font-normal leading-relaxed mb-10"
      >
        I build production-grade web applications with Next.js, architect relational databases with Supabase, and build asynchronous automation pipelines for real-world workflows.
      </motion.p>

      {/* Immediate CTAs (Above the Fold) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto"
      >
        <MagneticButton pullFactor={0.2}>
          <motion.a
            href="#lab"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => soundFx.playChime(500, 0.08)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-mono text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            <span>View Live Projects</span>
            <ArrowUpRight size={15} />
          </motion.a>
        </MagneticButton>

        <MagneticButton pullFactor={0.2}>
          <motion.a
            href="/Samarth_Nimangre_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => soundFx.playHover()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#060914]/70 hover:bg-white/[0.06] border border-white/[0.12] hover:border-cyan-400/40 text-slate-200 hover:text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 backdrop-blur-xl cursor-pointer min-h-[44px]"
          >
            <FileText size={15} className="text-cyan-400" />
            <span>View Resume (PDF)</span>
          </motion.a>
        </MagneticButton>
      </motion.div>

      {/* Immediate Direct Icon Links (Strictly GitHub, LinkedIn, Telegram, Email) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 mb-14"
      >
        <a
          href={CONTACT_CONFIG.GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          title="GitHub (Sam-CodesAI)"
          className="p-2.5 rounded-full bg-[#060914]/60 border border-white/[0.08] hover:border-cyan-400/40 text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all flex items-center justify-center cursor-pointer min-h-[40px] min-w-[40px]"
        >
          <GithubIcon />
        </a>

        <a
          href={CONTACT_CONFIG.LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          title="LinkedIn (Samarth Nimangre)"
          className="p-2.5 rounded-full bg-[#060914]/60 border border-white/[0.08] hover:border-cyan-400/40 text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all flex items-center justify-center cursor-pointer min-h-[40px] min-w-[40px]"
        >
          <LinkedinIcon />
        </a>

        <a
          href={CONTACT_CONFIG.TELEGRAM_PERSONAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Direct Telegram"
          title="Direct Telegram (@Samarth1306)"
          className="p-2.5 rounded-full bg-[#060914]/60 border border-white/[0.08] hover:border-cyan-400/40 text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all flex items-center justify-center cursor-pointer min-h-[40px] min-w-[40px]"
        >
          <Send size={15} className="text-cyan-400" />
        </a>

        <a
          href={`mailto:${CONTACT_CONFIG.EMAIL_ADDRESS}`}
          aria-label="Direct Email"
          title="Direct Email (samarthknimangre@gmail.com)"
          className="p-2.5 rounded-full bg-[#060914]/60 border border-white/[0.08] hover:border-cyan-400/40 text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all flex items-center justify-center cursor-pointer min-h-[40px] min-w-[40px]"
        >
          <Mail size={16} />
        </a>
      </motion.div>

      {/* Production Engineering Telemetry Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl text-left font-mono text-[11px] text-slate-400"
      >
        <div className="p-3.5 rounded-xl bg-[#060914]/60 border border-white/[0.06] hover:border-cyan-500/30 transition-colors flex items-center gap-2.5 backdrop-blur-md group">
          <Layers size={14} className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
          <div>
            <div className="text-slate-500 text-[9px] uppercase tracking-wider">Frontend &amp; Full-Stack</div>
            <div className="text-slate-200">
              <TextScramble text="Next.js 16 • TypeScript" />
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#060914]/60 border border-white/[0.06] hover:border-violet-500/30 transition-colors flex items-center gap-2.5 backdrop-blur-md group">
          <Database size={14} className="text-violet-400 group-hover:scale-110 transition-transform duration-300" />
          <div>
            <div className="text-slate-500 text-[9px] uppercase tracking-wider">Data &amp; Security Layer</div>
            <div className="text-slate-200">
              <TextScramble text="Supabase • Postgres RLS" />
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#060914]/60 border border-white/[0.06] hover:border-emerald-500/30 transition-colors flex items-center gap-2.5 backdrop-blur-md group">
          <Cpu size={14} className="text-emerald-400 group-hover:rotate-90 transition-transform duration-500" />
          <div>
            <div className="text-slate-500 text-[9px] uppercase tracking-wider">Cloud Automation</div>
            <div className="text-slate-200">
              <TextScramble text="Webhooks • Async Pipelines" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Downward Scroll Indicator */}
      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        href="#statement"
        onClick={() => soundFx.playHover()}
        aria-label="Scroll to vision statement"
        className="mt-14 inline-flex flex-col items-center gap-1 text-slate-500 hover:text-cyan-300 transition-colors"
      >
        <span className="text-[10px] uppercase font-mono tracking-widest">Explore</span>
        <ArrowDown size={14} className="animate-bounce mt-1 text-cyan-400" />
      </motion.a>
    </section>
  );
}

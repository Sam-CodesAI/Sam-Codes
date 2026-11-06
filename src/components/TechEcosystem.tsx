"use client";

import React from "react";
import { soundFx } from "@/utils/sound";
import {
  NextjsIcon,
  ReactIcon,
  TypeScriptIcon,
  PythonIcon,
  TailwindIcon,
  SupabaseIcon,
  PostgresIcon,
  ThreejsIcon,
  DockerIcon,
  GithubIcon,
} from "@/components/TechLogos";

const STACK = [
  { name: "Next.js 16", icon: NextjsIcon },
  { name: "React 19", icon: ReactIcon },
  { name: "TypeScript", icon: TypeScriptIcon },
  { name: "Python 3", icon: PythonIcon },
  { name: "Tailwind CSS", icon: TailwindIcon },
  { name: "Supabase", icon: SupabaseIcon },
  { name: "PostgreSQL", icon: PostgresIcon },
  { name: "Three.js", icon: ThreejsIcon },
  { name: "Docker", icon: DockerIcon },
  { name: "Git", icon: GithubIcon },
];

export default function TechEcosystem() {
  return (
    <section
      aria-label="Core Technology Stack"
      className="relative py-10 px-4 sm:px-6 max-w-7xl mx-auto border-y border-white/[0.06] overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="shrink-0 text-left">
          <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase block">
            CORE STACK // VERIFIED PRODUCTION
          </span>
          <span className="text-sm font-semibold text-slate-300">
            Engineered with modern 2026 foundations
          </span>
        </div>

        {/* Minimalist Horizontal Logo Badges */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 justify-center sm:justify-end">
          {STACK.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                onMouseEnter={() => soundFx.playHover()}
                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-blue-500/40 transition-all duration-300 cursor-default"
              >
                <div className="text-slate-400 group-hover:text-blue-400 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono text-slate-300 group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

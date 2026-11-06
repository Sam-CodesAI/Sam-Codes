"use client";

import React from "react";
import MotionReveal from "@/components/MotionReveal";
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
import { Terminal, Cpu } from "lucide-react";

interface TechItem {
  name: string;
  category: "Framework" | "Language" | "Database" | "Graphics" | "DevOps";
  version: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TECH_STACK: TechItem[] = [
  {
    name: "Next.js 16",
    category: "Framework",
    version: "v16.3 Turbopack",
    icon: NextjsIcon,
    description: "React Server Components, edge routes, and zero-waterfall data fetching.",
  },
  {
    name: "React 19",
    category: "Framework",
    version: "v19 Actions",
    icon: ReactIcon,
    description: "Concurrent rendering, action hooks, and compile-time optimizations.",
  },
  {
    name: "TypeScript",
    category: "Language",
    version: "Strict Typecheck",
    icon: TypeScriptIcon,
    description: "End-to-end type safety, runtime boundary schemas, and contract-first APIs.",
  },
  {
    name: "Python 3",
    category: "Language",
    version: "BLAS / SIMD",
    icon: PythonIcon,
    description: "Clean-room SIMD linear algebra, BM25 indexing, and vector engines.",
  },
  {
    name: "Tailwind CSS",
    category: "Framework",
    version: "v4 Oxide",
    icon: TailwindIcon,
    description: "CSS-first high-velocity token systems with zero CLS layout shifts.",
  },
  {
    name: "Supabase",
    category: "Database",
    version: "PostgreSQL RLS",
    icon: SupabaseIcon,
    description: "Row-Level Security, real-time change data capture, and auth tokens.",
  },
  {
    name: "PostgreSQL",
    category: "Database",
    version: "pgvector & Indexing",
    icon: PostgresIcon,
    description: "ACID transactions, B-Tree & IVFFlat indices, and keyset cursor paging.",
  },
  {
    name: "Three.js",
    category: "Graphics",
    version: "WebGL 3D Core",
    icon: ThreejsIcon,
    description: "60+ FPS perspective canvases, particle vectors, and shader geometry.",
  },
  {
    name: "Docker",
    category: "DevOps",
    version: "Distroless Builds",
    icon: DockerIcon,
    description: "Multi-stage supply-chain hardened containers with non-root runtime.",
  },
  {
    name: "Git & GitHub",
    category: "DevOps",
    version: "CI/CD & Actions",
    icon: GithubIcon,
    description: "Deterministic versioning, trunk builds, and automated verification gates.",
  },
];

export default function TechEcosystem() {
  return (
    <section
      aria-label="Core Technology Ecosystem"
      className="relative py-12 px-4 sm:px-6 max-w-7xl mx-auto border-y border-[#1e293b]/60 overflow-hidden"
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080d1a] border border-[#1e293b] text-[11px] font-mono text-blue-400 mb-2 uppercase tracking-wider">
          <Cpu size={12} className="text-[#ccff00]" />
          <span>Verified Production Stack // Zero Fluff</span>
        </div>
        <p className="text-xs sm:text-sm font-mono text-slate-400">
          The verified frameworks, languages, and architectures running inside my shipped systems.
        </p>
      </div>

      {/* Grid of Aesthetic Tech Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {TECH_STACK.map((tech) => {
          const Icon = tech.icon;
          return (
            <div
              key={tech.name}
              onMouseEnter={() => soundFx.playHover()}
              className="group relative p-4 rounded-xl bg-[#080d1a]/80 hover:bg-[#0c1322] border border-[#1e293b] hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-900/20 cursor-default"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0f172a] border border-[#1e293b] group-hover:border-blue-400/40 flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-800/30">
                  {tech.category}
                </span>
              </div>

              <div className="text-sm font-extrabold text-white group-hover:text-blue-300 transition-colors">
                {tech.name}
              </div>
              <div className="text-[10px] font-mono text-[#ccff00]/90 mb-1.5">
                {tech.version}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                {tech.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  projectsData,
  experimentsData,
  Project,
  LabExperiment,
} from "@/data/projects";
import { soundFx } from "@/utils/sound";
import MotionReveal from "@/components/MotionReveal";
import { TechBadge } from "@/components/TechLogos";
import {
  FlaskConical,
  ArrowUpRight,
  FolderGit2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "AI Application",
  "Agentic Workflow",
  "Automation",
  "Web System",
] as const;

export default function LabSection({
  projects = projectsData,
  experiments = experimentsData,
}: {
  projects?: Project[];
  experiments?: LabExperiment[];
}) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [warpProject, setWarpProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project: Project) => {
    if (selectedCategory === "All") return true;
    return project.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleTabChange = (category: string) => {
    soundFx.playHover();
    setSelectedCategory(category);
  };

  const handleCartridgeClick = (e: React.MouseEvent, project: Project) => {
    // If opening in a new tab/window, allow default browser navigation
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    soundFx.playChime(640, 0.1);
    setWarpProject(project);

    // Smooth anime tech portal warp transition then navigate
    setTimeout(() => {
      router.push(`/projects/${project.slug}`);
    }, 420);
  };

  return (
    <section
      id="lab"
      aria-label="The Lab & Projects"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1e293b]"
    >
      {/* Section Header */}
      <MotionReveal className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080d1a] border border-[#1e293b] text-xs font-mono text-blue-400 mb-4 uppercase tracking-wider">
          <FlaskConical size={13} className="text-[#ccff00] animate-pulse" />
          <span>The Digital Laboratory // Flagship Systems</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
          The Lab
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-2">
          Flagship systems built from first-principles scratch. Zero hypothetical claims.
        </p>

        <p className="text-xs sm:text-sm font-mono text-slate-400">
          Folder cartridges contain verified standalone case studies, high-resolution SVG architecture dataflow pipelines, and source repositories.
        </p>
      </MotionReveal>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleTabChange(category)}
              className="relative px-4 py-2 rounded-full text-xs font-mono transition-colors cursor-pointer text-slate-300 hover:text-white min-h-[44px] flex items-center justify-center"
            >
              {isSelected && (
                <motion.div
                  layoutId="activeLabPill"
                  className="absolute inset-0 rounded-full bg-blue-600 shadow-lg shadow-blue-600/30 border border-blue-400"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${isSelected ? "text-white font-bold" : "text-slate-400"}`}>
                {category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Flagship Cyber-Folder Cartridges Grid with Scroll-Triggered Zoom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredProjects.map((proj: Project, idx: number) => (
          <motion.div
            key={proj.slug}
            initial={{ scale: 0.92, opacity: 0.8 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 260, damping: 25, delay: idx * 0.06 }}
            className="flex"
          >
            <Link
              href={`/projects/${proj.slug}`}
              onClick={(e) => handleCartridgeClick(e, proj)}
              className="w-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#080d1a] border border-[#1e293b] hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-300 cursor-pointer group relative overflow-hidden backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {/* Anime Cyber-Folder Tab Header */}
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1e293b]">
                  <div className="flex items-center gap-2">
                    <FolderGit2 size={15} className="text-blue-400 group-hover:text-[#ccff00] transition-colors" />
                    <span className="text-[11px] font-mono font-bold tracking-wider text-blue-400">
                      {proj.cartridgeCode || `DIR://0${idx + 1}_${proj.slug.toUpperCase()}`}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                    <span>{proj.status}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-white mb-2.5 group-hover:text-blue-300 transition-colors leading-snug">
                  {proj.title}
                </h3>

                {/* Punchy 1-line outcome story (Zero numerical spreadsheet report clutter) */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6 line-clamp-3">
                  {proj.punchyOutcome || proj.shortDescription}
                </p>
              </div>

              {/* Footer: Tech Stack Badges + Warp Trigger */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {proj.technologies.slice(0, 3).map((tech) => (
                    <TechBadge key={tech} name={tech} size="xs" />
                  ))}
                  {proj.technologies.length > 3 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#0f172a] text-slate-500 border border-[#1e293b]">
                      +{proj.technologies.length - 3}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-[11px] group-hover:text-white transition-colors">
                    Open Case Study
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#0f172a] group-hover:bg-blue-600 border border-[#1e293b] group-hover:border-blue-400 flex items-center justify-center text-slate-400 group-hover:text-white transition-all shadow-sm">
                    <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Active R&D Experiments Section */}
      <div className="rounded-3xl bg-[#080d1a]/80 border border-[#1e293b] p-8 sm:p-10 max-w-5xl mx-auto backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Active R&amp;D Experiments In Progress ({experiments.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            TRANSPARENT DEV LOG
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiments.map((exp: LabExperiment) => (
            <div
              key={exp.id}
              className="p-5 rounded-2xl bg-[#0f172a]/60 border border-[#1e293b] hover:border-blue-500/30 transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-blue-400 font-semibold">{exp.state}</span>
                <span className="text-slate-500">{exp.category}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{exp.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {exp.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#080d1a] text-slate-400 border border-[#1e293b]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anime Tech Portal Warp Transition Overlay */}
      <AnimatePresence>
        {warpProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#030509]/90 backdrop-blur-2xl pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
              animate={{ scale: 1.3, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 rounded-3xl bg-[#080d1a] border-2 border-blue-500 shadow-[0_0_100px_#2563eb] text-center max-w-md w-full font-mono"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs mb-3 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span>WARP_PORTAL_ENGAGED</span>
              </div>
              <div className="text-white text-lg font-black mb-1">
                {warpProject.title}
              </div>
              <div className="text-slate-400 text-xs">
                Expanding architecture pipeline...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

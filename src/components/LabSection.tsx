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
  Sparkles,
  Layers,
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

    // Smooth cinematic lens transition then navigate
    setTimeout(() => {
      router.push(`/projects/${project.slug}`);
    }, 380);
  };

  return (
    <section
      id="lab"
      aria-label="The Lab & Projects"
      className="relative py-28 sm:py-36 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.06]"
    >
      {/* Section Header */}
      <MotionReveal className="flex flex-col items-center text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-blue-400 mb-4 uppercase tracking-wider backdrop-blur-md">
          <FlaskConical size={13} className="text-[#ccff00]" />
          <span>The Lab // Shipped Systems</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
          Flagship Projects
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
          Full-scale architectures built from first principles. Zero hypothetical mocks.
        </p>
      </MotionReveal>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-16">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleTabChange(category)}
              className="relative px-4 py-2 rounded-full text-xs font-mono transition-colors cursor-pointer text-slate-400 hover:text-white min-h-[44px] flex items-center justify-center"
            >
              {isSelected && (
                <motion.div
                  layoutId="activeLabPill"
                  className="absolute inset-0 rounded-full bg-blue-600/30 border border-blue-500/50 shadow-lg shadow-blue-600/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${isSelected ? "text-white font-semibold" : "text-slate-400"}`}>
                {category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tactile Archival Folder Cartridges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 items-stretch">
        {filteredProjects.map((proj: Project, idx: number) => (
          <motion.div
            key={proj.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="flex flex-col group"
          >
            {/* Archival Folder Tab (Sticking out above the main folder) */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 self-start rounded-t-xl bg-[#0c1424] border-t border-x border-white/[0.08] group-hover:border-blue-500/40 group-hover:bg-[#101b33] transition-all text-[11px] font-mono text-slate-400 group-hover:text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-[#ccff00] transition-colors" />
              <span className="tracking-wider">
                {`0${idx + 1} // ${proj.slug.toUpperCase()}`}
              </span>
            </div>

            {/* Folder Body Container */}
            <Link
              href={`/projects/${proj.slug}`}
              onClick={(e) => handleCartridgeClick(e, proj)}
              className="flex-1 flex flex-col justify-between p-6 sm:p-7 rounded-b-2xl rounded-tr-2xl bg-[#080d1a] border border-white/[0.08] group-hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 cursor-pointer relative overflow-hidden backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <div>
                {/* Status Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {proj.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/25 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
                    <span>{proj.status}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2.5 group-hover:text-blue-300 transition-colors leading-snug">
                  {proj.title}
                </h3>

                {/* Punchy 1-line outcome story */}
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
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white/[0.03] text-slate-400 border border-white/[0.08]">
                      +{proj.technologies.length - 3}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-[11px] group-hover:text-white transition-colors">
                    Explore Case Study
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] group-hover:bg-blue-600 border border-white/[0.08] group-hover:border-blue-400 flex items-center justify-center text-slate-400 group-hover:text-white transition-all shadow-sm">
                    <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Active R&D Experiments Section */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-7 sm:p-9 max-w-5xl mx-auto backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Active R&amp;D In Progress ({experiments.length})
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
              className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/25 transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-blue-400 font-semibold">{exp.state}</span>
                <span className="text-slate-500">{exp.category}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">{exp.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {exp.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-slate-400 border border-white/[0.06]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic Warp Iris Lens Transition */}
      <AnimatePresence>
        {warpProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#030509]/85 backdrop-blur-2xl pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.2, 3], opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-80 h-80 rounded-full bg-gradient-to-r from-blue-600/40 via-indigo-500/30 to-blue-400/20 blur-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projectsData, Project } from "@/data/projects";
import { soundFx } from "@/utils/sound";
import SpotlightCard from "@/components/SpotlightCard";
import MotionReveal from "@/components/MotionReveal";
import {
  FlaskConical,
  Sparkles,
  ArrowUpRight,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
  X,
  ExternalLink,
  Hammer,
  Bot,
  Zap,
  Globe,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "AI Application",
  "Agentic Workflow",
  "Automation",
  "Web System",
  "Prototype",
] as const;

interface ActivePrototype {
  id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  techStack: string[];
  icon: React.ElementType;
}

const ACTIVE_WORKBENCH: ActivePrototype[] = [
  {
    id: "whatsapp-qualifier",
    title: "WhatsApp Lead Qualifier & Scheduler",
    category: "Automation",
    status: "Alpha Testing",
    description:
      "An intelligent conversational bot for WhatsApp that answers client inquiries about pricing and scope, qualifies leads based on budget, and syncs meeting details directly to Google Sheets and Notion.",
    techStack: ["Next.js API", "WhatsApp Cloud API", "OpenAI Function Calling", "Supabase"],
    icon: Zap,
  },
  {
    id: "research-agent",
    title: "Autonomous Industry Intelligence Agent",
    category: "AI Application",
    status: "Active Development",
    description:
      "A background research agent that parses daily tech news and industry publications, eliminates fluff, and sends a concise 3-minute markdown briefing directly to Telegram every morning.",
    techStack: ["Python", "Claude 3.7", "FastAPI", "Telegram Bot API"],
    icon: Bot,
  },
  {
    id: "client-portal",
    title: "Lightweight Client Telemetry & Delivery Portal",
    category: "Web System",
    status: "Prototyping",
    description:
      "A private, high-speed portal where clients can track build milestones in real time, test live preview environments, and access clean handoff documentation.",
    techStack: ["Next.js 16", "React 19", "Tailwind CSS v4", "Vercel Edge"],
    icon: Globe,
  },
];

export default function LabSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [blueprintModalOpen, setBlueprintModalOpen] = useState<boolean>(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filteredProjects = projectsData.filter((project: Project) => {
    if (selectedCategory === "All") return true;
    return project.category === selectedCategory;
  });

  const handleTabChange = (category: string) => {
    soundFx.playHover();
    setSelectedCategory(category);
  };

  return (
    <section
      id="lab"
      aria-label="The Lab & Projects"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]"
    >
      {/* Section Header */}
      <MotionReveal className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-sky-400 mb-4 uppercase tracking-wider">
          <FlaskConical size={13} className="text-sky-400 animate-pulse" />
          The Digital Laboratory
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          The Lab // Real Builds &amp; Prototypes
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
          An authentic engineering workshop. Zero fabricated case studies or mock testimonials — only working software, active experiments, and production code.
        </p>
      </MotionReveal>

      {/* Category Filter Pills with Fluid Motion Slider */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleTabChange(category)}
              className="relative px-4 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer text-slate-300 hover:text-white"
            >
              {isSelected && (
                <motion.div
                  layoutId="activeLabPill"
                  className="absolute inset-0 rounded-full bg-sky-500 shadow-md shadow-sky-500/25 border border-sky-400"
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

      {/* Dynamic State: Empty Lab vs Populated Projects */}
      {filteredProjects.length === 0 ? (
        <div className="space-y-10">
          {/* Authentic Workbench Showcase */}
          <div className="text-left mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              <Hammer size={14} className="text-amber-400" />
              <span>On Sam&apos;s Workbench Right Now (Active Prototypes)</span>
            </div>
            <p className="text-sm text-slate-300">
              I don&apos;t publish fake client logos or cookie-cutter templates. Here is what I am actively engineering and testing on my machine:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACTIVE_WORKBENCH.map((item, idx) => {
              const Icon = item.icon;
              return (
                <MotionReveal key={item.id} delay={idx * 0.1}>
                  <SpotlightCard
                    onMouseEnter={() => soundFx.playHover()}
                    spotlightColor="rgba(56, 189, 248, 0.12)"
                    className="p-6 h-full flex flex-col justify-between group cursor-default"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon size={18} />
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {item.status}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-sky-400 uppercase tracking-wider mb-1">
                        {item.category}
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.05]">
                        {item.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-slate-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </SpotlightCard>
                </MotionReveal>
              );
            })}
          </div>

          {/* Transparent Policy & Blueprint Callout */}
          <div className="rounded-3xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-8 sm:p-10 text-center max-w-3xl mx-auto overflow-hidden relative">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Want to Build Something Custom Together?
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto mb-6">
              I partner with founders and teams to build high-impact AI chatbots, business automations, and modern web apps from scratch. Let&apos;s make your project the next featured case study.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  soundFx.playChime(520, 0.08);
                  setBlueprintModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-slate-200 hover:text-white text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Code2 size={15} className="text-sky-400" />
                <span>Preview Case Study Blueprint</span>
              </button>

              <a
                href="#contact"
                onClick={() => soundFx.playHover()}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/20"
              >
                <span>Propose a Custom Build</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Honest Standards Guarantee */}
            <div className="mt-8 pt-6 border-t border-white/[0.05] grid grid-cols-1 sm:grid-cols-3 gap-4 text-left font-mono text-[11px] text-slate-400">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Policy</span>
                <span className="text-slate-200">Zero Fabricated Claims</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Code Quality</span>
                <span className="text-slate-200">Strict TypeScript &amp; Tests</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Collaboration</span>
                <span className="text-slate-200">Direct Communication</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Populated Grid for when projects are added */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj: Project) => (
            <div
              key={proj.slug}
              onClick={() => {
                soundFx.playChime(440, 0.05);
                setActiveProject(proj);
              }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-sky-500/30 hover:bg-white/[0.04] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span className="text-sky-400">{proj.category}</span>
                  <span className="uppercase text-[10px]">{proj.status}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {proj.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {proj.technologies.slice(0, 3).map((t: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.02] text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <ArrowUpRight size={14} className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blueprint Preview Modal */}
      {blueprintModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#0a0f1d] border border-white/[0.12] p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setBlueprintModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-2">
              <Cpu size={14} />
              <span>SCHEMA // CASE_STUDY_STANDARD</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Production Case Study Standard
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Every system published in The Lab complies with this clear engineering schema. No vague summaries or fabricated metrics.
            </p>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-sky-400 font-bold mb-1 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-sky-400" />
                  <span>1. PROBLEM FORMULATION</span>
                </div>
                <div className="text-slate-400">
                  Explicit definition of the operational bottleneck or challenge solved for the user.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-emerald-400 font-bold mb-1 flex items-center gap-2">
                  <Layers size={13} className="text-emerald-400" />
                  <span>2. ARCHITECTURE &amp; WORKFLOW</span>
                </div>
                <div className="text-slate-400">
                  Clear description of the API connections, database schema, AI prompts, and error fallbacks.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-indigo-400 font-bold mb-1 flex items-center gap-2">
                  <Sparkles size={13} className="text-indigo-400" />
                  <span>3. PRACTICAL OUTCOMES</span>
                </div>
                <div className="text-slate-400">
                  Hours saved, manual tasks eliminated, or quantifiable user engagement improvements.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-purple-400 font-bold mb-1 flex items-center gap-2">
                  <ExternalLink size={13} className="text-purple-400" />
                  <span>4. REPRODUCIBILITY &amp; LIVE DEMO</span>
                </div>
                <div className="text-slate-400">
                  Working live URL or reproducible video walkthrough for client verification.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/[0.06] flex justify-end">
              <button
                type="button"
                onClick={() => setBlueprintModalOpen(false)}
                className="px-5 py-2 rounded-full bg-white text-slate-950 font-medium text-xs hover:bg-sky-300 transition-colors cursor-pointer"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Populated Project Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#0a0f1d] border border-white/[0.12] p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <span className="text-xs font-mono text-sky-400 uppercase tracking-wider block mb-2">
              {activeProject.category}
            </span>

            <h3 className="text-2xl font-bold text-white mb-2">
              {activeProject.title}
            </h3>

            <p className="text-sm text-slate-300 mb-6">
              {activeProject.fullDescription || activeProject.shortDescription}
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-slate-400 font-mono font-bold block mb-1">Problem</span>
                <p className="text-slate-300">{activeProject.problem}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-sky-400 font-mono font-bold block mb-1">Approach</span>
                <p className="text-slate-300">{activeProject.approach}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-emerald-400 font-mono font-bold block mb-1">Result</span>
                <p className="text-slate-300">{activeProject.result}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center justify-between">
              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-sky-400 transition-colors"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink size={13} />
                </a>
              )}
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="px-4 py-2 rounded-full bg-white/[0.06] text-slate-300 text-xs hover:text-white transition-colors ml-auto cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

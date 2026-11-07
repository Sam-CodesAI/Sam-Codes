import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projectsData, getProjectBySlug, Project } from "@/data/projects";
import { TechBadge, GithubIcon } from "@/components/TechLogos";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Shield,
  Send,
  Zap,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Production Case Study`,
    description: project.punchyOutcome || project.shortDescription,
    openGraph: {
      title: `${project.title} | SAM CODES`,
      description: project.punchyOutcome || project.shortDescription,
      type: "article",
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#101216] text-[#E8EAF0] antialiased selection:bg-[#4D7CFE]/35 selection:text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background Volumetric Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-10vw] left-[15vw] w-[50vw] h-[40vw] rounded-full glow-orb-cobalt blur-[140px] opacity-35 z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-10vw] right-[10vw] w-[45vw] h-[45vw] rounded-full glow-orb-lime blur-[160px] opacity-15 z-0"
      />

      <article className="relative z-10 max-w-5xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/#lab"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1D24] border border-white/[0.08] hover:border-[#4D7CFE]/50 text-[#9299A8] hover:text-[#E8EAF0] text-xs font-mono transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-[#4D7CFE]" />
            <span>Return to The Lab</span>
          </Link>

          <span className="text-[11px] font-mono text-[#ccff00] px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
            <span>STANDALONE CASE STUDY</span>
          </span>
        </div>

        {/* Hero Header Cartridge */}
        <header className="p-8 sm:p-12 rounded-3xl bg-[#1A1D24]/85 border border-white/[0.08] backdrop-blur-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono min-w-0">
            <span className="px-3 py-1 rounded-md bg-[#4D7CFE]/20 text-[#4D7CFE] border border-[#4D7CFE]/30 font-bold tracking-wider truncate break-all max-w-full">
              {project.cartridgeCode}
            </span>
            <div className="flex items-center gap-2 text-[#9299A8]">
              <span className="uppercase">{project.category}</span>
              <span>//</span>
              <span className="text-[#ccff00] font-semibold">{project.status}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#E8EAF0] leading-tight">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-[#85A6FF] font-medium leading-relaxed max-w-3xl">
            {project.punchyOutcome}
          </p>

          <p className="text-sm sm:text-base text-[#9299A8] leading-relaxed font-normal max-w-3xl">
            {project.fullDescription}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/[0.08]">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target={project.liveUrl.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-[#4D7CFE] hover:bg-[#3D6DEE] text-[#E8EAF0] font-medium text-xs font-mono transition-all flex items-center gap-2 shadow-lg shadow-[#4D7CFE]/30 cursor-pointer"
              >
                <span>Launch System / Demo</span>
                <ExternalLink size={14} />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-[#222630] hover:bg-[#282d39] border border-white/[0.08] text-[#E8EAF0] hover:text-white font-medium text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
              >
                <GithubIcon className="w-3.5 h-3.5 text-[#9299A8]" />
                <span>View Source Repository</span>
              </a>
            )}

            <a
              href="https://t.me/Samarth1306"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-[#1A1D24] hover:bg-[#222630] border border-white/[0.08] hover:border-[#ccff00]/40 text-[#E8EAF0] hover:text-[#ccff00] font-medium text-xs font-mono transition-all flex items-center gap-2 ml-auto cursor-pointer"
            >
              <Send size={14} className="text-[#ccff00]" />
              <span>Discuss Architecture on Telegram</span>
            </a>
          </div>

          {/* Tech Stack Silhouettes */}
          <div className="pt-4 flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-mono text-[#9299A8] mr-2 uppercase">Core Tech:</span>
            {project.technologies.map((tech) => (
              <TechBadge key={tech} name={tech} size="sm" />
            ))}
          </div>
        </header>

        {/* High-Resolution SVG Architecture Pipeline Flow */}
        {project.architecturePipeline && project.architecturePipeline.length > 0 && (
          <section className="p-8 sm:p-10 rounded-3xl bg-[#1A1D24]/85 border border-white/[0.08] backdrop-blur-xl space-y-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#4D7CFE]">
                <Layers size={16} />
                <span className="font-bold uppercase tracking-wider">
                  SYSTEM ARCHITECTURE // HIGH-RES DATAFLOW PIPELINE
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#9299A8] uppercase">
                Hardware &amp; Logic Stages
              </span>
            </div>

            {/* SVG Interactive Pipeline Graph */}
            <div className="w-full overflow-x-auto pb-4">
              <div className="min-w-[700px] flex items-stretch gap-3">
                {project.architecturePipeline.map((node, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center relative">
                    {/* Node Card */}
                    <div className="w-full p-4 rounded-2xl bg-[#222630]/90 border border-white/[0.08] hover:border-[#4D7CFE]/50 transition-all flex flex-col justify-between h-full group">
                      <div>
                        <div className="text-[10px] font-mono text-[#4D7CFE] font-bold mb-1">
                          {node.title}
                        </div>
                        <div className="text-xs font-mono font-bold text-[#E8EAF0] mb-2 group-hover:text-[#ccff00] transition-colors">
                          {node.role}
                        </div>
                        <p className="text-[11px] text-[#9299A8] leading-relaxed font-mono">
                          {node.detail}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[9px] font-mono text-[#9299A8]">
                        <span>STAGE_0{idx + 1}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4D7CFE] group-hover:bg-[#ccff00] transition-colors" />
                      </div>
                    </div>

                    {/* Connecting Pipe Chevron (except last) */}
                    {idx < project.architecturePipeline!.length - 1 && (
                      <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-[#4D7CFE] font-mono text-xs">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Flowchart SVG Diagram */}
            <div className="w-full p-4 rounded-xl bg-[#101216] border border-white/[0.08] flex items-center justify-center">
              <svg className="w-full max-w-3xl h-16" viewBox="0 0 800 60" fill="none">
                <defs>
                  <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4D7CFE" />
                    <stop offset="50%" stopColor="#85A6FF" />
                    <stop offset="100%" stopColor="#ccff00" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 30 H 780"
                  stroke="url(#pipeGrad)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
                <circle cx="50" cy="30" r="8" fill="#1A1D24" stroke="#4D7CFE" strokeWidth="3" />
                <circle cx="225" cy="30" r="8" fill="#1A1D24" stroke="#85A6FF" strokeWidth="3" />
                <circle cx="400" cy="30" r="8" fill="#1A1D24" stroke="#85A6FF" strokeWidth="3" />
                <circle cx="575" cy="30" r="8" fill="#1A1D24" stroke="#a3e635" strokeWidth="3" />
                <circle cx="750" cy="30" r="8" fill="#1A1D24" stroke="#ccff00" strokeWidth="3" />
              </svg>
            </div>
          </section>
        )}

        {/* Problem & Approach Matrix */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem */}
          <div className="p-8 rounded-3xl bg-[#1A1D24]/85 border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
              <Zap size={15} />
              <span>The Operational Bottleneck</span>
            </div>
            <h2 className="text-xl font-bold text-[#E8EAF0]">Why It Had to Be Built</h2>
            <p className="text-sm text-[#9299A8] leading-relaxed font-normal">
              {project.problem}
            </p>
          </div>

          {/* Approach */}
          <div className="p-8 rounded-3xl bg-[#1A1D24]/85 border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#ccff00] font-bold uppercase tracking-wider">
              <Cpu size={15} />
              <span>Clean-Room First Principles</span>
            </div>
            <h2 className="text-xl font-bold text-[#E8EAF0]">The Engineering Solution</h2>
            <p className="text-sm text-[#9299A8] leading-relaxed font-normal">
              {project.approach}
            </p>
          </div>
        </section>

        {/* Evidence & Verified Outcomes Grid */}
        {project.metrics && project.metrics.length > 0 && (
          <section className="p-8 sm:p-10 rounded-3xl bg-[#1A1D24]/85 border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#ccff00] font-bold uppercase tracking-wider">
                <CheckCircle2 size={16} />
                <span>Verified Telemetry &amp; Evidence</span>
              </div>
              <span className="text-[10px] font-mono text-[#9299A8]">
                100% Empirically Tested
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#222630] border border-white/[0.08] font-mono space-y-1"
                >
                  <div className="text-[10px] text-[#9299A8] uppercase tracking-wider">
                    {metric.label}
                  </div>
                  <div className="text-2xl font-black text-[#E8EAF0]">{metric.value}</div>
                  {metric.evidenceNotes && (
                    <div className="text-[10px] text-[#85A6FF] pt-1 leading-snug">
                      {metric.evidenceNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Architectural Principles & Lessons Learned */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#1A1D24]/85 border border-white/[0.08] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#4D7CFE] font-bold uppercase tracking-wider border-b border-white/[0.08] pb-4">
            <Shield size={16} />
            <span>Key Architectural Invariants &amp; Lessons</span>
          </div>

          <p className="text-sm sm:text-base text-[#9299A8] leading-relaxed">
            {project.lessons}
          </p>

          <div className="p-4 rounded-2xl bg-[#101216] border border-white/[0.08] text-xs font-mono text-[#9299A8] flex items-start gap-3">
            <Sparkles size={16} className="text-[#ccff00] shrink-0 mt-0.5" />
            <span>
              Every production system in Samarth&apos;s portfolio is built with zero hypothetical claims, fully reproducible test suites, and clean-room first-principles architecture.
            </span>
          </div>
        </section>

        {/* Next Step / Direct Contact Callout */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1A1D24] via-[#222630] to-[#101216] border border-[#4D7CFE]/30 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E8EAF0]">
            Need This Built or Customized for Your Team?
          </h2>
          <p className="text-sm sm:text-base text-[#9299A8] max-w-xl mx-auto">
            Samarth works directly with founders and teams to build custom vector engines, edge telephony bots, and high-velocity web platforms in days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://t.me/Samarth1306"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-full bg-[#4D7CFE] hover:bg-[#3D6DEE] text-[#E8EAF0] font-medium text-xs font-mono transition-all flex items-center gap-2 shadow-lg shadow-[#4D7CFE]/30 cursor-pointer"
            >
              <Send size={15} />
              <span>Talk on Telegram (@Samarth1306)</span>
            </a>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-[#1A1D24] hover:bg-[#222630] border border-white/[0.08] text-[#E8EAF0] hover:text-white font-medium text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Submit Project Specification</span>
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}

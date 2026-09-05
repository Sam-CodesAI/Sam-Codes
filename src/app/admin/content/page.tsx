"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  User,
  Layers,
  Cpu,
  Share2,
  Compass,
  MessageSquare,
  Settings,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

interface ContentItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  accentColor: string;
  badge?: string;
  stat?: string;
}

export default function AdminContentHub() {
  const [stats, setStats] = useState({
    projectsCount: 0,
    servicesCount: 0,
    topicsCount: 0,
    knowledgeCount: 0,
  });

  useEffect(() => {
    async function loadCounts() {
      try {
        const [projRes, servRes, expRes, assRes] = await Promise.all([
          fetch("/api/admin/projects"),
          fetch("/api/admin/services"),
          fetch("/api/admin/exploring"),
          fetch("/api/admin/assistant"),
        ]);
        const [projData, servData, expData, assData] = await Promise.all([
          projRes.ok ? projRes.json() : { projects: [] },
          servRes.ok ? servRes.json() : { services: [] },
          expRes.ok ? expRes.json() : { topics: [] },
          assRes.ok ? assRes.json() : { knowledge: [] },
        ]);

        setStats({
          projectsCount: projData.projects?.length || 0,
          servicesCount: servData.services?.length || 0,
          topicsCount: expData.topics?.length || 0,
          knowledgeCount: assData.knowledge?.length || 0,
        });
      } catch (err) {
        console.error("Error loading content stats:", err);
      }
    }
    loadCounts();
  }, []);

  const contentSections: ContentItem[] = [
    {
      title: "Profile & Identity",
      description: "Manage identity headline, location, bio, availability status, and Why Work With Sam value statements.",
      href: "/admin/profile",
      icon: User,
      accentColor: "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400",
      badge: "Core Identity",
    },
    {
      title: "Service Offerings",
      description: "Manage the 4 primary services, deliverables checklists, problem statements, and turnaround expectations.",
      href: "/admin/services",
      icon: Layers,
      accentColor: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
      stat: `${stats.servicesCount} Active Services`,
    },
    {
      title: "Projects & Lab",
      description: "Draft, edit, publish, and feature real architecture case studies with metrics, problem-approach, and code links.",
      href: "/admin/projects",
      icon: FileText,
      accentColor: "from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-400",
      stat: `${stats.projectsCount} Case Studies`,
    },
    {
      title: "Capabilities & Stack",
      description: "Curate your active production tools, Next.js/AI stack, and the exploring technology queue.",
      href: "/admin/capabilities",
      icon: Cpu,
      accentColor: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
      badge: "Tech Arsenal",
    },
    {
      title: "Social Links & Channels",
      description: "Update Instagram, LinkedIn, X, GitHub, Reddit, email, and WhatsApp connection channels.",
      href: "/admin/socials",
      icon: Share2,
      accentColor: "from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400",
      badge: "6 Channels",
    },
    {
      title: "Currently Exploring",
      description: "Keep visitors informed on your current R&D initiatives, local LLM benchmarks, and distributed agent systems.",
      href: "/admin/exploring",
      icon: Compass,
      accentColor: "from-cyan-500/20 to-sky-500/10 border-cyan-500/30 text-cyan-400",
      stat: `${stats.topicsCount} Active Topics`,
    },
    {
      title: "Ask Sam Knowledge Base",
      description: "Teach and update the on-site AI assistant with verified knowledge pairs regarding your background and workflow.",
      href: "/admin/assistant",
      icon: MessageSquare,
      accentColor: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400",
      stat: `${stats.knowledgeCount} Q&A Pairs`,
    },
    {
      title: "Global Site Settings",
      description: "Manage site SEO meta tags, availability status toggle, sound effects, and the living neural canvas intro.",
      href: "/admin/settings",
      icon: Settings,
      accentColor: "from-slate-500/20 to-zinc-500/10 border-slate-500/30 text-slate-300",
      badge: "Configuration",
    },
  ];

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <FileText size={14} />
              <span>Central Content Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Content Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Manage and deploy every piece of content that powers the public SAM CODES experience.
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-300 flex items-center gap-2 transition-all self-start sm:self-auto min-h-[44px]"
          >
            <ExternalLink size={14} className="text-sky-400" />
            <span>Open Public Site</span>
          </a>
        </div>

        {/* Content Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.href}
                href={sec.href}
                className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.14] transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className={`p-3 rounded-xl border bg-gradient-to-br ${sec.accentColor}`}>
                      <Icon size={20} />
                    </div>

                    <div className="flex items-center gap-2">
                      {sec.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.05] text-slate-300 border border-white/[0.06]">
                          {sec.badge}
                        </span>
                      )}
                      {sec.stat && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                          {sec.stat}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-sky-400 transition-colors mb-2">
                    {sec.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                    {sec.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono text-sky-400 group-hover:text-sky-300">
                  <span>Open Editor</span>
                  <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}

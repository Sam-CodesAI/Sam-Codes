"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Code2,
  BarChart3,
  Globe,
  GitBranch,
  Star,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";
import { ExtendedProject } from "@/lib/data-service";

interface MetricItem {
  label: string;
  value: string;
  description?: string;
}

const CATEGORY_OPTIONS = [
  "AI Application",
  "Agentic Workflow",
  "Automation",
  "Web System",
  "Prototype",
  "Workflow Automation",
  "AI Agent System",
  "Web Platform",
  "Developer Tool",
  "Experimental Prototype",
];

const DEFAULT_PROJECT: ExtendedProject = {
  id: "",
  slug: "",
  title: "",
  shortDescription: "",
  fullDescription: "",
  category: "AI Application",
  technologies: ["TypeScript", "Next.js", "Tailwind CSS"],
  tools: [],
  image: "",
  status: "DRAFT",
  featured: false,
  date: new Date().toISOString().split("T")[0],
  problem: "",
  approach: "",
  architecture: [],
  result: "",
  lessons: "",
  metrics: [],
  liveUrl: "",
  githubUrl: "",
};

export default function ProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const isNew = projectId === "new";
  const router = useRouter();
  const { showToast } = useToast();

  const [project, setProject] = useState<ExtendedProject>(DEFAULT_PROJECT);
  const [initialProject, setInitialProject] = useState<ExtendedProject>(DEFAULT_PROJECT);
  const [activeTab, setActiveTab] = useState<"basic" | "narrative" | "architecture" | "metrics">("basic");
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Form helper inputs
  const [newTagInput, setNewTagInput] = useState("");
  const [newArchLayerInput, setNewArchLayerInput] = useState("");

  useEffect(() => {
    if (isNew) {
      const fresh: ExtendedProject = {
        ...DEFAULT_PROJECT,
        id: `proj-${Date.now()}`,
      };
      setProject(fresh);
      setInitialProject(fresh);
      setIsLoading(false);
      return;
    }

    async function loadProject() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/projects?id=${projectId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.project) {
            setProject(data.project);
            setInitialProject(data.project);
          } else {
            showToast("Project not found", "error");
            router.push("/admin/projects");
          }
        } else {
          showToast("Failed to fetch project", "error");
          router.push("/admin/projects");
        }
      } catch {
        showToast("Error loading project", "error");
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [projectId, isNew, router, showToast]);

  // Dirty state checker
  const isDirty = JSON.stringify(project) !== JSON.stringify(initialProject);

  const handleFieldChange = <K extends keyof ExtendedProject>(
    field: K,
    value: ExtendedProject[K]
  ) => {
    setProject((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && (!prev.slug || isNew)) {
        updated.slug = (value as string)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");
      }
      return updated;
    });
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !project.technologies.includes(trimmed)) {
      setProject((prev) => ({
        ...prev,
        technologies: [...prev.technologies, trimmed],
      }));
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProject((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tagToRemove),
    }));
  };

  const handleAddArchLayer = () => {
    const trimmed = newArchLayerInput.trim();
    if (trimmed) {
      setProject((prev) => ({
        ...prev,
        architecture: [...(prev.architecture || []), trimmed],
      }));
      setNewArchLayerInput("");
    }
  };

  const handleRemoveArchLayer = (index: number) => {
    setProject((prev) => ({
      ...prev,
      architecture: (prev.architecture || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddMetric = () => {
    setProject((prev) => ({
      ...prev,
      metrics: [
        ...(prev.metrics || []),
        { label: "Throughput", value: "99.9%", description: "Automated reliability" },
      ],
    }));
  };

  const handleUpdateMetric = (index: number, updated: Partial<MetricItem>) => {
    setProject((prev) => {
      const current = [...(prev.metrics || [])];
      current[index] = { ...current[index], ...updated };
      return { ...prev, metrics: current };
    });
  };

  const handleRemoveMetric = (index: number) => {
    setProject((prev) => ({
      ...prev,
      metrics: (prev.metrics || []).filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (targetStatus?: ExtendedProject["status"]) => {
    if (!project.title.trim()) {
      showToast("Please provide a project title", "error");
      setActiveTab("basic");
      return;
    }

    if (!project.slug.trim()) {
      showToast("Please provide a URL slug", "error");
      setActiveTab("basic");
      return;
    }

    setIsSaving(true);
    const toSave: ExtendedProject = {
      ...project,
      status: targetStatus || project.status,
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });

      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        setInitialProject(data.project);
        setLastSavedAt(new Date().toLocaleTimeString());
        showToast(
          targetStatus === "PUBLISHED"
            ? `Project published to live site!`
            : "Draft saved successfully",
          "success"
        );

        if (isNew) {
          router.replace(`/admin/projects/${data.project.id}`);
        }
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to save project", "error");
      }
    } catch {
      showToast("Network error while saving project", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setProject(initialProject);
    showToast("Changes reverted", "info");
  };

  if (isLoading) {
    return (
      <AdminShell>
        <div className="p-16 text-center text-xs font-mono text-slate-400">
          Loading project editor...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6 pb-20 animate-in fade-in duration-300">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div className="space-y-1">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Projects</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isNew ? "Create New Project" : project.title || "Untitled Project"}
              </h1>
              <StatusBadge status={project.status} />
              {project.featured && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <Star size={11} className="fill-current" />
                  <span>Featured</span>
                </span>
              )}
            </div>

            {project.slug && (
              <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <span>Slug:</span>
                <span className="text-sky-400">/projects/{project.slug}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-sky-400 flex items-center gap-1.5 transition-colors min-h-[44px]"
              >
                <Eye size={14} />
                <span>Live Demo</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] overflow-x-auto scrollbar-none pb-px">
          {[
            { id: "basic" as const, label: "Overview & Meta", icon: Globe },
            { id: "narrative" as const, label: "Problem & Results", icon: Sparkles },
            { id: "architecture" as const, label: "Stack & Architecture", icon: Code2 },
            { id: "metrics" as const, label: "Quantitative Impact", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-mono border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
                  isActive
                    ? "border-sky-400 text-sky-400 font-bold bg-sky-500/[0.04]"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BASIC INFO */}
        {activeTab === "basic" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="e.g. LeadPulse AI Automation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white font-mono placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={project.slug}
                  onChange={(e) => handleFieldChange("slug", e.target.value)}
                  placeholder="leadpulse-ai-automation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-sky-400 font-mono placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Category
                </label>
                <select
                  value={project.category}
                  onChange={(e) => handleFieldChange("category", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:border-sky-500/50 min-h-[44px]"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Publication Date
                </label>
                <input
                  type="date"
                  value={project.date}
                  onChange={(e) => handleFieldChange("date", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:border-sky-500/50 min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Status
                </label>
                <select
                  value={project.status}
                  onChange={(e) => handleFieldChange("status", e.target.value as ExtendedProject["status"])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:border-sky-500/50 min-h-[44px]"
                >
                  <option value="DRAFT" className="bg-slate-900 text-slate-200">
                    Draft (Admin Only)
                  </option>
                  <option value="PUBLISHED" className="bg-slate-900 text-slate-200">
                    Published (Live on Portfolio)
                  </option>
                  <option value="ARCHIVED" className="bg-slate-900 text-slate-200">
                    Archived
                  </option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white font-mono">
                  Featured Case Study
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Highlight this project prominently on the homepage
                </div>
              </div>
              <input
                type="checkbox"
                checked={project.featured}
                onChange={(e) => handleFieldChange("featured", e.target.checked)}
                className="w-5 h-5 rounded bg-white/[0.05] border-white/[0.2] text-sky-500 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Short Card Summary (1-2 sentences)
              </label>
              <textarea
                rows={2}
                value={project.shortDescription}
                onChange={(e) => handleFieldChange("shortDescription", e.target.value)}
                placeholder="High-converting autonomous lead scraping and qualification pipeline delivering clean webhooks."
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-sans placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Full Narrative Description
              </label>
              <textarea
                rows={5}
                value={project.fullDescription}
                onChange={(e) => handleFieldChange("fullDescription", e.target.value)}
                placeholder="Complete project overview describing the client requirement, business context, and operational outcome..."
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-sans placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={13} className="text-sky-400" />
                  <span>Live Demo URL</span>
                </label>
                <input
                  type="url"
                  value={project.liveUrl || ""}
                  onChange={(e) => handleFieldChange("liveUrl", e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GitBranch size={13} className="text-purple-400" />
                  <span>GitHub Repository</span>
                </label>
                <input
                  type="url"
                  value={project.githubUrl || ""}
                  onChange={(e) => handleFieldChange("githubUrl", e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Hero Image Path
                </label>
                <input
                  type="text"
                  value={project.image || ""}
                  onChange={(e) => handleFieldChange("image", e.target.value)}
                  placeholder="/projects/demo.webp"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROBLEM & APPROACH */}
        {activeTab === "narrative" && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                1. Problem Statement
              </label>
              <p className="text-[11px] font-mono text-slate-400">
                What friction, technical constraint, or inefficiency was the project built to solve?
              </p>
              <textarea
                rows={4}
                value={project.problem || ""}
                onChange={(e) => handleFieldChange("problem", e.target.value)}
                placeholder="Manual data scraping took 14+ hours per week, with frequent IP bans and unstructured CSV exports..."
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-sans placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                2. Engineering Approach
              </label>
              <p className="text-[11px] font-mono text-slate-400">
                How did you architect and execute the solution? What tools or paradigms did you leverage?
              </p>
              <textarea
                rows={4}
                value={project.approach || ""}
                onChange={(e) => handleFieldChange("approach", e.target.value)}
                placeholder="Designed a headless Playwright cluster deployed on AWS Lambda with residential proxy rotation and Gemini 2.5 Flash for JSON schema extraction..."
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-sans placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                3. Business Results & Quantitative Outcomes
              </label>
              <p className="text-[11px] font-mono text-slate-400">
                What concrete results did this system achieve? (e.g. latency drop, hours saved, accuracy)
              </p>
              <textarea
                rows={3}
                value={project.result || ""}
                onChange={(e) => handleFieldChange("result", e.target.value)}
                placeholder="Reduced scraping cycle from 14 hours to 8 minutes, processed 45,000 entities with zero downtime."
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-sans placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                4. Architecture Lessons Learned
              </label>
              <textarea
                rows={3}
                value={project.lessons || ""}
                onChange={(e) => handleFieldChange("lessons", e.target.value)}
                placeholder="Schema validation at ingestion boundary prevented 98% of downstream pipeline crashes..."
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-sans placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50"
              />
            </div>
          </div>
        )}

        {/* TAB 3: STACK & ARCHITECTURE */}
        {activeTab === "architecture" && (
          <div className="space-y-8">
            {/* Tech Tags */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Tech Stack Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono flex items-center gap-1.5"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tech)}
                      className="hover:text-rose-400 cursor-pointer p-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type technology (e.g. Supabase, Docker, FastAPI) and press enter..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-white flex items-center gap-1 min-h-[44px] cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Tag</span>
                </button>
              </div>
            </div>

            {/* Architecture Layers */}
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Architecture Layers & Flow
                  </label>
                  <p className="text-[11px] font-mono text-slate-400">
                    Step-by-step breakdown of how data flows through the application
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {(project.architecture || []).map((layer, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3 text-xs font-mono text-slate-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{layer}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveArchLayer(idx)}
                      className="p-1 hover:text-rose-400 text-slate-500 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newArchLayerInput}
                  onChange={(e) => setNewArchLayerInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddArchLayer();
                    }
                  }}
                  placeholder="e.g. Ingestion Layer: Webhook receiver with HMAC authentication..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={handleAddArchLayer}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-white flex items-center gap-1 min-h-[44px] cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Layer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: METRICS */}
        {activeTab === "metrics" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Quantitative Impact Metrics
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Real numbers that prove your code works (e.g. 10x faster, 99.4% uptime)
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddMetric}
                className="px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Plus size={14} />
                <span>Add Metric</span>
              </button>
            </div>

            <div className="space-y-3">
              {(project.metrics || []).map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
                >
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => handleUpdateMetric(idx, { label: e.target.value })}
                      placeholder="e.g. Execution Speed"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => handleUpdateMetric(idx, { value: e.target.value })}
                      placeholder="e.g. 8 minutes (was 14h)"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-sky-400 font-bold"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={m.description || ""}
                        onChange={(e) => handleUpdateMetric(idx, { description: e.target.value })}
                        placeholder="e.g. End-to-end latency reduction"
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-300"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(idx)}
                      className="p-2 mt-5 hover:text-rose-400 text-slate-500 cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

              {(!project.metrics || project.metrics.length === 0) && (
                <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-slate-400">
                  No metrics added yet. Click &quot;Add Metric&quot; to showcase quantified performance.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sticky Save / Publish Action Bar */}
        <SaveBar
          isDirty={isDirty}
          isSaving={isSaving}
          lastSavedAt={lastSavedAt}
          onSaveDraft={() => handleSave("DRAFT")}
          onPublish={() => handleSave("PUBLISHED")}
          onDiscard={handleDiscard}
          onPreview={project.liveUrl ? () => window.open(project.liveUrl, "_blank") : undefined}
          publishLabel={project.status === "PUBLISHED" ? "Update Published" : "Publish to Live"}
        />
      </div>
    </AdminShell>
  );
}

"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Star,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import { ExtendedProject } from "@/lib/data-service";

export default function AdminProjectsPage() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<ExtendedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [projectToDelete, setProjectToDelete] = useState<ExtendedProject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      showToast("Failed to load projects", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleQuickStatusToggle = async (project: ExtendedProject) => {
    const nextStatus =
      project.status === "PUBLISHED" || project.status === "Shipped"
        ? "DRAFT"
        : "PUBLISHED";

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...project,
          status: nextStatus,
        }),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, status: nextStatus } : p))
        );
        showToast(
          `Project "${project.title}" marked as ${nextStatus}`,
          "success"
        );
      } else {
        showToast("Failed to update status", "error");
      }
    } catch {
      showToast("Network error while updating status", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects?id=${projectToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
        showToast(`Project "${projectToDelete.title}" deleted`, "info");
        setProjectToDelete(null);
      } else {
        showToast("Failed to delete project", "error");
      }
    } catch {
      showToast("Error deleting project", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "PUBLISHED"
          ? p.status === "PUBLISHED" || p.status === "Shipped"
          : p.status === statusFilter;

      const matchesCategory =
        categoryFilter === "ALL" ? true : p.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [projects, searchQuery, statusFilter, categoryFilter]);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return Array.from(set);
  }, [projects]);

  return (
    <AdminShell>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <FolderGit2 size={14} />
              <span>Catalog Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Projects & Case Studies
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Manage live case studies, problem-solving deep dives, architecture diagrams, and draft prototypes.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchProjects}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>

            <Link
              href="/admin/projects/new"
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer min-h-[44px]"
            >
              <Plus size={15} />
              <span>New Project</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by title, stack, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
            />
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-xl text-xs font-mono transition-all shrink-0 cursor-pointer min-h-[44px] ${
                  statusFilter === status
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/30 font-bold"
                    : "bg-white/[0.02] text-slate-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-300 focus:outline-none focus:border-sky-500/50 min-h-[44px] cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">
                All Categories
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-slate-400">
            Loading project catalog...
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="space-y-3">
            {filteredProjects.map((project) => {
              const isPublished =
                project.status === "PUBLISHED" || project.status === "Shipped";

              return (
                <div
                  key={project.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={project.status} />
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                          <Star size={11} className="fill-current" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-base sm:text-lg font-bold text-white hover:text-sky-400 transition-colors inline-block"
                      >
                        {project.title}
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-sans">
                        {project.shortDescription}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[10px] font-mono text-slate-400">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-sky-400 hover:text-sky-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                        title="Open Live Preview"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleQuickStatusToggle(project)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono transition-colors min-h-[44px] cursor-pointer flex items-center gap-1.5 ${
                        isPublished
                          ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                      title="Toggle Draft/Publish status"
                    >
                      <span>{isPublished ? "Published" : "Draft"}</span>
                    </button>

                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-sky-500/10 hover:text-sky-400 text-slate-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                      title="Edit Project"
                    >
                      <Edit3 size={15} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setProjectToDelete(project)}
                      className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <AlertCircle size={28} className="text-slate-500 mx-auto" />
            <p className="text-xs font-mono text-slate-400">
              No projects found matching your search or filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setCategoryFilter("ALL");
              }}
              className="text-xs font-mono text-sky-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          isOpen={!!projectToDelete}
          title="Delete Project"
          message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone and will remove it from the public portfolio.`}
          confirmLabel="Delete Project"
          confirmVariant="danger"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setProjectToDelete(null)}
        />
      </div>
    </AdminShell>
  );
}

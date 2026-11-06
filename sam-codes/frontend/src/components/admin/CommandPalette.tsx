"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  FolderGit2,
  Inbox,
  FileText,
  User,
  Sparkles,
  BarChart3,
  Settings,
  Activity,
  ExternalLink,
  Plus,
  X,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  href?: string;
  action?: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const items: CommandItem[] = [
    { id: "dashboard", title: "Overview Dashboard", category: "Navigation", icon: LayoutDashboard, href: "/admin" },
    { id: "new-project", title: "Create New Project", category: "Actions", icon: Plus, href: "/admin/projects/new" },
    { id: "projects", title: "Manage Projects & Case Studies", category: "Navigation", icon: FolderGit2, href: "/admin/projects" },
    { id: "inquiries", title: "Review Leads & Inquiries", category: "Navigation", icon: Inbox, href: "/admin/inquiries" },
    { id: "content", title: "Content Manager", category: "Navigation", icon: FileText, href: "/admin/content" },
    { id: "profile", title: "Edit Builder Profile", category: "Content", icon: User, href: "/admin/profile" },
    { id: "services", title: "Manage Services & Offerings", category: "Content", icon: Sparkles, href: "/admin/services" },
    { id: "capabilities", title: "Edit Capabilities & Stack", category: "Content", icon: FileText, href: "/admin/capabilities" },
    { id: "analytics", title: "View Traffic & Conversion Analytics", category: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { id: "settings", title: "Site Configuration & Settings", category: "System", icon: Settings, href: "/admin/settings" },
    { id: "system", title: "System Health & Audit Logs", category: "System", icon: Activity, href: "/admin/system" },
    {
      id: "view-live",
      title: "View Live Public Website",
      category: "External",
      icon: ExternalLink,
      action: () => window.open("/", "_blank"),
    },
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (item: CommandItem) => {
    if (item.href) router.push(item.href);
    if (item.action) item.action();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-24 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[#090d16] border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <Search size={18} className="text-sky-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, section, or action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results list */}
        <div className="overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all text-left text-xs font-mono group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] group-hover:border-sky-500/40 text-slate-400 group-hover:text-sky-400 transition-colors">
                      <Icon size={15} />
                    </div>
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[10px] uppercase text-slate-400 px-2 py-0.5 rounded bg-white/[0.03]">
                    {item.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 font-mono">
              No matching commands or routes found.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Navigation: Arrow keys / Click</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}

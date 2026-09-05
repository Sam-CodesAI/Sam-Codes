"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Inbox,
  FileText,
  BarChart3,
  Settings,
  Activity,
  ExternalLink,
  Search,
  LogOut,
  Sparkles,
  Terminal,
} from "lucide-react";
import { ToastProvider, useToast } from "@/components/admin/ToastProvider";
import CommandPalette from "@/components/admin/CommandPalette";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  badge?: number;
}

const PRIMARY_NAV: NavItem[] = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const SECONDARY_NAV: NavItem[] = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "System Health", href: "/admin/system", icon: Activity },
];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      showToast("Signed out successfully", "info");
      router.push("/admin/login");
      router.refresh();
    } catch {
      showToast("Failed to sign out", "error");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 flex flex-col sm:flex-row antialiased">
      {/* ---------------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR (Visible on sm and up)                                 */}
      {/* ---------------------------------------------------------------------- */}
      <aside className="hidden sm:flex flex-col w-64 border-r border-white/[0.08] bg-[#080c16]/80 backdrop-blur-xl shrink-0 sticky top-0 h-screen z-30 justify-between p-4">
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/[0.06]">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Terminal size={17} />
              </div>
              <div>
                <span className="font-mono text-xs font-bold tracking-wider text-white block">
                  SAM CODES
                </span>
                <span className="font-mono text-[10px] text-sky-400 block tracking-widest uppercase">
                  CMD_CENTER v1.2
                </span>
              </div>
            </Link>

            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Live" />
          </div>

          {/* Quick Search Shortcut */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-xs font-mono text-slate-400 mb-6 cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-500 group-hover:text-sky-400 transition-colors" />
              <span>Search commands...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-slate-400 border border-white/[0.08]">
              ⌘K
            </kbd>
          </button>

          {/* Primary Navigation Links */}
          <div className="space-y-1 mb-6">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-3 mb-2">
              Control Plane
            </div>
            {PRIMARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all group ${
                    isActive
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      className={isActive ? "text-sky-400" : "text-slate-500 group-hover:text-slate-300"}
                    />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Secondary Navigation Links */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-3 mb-2">
              System
            </div>
            {SECONDARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all group ${
                    isActive
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={15}
                      className={isActive ? "text-sky-400" : "text-slate-500 group-hover:text-slate-300"}
                    />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Footer Actions */}
        <div className="pt-4 border-t border-white/[0.06] space-y-2 font-mono">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-xs text-slate-300 hover:text-white transition-all group border border-white/[0.04]"
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={13} className="text-sky-400" />
              <span>View Public Site</span>
            </div>
            <span className="text-[10px] text-slate-400">Live ↗</span>
          </a>

          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.01]">
            <div>
              <div className="text-[11px] font-bold text-white">Samarth N.</div>
              <div className="text-[9px] text-emerald-400">SUPER_ADMIN</div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------------------------- */}
      {/* MOBILE TOP HEADER (Visible on small screens)                           */}
      {/* ---------------------------------------------------------------------- */}
      <header className="sm:hidden sticky top-0 z-30 px-4 py-3 bg-[#080c16]/90 border-b border-white/[0.08] backdrop-blur-xl flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
            <Terminal size={14} />
          </div>
          <span className="font-mono text-xs font-bold text-white tracking-wider">
            SAM CODES
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            CMD
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="p-2 rounded-full bg-white/[0.04] text-slate-300 hover:text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Search"
          >
            <Search size={16} />
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full bg-white/[0.04] text-sky-400 hover:text-sky-300 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="View Live Site"
          >
            <ExternalLink size={16} />
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-full bg-white/[0.04] text-slate-400 hover:text-rose-400 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN ADMIN CONTENT AREA                                                */}
      {/* ---------------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 pb-24 sm:pb-8 p-4 sm:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* ---------------------------------------------------------------------- */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Visible on small screens)                */}
      {/* ---------------------------------------------------------------------- */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#080c16]/95 border-t border-white/[0.08] backdrop-blur-xl px-2 py-1 flex items-center justify-around safe-area-bottom">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl min-h-[48px] min-w-[56px] transition-all cursor-pointer ${
                isActive
                  ? "text-sky-400 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon size={18} className={isActive ? "text-sky-400" : "text-slate-500"} />
              <span className="text-[10px] font-mono mt-1 tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ShellInner>{children}</ShellInner>
    </ToastProvider>
  );
}

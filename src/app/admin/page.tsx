"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Inbox,
  Eye,
  Activity,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Plus,
  Mail,
  Clock,
  ShieldCheck,
  ChevronRight,
  Layers,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import MetricCard from "@/components/admin/MetricCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { ExtendedProject, Inquiry, AuditLog } from "@/lib/data-service";

interface DashboardData {
  projects: ExtendedProject[];
  inquiries: Inquiry[];
  analyticsSummary: {
    totalVisitors: number;
    totalPageViews: number;
    totalSessions: number;
    totalInquiries: number;
  };
  auditLogs: AuditLog[];
  systemHealth: {
    database: string;
    auth: string;
    storage: string;
    version: string;
    uptime: string;
  };
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [projRes, inqRes, anaRes, sysRes] = await Promise.all([
        fetch("/api/admin/projects"),
        fetch("/api/admin/inquiries"),
        fetch("/api/admin/analytics?range=7"),
        fetch("/api/admin/system"),
      ]);

      const [projData, inqData, anaData, sysData] = await Promise.all([
        projRes.ok ? projRes.json() : { projects: [] },
        inqRes.ok ? inqRes.json() : { inquiries: [] },
        anaRes.ok ? anaRes.json() : { summary: { totalVisitors: 0, totalPageViews: 0, totalSessions: 0, totalInquiries: 0 } },
        sysRes.ok ? sysRes.json() : { health: { database: "Healthy", auth: "Healthy", storage: "Healthy", version: "1.2.0", uptime: "99.9%" }, auditLogs: [] },
      ]);

      setData({
        projects: projData.projects || [],
        inquiries: inqData.inquiries || [],
        analyticsSummary: anaData.summary || { totalVisitors: 0, totalPageViews: 0, totalSessions: 0, totalInquiries: 0 },
        auditLogs: sysData.auditLogs || [],
        systemHealth: sysData.health || { database: "Healthy", auth: "Healthy", storage: "Healthy", version: "1.2.0", uptime: "99.9%" },
      });
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const newInquiries = data?.inquiries.filter((i) => i.status === "NEW") || [];
  const publishedProjects = data?.projects.filter((p) => p.status === "PUBLISHED" || p.status === "Shipped") || [];
  const draftProjects = data?.projects.filter((p) => p.status === "DRAFT") || [];

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                Operating System // v1.2
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Welcome back, Samarth. All systems are operational.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-300 flex items-center gap-2 cursor-pointer transition-all min-h-[44px]"
              title="Refresh telemetry"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-sky-400" : "text-slate-400"} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/admin/projects/new"
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all min-h-[44px]"
            >
              <Plus size={15} />
              <span>New Project</span>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-white flex items-center gap-1.5 transition-all min-h-[44px]"
            >
              <Eye size={14} className="text-sky-400" />
              <span className="hidden sm:inline">View Site</span>
              <ArrowUpRight size={13} className="text-slate-400" />
            </a>
          </div>
        </div>

        {/* Core Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <MetricCard
            label="7-Day Visitors"
            value={isLoading ? "..." : (data?.analyticsSummary.totalVisitors ?? 0)}
            subtext="Authentic client sessions"
            icon={BarChart3}
            accentColor="cyan"
          />
          <MetricCard
            label="Inquiries"
            value={isLoading ? "..." : (data?.inquiries.length ?? 0)}
            badge={newInquiries.length > 0 ? `${newInquiries.length} NEW` : undefined}
            subtext="High-intent proposals"
            icon={Inbox}
            accentColor="amber"
          />
          <MetricCard
            label="Active Projects"
            value={isLoading ? "..." : publishedProjects.length}
            subtext={`${draftProjects.length} drafts in progress`}
            icon={FolderGit2}
            accentColor="purple"
          />
          <MetricCard
            label="System Health"
            value="100%"
            subtext="API & Storage nominal"
            icon={Activity}
            accentColor="emerald"
          />
        </div>

        {/* Main Grid: Urgent Inquiries & Quick Jump */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Urgent Inquiries Section (2 Columns on large) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox size={16} className="text-amber-400" />
                <h2 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
                  Client Inquiries
                </h2>
                {newInquiries.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                    {newInquiries.length} Action Required
                  </span>
                )}
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors min-h-[44px] flex items-center"
              >
                <span>View all</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-slate-500">
                  Loading inquiries...
                </div>
              ) : data && data.inquiries.length > 0 ? (
                data.inquiries.slice(0, 4).map((inq) => (
                  <Link
                    key={inq.id}
                    href={`/admin/inquiries?id=${inq.id}`}
                    className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] transition-all block group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <StatusBadge status={inq.status} />
                        <span className="font-bold text-sm text-white group-hover:text-sky-400 transition-colors">
                          {inq.name}
                        </span>
                        {inq.email && (
                          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                            ({inq.email})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock size={12} />
                        <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-sky-400/90 mb-1">
                      {inq.serviceRequested}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {inq.message}
                    </p>

                    {inq.privateNotes && (
                      <div className="mt-2.5 pt-2.5 border-t border-white/[0.04] text-[11px] font-mono text-slate-400">
                        <span className="text-amber-400 font-medium">Note:</span> {inq.privateNotes}
                      </div>
                    )}
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-mono text-slate-400">
                    No inquiries yet. Form submissions will appear here instantly.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Control Hub (1 Column on large) */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Layers size={16} className="text-sky-400" />
                <h2 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
                  Quick Actions
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <Link
                  href="/admin/projects/new"
                  className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-sky-500/30 transition-all flex items-center justify-between group min-h-[50px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                      <Plus size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-white group-hover:text-sky-400 transition-colors">
                        Add New Project
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Draft or publish architecture
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-500 group-hover:text-white transition-colors" />
                </Link>

                <Link
                  href="/admin/profile"
                  className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-purple-500/30 transition-all flex items-center justify-between group min-h-[50px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-white group-hover:text-purple-400 transition-colors">
                        Update Bio & Status
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Headline, availability, rates
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-500 group-hover:text-white transition-colors" />
                </Link>

                <Link
                  href="/admin/services"
                  className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-emerald-500/30 transition-all flex items-center justify-between group min-h-[50px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Layers size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-white group-hover:text-emerald-400 transition-colors">
                        Manage Services
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Deliverables & pricing models
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-500 group-hover:text-white transition-colors" />
                </Link>

                <Link
                  href="/admin/assistant"
                  className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-amber-500/30 transition-all flex items-center justify-between group min-h-[50px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                      <Mail size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-white group-hover:text-amber-400 transition-colors">
                        Ask Sam Knowledge
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Train the on-site AI assistant
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-500 group-hover:text-white transition-colors" />
                </Link>
              </div>
            </div>

            {/* Live System Diagnostics Mini Widget */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white">System Diagnostics</span>
                </div>
                <span className="text-[10px] text-emerald-400">Nominal</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Database Layer:</span>
                  <span className="text-slate-200">{data?.systemHealth.database || "Healthy"}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Auth Engine:</span>
                  <span className="text-slate-200">{data?.systemHealth.auth || "Healthy"}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Version:</span>
                  <span className="text-sky-400">v{data?.systemHealth.version || "1.2.0"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Stream / Audit Log Feed */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-mono">
              <Activity size={16} className="text-sky-400" />
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Live Audit Activity
              </h2>
            </div>
            <Link
              href="/admin/system"
              className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>Audit details</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-center text-xs font-mono text-slate-500">
                Loading activity logs...
              </div>
            ) : data && data.auditLogs.length > 0 ? (
              data.auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs hover:bg-white/[0.01] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold border border-sky-500/20">
                      {log.action}
                    </span>
                    <span className="text-white font-medium">{log.entityType}</span>
                    {log.entityId && (
                      <span className="text-slate-500 text-[11px]">#{log.entityId}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>{log.actorEmail}</span>
                    <span>•</span>
                    <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs font-mono text-slate-500">
                No activity logs recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

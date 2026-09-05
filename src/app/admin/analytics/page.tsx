"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Eye,
  Smartphone,
  Laptop,
  Compass,
  ArrowUpRight,
  RefreshCw,
  Clock,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import MetricCard from "@/components/admin/MetricCard";
import { useToast } from "@/components/admin/ToastProvider";

interface AnalyticsData {
  totalVisitors: number;
  totalPageViews: number;
  totalSessions: number;
  totalInquiries: number;
  topSources: { source: string; count: number }[];
  devices: { device: string; count: number }[];
  timeline: { date: string; views: number; visitors: number }[];
}

export default function AdminAnalyticsPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [rangeDays, setRangeDays] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async (days: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/analytics?range=${days}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.summary);
      }
    } catch {
      showToast("Failed to load analytics telemetry", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(rangeDays);
  }, [rangeDays]);

  // Max views in timeline for SVG scaling
  const maxViews = Math.max(...(data?.timeline.map((t) => t.views) || [1]), 1);

  return (
    <AdminShell>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <BarChart3 size={14} />
              <span>Real-Time Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Traffic & Conversions
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Privacy-first local analytics. Real visitor sessions with zero tracking cookies or fabrication.
            </p>
          </div>

          {/* Time range selector */}
          <div className="flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] self-start sm:self-auto">
            {[
              { label: "Today", days: 1 },
              { label: "7D", days: 7 },
              { label: "30D", days: 30 },
              { label: "90D", days: 90 },
            ].map((option) => (
              <button
                key={option.days}
                type="button"
                onClick={() => setRangeDays(option.days)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer min-h-[44px] ${
                  rangeDays === option.days
                    ? "bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard
            label="Page Views"
            value={isLoading ? "..." : (data?.totalPageViews ?? 0)}
            subtext="Total authenticated loads"
            icon={Eye}
            accentColor="cyan"
          />
          <MetricCard
            label="Unique Visitors"
            value={isLoading ? "..." : (data?.totalVisitors ?? 0)}
            subtext="Distinct client fingerprints"
            icon={Users}
            accentColor="purple"
          />
          <MetricCard
            label="Client Sessions"
            value={isLoading ? "..." : (data?.totalSessions ?? 0)}
            subtext="Active reading sessions"
            icon={Clock}
            accentColor="emerald"
          />
          <MetricCard
            label="Inquiry Forms"
            value={isLoading ? "..." : (data?.totalInquiries ?? 0)}
            subtext="Submissions received"
            icon={TrendingUp}
            accentColor="amber"
          />
        </div>

        {/* Traffic Timeline Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Activity Timeline ({rangeDays} Days)
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Daily visitor sessions and page views
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
                <span className="text-slate-400">Page Views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" />
                <span className="text-slate-400">Visitors</span>
              </div>
            </div>
          </div>

          {/* SVG Bar / Timeline Visualizer */}
          <div className="pt-4 pb-2">
            {isLoading ? (
              <div className="h-44 flex items-center justify-center text-xs font-mono text-slate-500">
                Loading timeline...
              </div>
            ) : data && data.timeline.length > 0 ? (
              <div className="h-44 flex items-end gap-2 sm:gap-4 overflow-x-auto pb-4 scrollbar-none">
                {data.timeline.map((item, idx) => {
                  const viewHeight = Math.max(
                    Math.round((item.views / maxViews) * 120),
                    8
                  );
                  const visitorHeight = Math.max(
                    Math.round((item.visitors / maxViews) * 120),
                    6
                  );

                  return (
                    <div
                      key={idx}
                      className="flex-1 min-w-[32px] sm:min-w-[44px] flex flex-col items-center gap-1 group"
                    >
                      <div className="w-full flex items-end justify-center gap-1 h-32">
                        {/* Views bar */}
                        <div
                          style={{ height: `${viewHeight}px` }}
                          className="w-2 sm:w-3.5 bg-sky-400/80 group-hover:bg-sky-400 rounded-t transition-all"
                          title={`${item.views} Views`}
                        />
                        {/* Visitors bar */}
                        <div
                          style={{ height: `${visitorHeight}px` }}
                          className="w-2 sm:w-3.5 bg-purple-400/80 group-hover:bg-purple-400 rounded-t transition-all"
                          title={`${item.visitors} Visitors`}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 tracking-tighter">
                        {item.date.split("-").slice(1).join("/")}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-xs font-mono text-slate-500 space-y-2">
                <BarChart3 size={28} className="text-slate-600" />
                <p>No activity recorded in this time range yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Breakdown (Sources & Devices) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Acquisition Sources */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-sky-400" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Traffic Acquisition Channels
              </h3>
            </div>

            <div className="space-y-2.5">
              {data && data.topSources.length > 0 ? (
                data.topSources.map((src, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-200 capitalize">{src.source}</span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                      {src.count} visits
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs font-mono text-slate-500">
                  No referral sources recorded.
                </div>
              )}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-purple-400" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Device Distribution
              </h3>
            </div>

            <div className="space-y-2.5">
              {data && data.devices.length > 0 ? (
                data.devices.map((dev, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      {dev.device === "mobile" ? (
                        <Smartphone size={14} className="text-sky-400" />
                      ) : (
                        <Laptop size={14} className="text-purple-400" />
                      )}
                      <span className="text-slate-200 capitalize">{dev.device}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                      {dev.count} sessions
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs font-mono text-slate-500">
                  No device data recorded.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Invariant Banner */}
        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] flex items-center gap-3 text-xs font-mono text-slate-400">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span>
            Telemetry is privacy-first: No third-party cookies, no PII stored, fully compliant with international privacy frameworks.
          </span>
        </div>
      </div>
    </AdminShell>
  );
}

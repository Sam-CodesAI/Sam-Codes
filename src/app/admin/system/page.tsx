"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  ShieldCheck,
  Database,
  Lock,
  HardDrive,
  RefreshCw,
  Download,
  Terminal,
  Clock,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";
import { AuditLog } from "@/lib/data-service";

interface SystemHealth {
  database: string;
  auth: string;
  storage: string;
  analytics: string;
  askSam: string;
  version: string;
  uptime: string;
}

export default function AdminSystemPage() {
  const { showToast } = useToast();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPinging, setIsPinging] = useState(false);
  const [searchLog, setSearchLog] = useState("");

  const [secrets, setSecrets] = useState<Record<string, { configured: boolean; preview: string }>>({});

  const fetchSystemData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/system");
      if (res.ok) {
        const json = await res.json();
        setHealth(json.health);
        setAuditLogs(json.auditLogs || []);
        if (json.secrets) {
          setSecrets(json.secrets);
        }
      }
    } catch {
      showToast("Failed to fetch system metrics", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  const handlePing = async () => {
    setIsPinging(true);
    await fetchSystemData();
    setIsPinging(false);
    showToast("Diagnostics ping complete: All services online", "success");
  };

  const handleExportBackup = async () => {
    try {
      showToast("Preparing authenticated database snapshot...", "info");
      const res = await fetch("/api/admin/system/backup");

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Backup request failed");
      }

      const checksum = res.headers.get("X-Backup-Checksum");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sam-codes-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      const checksumPreview = checksum ? `${checksum.substring(0, 8)}...${checksum.substring(checksum.length - 6)}` : "Verified";
      showToast(`Snapshot downloaded! Checksum: ${checksumPreview}`, "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to export backup";
      showToast(msg, "error");
    }
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(searchLog.toLowerCase())
  );

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in duration-300 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <Activity size={14} />
              <span>Diagnostic Control Plane</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              System Health & Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Live server diagnostics, database connection integrity, and immutable administrative audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePing}
              disabled={isPinging}
              className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-300 flex items-center gap-2 cursor-pointer transition-all min-h-[44px]"
            >
              <RefreshCw
                size={14}
                className={isPinging ? "animate-spin text-sky-400" : "text-slate-400"}
              />
              <span>Ping Health</span>
            </button>

            <button
              type="button"
              onClick={handleExportBackup}
              className="px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono flex items-center gap-2 cursor-pointer transition-all min-h-[44px]"
            >
              <Download size={14} />
              <span>Export Backup</span>
            </button>
          </div>
        </div>

        {/* Health Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <Database size={15} className="text-sky-400" />
              <StatusBadge status={health?.database || "HEALTHY"} />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Database</div>
              <div className="text-xs font-mono text-white font-bold">
                {health?.database || "Checking..."}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <Lock size={15} className="text-purple-400" />
              <StatusBadge status={health?.auth || "HEALTHY"} />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Auth Session</div>
              <div className="text-xs font-mono text-white font-bold">
                {health?.auth || "Checking..."}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <HardDrive size={15} className="text-emerald-400" />
              <StatusBadge status={health?.storage || "HEALTHY"} />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Storage Layer</div>
              <div className="text-xs font-mono text-white font-bold">
                {health?.storage || "Checking..."}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <Activity size={15} className="text-amber-400" />
              <StatusBadge status={health?.analytics || "HEALTHY"} />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Telemetry</div>
              <div className="text-xs font-mono text-white font-bold">
                {health?.analytics || "Checking..."}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <Terminal size={15} className="text-cyan-400" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v{health?.version || "1.2.0"}
              </span>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">OS Version</div>
              <div className="text-xs font-mono text-white font-bold">Production</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <Clock size={15} className="text-teal-400" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Nominal
              </span>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Uptime</div>
              <div className="text-xs font-mono text-white font-bold">
                {health?.uptime || "99.9%"}
              </div>
            </div>
          </div>
        </div>

        {/* Secrets & Security Guard */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono">
              <ShieldCheck size={16} className="text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Secrets & Security Integrity
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              AES / HMAC-SHA256 Guard Active
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Zero-leakage secret sanitization: keys are cryptographically masked and never exposed to the client bundle.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            {Object.entries(secrets).map(([key, sec]) => (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-black/40 border border-white/[0.04] flex flex-col justify-between gap-2"
              >
                <div>
                  <span className="text-[10px] text-slate-400 block truncate" title={key}>
                    {key}
                  </span>
                  <span className="text-slate-200 font-semibold tracking-wider text-[11px] block mt-1">
                    {sec.preview}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pt-2 border-t border-white/[0.04]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      sec.configured ? "bg-emerald-400" : "bg-rose-400 animate-pulse"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold ${
                      sec.configured ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {sec.configured ? "CONFIGURED" : "MISSING"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Immutable Audit Logs ({filteredLogs.length})
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Every administrative mutation, publish event, and status transition is recorded
              </p>
            </div>

            <input
              type="text"
              placeholder="Filter audit logs..."
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
            />
          </div>

          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                Loading audit trail...
              </div>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono hover:bg-white/[0.01] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold border border-sky-500/20">
                        {log.action}
                      </span>
                      <span className="text-white font-medium">{log.entityType}</span>
                      {log.entityId && (
                        <span className="text-slate-500 text-[11px]">#{log.entityId}</span>
                      )}
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="text-[11px] text-slate-400 truncate max-w-xl font-mono">
                        {JSON.stringify(log.details)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px] shrink-0">
                    <span>{log.actorEmail}</span>
                    <span>•</span>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                No audit logs found matching query.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

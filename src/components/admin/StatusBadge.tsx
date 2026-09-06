import React from "react";

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();

  let colorClasses = "bg-slate-800/80 text-slate-300 border-slate-700";

  switch (normalized) {
    case "PUBLISHED":
    case "SHIPPED":
    case "WON":
    case "HEALTHY":
    case "OPERATIONAL":
      colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      break;
    case "NEW":
    case "BUILDING":
    case "ACTIVE RESEARCH":
    case "EXPERIMENT":
    case "EXPERIMENTING":
      colorClasses = "bg-sky-500/10 text-sky-400 border-sky-500/30";
      break;
    case "DRAFT":
    case "IDEA":
    case "DISCUSSING":
    case "PROPOSAL":
    case "CONTACTED":
      colorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/30";
      break;
    case "TESTING":
    case "VERIFIED":
      colorClasses = "bg-purple-500/10 text-purple-400 border-purple-500/30";
      break;
    case "ARCHIVED":
    case "LOST":
    case "OFFLINE":
    case "DEGRADED":
      colorClasses = "bg-rose-500/10 text-rose-400 border-rose-500/30";
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border font-medium ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

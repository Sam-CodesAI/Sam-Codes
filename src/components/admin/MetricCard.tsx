import React from "react";

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  accentColor?: "cyan" | "purple" | "emerald" | "amber";
  badge?: string;
}

export default function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  accentColor = "cyan",
  badge,
}: MetricCardProps) {
  const accentClasses = {
    cyan: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  }[accentColor];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col justify-between group">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
          {label}
        </span>
        <div className={`p-2 rounded-xl border ${accentClasses} transition-transform group-hover:scale-110`}>
          <Icon size={16} />
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {value}
          </div>
          {badge && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300">
              {badge}
            </span>
          )}
        </div>
        {subtext && (
          <p className="text-[11px] font-mono text-slate-400 mt-1">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

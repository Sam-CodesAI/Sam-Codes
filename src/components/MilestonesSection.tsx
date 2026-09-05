"use client";

import React from "react";
import { milestonesData, Milestone } from "@/data/milestones";
import { soundFx } from "@/utils/sound";
import { Award, Milestone as MilestoneIcon, Calendar, ArrowUpRight } from "lucide-react";

export default function MilestonesSection() {
  if (milestonesData.length === 0) {
    return (
      <section
        id="milestones"
        aria-label="Milestones & Timeline"
        className="relative py-12 px-4 sm:px-6 max-w-4xl mx-auto text-center"
      >
        <div className="p-6 rounded-2xl bg-white/[0.015] border border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <MilestoneIcon size={16} />
            </span>
            <div className="text-left">
              <div className="text-white font-medium text-xs">Milestone Log</div>
              <div className="text-slate-500 text-[11px]">
                The journey is actively unfolding. Open-source milestones and project releases will be cataloged here.
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-400">
            LOG_STATUS: READY
          </span>
        </div>
      </section>
    );
  }

  return (
    <section
      id="milestones"
      aria-label="Milestones & Timeline"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.06]"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-amber-400 mb-4 uppercase tracking-wider">
          <Award size={13} className="text-amber-400" />
          Track Record
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Milestones &amp; Progression
        </h2>
      </div>

      <div className="space-y-6">
        {milestonesData.map((m: Milestone) => (
          <div
            key={m.id}
            onMouseEnter={() => soundFx.playHover()}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-1">
                <span className="text-amber-400">{m.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {m.date}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{m.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300">{m.description}</p>
            </div>

            {m.url && (
              <a
                href={m.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>Details</span>
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

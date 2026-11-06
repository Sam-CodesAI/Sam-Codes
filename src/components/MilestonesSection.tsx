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
        className="relative py-12 px-4 sm:px-6 max-w-5xl mx-auto text-center"
      >
        <div className="p-6 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-600/15 text-blue-400">
              <MilestoneIcon size={16} />
            </span>
            <div className="text-left">
              <div className="text-white font-medium text-xs">Milestone Log</div>
              <div className="text-slate-500 text-[11px]">
                The journey is actively unfolding. Open-source releases and systems are cataloged here.
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#0f172a] border border-[#1e293b] text-slate-400">
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
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#1e293b]"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080d1a] border border-[#1e293b] text-xs font-mono text-blue-400 mb-4 uppercase tracking-wider">
          <Award size={13} className="text-[#ccff00]" />
          <span>Track Record</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Milestones &amp; Progression
        </h2>
      </div>

      <div className="space-y-4">
        {milestonesData.map((m: Milestone) => (
          <div
            key={m.id}
            onMouseEnter={() => soundFx.playHover()}
            className="p-6 rounded-2xl bg-[#080d1a] border border-[#1e293b] hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-1">
                <span className="text-blue-400 font-semibold">{m.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {m.date}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{m.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal">{m.description}</p>
            </div>

            {m.url && (
              <a
                href={m.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono text-[#ccff00] hover:underline transition-colors shrink-0"
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

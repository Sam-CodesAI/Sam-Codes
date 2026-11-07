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
        <div className="p-6 rounded-2xl bg-[#1A1D24] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9299A8]">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#4D7CFE]/15 text-[#4D7CFE]">
              <MilestoneIcon size={16} />
            </span>
            <div className="text-left">
              <div className="text-[#E8EAF0] font-medium text-xs">Milestone Log</div>
              <div className="text-[#9299A8]/80 text-[11px]">
                The journey is actively unfolding. Open-source releases and systems are cataloged here.
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#222630] border border-white/[0.08] text-[#9299A8]">
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
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.08]"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1D24] border border-white/[0.08] text-xs font-mono text-[#4D7CFE] mb-4 uppercase tracking-wider">
          <Award size={13} className="text-[#4D7CFE]" />
          <span>Track Record</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#E8EAF0] mb-4">
          Milestones &amp; Progression
        </h2>
      </div>

      <div className="space-y-4">
        {milestonesData.map((m: Milestone) => (
          <div
            key={m.id}
            onMouseEnter={() => soundFx.playHover()}
            className="p-6 rounded-2xl bg-[#1A1D24] border border-white/[0.08] hover:border-[#4D7CFE]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#9299A8] mb-1">
                <span className="text-[#4D7CFE] font-semibold">{m.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {m.date}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#E8EAF0] mb-1">{m.title}</h3>
              <p className="text-xs sm:text-sm text-[#9299A8] font-normal">{m.description}</p>
            </div>

            {m.url && (
              <a
                href={m.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono text-[#4D7CFE] hover:underline transition-colors shrink-0"
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
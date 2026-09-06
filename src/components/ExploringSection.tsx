"use client";

import React from "react";
import { exploringData, ExplorationItem } from "@/data/exploring";
import { soundFx } from "@/utils/sound";
import {
  Telescope,
  Radio,
} from "lucide-react";

export default function ExploringSection({
  exploringTopics = exploringData,
}: {
  exploringTopics?: ExplorationItem[];
}) {
  const getStatusBadge = (status: ExplorationItem["status"]) => {
    switch (status) {
      case "Building":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Active Research":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Experimenting":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-white/[0.04] text-slate-300 border-white/[0.08]";
    }
  };

  return (
    <section
      id="exploring"
      aria-label="Active Exploration"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-purple-400 mb-4 uppercase tracking-wider">
          <Telescope size={13} className="text-purple-400" />
          Frontier Horizons
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          What I&apos;m Currently Exploring
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
          Continuous research into the modern AI paradigm — staying ahead of shifts in intelligence, tooling, and systems architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exploringTopics.map((item, idx) => (
          <div
            key={idx}
            onMouseEnter={() => soundFx.playHover()}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/40 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.04] text-slate-400">
                  {item.category}
                </span>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {item.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {item.focus}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Radio size={11} className="text-sky-400 animate-pulse" />
                Active Feed
              </span>
              <span>2026 FOCUS</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

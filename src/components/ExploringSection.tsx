"use client";

import React from "react";
import { exploringData, ExplorationItem } from "@/data/exploring";
import { soundFx } from "@/utils/sound";
import { Telescope, Radio } from "lucide-react";

export default function ExploringSection({
  exploringTopics = exploringData,
}: {
  exploringTopics?: ExplorationItem[];
}) {
  const getStatusBadge = (status: ExplorationItem["status"]) => {
    switch (status) {
      case "Building":
        return "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/30 font-semibold";
      case "Active Research":
        return "bg-blue-600/10 text-blue-400 border-blue-500/30";
      case "Experimenting":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-[#0f172a] text-slate-300 border-[#1e293b]";
    }
  };

  return (
    <section
      id="exploring"
      aria-label="Active Exploration"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1e293b]"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080d1a] border border-[#1e293b] text-xs font-mono text-blue-400 mb-4 uppercase tracking-wider">
          <Telescope size={13} className="text-[#ccff00]" />
          <span>Frontier Horizons</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
          What I&apos;m Currently Exploring
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Continuous research into the modern AI paradigm—staying ahead of shifts in intelligence, tooling, and systems architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exploringTopics.map((item, idx) => (
          <div
            key={idx}
            onMouseEnter={() => soundFx.playHover()}
            className="p-6 rounded-2xl bg-[#080d1a] border border-[#1e293b] hover:border-blue-500/50 hover:bg-[#0f172a] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#0f172a] text-slate-400 border border-[#1e293b]">
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

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {item.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {item.focus}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Radio size={11} className="text-[#ccff00] animate-pulse" />
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

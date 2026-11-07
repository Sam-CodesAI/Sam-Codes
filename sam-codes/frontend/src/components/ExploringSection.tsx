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
        return "bg-[#4D7CFE]/20 text-[#4D7CFE] border-[#4D7CFE]/40 font-semibold";
      case "Active Research":
        return "bg-[#4D7CFE]/15 text-[#85A6FF] border-[#4D7CFE]/30";
      case "Experimenting":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-[#222630] text-[#9299A8] border-white/[0.08]";
    }
  };

  return (
    <section
      id="exploring"
      aria-label="Active Exploration"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.08]"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1D24] border border-white/[0.08] text-[11px] sm:text-xs md:text-[13px] font-mono text-[#4D7CFE] mb-4 uppercase tracking-wider">
          <Telescope size={13} className="text-[#4D7CFE]" />
          <span>Frontier Horizons</span>
        </div>

        <h2 className="text-[32px] sm:text-[38px] md:text-[44px] font-heading font-black tracking-tight text-[#E8EAF0] mb-4">
          What I&apos;m Currently Exploring
        </h2>

        <p className="text-base sm:text-[17px] md:text-lg text-[#9299A8] max-w-2xl font-sans font-normal leading-relaxed">
          Continuous research into the modern AI paradigm—staying ahead of shifts in intelligence, tooling, and systems architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exploringTopics.map((item, idx) => (
          <div
            key={idx}
            onMouseEnter={() => soundFx.playHover()}
            className="p-6 rounded-2xl bg-[#1A1D24] border border-white/[0.08] hover:border-[#4D7CFE]/50 hover:bg-[#222630] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#222630] text-[#9299A8] border border-white/[0.08]">
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

              <h3 className="text-lg sm:text-xl font-heading font-bold text-[#E8EAF0] mb-2 group-hover:text-[#4D7CFE] transition-colors">
                {item.name}
              </h3>

              <p className="text-sm sm:text-base text-[#9299A8] leading-relaxed font-sans font-normal">
                {item.focus}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-[10px] text-[#9299A8]">
              <span className="flex items-center gap-1.5 text-[#9299A8]">
                <Radio size={11} className="text-[#4D7CFE] animate-pulse" />
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
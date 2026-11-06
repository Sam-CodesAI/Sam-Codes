"use client";

import React, { useState } from "react";
import {
  capabilitiesData,
  buildingWithStack,
  exploringStack,
  Capability,
  TechItem,
} from "@/data/capabilities";
import { soundFx } from "@/utils/sound";
import SpotlightCard from "@/components/SpotlightCard";
import MotionReveal from "@/components/MotionReveal";
import { TechBadge } from "@/components/TechLogos";
import { motion } from "motion/react";
import {
  Brain,
  Zap,
  Bot,
  GitBranch,
  Globe,
  Network,
  Flame,
  Sparkles,
  LucideIcon,
  CheckCircle2,
  Compass,
  Cpu,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Zap,
  Bot,
  GitFork: GitBranch,
  Globe,
  Network,
  Flame,
  Sparkles,
};

type ViewMode = "capabilities" | "stack";

export default function CapabilitiesSection({
  capabilities = capabilitiesData,
  buildingWith = buildingWithStack,
  exploring = exploringStack,
}: {
  capabilities?: Capability[];
  buildingWith?: TechItem[];
  exploring?: TechItem[];
}) {
  const [activeTab, setActiveTab] = useState<ViewMode>("capabilities");

  const handleTabChange = (tab: ViewMode) => {
    soundFx.playHover();
    setActiveTab(tab);
  };

  return (
    <section
      id="capabilities"
      aria-label="Capabilities and Technologies"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1e293b]"
    >
      <MotionReveal className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080d1a] border border-[#1e293b] text-xs font-mono text-blue-400 mb-4 uppercase tracking-wider">
          <Cpu size={13} className="text-[#ccff00]" />
          <span>Build Environment &amp; Capabilities</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Technologies I Work With
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Production systems engineered from first principles alongside frontier tools actively researched.
        </p>

        {/* View Switcher Pill */}
        <div className="mt-8 inline-flex p-1 rounded-full bg-[#080d1a] border border-[#1e293b] backdrop-blur-md">
          <button
            type="button"
            onClick={() => handleTabChange("capabilities")}
            className="relative px-5 py-2 rounded-full text-xs font-mono transition-colors cursor-pointer"
          >
            {activeTab === "capabilities" && (
              <motion.div
                layoutId="capTabPill"
                className="absolute inset-0 rounded-full bg-blue-600 shadow-md shadow-blue-600/30 border border-blue-400"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 ${
                activeTab === "capabilities" ? "text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              What I Build
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("stack")}
            className="relative px-5 py-2 rounded-full text-xs font-mono transition-colors cursor-pointer"
          >
            {activeTab === "stack" && (
              <motion.div
                layoutId="capTabPill"
                className="absolute inset-0 rounded-full bg-blue-600 shadow-md shadow-blue-600/30 border border-blue-400"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 ${
                activeTab === "stack" ? "text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Stack &amp; Environment
            </span>
          </button>
        </div>
      </MotionReveal>

      {/* Tab 1: Practical Capabilities (What I Can Build) */}
      {activeTab === "capabilities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in duration-300">
          {capabilities.map((cap: Capability, idx: number) => {
            const Icon = ICON_MAP[cap.icon] || Sparkles;

            return (
              <MotionReveal key={cap.id} delay={idx * 0.05}>
                <SpotlightCard
                  onMouseEnter={() => soundFx.playHover()}
                  spotlightColor="rgba(37, 99, 235, 0.15)"
                  className="h-full flex flex-col justify-between group cursor-default p-6 bg-[#080d1a] border-[#1e293b]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600/25 transition-all duration-300">
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0f172a] border border-[#1e293b] text-slate-400">
                        {cap.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {cap.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {cap.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#1e293b]">
                      {cap.highlights.map((tag, tIdx) => (
                        <TechBadge key={tIdx} name={tag} size="xs" />
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </MotionReveal>
            );
          })}
        </div>
      )}

      {/* Tab 2: Stack Breakdown (Building With vs Exploring) */}
      {activeTab === "stack" && (
        <div className="space-y-10 animate-in fade-in duration-300">
          {/* Section A: Building With */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ccff00] uppercase tracking-wider mb-4 font-bold">
              <CheckCircle2 size={14} />
              <span>Building With (Primary Production Stack)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {buildingWith.map((item: TechItem, idx: number) => (
                <SpotlightCard
                  key={idx}
                  spotlightColor="rgba(37, 99, 235, 0.15)"
                  className="p-5 h-full flex flex-col justify-between group cursor-default bg-[#080d1a] border-[#1e293b]"
                >
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#0f172a] text-slate-400 mb-3 inline-block border border-[#1e293b]">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Section B: Exploring */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-4 font-bold">
              <Compass size={14} />
              <span>Exploring (Active Research &amp; Experiments)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {exploring.map((item: TechItem, idx: number) => (
                <SpotlightCard
                  key={idx}
                  spotlightColor="rgba(204, 255, 0, 0.12)"
                  className="p-5 h-full flex flex-col justify-between group cursor-default bg-[#080d1a] border-[#1e293b]"
                >
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600/10 text-blue-400 border border-blue-500/20 mb-3 inline-block">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-[#ccff00] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

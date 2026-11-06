"use client";

import React, { useState } from "react";
import Link from "next/link";
import { soundFx } from "@/utils/sound";
import MotionReveal from "@/components/MotionReveal";
import {
  Wrench,
  ArrowUpRight,
  Check,
  FolderOpen,
  Folder,
  Send,
  Zap,
  Cpu,
  Layers,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FolderService {
  id: string;
  folderCode: string;
  title: string;
  tagline: string;
  turnaround: string;
  priceUsd: string;
  priceInr: string;
  highlight: string;
  description: string;
  deliverables: { title: string; desc: string }[];
}

const SERVICE_FOLDERS: FolderService[] = [
  {
    id: "folder-freelance",
    folderCode: "DIR://01_TECH_FREELANCE_LIBRARY",
    title: "Engineering Micro-Fixes & Fast Integrations",
    tagline: "Micro-fixes, Python scrapers, third-party API/webhooks, & Next.js performance tuning.",
    turnaround: "24 – 48 Hours",
    priceUsd: "$120 – $280",
    priceInr: "₹9,999 – ₹22,999",
    highlight: "SPEED & IMMEDIATE REPAIR",
    description:
      "Rapid turnaround engineering for business owners and teams blocked by fragile scrapers, broken webhook deliveries, sluggish page loads, or complex third-party API schemas. Fixed cleanly with zero fluff.",
    deliverables: [
      {
        title: "Resilient Web Scraping Pipelines",
        desc: "Python Asyncio + Playwright scrapers with schema validation, proxy rotation, and automated Google Sheets sync.",
      },
      {
        title: "Third-Party API & Webhook Bridges",
        desc: "Edge webhook receivers with HMAC verification, retry cascades, and instant Telegram/Discord CRM alerts.",
      },
      {
        title: "Next.js & Frontend Performance Tuning",
        desc: "Lighthouse optimization, Core Web Vitals audit (LCP < 2s, zero CLS), and bundle pruning.",
      },
      {
        title: "Surgical Code Repairs & Debugging",
        desc: "Immediate root-cause isolation for stubborn TypeScript, Next.js 16, or database errors.",
      },
    ],
  },
  {
    id: "folder-ai-systems",
    folderCode: "DIR://02_SPECIALIZED_AI_SYSTEMS",
    title: "Specialized AI Systems & Full-Stack MVPs",
    tagline: "AI Voice Agents, Custom Vector RAG, Autonomous Lead/CRM bots, & Rapid Full-Stack MVPs.",
    turnaround: "3 – 7 Days",
    priceUsd: "$450 – $1,250",
    priceInr: "₹37,500 – ₹99,000",
    highlight: "DEEP FIRST-PRINCIPLES CRAFT",
    description:
      "Full-scope production architectures built from the ground up: sub-300ms edge telephony agents, clean-room hybrid vector search engines, autonomous CRM qualification bots, and modern 2026 Bento web applications.",
    deliverables: [
      {
        title: "Real-Time Telephony AI Voice Agents",
        desc: "Full-duplex WebRTC + Twilio SIP pipelines with streaming VAD and sub-300ms speech turnaround.",
      },
      {
        title: "Custom Vector RAG & Retrieval Engines",
        desc: "In-memory or embedded vector databases with BM25 hybrid fusion and compound metadata bitmasks.",
      },
      {
        title: "Autonomous Lead & CRM Qualifier Bots",
        desc: "Multi-turn Telegram or WhatsApp state machines extracting structured requirements directly to Supabase.",
      },
      {
        title: "Complete 2026 Bento Web Platforms",
        desc: "Full-stack Next.js 16 applications with Supabase PostgreSQL RLS, dark-mode aesthetics, and sub-2s loads.",
      },
    ],
  },
];

export default function ServicesSection({
  services,
}: {
  services?: any;
} = {}) {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "folder-freelance": true,
    "folder-ai-systems": true,
  });

  const toggleFolder = (folderId: string) => {
    soundFx.playChime(500, 0.05);
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  return (
    <section
      id="services"
      aria-label="Services & Systems"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1e293b]"
    >
      <MotionReveal className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080d1a] border border-[#1e293b] text-xs font-mono text-blue-400 mb-4 uppercase tracking-wider">
          <Wrench size={13} className="text-[#ccff00]" />
          <span>Services // 2-Folder Interactive Cartridges</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Services &amp; Systems
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
          Direct collaboration with Samarth. Select a folder to inspect deliverables, pricing, and turnarounds.
        </p>

        {/* Currency Switcher */}
        <div className="inline-flex items-center p-1 rounded-full bg-[#080d1a] border border-[#1e293b] mt-6 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              soundFx.playHover();
              setCurrency("USD");
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              currency === "USD"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            USD ($)
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playHover();
              setCurrency("INR");
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              currency === "INR"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            INR (₹)
          </button>
        </div>
      </MotionReveal>

      {/* 2-Folder Interactive Accordion Cartridges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {SERVICE_FOLDERS.map((folder) => {
          const isOpen = !!openFolders[folder.id];

          return (
            <div
              key={folder.id}
              className="rounded-3xl bg-[#080d1a] border border-[#1e293b] hover:border-blue-500/40 transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-xl relative"
            >
              {/* Folder Header Banner (Clickable Accordion) */}
              <button
                type="button"
                onClick={() => toggleFolder(folder.id)}
                className="w-full p-6 sm:p-8 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none group border-b border-[#1e293b]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <div className="chamfer-tab bg-blue-600/20 border-l-2 border-t border-b border-blue-500/40 px-3.5 py-1 flex items-center gap-2">
                      {isOpen ? (
                        <FolderOpen size={16} className="text-[#ccff00]" />
                      ) : (
                        <Folder size={16} className="text-blue-400" />
                      )}
                      <span className="text-xs font-mono font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                        {folder.folderCode}
                      </span>
                    </div>

                    <span className="chamfer-tag text-[10px] font-mono px-2.5 py-1 bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold">
                      {folder.highlight}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-200 transition-colors">
                    {folder.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 mt-2 font-normal">
                    {folder.tagline}
                  </p>
                </div>

                <div className="p-2 rounded-full bg-[#0f172a] border border-[#1e293b] text-slate-400 group-hover:text-white shrink-0 mt-1">
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-400" : ""}`}
                  />
                </div>
              </button>

              {/* Accordion Drawer Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 sm:p-8 space-y-6">
                      {/* Price & Turnaround Badge Strip */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#030509] border border-[#1e293b] font-mono text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase block">
                            Estimated Investment
                          </span>
                          <span className="text-lg font-black text-[#ccff00]">
                            {currency === "USD" ? folder.priceUsd : folder.priceInr}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 text-[10px] uppercase block">
                            Typical Turnaround
                          </span>
                          <span className="text-white font-bold">
                            ⏱ {folder.turnaround}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {folder.description}
                      </p>

                      {/* Deliverables List */}
                      <div className="space-y-3">
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                          Core Deliverables:
                        </span>
                        <div className="space-y-2.5">
                          {folder.deliverables.map((item, dIdx) => (
                            <div
                              key={dIdx}
                              className="p-3.5 rounded-xl bg-[#0f172a]/70 border border-[#1e293b] flex items-start gap-3"
                            >
                              <Check
                                size={15}
                                className="text-[#ccff00] shrink-0 mt-0.5"
                              />
                              <div>
                                <h4 className="text-xs font-bold text-white mb-0.5">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="pt-4 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-[11px] font-mono text-slate-500">
                          Direct collaboration with Samarth
                        </span>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <a
                            href="https://t.me/Samarth1306"
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer min-h-[44px]"
                          >
                            <Send size={13} />
                            <span>Talk on Telegram</span>
                          </a>

                          <Link
                            href="/contact"
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] border border-[#1e293b] text-slate-200 hover:text-white font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[44px]"
                          >
                            <span>Open Brief</span>
                            <ArrowUpRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

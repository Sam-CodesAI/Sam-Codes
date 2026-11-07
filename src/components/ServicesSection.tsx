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
    folderCode: "01 // FAST INTEGRATIONS & FIXES",
    title: "Engineering Micro-Fixes & Integrations",
    tagline: "Python scrapers, webhook cascades, API bridges, & Next.js performance tuning.",
    turnaround: "24 – 48 Hours",
    priceUsd: "$120 – $280",
    priceInr: "₹9,999 – ₹22,999",
    highlight: "SPEED & PRECISION",
    description:
      "Rapid turnaround engineering for teams blocked by fragile scrapers, broken webhook deliveries, sluggish page loads, or complex third-party API schemas. Fixed cleanly with zero fluff.",
    deliverables: [
      {
        title: "Resilient Web Scraping Pipelines",
        desc: "Python Asyncio + Playwright scrapers with schema validation, proxy rotation, and automated sync.",
      },
      {
        title: "Third-Party API & Webhook Bridges",
        desc: "Edge webhook receivers with HMAC verification, retry cascades, and instant notifications.",
      },
      {
        title: "Next.js & Frontend Performance Tuning",
        desc: "Core Web Vitals audit (LCP < 2s, zero CLS), hydration fixes, and bundle pruning.",
      },
      {
        title: "Surgical Code Repairs & Debugging",
        desc: "Immediate root-cause isolation for stubborn TypeScript, Next.js 16, or database errors.",
      },
    ],
  },
  {
    id: "folder-ai-systems",
    folderCode: "02 // SPECIALIZED AI & MVPS",
    title: "Specialized AI Systems & Full-Stack MVPs",
    tagline: "Real-time AI voice pipelines, custom vector RAG, autonomous bots, & Bento web apps.",
    turnaround: "3 – 7 Days",
    priceUsd: "$450 – $1,250",
    priceInr: "₹37,500 – ₹99,000",
    highlight: "FIRST-PRINCIPLES CRAFT",
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
      className="relative py-28 sm:py-36 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.06]"
    >
      <MotionReveal className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1D24] border border-white/[0.08] text-[11px] sm:text-xs md:text-[13px] font-mono text-[#4D7CFE] mb-4 uppercase tracking-wider backdrop-blur-md">
          <Wrench size={13} className="text-[#ccff00]" />
          <span>Services // Direct Collaboration</span>
        </div>

        <h2 className="text-[32px] sm:text-[38px] md:text-[44px] font-heading font-black tracking-tight text-[#E8EAF0] mb-4">
          Services &amp; Systems
        </h2>

        <p className="text-base sm:text-[17px] md:text-lg text-[#9299A8] max-w-2xl font-sans font-normal leading-relaxed">
          Direct engineering partnership with Samarth. Select a drawer to inspect deliverables and turnarounds.
        </p>

        {/* Currency Switcher */}
        <div className="inline-flex items-center p-1 rounded-full bg-[#1A1D24]/80 border border-white/[0.08] mt-6 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              soundFx.playHover();
              setCurrency("USD");
            }}
            className={`px-4 py-1.5 rounded-full text-[11px] sm:text-xs md:text-[13px] font-mono transition-all cursor-pointer ${
              currency === "USD"
                ? "bg-[#4D7CFE]/30 text-[#E8EAF0] font-semibold border border-[#4D7CFE]/50 shadow-md shadow-[#4D7CFE]/20"
                : "text-[#9299A8] hover:text-[#E8EAF0]"
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
            className={`px-4 py-1.5 rounded-full text-[11px] sm:text-xs md:text-[13px] font-mono transition-all cursor-pointer ${
              currency === "INR"
                ? "bg-[#4D7CFE]/30 text-[#E8EAF0] font-semibold border border-[#4D7CFE]/50 shadow-md shadow-[#4D7CFE]/20"
                : "text-[#9299A8] hover:text-[#E8EAF0]"
            }`}
          >
            INR (₹)
          </button>
        </div>
      </MotionReveal>

      {/* 2-Folder Interactive Accordion Drawers with Archival Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {SERVICE_FOLDERS.map((folder) => {
          const isOpen = !!openFolders[folder.id];

          return (
            <div key={folder.id} className="flex flex-col group">
              {/* Archival Folder Tab */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 self-start rounded-t-xl bg-[#222630] border-t border-x border-white/[0.08] group-hover:border-[#4D7CFE]/40 group-hover:bg-[#282d39] transition-all text-[11px] font-mono text-[#9299A8] group-hover:text-[#4D7CFE] max-w-full min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4D7CFE] group-hover:bg-[#ccff00] transition-colors shrink-0" />
                <span className="truncate break-all">{folder.folderCode}</span>
              </div>

              {/* Folder Drawer Container */}
              <div className="rounded-b-2xl rounded-tr-2xl bg-[#1A1D24] border border-white/[0.08] group-hover:border-[#4D7CFE]/40 transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-xl">
                {/* Folder Header Banner */}
                <button
                  type="button"
                  onClick={() => toggleFolder(folder.id)}
                  className="w-full p-6 sm:p-8 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none group/btn border-b border-white/[0.06]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#4D7CFE]/10 text-[#4D7CFE] border border-[#4D7CFE]/20 font-semibold">
                        {folder.highlight}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#E8EAF0] group-hover/btn:text-white transition-colors">
                      {folder.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#9299A8] mt-2 font-sans font-normal">
                      {folder.tagline}
                    </p>
                  </div>

                  <div className="p-2 rounded-full bg-[#222630] border border-white/[0.08] text-[#9299A8] group-hover/btn:text-[#E8EAF0] shrink-0 mt-1">
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-[#4D7CFE]" : ""}`}
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
                        {/* Price & Turnaround Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#222630]/60 border border-white/[0.06] font-mono text-xs">
                          <div>
                            <span className="text-[#9299A8] text-[10px] uppercase block">
                              Estimated Investment
                            </span>
                            <span className="text-lg font-bold text-[#ccff00]">
                              {currency === "USD" ? folder.priceUsd : folder.priceInr}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[#9299A8] text-[10px] uppercase block">
                              Typical Turnaround
                            </span>
                            <span className="text-[#E8EAF0] font-semibold">
                              ⏱ {folder.turnaround}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[#9299A8] leading-relaxed font-normal">
                          {folder.description}
                        </p>

                        {/* Deliverables List */}
                        <div className="space-y-3">
                          <span className="text-[11px] font-mono text-[#9299A8] uppercase tracking-wider block font-bold">
                            Core Deliverables:
                          </span>
                          <div className="space-y-2">
                            {folder.deliverables.map((item, dIdx) => (
                              <div
                                key={dIdx}
                                className="p-3.5 rounded-xl bg-[#222630]/50 border border-white/[0.05] flex items-start gap-3"
                              >
                                <Check
                                  size={15}
                                  className="text-[#ccff00] shrink-0 mt-0.5"
                                />
                                <div>
                                  <h4 className="text-xs font-bold text-[#E8EAF0] mb-0.5">
                                    {item.title}
                                  </h4>
                                  <p className="text-[11px] text-[#9299A8] leading-relaxed font-mono">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
                          <span className="text-[11px] font-mono text-[#9299A8]">
                            Direct collaboration with Samarth
                          </span>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <a
                              href="https://t.me/Samarth1306"
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#4D7CFE] hover:bg-[#3D6DEE] text-[#E8EAF0] font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#4D7CFE]/20 cursor-pointer min-h-[44px]"
                            >
                              <Send size={13} />
                              <span>Talk on Telegram</span>
                            </a>

                            <Link
                              href="/contact"
                              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#222630] hover:bg-[#282d39] border border-white/[0.08] text-[#E8EAF0] hover:text-white font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[44px]"
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
            </div>
          );
        })}
      </div>
    </section>
  );
}

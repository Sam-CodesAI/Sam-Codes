"use client";

import React from "react";
import { servicesData, ServiceOffering } from "@/data/services";
import { soundFx } from "@/utils/sound";
import { Briefcase, ArrowUpRight, Check } from "lucide-react";

export default function ServicesSection() {
  return (
    <section
      id="services"
      aria-label="Services & Commercial Offerings"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-indigo-400 mb-4 uppercase tracking-wider">
          <Briefcase size={13} className="text-indigo-400" />
          Collaboration
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Ways We Can Work Together
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
          Focused engineering engagements for founders, teams, and individuals who value speed, technical craft, and clear communication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicesData.map((svc: ServiceOffering) => (
          <div
            key={svc.id}
            onMouseEnter={() => soundFx.playHover()}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  SERVICE // 0{servicesData.indexOf(svc) + 1}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400">
                  Direct Collaboration
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {svc.title}
              </h3>

              <p className="text-xs font-mono text-slate-400 mb-4">
                {svc.tagline}
              </p>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {svc.description}
              </p>

              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">
                  Deliverables Include:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                  {svc.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check size={13} className="text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.04] flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Scope-based timeline &amp; deliverables
              </span>
              <a
                href={`#contact?service=${encodeURIComponent(svc.title)}`}
                onClick={() => soundFx.playChime(500, 0.06)}
                className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white text-slate-200 hover:text-slate-950 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Inquire</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

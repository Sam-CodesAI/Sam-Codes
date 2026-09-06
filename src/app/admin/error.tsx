"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home, Terminal, ShieldAlert } from "lucide-react";

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to local telemetry
    console.error("[Admin Error Boundary Caught Exception]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0b0f19] border border-rose-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden font-mono text-center">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-rose-500/10 blur-[80px] pointer-events-none" />

        {/* Error Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-500/10">
          <AlertOctagon size={28} />
        </div>

        {/* Header */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-wider mb-2 border border-rose-500/20">
          <ShieldAlert size={12} />
          <span>Execution Interrupted</span>
        </div>

        <h1 className="text-xl font-black text-white tracking-tight mb-2">
          Administrative Fault Caught
        </h1>

        <p className="text-xs text-slate-400 leading-relaxed mb-6 font-sans">
          The administrative control plane encountered an unexpected runtime exception. All system data and credentials remain safeguarded.
        </p>

        {/* Technical Error Box */}
        <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.06] text-left mb-6 space-y-1 text-[11px] overflow-x-auto">
          <div className="text-slate-500 font-mono flex items-center gap-1.5">
            <Terminal size={12} className="text-slate-400" />
            <span>Fault Message:</span>
          </div>
          <p className="text-rose-300 font-mono break-all font-medium">
            {error.message || "An unspecified application error occurred."}
          </p>
          {error.digest && (
            <p className="text-[10px] text-slate-500 font-mono pt-1 border-t border-white/[0.04]">
              Digest Ref: {error.digest}
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-sky-500/20 min-h-[44px]"
          >
            <RotateCcw size={14} />
            <span>Reset & Retry</span>
          </button>

          <Link
            href="/admin"
            className="w-full py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-medium text-xs flex items-center justify-center gap-2 transition-all min-h-[44px]"
          >
            <Home size={14} />
            <span>Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

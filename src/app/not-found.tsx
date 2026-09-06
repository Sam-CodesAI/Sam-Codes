import React from "react";
import Link from "next/link";
import { Terminal, Home, ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-mono selection:bg-sky-500/20 selection:text-white">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-sky-500/10 blur-[130px] pointer-events-none" />

      <div className="max-w-md w-full p-8 rounded-3xl bg-[#090d16]/90 border border-white/[0.08] backdrop-blur-2xl shadow-2xl text-center relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-4">
          <Terminal size={22} />
        </div>

        <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] text-sky-400 font-mono uppercase tracking-widest mb-3">
          Error 404 // Route Void
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          Page Not Located
        </h1>

        <p className="text-xs text-slate-400 font-sans leading-relaxed mb-6">
          The requested path could not be resolved on the SAM CODES network. The node may have been moved, renamed, or restricted.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-sky-500/20 min-h-[44px]"
          >
            <Home size={15} />
            <span>Return Home</span>
          </Link>

          <Link
            href="/admin"
            className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white font-medium text-xs flex items-center justify-center gap-2 transition-all min-h-[44px]"
          >
            <ArrowLeft size={15} />
            <span>Command Center</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

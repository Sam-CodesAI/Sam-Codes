import Link from "next/link";
import { Terminal, Home, ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-[#101216] text-[#E8EAF0] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#4D7CFE]/30 selection:text-white">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#4D7CFE]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-md w-full p-8 rounded-3xl bg-[#1A1D24]/90 border border-white/[0.08] backdrop-blur-2xl shadow-2xl text-center relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-[#4D7CFE]/15 border border-[#4D7CFE]/30 text-[#4D7CFE] flex items-center justify-center mx-auto mb-4">
          <Terminal size={22} />
        </div>

        <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] sm:text-xs text-[#4D7CFE] font-mono uppercase tracking-widest mb-3">
          Error 404 // Route Void
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#E8EAF0] tracking-tight mb-2">
          Page Not Located
        </h1>

        <p className="text-base text-[#9299A8] font-sans leading-relaxed mb-6">
          The requested path could not be resolved on the SAM CODES network. The node may have been moved, renamed, or restricted.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-[#4D7CFE] hover:bg-[#3D6DEE] text-[#E8EAF0] font-sans font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-[#4D7CFE]/25 min-h-[44px]"
          >
            <Home size={15} />
            <span>Return Home</span>
          </Link>

          <Link
            href="/contact"
            className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#E8EAF0] font-sans font-medium text-sm flex items-center justify-center gap-2 transition-all min-h-[44px]"
          >
            <ArrowLeft size={15} />
            <span>Contact Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

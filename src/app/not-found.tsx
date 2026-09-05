import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl max-w-md w-full">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-6">
          <Terminal size={22} />
        </div>

        <div className="text-xs font-mono text-sky-400 uppercase tracking-widest mb-2">
          404 // SIGNAL LOST
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Node Not Found
        </h1>

        <p className="text-xs text-slate-400 leading-relaxed mb-6 font-mono">
          The requested coordinate does not exist in the SAM CODES topology or has been relocated.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-950 font-medium text-xs hover:bg-sky-300 transition-colors shadow-lg"
        >
          <ArrowLeft size={14} />
          <span>Return to Origin</span>
        </Link>
      </div>
    </div>
  );
}

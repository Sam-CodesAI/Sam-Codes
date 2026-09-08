import React from "react";
import DokumentkoCheckoutModal from "@/components/demos/DokumentkoCheckoutModal";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Dokumentko AI Conversion Checkout Prototype | SAM CODES",
  description: "High-converting frictionless checkout modal built to eliminate the 30-abandoned-checkout bottleneck for dokumentkoai.com"
};

export default function DokumentkoDemoPage() {
  return (
    <main className="min-h-screen bg-[#060606] text-white p-6 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background radial glow */}
      <div 
        className="absolute pointer-events-none w-[800px] h-[500px] blur-[100px] opacity-20 -top-20 left-1/2 -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse, #6366f1 0%, transparent 70%)" }}
      />

      <div className="max-w-xl text-center mb-8 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sam Codes
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <CheckCircle className="w-3.5 h-3.5" /> 2026 Conversion Optimization Prototype
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Dokumentko AI Checkout Fix
        </h1>
        <p className="text-sm text-white/60">
          Removes the mandatory invoice data-entry wall, defaults to monthly €3.99/mo with 1-click Stripe, and offers dual language support.
        </p>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <DokumentkoCheckoutModal isOpen={true} />
      </div>
    </main>
  );
}

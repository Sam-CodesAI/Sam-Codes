"use client";

import React, { useState } from "react";
import DokumentkoCheckoutModal from "@/components/demos/DokumentkoCheckoutModal";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Code2, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Copy, 
  Check, 
  Mail, 
  Send 
} from "lucide-react";

export default function DokumentkoDemoPage() {
  const [activeTab, setActiveTab] = useState<"prototype" | "blueprint" | "handoff">("prototype");
  const [copied, setCopied] = useState(false);

  const integrationSnippet = `// 1. Drop into src/pages/_components/PricingSection.tsx
// Replace the mandatory <BillingProfileModal /> with:

import DokumentkoCheckoutModal from "./DokumentkoCheckoutModal";

// Inside PricingSection:
<DokumentkoCheckoutModal
  isOpen={isUpgradeOpen}
  onClose={() => setIsUpgradeOpen(false)}
  initialPlan={selectedPlan}
  onCheckout={async (planId, cycle) => {
    // Directly invokes Hercules/Stripe Checkout without the pre-checkout invoice form:
    const variantId = qee[planId][cycle];
    const checkout = await createCheckout({
      variantId,
      successUrl: window.location.origin + \`/\${lng || "en"}/studio?upgraded=1\`,
      cancelUrl: window.location.href
    });
    window.location.assign(checkout.url);
  }}
/>`;

  const copyCode = () => {
    navigator.clipboard.writeText(integrationSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#060606] text-white py-12 px-4 sm:px-6 relative overflow-x-hidden">
      {/* Background radial ambient lights */}
      <div 
        className="absolute pointer-events-none w-[900px] h-[500px] blur-[120px] opacity-25 -top-24 left-1/2 -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse, #6366f1 0%, transparent 70%)" }}
      />
      <div 
        className="absolute pointer-events-none w-[600px] h-[400px] blur-[100px] opacity-15 bottom-0 right-0"
        style={{ background: "radial-gradient(ellipse, #a855f7 0%, transparent 70%)" }}
      />

      {/* Top Header */}
      <div className="max-w-4xl mx-auto mb-10 relative z-10 text-center">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all bg-white/[0.02]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to SAM CODES Portfolio
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Production Ready (Next.js 16 + Tailwind)
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Dokumentko AI · Conversion Optimization Demo
        </h1>
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
          Engineered to resolve the 30 abandoned checkouts on{" "}
          <a 
            href="https://dokumentkoai.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-400 underline hover:text-indigo-300 inline-flex items-center gap-0.5"
          >
            dokumentkoai.com <ExternalLink className="w-3 h-3" />
          </a>
          . Eliminates the pre-payment accounting barrier, fixes the annual toggle default trap, and enables instant 1-click Stripe payments.
        </p>

        {/* Navigation Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 mt-8">
          <button
            onClick={() => setActiveTab("prototype")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "prototype"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Interactive Prototype
          </button>
          <button
            onClick={() => setActiveTab("blueprint")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "blueprint"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Technical Blueprint
          </button>
          <button
            onClick={() => setActiveTab("handoff")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "handoff"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Integration & Handoff
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto relative z-10">
        {activeTab === "prototype" && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <DokumentkoCheckoutModal embedded={true} />
            </div>
            
            <div className="mt-8 text-center text-xs text-white/40 max-w-md">
              💡 <span className="font-semibold text-white/70">Interactive Demo:</span> Try switching billing cycles (Monthly vs Annual), toggling English / Slovenian, and selecting plans.
            </div>
          </div>
        )}

        {activeTab === "blueprint" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> The 4 Critical Conversion Fixes
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 text-xs text-white/70 leading-relaxed">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <span className="font-bold text-white text-sm">1. Removed Invoice Wall</span>
                  <p>
                    Replaced the mandatory pre-checkout <code className="text-indigo-300 font-mono">BillingProfileModal</code> that demanded physical street addresses and tax IDs before Stripe opened.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <span className="font-bold text-white text-sm">2. Monthly Pricing by Default</span>
                  <p>
                    Replaced <code className="text-indigo-300 font-mono">useState(&quot;annual&quot;)</code> with monthly default so users clicking €3.99 ads are not shocked by a ~€24 - €48 annual lump sum.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <span className="font-bold text-white text-sm">3. Dynamic Locale Support</span>
                  <p>
                    Bypassed hardcoded <code className="text-indigo-300 font-mono">&lt;html lang=&quot;sl&quot;&gt;</code> defaults with auto-detecting English/Slovenian toggle for global ad traffic.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <span className="font-bold text-white text-sm">4. Risk Reversal Guarantees</span>
                  <p>
                    Embedded explicit 14-day refund assurances and 256-bit Stripe encryption badges directly beside the primary payment trigger.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-mono uppercase tracking-wider text-white/60">
                  Integration Code (PricingSection.tsx)
                </h2>
                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white font-mono transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Snippet"}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black/60 border border-white/5 text-indigo-300 text-xs font-mono overflow-x-auto leading-relaxed">
                {integrationSnippet}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "handoff" && (
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                  <Code2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold mb-2">Self-Service Handoff</h2>
                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  If you have a developer on your team or build via Lovable/Vite, you can take the standalone component file <code className="text-indigo-300">DokumentkoCheckoutModal.tsx</code> and drop it into your repository for free.
                </p>
                <ul className="text-xs text-white/70 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Pure React + Tailwind CSS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 0 third-party bloatware
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Native Stripe & Convex compatibility
                  </li>
                </ul>
              </div>

              <a
                href="mailto:samarthsr200@gmail.com?subject=Dokumentko%20Checkout%20Source%20Code"
                className="w-full py-3 rounded-xl border border-white/20 hover:border-white/40 text-center text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Request Source File (.tsx)
              </a>
            </div>

            <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-black to-black flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-indigo-500 text-[10px] font-bold uppercase tracking-wider text-white">
                Recommended
              </div>

              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold mb-2">Done-For-You Integration</h2>
                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  We handle the complete integration directly in your codebase or Lovable workspace. We will connect your Stripe IDs, test the checkout flow, and deploy the fix in under 30 minutes.
                </p>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 mb-4">
                  <div className="text-xs text-white/50">Turnaround & Price</div>
                  <div className="text-xl font-bold text-white mt-0.5">€25 <span className="text-xs text-white/50 font-normal">(~₹2,300 INR) · 30 Mins</span></div>
                </div>
              </div>

              <a
                href="https://t.me/Samarth1306"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-center text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Message on Telegram (@Samarth1306)
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="max-w-4xl mx-auto mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-3">
        <span>SAM CODES · Advanced Agentic Engineering</span>
        <div className="flex items-center gap-4">
          <Link href="/#contact" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/admin" className="hover:text-white transition-colors">Command Center</Link>
        </div>
      </div>
    </main>
  );
}

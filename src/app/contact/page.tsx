"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { soundFx } from "@/utils/sound";
import {
  Mail,
  Send,
  ArrowLeft,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";

// Dynamically import Three.js WebGL Cyber Data Highway
const CyberHighway3D = dynamic(
  () => import("@/components/3d/CyberHighway3D"),
  { ssr: false }
);

const EMAIL_ADDRESS = "samarthknimangre@gmail.com";
const TELEGRAM_HANDLE = "@Samarth1306";
const TELEGRAM_URL = "https://t.me/Samarth1306";

export default function ContactPortalPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "AI Voice Agents & Telephony",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL_ADDRESS);
    soundFx.playChime(640, 0.08);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard for spam bots

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          serviceRequested: formState.service,
          message: formState.message,
          contactMethod: `Email (${formState.email})`,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        soundFx.playChime(720, 0.12);
        setIsSubmitted(true);
      } else {
        setSubmissionError(
          data.error || "Unable to dispatch message. Please use direct Telegram or email below."
        );
      }
    } catch {
      // Graceful fallback to mailto so transmission is 100% resilient
      soundFx.playChime(640, 0.1);
      const subject = encodeURIComponent(`Project Brief: ${formState.service} (${formState.name})`);
      const body = encodeURIComponent(
        `Hi Samarth,\n\nName: ${formState.name}\nEmail: ${formState.email}\nTopic: ${formState.service}\n\nProject Details:\n${formState.message}\n\nSent from SAM CODES Contact Portal.`
      );
      window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openGmailApp = () => {
    soundFx.playChime(600, 0.08);
    const subject = encodeURIComponent("Project Build Inquiry with Samarth");
    const body = encodeURIComponent(
      "Hi Samarth,\n\nI have a project specification worth scoping out...\n\nTimeline:\nBudget:\nCore Requirements:\n"
    );
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative min-h-screen bg-[#030509] text-slate-100 antialiased selection:bg-blue-600/35 selection:text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 3D Cyber Data Highway Three.js WebGL Background */}
      <CyberHighway3D />

      <main className="relative z-10 max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#080d1a] border border-[#1e293b] hover:border-blue-500/50 text-slate-300 hover:text-white text-xs font-mono transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-blue-400" />
            <span>Return to Portfolio</span>
          </Link>

          <span className="text-[11px] font-mono text-[#ccff00] px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
            <span>DATA HIGHWAY ONLINE</span>
          </span>
        </div>

        {/* Header HUD */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080d1a] border border-[#1e293b] text-xs font-mono text-blue-400">
            <MessageSquare size={13} className="text-[#ccff00]" />
            <span>DIRECT TRANSMISSION PORTAL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Start a Conversation
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Direct access to Samarth. Submit project requirements via the secure form, launch directly into Gmail, or message on Telegram.
          </p>
        </div>

        {/* Dual Direct Action Cards (Telegram & Gmail 1-Click) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Direct Telegram Line */}
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFx.playChime(640, 0.08)}
            className="p-6 rounded-3xl bg-[#080d1a]/90 border border-[#1e293b] hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-900/30 transition-all flex items-center justify-between group cursor-pointer backdrop-blur-xl"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold">
                <Send size={14} />
                <span>DIRECT TELEGRAM LINE</span>
              </div>
              <div className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                {TELEGRAM_HANDLE}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Instant reply · Direct voice notes &amp; scoping
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0f172a] group-hover:bg-blue-600 border border-[#1e293b] group-hover:border-blue-400 flex items-center justify-center text-slate-400 group-hover:text-white transition-all shrink-0">
              <ExternalLink size={16} />
            </div>
          </a>

          {/* 1-Click Open in Gmail App */}
          <button
            type="button"
            onClick={openGmailApp}
            className="p-6 rounded-3xl bg-[#080d1a]/90 border border-[#1e293b] hover:border-[#ccff00]/50 hover:shadow-xl hover:shadow-lime-900/20 transition-all flex items-center justify-between group cursor-pointer text-left backdrop-blur-xl"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#ccff00] font-bold">
                <Mail size={14} />
                <span>1-CLICK GMAIL TRANSMISSION</span>
              </div>
              <div className="text-lg font-bold text-white group-hover:text-[#ccff00] transition-colors truncate">
                {EMAIL_ADDRESS}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Opens directly in your mail application
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0f172a] group-hover:bg-[#ccff00] border border-[#1e293b] group-hover:border-[#ccff00] flex items-center justify-center text-slate-400 group-hover:text-slate-950 transition-all shrink-0">
              <ExternalLink size={16} />
            </div>
          </button>
        </div>

        {/* Direct Web Form Container */}
        <div className="rounded-3xl bg-[#080d1a]/90 border border-[#1e293b] p-8 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#ccff00]" />
              <h2 className="text-lg font-bold text-white">
                Submit Project Specification
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              LOGS DIRECTLY TO COMMAND CENTER
            </span>
          </div>

          {isSubmitted ? (
            <div className="p-8 rounded-2xl bg-[#0f172a] border border-blue-500/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 text-[#ccff00] flex items-center justify-center mx-auto">
                <CheckCircle2 size={26} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Transmission Received by Samarth
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-white font-semibold">{formState.name}</span>. Your brief has been routed to Samarth&apos;s Telegram and saved in Supabase. You will receive a direct reply to <span className="text-blue-400 font-mono">{formState.email}</span> within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormState({
                    name: "",
                    email: "",
                    service: "AI Voice Agents & Telephony",
                    message: "",
                  });
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#080d1a] hover:bg-[#1e293b] border border-[#1e293b] text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Send Another Specification
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {submissionError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono flex items-center gap-2.5">
                  <AlertCircle size={15} className="shrink-0 text-rose-400" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* Honeypot field for automated spam protection */}
              <input
                type="text"
                name="user_anti_spam_field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono text-slate-400 mb-1.5">
                    YOUR NAME OR COMPANY
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Alex Vance"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#030509] border border-[#1e293b] text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-blue-400 transition-colors min-h-[44px]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-slate-400 mb-1.5">
                    YOUR EMAIL ADDRESS
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#030509] border border-[#1e293b] text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-blue-400 transition-colors min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-xs font-mono text-slate-400 mb-1.5">
                  SYSTEM ARCHITECTURE REQUESTED
                </label>
                <select
                  id="service"
                  value={formState.service}
                  onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#030509] border border-[#1e293b] text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 transition-colors cursor-pointer min-h-[44px]"
                >
                  <option value="AI Voice Agents & Telephony">Telephony AI Voice Agent (Twilio + WebRTC &lt;300ms)</option>
                  <option value="Vector Retrieval & RAG">Custom Vector Database &amp; Hybrid BM25 Search</option>
                  <option value="Autonomous Lead Qualifier Bots">Autonomous Telegram / WhatsApp CRM Lead Bot</option>
                  <option value="High-Velocity Bento Web MVP">Complete Next.js 16 Bento Web Platform / MVP</option>
                  <option value="Scrapers & Webhook Integrations">Python Scrapers &amp; Edge Webhook Integrations</option>
                  <option value="General Technical Consultation">General Architectural Scoping</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono text-slate-400 mb-1.5">
                  PROJECT SPECIFICATION &amp; TIMELINE
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Describe what needs to operate, target outcomes, timeline requirements, and any API dependencies..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#030509] border border-[#1e293b] text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check size={14} className="text-[#ccff00]" />
                      <span className="text-[#ccff00]">Email Copied ({EMAIL_ADDRESS})</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Email ({EMAIL_ADDRESS})</span>
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer min-h-[48px] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Transmitting Brief...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Transmit Specification to Samarth</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

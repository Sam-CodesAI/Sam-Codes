"use client";

import React, { useState } from "react";
import { socialsData, SocialLink } from "@/data/socials";
import { soundFx } from "@/utils/sound";
import SpotlightCard from "@/components/SpotlightCard";
import MotionReveal from "@/components/MotionReveal";
import {
  Mail,
  Copy,
  Check,
  Send,
  Sparkles,
  MessageSquare,
  ArrowUpRight,
  Clock,
  ExternalLink,
} from "lucide-react";

// Crisp inline SVGs for brand socials
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4l11.733 16h4.267l-11.733-16z" />
      <path d="M4 20l6.768-6.768m2.464-2.464l6.768-6.768" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M17 13c0-1.66-1.34-3-3-3-.4 0-.78.08-1.12.22C12.35 9.4 11.23 9 10 9c-.04 0-.08 0-.12.01L11 5l3 1" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15" cy="13" r="1" />
      <path d="M9.5 16.5c1 .67 2 .67 3 0" />
    </svg>
  );
}

const BRAND_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Instagram: InstagramIcon,
  Linkedin: LinkedinIcon,
  Twitter: TwitterIcon,
  Reddit: RedditIcon,
  Mail: Mail,
};

export default function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "AI Chatbots & Assistants",
    message: "",
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@samcodes.dev");
    soundFx.playChime(600, 0.08);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyHandle = (handle: string) => {
    navigator.clipboard.writeText(handle);
    soundFx.playChime(500, 0.06);
    setCopiedHandle(handle);
    setTimeout(() => setCopiedHandle(null), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playChime(640, 0.1);

    const subject = encodeURIComponent(`Project Inquiry: ${formState.service} (${formState.name})`);
    const body = encodeURIComponent(
      `Hello Sam,\n\nName: ${formState.name}\nEmail: ${formState.email}\nProject Type: ${formState.service}\n\nProject Details:\n${formState.message}\n\nSent from samcodes.dev portfolio.`
    );

    window.location.href = `mailto:contact@samcodes.dev?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      aria-label="Contact Sam"
      className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]"
    >
      <MotionReveal className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-sky-400 mb-4 uppercase tracking-wider">
          <MessageSquare size={13} className="text-sky-400" />
          Direct Communication Channels
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Have Something Worth Building? Let&apos;s Talk.
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
          I don&apos;t make you wait days for an email reply. Drop me a DM on X or Instagram for the fastest response, connect on LinkedIn, or shoot me a direct email.
        </p>
      </MotionReveal>

      {/* Primary Social Pathways Grid (Prioritized as requested) */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Fastest Pathways: Direct Messaging (DMs Open)
          </span>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <Clock size={12} />
            <span>Usually replies within 2–4 hours</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialsData
            .filter((s) => s.platform !== "Email")
            .map((item) => {
              const Icon = BRAND_ICONS[item.iconName] || Mail;

              return (
                <SpotlightCard
                  key={item.platform}
                  spotlightColor="rgba(56, 189, 248, 0.12)"
                  className="p-5 flex flex-col justify-between group cursor-default"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-sky-400 group-hover:bg-sky-500/10 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      {item.priorityBadge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {item.priorityBadge}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white mb-0.5">
                      {item.platform}
                    </h4>

                    <div className="text-xs font-mono text-slate-400 mb-4">
                      {item.handleOrLabel}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.04] flex items-center gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundFx.playHover()}
                      className="flex-1 py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-white text-slate-200 hover:text-slate-950 font-mono text-xs text-center font-medium transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
                    >
                      <span>Open {item.platform.split(" ")[0]}</span>
                      <ExternalLink size={12} />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyHandle(item.handleOrLabel)}
                      title={`Copy ${item.handleOrLabel}`}
                      className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      {copiedHandle === item.handleOrLabel ? (
                        <Check size={14} className="text-emerald-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </SpotlightCard>
              );
            })}
        </div>
      </div>

      {/* Secondary Direct Form & Email Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Email & Builder Location (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm space-y-6">
            <h3 className="text-lg font-bold text-white">Direct Email &amp; Proposals</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              If you have a formal project specification, RFP, or detailed scope, email is great. I read every email personally.
            </p>

            {/* Email Copy Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Mail size={16} className="text-sky-400 shrink-0" />
                <span className="text-xs sm:text-sm font-mono text-white truncate">
                  contact@samcodes.dev
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy email address"
                className="px-4 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 min-h-[44px]"
              >
                {copiedEmail ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/15 text-[11px] font-mono text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <Sparkles size={14} />
                <span>DIRECT BUILDER GUARANTEE</span>
              </div>
              <p className="leading-relaxed">
                Based in Karnataka, India (IST UTC+5:30). Open to global remote clients. No agency overhead, no account managers — just direct, fast collaboration.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Project Inquiry Form (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleFormSubmit}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm space-y-5"
          >
            <h3 className="text-lg font-bold text-white mb-2">Send a Direct Message</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-mono text-slate-400 mb-1.5">
                  YOUR NAME
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-sky-400 transition-colors min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-mono text-slate-400 mb-1.5">
                  YOUR EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-sky-400 transition-colors min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="service" className="block text-xs font-mono text-slate-400 mb-1.5">
                WHAT ARE YOU LOOKING TO BUILD?
              </label>
              <select
                id="service"
                value={formState.service}
                onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#090d1a] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 transition-colors cursor-pointer min-h-[44px]"
              >
                <option value="AI Chatbots & Assistants">AI Chatbot or Customer Assistant</option>
                <option value="Business Automation">Workflow &amp; Business Process Automation</option>
                <option value="Web Apps & Landing Pages">Modern Website or Next.js Web App</option>
                <option value="Rapid MVP Prototyping">Rapid Working MVP (Validate in Days)</option>
                <option value="General Collaboration">Collaboration or Academic Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-mono text-slate-400 mb-1.5">
                BRIEF PROJECT CONTEXT
              </label>
              <textarea
                id="message"
                required
                rows={4}
                placeholder="What is your product idea or current operational bottleneck? What would success look like?"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-sky-400 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20 cursor-pointer min-h-[48px]"
            >
              <Send size={15} />
              <span>Send Message Directly to Sam</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

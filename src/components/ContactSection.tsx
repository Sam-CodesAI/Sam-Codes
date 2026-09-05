"use client";

import React, { useState } from "react";
import { socialsData, SocialLink } from "@/data/socials";
import { soundFx } from "@/utils/sound";
import {
  Mail,
  Copy,
  Check,
  Send,
  Sparkles,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

// Crisp inline SVGs for brand socials to avoid deprecation issues
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "AI Agents & Systems",
    message: "",
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@samcodes.dev");
    soundFx.playChime(600, 0.08);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSocialClick = (e: React.MouseEvent, item: SocialLink) => {
    if (item.isPlaceholder) {
      e.preventDefault();
      soundFx.playHover();
      setToastMessage(
        `${item.platform} handle is currently being activated. You can reach out directly via email at contact@samcodes.dev!`
      );
      setTimeout(() => setToastMessage(null), 4000);
    }
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
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-sky-400 mb-4 uppercase tracking-wider">
          <MessageSquare size={13} className="text-sky-400" />
          Get in Touch
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Have Something Worth Building?
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
          Whether you need a custom AI agent, an automated workflow pipeline, or a high-performance web experience — let&apos;s build something intelligent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Outreach & Socials (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm space-y-6">
            <h3 className="text-lg font-bold text-white">Direct Communication</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              I prioritize fast, clear, and asynchronous communication. Feel free to copy my direct email or connect across networks.
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
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
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

            {/* Social Channels List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono text-slate-500 block uppercase tracking-wider">
                Digital Footprint
              </span>

              <div className="grid grid-cols-2 gap-2">
                {socialsData
                  .filter((s) => s.platform !== "Email")
                  .map((item) => {
                    const Icon = BRAND_ICONS[item.iconName] || Mail;

                    return (
                      <a
                        key={item.platform}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => handleSocialClick(e, item)}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-sky-500/30 hover:bg-white/[0.05] transition-all flex items-center gap-2.5 text-xs text-slate-300 hover:text-white group"
                      >
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-sky-400 shrink-0 transition-colors" />
                        <span className="truncate">{item.platform}</span>
                      </a>
                    );
                  })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/15 text-[11px] font-mono text-slate-400 flex items-start gap-2.5">
              <Sparkles size={14} className="text-sky-400 shrink-0 mt-0.5" />
              <span>
                Based in Karnataka, India (IST UTC+5:30). Open to global collaboration and remote engagements.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Project Inquiry Form (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleFormSubmit}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm space-y-5"
          >
            <h3 className="text-lg font-bold text-white mb-2">Send a Message</h3>

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
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-sky-400 transition-colors"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="service" className="block text-xs font-mono text-slate-400 mb-1.5">
                INTERESTED SERVICE / DOMAIN
              </label>
              <select
                id="service"
                value={formState.service}
                onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#090d1a] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 transition-colors cursor-pointer"
              >
                <option value="AI Agents & Systems">AI Agents &amp; Systems</option>
                <option value="Business Automation">Business Process Automation</option>
                <option value="Web Apps & Dashboards">Web Experiences &amp; Next.js</option>
                <option value="Rapid Prototyping">Rapid Prototyping &amp; MVP</option>
                <option value="General Collaboration">General / Academic Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-mono text-slate-400 mb-1.5">
                PROJECT CONTEXT / BRIEF
              </label>
              <textarea
                id="message"
                required
                rows={4}
                placeholder="Describe what you want to build, current challenges, or goals..."
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-sky-400 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <Send size={15} />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-[#0b1020] border border-sky-400/40 text-slate-200 text-xs shadow-2xl flex items-start gap-3 animate-fade-in"
        >
          <AlertCircle size={16} className="text-sky-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{toastMessage}</div>
        </div>
      )}
    </section>
  );
}

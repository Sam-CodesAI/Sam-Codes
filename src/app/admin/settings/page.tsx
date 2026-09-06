"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Globe,
  Sliders,
  Sparkles,
  Volume2,
  Inbox,
  BarChart3,
  Bot,
  Send,
  RotateCcw,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { useToast } from "@/components/admin/ToastProvider";
import { SiteSettings } from "@/lib/data-service";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [initialSettings, setInitialSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Telegram Integration State
  const [telegramStatus, setTelegramStatus] = useState<{
    configured: boolean;
    hasSecret: boolean;
    botInfo: { id: number; username?: string; first_name?: string } | null;
    webhookInfo: { url?: string } | null;
    activeSessions: number;
    webhookEndpoint: string;
  } | null>(null);
  const [simMessage, setSimMessage] = useState("");
  const [simChatId] = useState(`admin-sim-${Date.now().toString(36)}`);
  const [simLogs, setSimLogs] = useState<
    Array<{ sender: "user" | "agent"; text: string; time: string; meta?: string }>
  >([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simInquiryCreatedId, setSimInquiryCreatedId] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const json = await res.json();
        setSettings(json.settings);
        setInitialSettings(json.settings);
      }
    } catch {
      showToast("Failed to load settings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTelegramStatus = async () => {
    try {
      const res = await fetch("/api/admin/telegram");
      if (res.ok) {
        const data = await res.json();
        setTelegramStatus(data);
      }
    } catch {
      // Ignored non-blocking
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchTelegramStatus();
  }, []);

  const handleSimulateMessage = async (textToSend?: string) => {
    const text = textToSend || simMessage;
    if (!text.trim() || isSimulating) return;

    setIsSimulating(true);
    const userLog = {
      sender: "user" as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString(),
    };
    setSimLogs((prev) => [...prev, userLog]);
    setSimMessage("");

    try {
      const res = await fetch("/api/admin/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate",
          message: text.trim(),
          chatId: simChatId,
          username: "sam_admin_tester",
          firstName: "Samarth",
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const r = json.result;
        const metaDesc = `Phase: ${r.phase} • Latency: ${r.latencyMs}ms${r.leadQualified ? " • [QUALIFIED]" : ""}`;
        setSimLogs((prev) => [
          ...prev,
          {
            sender: "agent",
            text: r.replyText,
            time: new Date().toLocaleTimeString(),
            meta: metaDesc,
          },
        ]);
        if (r.inquiryCreated?.id) {
          setSimInquiryCreatedId(r.inquiryCreated.id);
          showToast(`Inquiry #${r.inquiryCreated.id.slice(-6)} created in Supabase!`, "success");
        }
      } else {
        showToast("Simulation request failed", "error");
      }
    } catch {
      showToast("Network error during simulation", "error");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetSimulation = async () => {
    try {
      await fetch("/api/admin/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_session", chatId: simChatId }),
      });
      setSimLogs([]);
      setSimInquiryCreatedId(null);
      showToast("Simulation session reset", "info");
    } catch {
      showToast("Failed to reset session", "error");
    }
  };

  const isDirty =
    settings && initialSettings
      ? JSON.stringify(settings) !== JSON.stringify(initialSettings)
      : false;

  const handleUpdate = <K extends keyof SiteSettings>(
    field: K,
    val: SiteSettings[K]
  ) => {
    setSettings((prev) => (prev ? { ...prev, [field]: val } : null));
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        const json = await res.json();
        setSettings(json.settings);
        setInitialSettings(json.settings);
        setLastSavedAt(new Date().toLocaleTimeString());
        showToast("Global settings applied", "success");
      } else {
        showToast("Failed to save settings", "error");
      }
    } catch {
      showToast("Network error saving settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setSettings(initialSettings);
    showToast("Changes reverted", "info");
  };

  if (isLoading || !settings) {
    return (
      <AdminShell>
        <div className="p-16 text-center text-xs font-mono text-slate-500">
          Loading site configuration...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6 pb-20 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <Settings size={14} />
              <span>System Configuration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Site Settings & Toggles
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Global feature flags, SEO metadata, and portfolio runtime preferences.
            </p>
          </div>
        </div>

        {/* Form Groups */}
        <div className="space-y-6">
          {/* SEO & Meta */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-sky-400" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                1. SEO & Metadata
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Portfolio Page Title
              </label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => handleUpdate("siteTitle", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Meta Description (Search & Social Preview)
              </label>
              <textarea
                rows={3}
                value={settings.metaDescription}
                onChange={(e) => handleUpdate("metaDescription", e.target.value)}
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Public Availability Headline
              </label>
              <input
                type="text"
                value={settings.availabilityStatus}
                onChange={(e) =>
                  handleUpdate("availabilityStatus", e.target.value)
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-emerald-400 min-h-[44px]"
              />
            </div>
          </div>

          {/* Feature Flags & Toggles */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-purple-400" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                2. Feature Flags & Experience Toggles
              </h2>
            </div>

            <div className="space-y-3">
              {/* Contact Form Submission */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <Inbox size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-mono">
                      Client Contact Form
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Allow visitors to submit direct project inquiries on the site
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowContactForm}
                  onChange={(e) =>
                    handleUpdate("allowContactForm", e.target.checked)
                  }
                  className="w-5 h-5 rounded bg-white/[0.05] border-white/[0.2] text-sky-500 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Analytics Telemetry */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-mono">
                      Privacy Telemetry Ingestion
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Record privacy-first sessions, referral channels, and device stats
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.analyticsEnabled}
                  onChange={(e) =>
                    handleUpdate("analyticsEnabled", e.target.checked)
                  }
                  className="w-5 h-5 rounded bg-white/[0.05] border-white/[0.2] text-sky-500 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Cinematic Intro */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-mono">
                      Cinematic Neural Canvas Intro
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Play the cinematic initialization animation on first visitor load
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.cinematicIntroEnabled}
                  onChange={(e) =>
                    handleUpdate("cinematicIntroEnabled", e.target.checked)
                  }
                  className="w-5 h-5 rounded bg-white/[0.05] border-white/[0.2] text-sky-500 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Audio Sound Effects */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Volume2 size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-mono">
                      Interface Sound Effects
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Enable subtle sound feedback on interactive easter eggs and buttons
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEffectsEnabled}
                  onChange={(e) =>
                    handleUpdate("soundEffectsEnabled", e.target.checked)
                  }
                  className="w-5 h-5 rounded bg-white/[0.05] border-white/[0.2] text-sky-500 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* TELEGRAM AI QUALIFIER & LIVE SIMULATOR */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    Telegram AI Qualifier &amp; CRM Bridge
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      LIVE ENGINE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    24/7 conversational lead qualification, grounded intent analysis, and automated Supabase ingestion
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    telegramStatus?.configured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                  }`}
                />
                <span className="text-xs font-mono text-slate-300">
                  {telegramStatus?.configured
                    ? `@${telegramStatus.botInfo?.username || "Telegram Bot"} Connected`
                    : "Simulated Engine Ready"}
                </span>
              </div>
            </div>

            {/* Architecture Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                <div className="text-slate-500 text-[10px] uppercase">Webhook Endpoint</div>
                <div className="text-slate-300 truncate mt-1">/api/telegram/webhook</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                <div className="text-slate-500 text-[10px] uppercase">Active In-Memory Sessions</div>
                <div className="text-emerald-400 font-bold mt-1">
                  {telegramStatus?.activeSessions ?? 0} active
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                <div className="text-slate-500 text-[10px] uppercase">Security Guardrail</div>
                <div className="text-sky-400 flex items-center gap-1 mt-1">
                  <ShieldCheck size={13} />
                  40 req/min Rate Limit
                </div>
              </div>
            </div>

            {/* Interactive Simulation Playground */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Live Agent Conversation Simulator
                </div>
                {simLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetSimulation}
                    className="text-[11px] font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors min-h-[32px] px-2"
                  >
                    <RotateCcw size={12} />
                    Reset Session
                  </button>
                )}
              </div>

              {/* Chat Log Window */}
              <div className="min-h-[160px] max-h-[300px] overflow-y-auto space-y-3 p-3 rounded-lg bg-white/[0.01] border border-white/[0.03]">
                {simLogs.length === 0 ? (
                  <div className="text-center py-8 text-xs font-mono text-slate-500">
                    No simulated messages yet. Send a test message below or click a quick prompt to see the agent qualify and persist a lead in real-time.
                  </div>
                ) : (
                  simLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        log.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="text-[9px] font-mono text-slate-500 mb-1 flex items-center gap-2">
                        <span>{log.sender === "user" ? "You (Client)" : "Samarth's AI Qualifier"}</span>
                        <span>{log.time}</span>
                        {log.meta && (
                          <span className="text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded">
                            {log.meta}
                          </span>
                        )}
                      </div>
                      <div
                        className={`max-w-[85%] p-3 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed ${
                          log.sender === "user"
                            ? "bg-sky-600/20 text-sky-200 border border-sky-500/30"
                            : "bg-white/[0.04] text-slate-200 border border-white/[0.08]"
                        }`}
                      >
                        {log.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Generated Inquiry Banner */}
              {simInquiryCreatedId && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Lead qualified &amp; recorded into Supabase `inquiries` table!</span>
                  </div>
                  <a
                    href={`/admin/inquiries?id=${simInquiryCreatedId}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-white font-bold transition-colors"
                  >
                    View in Inquiries
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() =>
                    handleSimulateMessage(
                      "Hi! I need an automated WhatsApp CRM sync for my e-commerce store."
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] font-mono text-slate-300 border border-white/[0.06] transition-colors min-h-[36px]"
                >
                  1. Inquire CRM Sync
                </button>
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() =>
                    handleSimulateMessage(
                      "Our target launch is 3 weeks, and my email is test.lead@example.com."
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] font-mono text-slate-300 border border-white/[0.06] transition-colors min-h-[36px]"
                >
                  2. Provide Timeline &amp; Email
                </button>
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() =>
                    handleSimulateMessage(
                      "Who is Samarth and what does he build?"
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] font-mono text-slate-300 border border-white/[0.06] transition-colors min-h-[36px]"
                >
                  3. Query Grounded FAQ
                </button>
              </div>

              {/* Message Input Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSimulateMessage();
                    }
                  }}
                  placeholder="Type a simulated client message (e.g. 'I need a customer support bot')..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => handleSimulateMessage()}
                  disabled={isSimulating || !simMessage.trim()}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition-colors min-h-[44px]"
                >
                  <Send size={14} />
                  {isSimulating ? "Thinking..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <SaveBar
          isDirty={isDirty}
          isSaving={isSaving}
          lastSavedAt={lastSavedAt}
          onSaveDraft={handleSave}
          onPublish={handleSave}
          onDiscard={handleDiscard}
          publishLabel="Apply Settings"
        />
      </div>
    </AdminShell>
  );
}

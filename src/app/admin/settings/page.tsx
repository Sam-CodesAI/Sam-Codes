"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Sliders,
  Sparkles,
  Volume2,
  Inbox,
  BarChart3,
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

  useEffect(() => {
    fetchSettings();
  }, []);

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

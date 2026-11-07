"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { useToast } from "@/components/admin/ToastProvider";
import { ProfileData } from "@/data/profile";

export default function AdminProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [initialProfile, setInitialProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setInitialProfile(data.profile);
      }
    } catch {
      showToast("Failed to fetch profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const isDirty =
    profile && initialProfile
      ? JSON.stringify(profile) !== JSON.stringify(initialProfile)
      : false;

  const handleUpdate = <K extends keyof ProfileData>(
    field: K,
    val: ProfileData[K]
  ) => {
    setProfile((prev) => (prev ? { ...prev, [field]: val } : null));
  };

  const handleAddWhyWorkItem = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      whyWorkWithMe: [
        ...profile.whyWorkWithMe,
        {
          title: "Engineering Rigor",
          description: "Production code with strict typing and no brittle workarounds.",
          tag: "Core Value",
        },
      ],
    });
  };

  const handleUpdateWhyWorkItem = (
    index: number,
    field: "title" | "description",
    val: string
  ) => {
    if (!profile) return;
    const updated = [...profile.whyWorkWithMe];
    updated[index] = { ...updated[index], [field]: val };
    setProfile({ ...profile, whyWorkWithMe: updated });
  };

  const handleRemoveWhyWorkItem = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      whyWorkWithMe: profile.whyWorkWithMe.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setInitialProfile(data.profile);
        setLastSavedAt(new Date().toLocaleTimeString());
        showToast("Profile & builder identity saved", "success");
      } else {
        showToast("Failed to save profile", "error");
      }
    } catch {
      showToast("Network error while saving profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setProfile(initialProfile);
    showToast("Changes reverted", "info");
  };

  if (isLoading || !profile) {
    return (
      <AdminShell>
        <div className="p-16 text-center text-xs font-mono text-slate-500">
          Loading profile settings...
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
              <User size={14} />
              <span>Identity & Personal Brand</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Profile & Bio
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Manage builder name, identity headline, location, availability status, and core philosophy.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Identity Basics */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              1. Basic Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleUpdate("fullName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Preferred / Display Name
                </label>
                <input
                  type="text"
                  value={profile.preferredName}
                  onChange={(e) => handleUpdate("preferredName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400"
                  />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleUpdate("location", e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Identity Headline
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => handleUpdate("title", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Availability Status
                </label>
                <input
                  type="text"
                  value={profile.availabilityStatus}
                  onChange={(e) => handleUpdate("availabilityStatus", e.target.value)}
                  placeholder="Available for custom builds"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-emerald-400 min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              2. Hero & Value Proposition
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Hero Primary Headline
              </label>
              <input
                type="text"
                value={profile.heroHeadline}
                onChange={(e) => handleUpdate("heroHeadline", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Hero Subheadline / Mission
              </label>
              <textarea
                rows={3}
                value={profile.heroSubheadline}
                onChange={(e) => handleUpdate("heroSubheadline", e.target.value)}
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Philosophy Statement Description
              </label>
              <textarea
                rows={3}
                value={profile.statementDescription}
                onChange={(e) => handleUpdate("statementDescription", e.target.value)}
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-sans"
              />
            </div>
          </div>

          {/* Why Work With Sam (Value Pillars) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  3. Why Work With Sam (Client Value Pillars)
                </h2>
                <p className="text-[11px] font-mono text-slate-400">
                  Four core reasons clients and teams choose to partner with you
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddWhyWorkItem}
                className="px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Plus size={14} />
                <span>Add Pillar</span>
              </button>
            </div>

            <div className="space-y-3">
              {profile.whyWorkWithMe.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateWhyWorkItem(idx, "title", e.target.value)}
                      placeholder="Pillar Title"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-bold text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveWhyWorkItem(idx)}
                      className="p-1.5 hover:text-rose-400 text-slate-500 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateWhyWorkItem(idx, "description", e.target.value)
                    }
                    placeholder="Description of this value proposition..."
                    className="w-full p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 font-sans"
                  />
                </div>
              ))}
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
          publishLabel="Save & Deploy"
        />
      </div>
    </AdminShell>
  );
}

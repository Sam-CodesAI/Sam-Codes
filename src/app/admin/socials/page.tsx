"use client";

import React, { useEffect, useState } from "react";
import {
  Share2,
  ExternalLink,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { useToast } from "@/components/admin/ToastProvider";
import { SocialLink } from "@/data/socials";

export default function AdminSocialsPage() {
  const { showToast } = useToast();
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [initialSocials, setInitialSocials] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const fetchSocials = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/socials");
      if (res.ok) {
        const json = await res.json();
        setSocials(json.socials || []);
        setInitialSocials(json.socials || []);
      }
    } catch {
      showToast("Failed to load social links", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // X (Twitter) Integration State
  const [twitterStatus, setTwitterStatus] = useState<{
    configured: boolean;
    hasUserTokens: boolean;
    account: string;
    status: { valid: boolean; tier: string; canPost: boolean; message: string };
  } | null>(null);
  const [tweetText, setTweetText] = useState("");
  const [isPostingTweet, setIsPostingTweet] = useState(false);

  const fetchTwitterStatus = async () => {
    try {
      const res = await fetch("/api/admin/twitter");
      if (res.ok) {
        const data = await res.json();
        setTwitterStatus(data);
      }
    } catch {
      // Non-blocking
    }
  };

  useEffect(() => {
    fetchSocials();
    fetchTwitterStatus();
  }, []);

  const handlePostTweet = async () => {
    if (!tweetText.trim() || isPostingTweet) return;
    setIsPostingTweet(true);
    try {
      const res = await fetch("/api/admin/twitter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tweetText.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Tweet published successfully to @Sam_CodeAI!", "success");
        setTweetText("");
      } else {
        showToast(data.error || "Failed to post tweet", "error");
      }
    } catch {
      showToast("Network error while posting to X", "error");
    } finally {
      setIsPostingTweet(false);
    }
  };

  const isDirty =
    JSON.stringify(socials) !== JSON.stringify(initialSocials);

  const handleUpdateSocial = <K extends keyof SocialLink>(
    index: number,
    field: K,
    val: SocialLink[K]
  ) => {
    setSocials((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleAddSocial = () => {
    const newSocial: SocialLink = {
      platform: "Custom Link",
      url: "https://",
      handleOrLabel: "@handle",
      ariaLabel: "Visit Custom Link",
      iconName: "Mail",
      directActionLabel: "Connect",
      description: "Direct outreach and project updates",
    };
    setSocials((prev) => [...prev, newSocial]);
  };

  const handleRemoveSocial = (index: number) => {
    setSocials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const item of socials) {
        await fetch("/api/admin/socials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }
      setInitialSocials(socials);
      setLastSavedAt(new Date().toLocaleTimeString());
      showToast("Social channels saved successfully", "success");
    } catch {
      showToast("Failed to save social links", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setSocials(initialSocials);
    showToast("Changes reverted", "info");
  };

  return (
    <AdminShell>
      <div className="space-y-6 pb-20 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <Share2 size={14} />
              <span>Connection Channels</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Socials & Outreach
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Manage client-facing communication channels: Instagram, LinkedIn, X, GitHub, Reddit, and WhatsApp.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddSocial}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all cursor-pointer min-h-[44px]"
          >
            <Plus size={15} />
            <span>Add Channel</span>
          </button>
        </div>

        {/* X (Twitter) Developer API Bridge */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black border border-white/[0.12] flex items-center justify-center font-bold text-white text-sm">
                𝕏
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    X Developer API Bridge
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono flex items-center gap-1">
                    <CheckCircle2 size={10} />
                    <span>Keys Connected</span>
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  Target Account:{" "}
                  <a
                    href="https://x.com/Sam_CodeAI"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>@Sam_CodeAI</span>
                    <ExternalLink size={10} />
                  </a>{" "}
                  · Free Tier v2 Active
                </p>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Posting:{" "}
              {twitterStatus?.hasUserTokens ? (
                <span className="text-emerald-400">Ready to Publish</span>
              ) : (
                <span className="text-amber-400">User Token Required</span>
              )}
            </div>
          </div>

          {/* Tweet Composer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Sparkles size={12} className="text-sky-400" />
                <span>Broadcast to @Sam_CodeAI</span>
              </label>
              <span
                className={`text-[10px] font-mono ${
                  tweetText.length > 280 ? "text-rose-400 font-bold" : "text-slate-500"
                }`}
              >
                {tweetText.length}/280
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="Share a build milestone, tech update, or project launch directly to X..."
                rows={2}
                maxLength={300}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:border-sky-400 focus:outline-none resize-none font-sans"
              />
              <button
                type="button"
                onClick={handlePostTweet}
                disabled={!tweetText.trim() || isPostingTweet || tweetText.length > 280}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 disabled:bg-white/10 text-slate-950 disabled:text-slate-500 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed min-h-[44px] self-end sm:self-auto"
              >
                <Send size={13} />
                <span>{isPostingTweet ? "Posting..." : "Post to X"}</span>
              </button>
            </div>

            {!twitterStatus?.hasUserTokens && (
              <p className="text-[10px] font-mono text-slate-500">
                💡 <strong className="text-slate-400">Tip:</strong> App credentials verified. To enable direct 1-click posting from this dashboard, generate your User Access Token &amp; Secret with &quot;Read and Write&quot; permissions in the X Developer Portal and add them to your environment.
              </p>
            )}
          </div>
        </div>

        {/* Channels List */}
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-slate-500">
            Loading social links...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socials.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={item.platform}
                    onChange={(e) =>
                      handleUpdateSocial(idx, "platform", e.target.value)
                    }
                    className="text-sm font-bold text-white bg-transparent border-b border-white/[0.1] focus:border-sky-400 focus:outline-none font-mono py-1 flex-1"
                  />

                  <div className="flex items-center gap-2">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 hover:bg-white/[0.06] text-sky-400 rounded-lg cursor-pointer"
                        title="Open external link"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveSocial(idx)}
                      className="p-2 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Handle or Label
                  </label>
                  <input
                    type="text"
                    value={item.handleOrLabel}
                    onChange={(e) =>
                      handleUpdateSocial(idx, "handleOrLabel", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-sky-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => handleUpdateSocial(idx, "url", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Context Note
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateSocial(idx, "description", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 font-sans"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save Bar */}
        <SaveBar
          isDirty={isDirty}
          isSaving={isSaving}
          lastSavedAt={lastSavedAt}
          onSaveDraft={handleSave}
          onPublish={handleSave}
          onDiscard={handleDiscard}
          publishLabel="Save Socials"
        />
      </div>
    </AdminShell>
  );
}

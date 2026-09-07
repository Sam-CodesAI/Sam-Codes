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
  Zap,
  Key,
  RefreshCw,
  Clock,
  ShieldCheck,
  Code2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { useToast } from "@/components/admin/ToastProvider";
import { SocialLink } from "@/data/socials";

interface TweetTemplate {
  id: string;
  category: string;
  title: string;
  text: string;
}

interface TwitterStatusData {
  success: boolean;
  account: string;
  configured: boolean;
  hasClientId: boolean;
  hasUserTokens: boolean;
  authMode: string;
  authUrl?: string;
  verifier?: string;
  state?: string;
  tokenExpiresAt?: number;
  status: {
    valid: boolean;
    tier: string;
    canPost: boolean;
    canRead: boolean;
    authMode: string;
    message: string;
    details?: {
      account?: string;
      authMode?: string;
      expiresInMinutes?: number;
      autoRefreshEnabled?: boolean;
    };
  };
  templates?: TweetTemplate[];
}

export default function AdminSocialsPage() {
  const { showToast } = useToast();
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [initialSocials, setInitialSocials] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // X (Twitter) Engine State
  const [twitterData, setTwitterData] = useState<TwitterStatusData | null>(null);
  const [tweetText, setTweetText] = useState("");
  const [isPostingTweet, setIsPostingTweet] = useState(false);
  const [isExchangingCode, setIsExchangingCode] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [showManualExchange, setShowManualExchange] = useState(false);
  const [publishedTweetUrl, setPublishedTweetUrl] = useState<string | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

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

  const fetchTwitterStatus = async () => {
    try {
      const res = await fetch("/api/admin/twitter");
      if (res.ok) {
        const data: TwitterStatusData = await res.json();
        setTwitterData(data);
      }
    } catch {
      // Non-blocking
    }
  };

  const handleExchangeCode = async (codeToExchange?: string) => {
    const rawInput = codeToExchange || manualCode;
    if (!rawInput.trim()) {
      showToast("Please enter the authorization code or redirect URL", "error");
      return;
    }

    setIsExchangingCode(true);
    const storedVerifier =
      (typeof window !== "undefined" ? localStorage.getItem("x_pkce_verifier") : null) ||
      twitterData?.verifier ||
      "";

    try {
      const res = await fetch("/api/admin/twitter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "exchange_code",
          code: rawInput.trim(),
          verifier: storedVerifier,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Connected to @Sam_CodeAI via OAuth 2.0 PKCE!", "success");
        setManualCode("");
        setShowManualExchange(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem("x_pkce_verifier");
        }
        await fetchTwitterStatus();
      } else {
        showToast(data.error || "Failed to exchange code", "error");
      }
    } catch {
      showToast("Network error exchanging code", "error");
    } finally {
      setIsExchangingCode(false);
    }
  };

  useEffect(() => {
    fetchSocials();
    fetchTwitterStatus();

    // Check query params for OAuth 2.0 callback return
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const twitterAuth = urlParams.get("twitter_auth");
      const twitterError = urlParams.get("twitter_error");
      const twitterCode = urlParams.get("twitter_code");

      if (twitterAuth === "success") {
        showToast("X (@Sam_CodeAI) authenticated successfully with auto-refresh!", "success");
        window.history.replaceState({}, document.title, window.location.pathname);
        fetchTwitterStatus();
      } else if (twitterError) {
        showToast(`X Auth Error: ${decodeURIComponent(twitterError)}`, "error");
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (twitterCode) {
        handleExchangeCode(twitterCode);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleAuthorizeClick = () => {
    if (!twitterData?.authUrl) {
      // Fallback direct endpoint
      window.location.href = "/api/admin/twitter?action=authorize";
      return;
    }
    if (twitterData.verifier && typeof window !== "undefined") {
      localStorage.setItem("x_pkce_verifier", twitterData.verifier);
    }
    window.location.href = twitterData.authUrl;
  };

  const handleSelectTemplate = (template: TweetTemplate) => {
    setTweetText(template.text);
    setActiveTemplateId(template.id);
    setPublishedTweetUrl(null);
    showToast(`Loaded: ${template.title}`, "info");
  };

  const handlePostTweet = async () => {
    if (!tweetText.trim() || isPostingTweet) return;
    setIsPostingTweet(true);
    setPublishedTweetUrl(null);

    try {
      const res = await fetch("/api/admin/twitter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tweetText.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Tweet published successfully to @Sam_CodeAI!", "success");
        setPublishedTweetUrl(data.url || `https://x.com/Sam_CodeAI/status/${data.tweetId}`);
        setTweetText("");
        setActiveTemplateId(null);
      } else {
        showToast(data.error || "Failed to post tweet", "error");
      }
    } catch {
      showToast("Network error while posting to X", "error");
    } finally {
      setIsPostingTweet(false);
    }
  };

  const isDirty = JSON.stringify(socials) !== JSON.stringify(initialSocials);

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

  const isOauth2Active =
    twitterData?.hasUserTokens && twitterData?.authMode === "oauth2_user";

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
              Socials &amp; Outreach
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

        {/* X (Twitter) Autonomous Broadcast Engine & Bridge */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm space-y-6">
          {/* Bridge Status Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center font-bold text-white text-base shadow-inner shrink-0">
                𝕏
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    X Developer API &amp; Tweet Engine
                  </h3>
                  {isOauth2Active ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono flex items-center gap-1">
                      <ShieldCheck size={11} />
                      <span>OAuth 2.0 PKCE • Auto-Refresh Active</span>
                    </span>
                  ) : twitterData?.hasUserTokens ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      <span>OAuth 1.0a Connected</span>
                    </span>
                  ) : twitterData?.configured ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[10px] font-mono flex items-center gap-1">
                      <Key size={11} />
                      <span>App Keys Verified · Connect User Token</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[10px] font-mono">
                      Not Configured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-400 mt-1">
                  <span>
                    Account:{" "}
                    <a
                      href="https://x.com/Sam_CodeAI"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>@Sam_CodeAI</span>
                      <ExternalLink size={10} />
                    </a>
                  </span>
                  <span>•</span>
                  <span>1,500 Tweets/mo Cap</span>
                  {twitterData?.status?.details?.expiresInMinutes !== undefined && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock size={11} />
                        Token: {twitterData.status.details.expiresInMinutes}m remaining (Auto-rotates)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Auth Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAuthorizeClick}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all cursor-pointer min-h-[44px]"
              >
                <Zap size={14} />
                <span>{twitterData?.hasUserTokens ? "Reconnect @Sam_CodeAI" : "Connect with X"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowManualExchange(!showManualExchange)}
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono text-xs border border-white/[0.08] transition-all cursor-pointer min-h-[44px]"
                title="Manual code or redirect URL exchange"
              >
                <Code2 size={14} />
              </button>
            </div>
          </div>

          {/* Manual Exchange Drawer */}
          {showManualExchange && (
            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.1] space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5">
                  <Key size={13} />
                  <span>Manual OAuth 2.0 Authorization Exchange</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Paste code or full redirect URL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                If the automatic redirect did not finalize your session, paste the authorization code or the full callback URL from your browser address bar below:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Paste callback URL or code (e.g. abcdef123...)"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-600 focus:border-sky-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleExchangeCode()}
                  disabled={!manualCode.trim() || isExchangingCode}
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 text-slate-950 disabled:text-slate-500 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed min-h-[44px]"
                >
                  <RefreshCw size={13} className={isExchangingCode ? "animate-spin" : ""} />
                  <span>{isExchangingCode ? "Exchanging..." : "Exchange Token"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Live Tweet Success Banner */}
          {publishedTweetUrl && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-300 text-xs font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Tweet published successfully to <strong>@Sam_CodeAI</strong>!</span>
              </div>
              <a
                href={publishedTweetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-bold flex items-center gap-1 shrink-0"
              >
                <span>View on X</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Autonomous Dev Log Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} className="text-sky-400" />
                <span>Autonomous Dev Log Presets (@Sam_CodeAI)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Click any template to load into composer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(twitterData?.templates || []).map((t) => {
                const isSelected = activeTemplateId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTemplate(t)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? "bg-sky-500/10 border-sky-400/40 shadow-md shadow-sky-500/5"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                        {t.category.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {t.text.length}c
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-white line-clamp-1">
                      {t.title}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-2 font-mono">
                      {t.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tweet Composer */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Share2 size={12} className="text-sky-400" />
                <span>Live Tweet Composer</span>
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono ${
                    tweetText.length > 280
                      ? "text-rose-400 font-bold"
                      : tweetText.length > 250
                      ? "text-amber-400"
                      : "text-slate-500"
                  }`}
                >
                  {tweetText.length}/280 characters
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <textarea
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="Share a build milestone, tech insight, or open-source release directly to X..."
                rows={4}
                maxLength={300}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:border-sky-400 focus:outline-none resize-none font-mono leading-relaxed"
              />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <p className="text-[11px] font-mono text-slate-500">
                  {twitterData?.hasUserTokens ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck size={12} />
                      Connected to @Sam_CodeAI. Dispatches in real-time.
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Key size={12} />
                      Click &apos;Connect with X&apos; above to authorize 1-click posting.
                    </span>
                  )}
                </p>

                <button
                  type="button"
                  onClick={handlePostTweet}
                  disabled={!tweetText.trim() || isPostingTweet || tweetText.length > 280}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 disabled:bg-white/10 text-slate-950 disabled:text-slate-500 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed min-h-[44px] shadow-md shadow-white/10"
                >
                  <Send size={13} className={isPostingTweet ? "animate-pulse" : ""} />
                  <span>{isPostingTweet ? "Publishing to X..." : "Broadcast to @Sam_CodeAI"}</span>
                </button>
              </div>
            </div>
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

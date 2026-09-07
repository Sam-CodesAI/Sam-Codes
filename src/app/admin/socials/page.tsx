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
  MessageSquare,
  Flame,
  Award,
  Settings,
  Link2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { useToast } from "@/components/admin/ToastProvider";
import { SocialLink } from "@/data/socials";

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

interface LinkedInProfileInfo {
  connected: boolean;
  name: string;
  email?: string;
  picture?: string;
  personUrn: string;
  profileUrl: string;
  expiresInDays?: number;
}

interface LinkedInPostTemplate {
  id: string;
  category: "ENGINEERING_INSIGHT" | "OPEN_SOURCE" | "BUILD_IN_PUBLIC" | "CASE_STUDY";
  title: string;
  text: string;
}

interface LinkedInStatusData {
  success: boolean;
  hasCredentials: boolean;
  clientId?: string;
  connected: boolean;
  profile?: LinkedInProfileInfo;
  authUrl?: string | null;
  redirectUri?: string;
  templates?: LinkedInPostTemplate[];
  error?: string;
}

interface RedditAccountInfo {
  connected: boolean;
  username: string;
  displayName?: string;
  totalKarma: number;
  linkKarma: number;
  commentKarma: number;
  inboxCount: number;
  createdUtc: number;
  iconImg?: string;
  profileUrl: string;
}

interface RedditPostSummary {
  id: string;
  title: string;
  subreddit: string;
  score: number;
  numComments: number;
  permalink: string;
  url: string;
  createdUtc: number;
}

interface RedditPostTemplate {
  id: string;
  targetSubreddit: string;
  title: string;
  body: string;
}

interface RedditStatusData {
  success: boolean;
  connected: boolean;
  account?: RedditAccountInfo;
  recentPosts?: RedditPostSummary[];
  templates?: RedditPostTemplate[];
  error?: string;
}

const POPULAR_SUBREDDITS = [
  "TelegramBots",
  "buildinpublic",
  "webdev",
  "Next_JS",
  "SaaS",
  "sam_codeai_manage_dev",
];

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

  // Reddit Personal Account Studio State
  const [redditData, setRedditData] = useState<RedditStatusData | null>(null);
  const [isLoadingReddit, setIsLoadingReddit] = useState(false);
  const [redditSubreddit, setRedditSubreddit] = useState("TelegramBots");
  const [redditTitle, setRedditTitle] = useState("");
  const [redditBody, setRedditBody] = useState("");
  const [isPostingReddit, setIsPostingReddit] = useState(false);
  const [publishedRedditUrl, setPublishedRedditUrl] = useState<string | null>(null);
  const [activeRedditTemplateId, setActiveRedditTemplateId] = useState<string | null>(null);

  // LinkedIn Personal Account Studio State
  const [linkedInData, setLinkedInData] = useState<LinkedInStatusData | null>(null);
  const [isLoadingLinkedIn, setIsLoadingLinkedIn] = useState(false);
  const [linkedInText, setLinkedInText] = useState("");
  const [linkedInArticleUrl, setLinkedInArticleUrl] = useState("");
  const [isPostingLinkedIn, setIsPostingLinkedIn] = useState(false);
  const [publishedLinkedInUrl, setPublishedLinkedInUrl] = useState<string | null>(null);
  const [activeLinkedInTemplateId, setActiveLinkedInTemplateId] = useState<string | null>(null);

  // App Credentials Setup Drawer State
  const [showLinkedInConfig, setShowLinkedInConfig] = useState(false);
  const [inputLinkedInClientId, setInputLinkedInClientId] = useState("");
  const [inputLinkedInClientSecret, setInputLinkedInClientSecret] = useState("");
  const [isSavingLinkedInCreds, setIsSavingLinkedInCreds] = useState(false);

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

  const fetchRedditStatus = async () => {
    try {
      setIsLoadingReddit(true);
      const res = await fetch("/api/admin/reddit");
      if (res.ok) {
        const data: RedditStatusData = await res.json();
        setRedditData(data);
      }
    } catch {
      // Non-blocking
    } finally {
      setIsLoadingReddit(false);
    }
  };

  const fetchLinkedInStatus = async () => {
    try {
      setIsLoadingLinkedIn(true);
      const res = await fetch("/api/admin/linkedin");
      if (res.ok) {
        const data: LinkedInStatusData = await res.json();
        setLinkedInData(data);
      }
    } catch {
      // Non-blocking
    } finally {
      setIsLoadingLinkedIn(false);
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
    fetchRedditStatus();
    fetchLinkedInStatus();

    // Check query params for OAuth return
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const twitterAuth = urlParams.get("twitter_auth");
      const twitterError = urlParams.get("twitter_error");
      const twitterCode = urlParams.get("twitter_code");

      const linkedInAuth = urlParams.get("linkedin_auth");
      const linkedInError = urlParams.get("linkedin_error");

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

      if (linkedInAuth === "success") {
        showToast("Connected to LinkedIn successfully!", "success");
        window.history.replaceState({}, document.title, window.location.pathname);
        fetchLinkedInStatus();
      } else if (linkedInError) {
        showToast(`LinkedIn Auth Error: ${decodeURIComponent(linkedInError)}`, "error");
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

  const handleSelectRedditTemplate = (template: RedditPostTemplate) => {
    setRedditSubreddit(template.targetSubreddit);
    setRedditTitle(template.title);
    setRedditBody(template.body);
    setActiveRedditTemplateId(template.id);
    setPublishedRedditUrl(null);
    showToast(`Loaded template: ${template.title.slice(0, 32)}...`, "info");
  };

  const handlePostReddit = async () => {
    if (!redditTitle.trim() || !redditBody.trim() || !redditSubreddit.trim() || isPostingReddit) return;
    setIsPostingReddit(true);
    setPublishedRedditUrl(null);

    try {
      const cleanSub = redditSubreddit.replace(/^r\//, "").trim();
      const res = await fetch("/api/admin/reddit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_post",
          subreddit: cleanSub,
          title: redditTitle.trim(),
          text: redditBody.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Post published to r/${cleanSub}!`, "success");
        setPublishedRedditUrl(data.url || `https://reddit.com/r/${cleanSub}`);
        setRedditTitle("");
        setRedditBody("");
        setActiveRedditTemplateId(null);
        await fetchRedditStatus();
      } else {
        showToast(data.error || "Failed to submit post to Reddit", "error");
      }
    } catch {
      showToast("Network error while submitting to Reddit", "error");
    } finally {
      setIsPostingReddit(false);
    }
  };

  const handleSaveLinkedInCredentials = async () => {
    if (!inputLinkedInClientId.trim() || !inputLinkedInClientSecret.trim()) {
      showToast("Please enter both Client ID and Client Secret", "error");
      return;
    }
    setIsSavingLinkedInCreds(true);
    try {
      const res = await fetch("/api/admin/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_credentials",
          clientId: inputLinkedInClientId.trim(),
          clientSecret: inputLinkedInClientSecret.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("LinkedIn App credentials saved!", "success");
        setShowLinkedInConfig(false);
        setInputLinkedInClientId("");
        setInputLinkedInClientSecret("");
        await fetchLinkedInStatus();
      } else {
        showToast(data.error || "Failed to save credentials", "error");
      }
    } catch {
      showToast("Network error saving credentials", "error");
    } finally {
      setIsSavingLinkedInCreds(false);
    }
  };

  const handleSelectLinkedInTemplate = (template: LinkedInPostTemplate) => {
    setLinkedInText(template.text);
    setActiveLinkedInTemplateId(template.id);
    setPublishedLinkedInUrl(null);
    showToast(`Loaded: ${template.title.slice(0, 32)}...`, "info");
  };

  const handlePostLinkedIn = async () => {
    if (!linkedInText.trim() || isPostingLinkedIn) return;
    setIsPostingLinkedIn(true);
    setPublishedLinkedInUrl(null);

    try {
      const res = await fetch("/api/admin/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_post",
          text: linkedInText.trim(),
          url: linkedInArticleUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Post published successfully to LinkedIn!", "success");
        setPublishedLinkedInUrl(data.postUrl || "https://www.linkedin.com/feed/");
        setLinkedInText("");
        setLinkedInArticleUrl("");
        setActiveLinkedInTemplateId(null);
        await fetchLinkedInStatus();
      } else {
        showToast(data.error || "Failed to publish to LinkedIn", "error");
      }
    } catch {
      showToast("Network error while publishing to LinkedIn", "error");
    } finally {
      setIsPostingLinkedIn(false);
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

        {/* Reddit Personal Account Studio (Sam_CodeAI) */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm space-y-6">
          {/* Bridge Status Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF4500]/10 border border-[#FF4500]/30 flex items-center justify-center font-bold text-[#FF4500] text-base shadow-inner shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    Reddit Personal Account Studio
                  </h3>
                  {redditData?.connected ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono flex items-center gap-1">
                      <ShieldCheck size={11} />
                      <span>Connected • Live API Active</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[10px] font-mono flex items-center gap-1">
                      <RefreshCw size={11} className={isLoadingReddit ? "animate-spin" : ""} />
                      <span>Connecting Account...</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-400 mt-1">
                  <span>
                    Display Name:{" "}
                    <strong className="text-white font-semibold">
                      {redditData?.account?.displayName || "Sam_CodeAI"}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Handle:{" "}
                    <a
                      href={redditData?.account?.profileUrl || "https://www.reddit.com/user/SamarthBuilds_"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#FF4500] hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>u/{redditData?.account?.username || "SamarthBuilds_"}</span>
                      <ExternalLink size={10} />
                    </a>
                  </span>
                  <span>•</span>
                  <span className="text-slate-300">
                    Total Karma: <strong className="text-white">{redditData?.account?.totalKarma ?? 1}</strong>
                  </span>
                  <span>•</span>
                  <span>Post: {redditData?.account?.linkKarma ?? 1}</span>
                  <span>•</span>
                  <span>Comment: {redditData?.account?.commentKarma ?? 0}</span>
                  {redditData?.account?.inboxCount !== undefined && redditData.account.inboxCount > 0 && (
                    <>
                      <span>•</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#FF4500]/20 text-[#FF4500] font-bold text-[10px]">
                        {redditData.account.inboxCount} unread
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Refresh Sync Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchRedditStatus}
                disabled={isLoadingReddit}
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono text-xs border border-white/[0.08] transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5"
                title="Refresh Reddit Account Data"
              >
                <RefreshCw size={13} className={isLoadingReddit ? "animate-spin" : ""} />
                <span>Refresh Sync</span>
              </button>
            </div>
          </div>

          {/* Subreddit Quick Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame size={12} className="text-[#FF4500]" />
                <span>Target Subreddit</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Select a developer community or enter a custom one
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {POPULAR_SUBREDDITS.map((sub) => {
                const isSelected = redditSubreddit === sub;
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setRedditSubreddit(sub)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#FF4500] text-white font-bold shadow-md shadow-[#FF4500]/20"
                        : "bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] border border-white/[0.06]"
                    }`}
                  >
                    <span>r/{sub}</span>
                  </button>
                );
              })}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] min-h-[44px]">
                <span className="text-xs font-mono text-slate-500">r/</span>
                <input
                  type="text"
                  value={redditSubreddit}
                  onChange={(e) => setRedditSubreddit(e.target.value.replace(/^r\//, ""))}
                  placeholder="custom_subreddit"
                  className="w-36 bg-transparent text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Presets / Templates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#FF4500]" />
                <span>Developer Discussion Presets (Sam_CodeAI)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Click to load title, body, and target subreddit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(redditData?.templates || []).map((t) => {
                const isSelected = activeRedditTemplateId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectRedditTemplate(t)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? "bg-[#FF4500]/10 border-[#FF4500]/40 shadow-md shadow-[#FF4500]/5"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#FF4500] uppercase tracking-wider">
                        r/{t.targetSubreddit}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {t.body.length} chars
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-white line-clamp-2">
                      {t.title}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-2 font-mono">
                      {t.body}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post Composer */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <MessageSquare size={12} className="text-[#FF4500]" />
                <span>Post Composer (Markdown Formatted)</span>
              </label>
              <span
                className={`text-[10px] font-mono ${
                  redditTitle.length > 300
                    ? "text-rose-400 font-bold"
                    : "text-slate-500"
                }`}
              >
                Title: {redditTitle.length}/300 chars
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={redditTitle}
                onChange={(e) => setRedditTitle(e.target.value)}
                placeholder="Post title (e.g. Built an open-source edge Telegram lead qualifier in TypeScript)"
                maxLength={300}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:border-[#FF4500] focus:outline-none font-mono"
              />

              <textarea
                value={redditBody}
                onChange={(e) => setRedditBody(e.target.value)}
                placeholder="Write markdown post content (headers, bullet points, code blocks, links)..."
                rows={7}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:border-[#FF4500] focus:outline-none resize-none font-mono leading-relaxed"
              />

              {/* Live Reddit Success Banner */}
              {publishedRedditUrl && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-300 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Post successfully submitted to <strong>r/{redditSubreddit}</strong>!</span>
                  </div>
                  <a
                    href={publishedRedditUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-bold flex items-center gap-1 shrink-0 min-h-[36px]"
                  >
                    <span>View on Reddit</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <p className="text-[11px] font-mono text-slate-500">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck size={12} />
                    Submits under {redditData?.account?.displayName || "Sam_CodeAI"} (u/{redditData?.account?.username || "SamarthBuilds_"}) with auto-refreshed token.
                  </span>
                </p>

                <button
                  type="button"
                  onClick={handlePostReddit}
                  disabled={!redditTitle.trim() || !redditBody.trim() || !redditSubreddit.trim() || isPostingReddit || redditTitle.length > 300}
                  className="px-6 py-2.5 rounded-xl bg-[#FF4500] hover:bg-[#FF5722] disabled:bg-white/10 text-white disabled:text-slate-500 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed min-h-[44px] shadow-md shadow-[#FF4500]/20"
                >
                  <Send size={13} className={isPostingReddit ? "animate-pulse" : ""} />
                  <span>{isPostingReddit ? "Submitting to Reddit..." : `Broadcast to r/${redditSubreddit || "..."}`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Submissions Feed */}
          {redditData?.recentPosts && redditData.recentPosts.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Award size={12} className="text-[#FF4500]" />
                  <span>Recent Submissions (Sam_CodeAI)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Live from Reddit API
                </span>
              </div>

              <div className="space-y-2">
                {redditData.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#FF4500]">
                          r/{post.subreddit}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Score: {post.score} • {post.numComments} comments
                        </span>
                      </div>
                      <p className="text-xs font-medium text-white truncate mt-0.5">
                        {post.title}
                      </p>
                    </div>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white shrink-0 min-h-[44px] flex items-center justify-center"
                      title="Open submission"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LinkedIn Personal Account Studio (Samarth Nimangre) */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm space-y-6">
          {/* Bridge Status Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 flex items-center justify-center font-bold text-[#0A66C2] text-base shadow-inner shrink-0">
                <LinkedinIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    LinkedIn Personal Account Studio
                  </h3>
                  {linkedInData?.connected ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono flex items-center gap-1">
                      <ShieldCheck size={11} />
                      <span>Connected • Live Profile Active</span>
                    </span>
                  ) : linkedInData?.hasCredentials ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[10px] font-mono flex items-center gap-1">
                      <Key size={11} />
                      <span>App Configured · Click Connect</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[10px] font-mono flex items-center gap-1">
                      <Settings size={11} />
                      <span>Setup Required · Configure App Keys</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-400 mt-1">
                  <span>
                    Member:{" "}
                    <a
                      href="https://www.linkedin.com/in/samarth-nimangre-0a3b02421/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0A66C2] hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>{linkedInData?.profile?.name || "Samarth Nimangre"}</span>
                      <ExternalLink size={10} />
                    </a>
                  </span>
                  <span>•</span>
                  <span>Professional Network Feed</span>
                  {linkedInData?.profile?.expiresInDays !== undefined && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock size={11} />
                        Token: {linkedInData.profile.expiresInDays}d remaining
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {linkedInData?.authUrl ? (
                <a
                  href={linkedInData.authUrl}
                  className="px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-[#0A66C2]/20 transition-all cursor-pointer min-h-[44px]"
                >
                  <Zap size={14} />
                  <span>{linkedInData.connected ? "Reconnect Account" : "Connect with LinkedIn"}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLinkedInConfig(true)}
                  className="px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-[#0A66C2]/20 transition-all cursor-pointer min-h-[44px]"
                >
                  <Key size={14} />
                  <span>Configure App Keys</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowLinkedInConfig(!showLinkedInConfig)}
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono text-xs border border-white/[0.08] transition-all cursor-pointer min-h-[44px]"
                title="Configure LinkedIn Developer App credentials"
              >
                <Settings size={14} />
              </button>

              <button
                type="button"
                onClick={fetchLinkedInStatus}
                disabled={isLoadingLinkedIn}
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono text-xs border border-white/[0.08] transition-all cursor-pointer min-h-[44px]"
                title="Refresh sync status"
              >
                <RefreshCw size={13} className={isLoadingLinkedIn ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Credentials Setup Drawer */}
          {(showLinkedInConfig || !linkedInData?.hasCredentials) && (
            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.1] space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0A66C2] flex items-center gap-1.5">
                  <Key size={13} />
                  <span>LinkedIn Developer App Credentials</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Required for OAuth 2.0 &amp; UGC Post API
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-slate-300 space-y-2 leading-relaxed">
                <p className="text-white font-semibold">How to connect LinkedIn in 60 seconds:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>
                    Visit{" "}
                    <a
                      href="https://www.linkedin.com/developers/apps"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0A66C2] hover:underline font-bold inline-flex items-center gap-0.5"
                    >
                      <span>LinkedIn Developer Portal</span>
                      <ExternalLink size={10} />
                    </a>{" "}
                    and create or select your App.
                  </li>
                  <li>
                    Under the <strong>Products</strong> tab, enable <strong>&apos;Sign In with LinkedIn using OpenID Connect&apos;</strong> and <strong>&apos;Share on LinkedIn&apos;</strong>.
                  </li>
                  <li>
                    Under the <strong>Auth</strong> tab, add this <strong>Authorized redirect URL</strong>:
                    <div className="mt-1 p-2 rounded bg-black/60 text-sky-400 select-all break-all border border-white/[0.06]">
                      {linkedInData?.redirectUri || "https://sam-codes.vercel.app/api/admin/linkedin/callback"}
                    </div>
                  </li>
                  <li>Paste your <strong>Client ID</strong> and <strong>Client Secret</strong> below to connect your profile:</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={inputLinkedInClientId}
                    onChange={(e) => setInputLinkedInClientId(e.target.value)}
                    placeholder="e.g. 78xxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-600 focus:border-[#0A66C2] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={inputLinkedInClientSecret}
                    onChange={(e) => setInputLinkedInClientSecret(e.target.value)}
                    placeholder="e.g. WPL_AP1.xxxxxxxx..."
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-600 focus:border-[#0A66C2] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                {linkedInData?.hasCredentials && (
                  <button
                    type="button"
                    onClick={() => setShowLinkedInConfig(false)}
                    className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 font-mono text-xs cursor-pointer min-h-[44px]"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveLinkedInCredentials}
                  disabled={!inputLinkedInClientId.trim() || !inputLinkedInClientSecret.trim() || isSavingLinkedInCreds}
                  className="px-5 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#004182] disabled:bg-white/10 text-white disabled:text-slate-500 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed min-h-[44px]"
                >
                  <RefreshCw size={13} className={isSavingLinkedInCreds ? "animate-spin" : ""} />
                  <span>{isSavingLinkedInCreds ? "Saving..." : "Save App Credentials"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Live LinkedIn Success Banner */}
          {publishedLinkedInUrl && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-300 text-xs font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Post published successfully to <strong>LinkedIn</strong>!</span>
              </div>
              <a
                href={publishedLinkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-bold flex items-center gap-1 shrink-0 min-h-[36px]"
              >
                <span>View on LinkedIn</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Discussion Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#0A66C2]" />
                <span>Professional Discussion Presets (LinkedIn)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Click to load into composer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(linkedInData?.templates || []).map((t) => {
                const isSelected = activeLinkedInTemplateId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectLinkedInTemplate(t)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? "bg-[#0A66C2]/10 border-[#0A66C2]/40 shadow-md shadow-[#0A66C2]/5"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#0A66C2] uppercase tracking-wider">
                        {t.category.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {t.text.length} chars
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-white line-clamp-2">
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

          {/* Post Composer */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <MessageSquare size={12} className="text-[#0A66C2]" />
                <span>LinkedIn Post Composer</span>
              </label>
              <span
                className={`text-[10px] font-mono ${
                  linkedInText.length > 3000
                    ? "text-rose-400 font-bold"
                    : "text-slate-500"
                }`}
              >
                {linkedInText.length}/3000 chars
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <textarea
                value={linkedInText}
                onChange={(e) => setLinkedInText(e.target.value)}
                placeholder="Share technical insights, engineering decisions, open-source milestones, or architectural deep dives..."
                rows={7}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:border-[#0A66C2] focus:outline-none resize-none font-mono leading-relaxed"
              />

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08]">
                <Link2 size={13} className="text-[#0A66C2] shrink-0" />
                <input
                  type="url"
                  value={linkedInArticleUrl}
                  onChange={(e) => setLinkedInArticleUrl(e.target.value)}
                  placeholder="Attach URL (e.g. https://github.com/Sam-CodesAI/teleflow-agent or https://sam-codes.vercel.app)"
                  className="flex-1 bg-transparent text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <p className="text-[11px] font-mono text-slate-500">
                  {linkedInData?.connected ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck size={12} />
                      Posting to {linkedInData.profile?.name || "Samarth Nimangre"}&apos;s profile feed.
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Key size={12} />
                      Connect your LinkedIn account above to enable 1-click publishing.
                    </span>
                  )}
                </p>

                <button
                  type="button"
                  onClick={handlePostLinkedIn}
                  disabled={!linkedInText.trim() || isPostingLinkedIn || !linkedInData?.connected || linkedInText.length > 3000}
                  className="px-6 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] disabled:bg-white/10 text-white disabled:text-slate-500 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed min-h-[44px] shadow-md shadow-[#0A66C2]/20"
                >
                  <Send size={13} className={isPostingLinkedIn ? "animate-pulse" : ""} />
                  <span>{isPostingLinkedIn ? "Publishing to LinkedIn..." : "Broadcast to LinkedIn"}</span>
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

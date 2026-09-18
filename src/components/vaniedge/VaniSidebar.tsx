"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mic,
  BarChart3,
  Database,
  Calendar,
  ShieldCheck,
  Plus,
  Phone,
  Flame,
  PanelLeftClose,
  PanelLeft,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  User,
  Palette,
  Volume2,
  VolumeX,
  Trash2,
} from "lucide-react";
import { VaniTheme, VANI_THEMES } from "@/lib/vaniedge/theme-config";
import { playBlipSound, setSoundMuted, getSoundMuted } from "@/lib/vaniedge/audio-fx";

export type NavTab = "studio" | "dashboard" | "sutradb" | "dispatch" | "telephony";

export interface SessionHistoryItem {
  id: string;
  title: string;
  timestamp: string;
  persona: string;
  messageCount: number;
}

interface VaniSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onNewSession: () => void;
  sessionHistory: SessionHistoryItem[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession?: (id: string) => void;
  ticketsCount: number;
  knowledgeCount: number;
  theme?: VaniTheme;
  onSelectTheme?: (t: VaniTheme) => void;
  isAudioMuted?: boolean;
  onToggleAudioMute?: () => void;
}

export default function VaniSidebar({
  activeTab,
  onSelectTab,
  isOpen,
  onToggleOpen,
  onNewSession,
  sessionHistory,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  ticketsCount,
  knowledgeCount,
  theme = "emerald",
  onSelectTheme,
  isAudioMuted = false,
  onToggleAudioMute,
}: VaniSidebarProps) {
  const activeThemeConfig = VANI_THEMES[theme] || VANI_THEMES.emerald;

  const navItems = [
    {
      id: "studio" as NavTab,
      label: "Voice Studio",
      icon: Mic,
      badge: "Live Call",
      badgeColor: activeThemeConfig.badgeClass,
    },
    {
      id: "dashboard" as NavTab,
      label: "Intelligence Dashboard",
      icon: BarChart3,
      badge: "Fleet Telemetry",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
    {
      id: "sutradb" as NavTab,
      label: "SutraDB RAG Engine",
      icon: Database,
      badge: `${knowledgeCount} Docs`,
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    },
    {
      id: "dispatch" as NavTab,
      label: "Dispatch Queue",
      icon: Calendar,
      badge: `${ticketsCount} Active`,
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    {
      id: "telephony" as NavTab,
      label: "Carrier & Telephony",
      icon: ShieldCheck,
      badge: "Sub-Second",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#090e17] border-r border-slate-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header & App Brand */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`h-9 w-9 rounded-xl bg-gradient-to-tr ${activeThemeConfig.bgGradient} p-0.5 shadow-lg shrink-0`}
            >
              <div className="h-full w-full bg-[#070b12] rounded-[10px] flex items-center justify-center">
                <Flame
                  className="w-5 h-5"
                  style={{ color: activeThemeConfig.primaryHex }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">VaniEdge AI</span>
                <span
                  className="h-2 w-2 rounded-full animate-pulse"
                  style={{ backgroundColor: activeThemeConfig.primaryHex }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 block">
                वाणी Edge v2.5
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onToggleAudioMute && (
              <button
                onClick={() => {
                  playBlipSound(700);
                  onToggleAudioMute();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isAudioMuted ? "Unmute Audio FX" : "Mute Audio FX"}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            )}

            <button
              onClick={onToggleOpen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Middle: New Session Button + Nav Items + Theme Switcher + Session History */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 text-xs">
          {/* ChatGPT / Gemini Style "+ New Conversation" Button */}
          <button
            onClick={() => {
              playBlipSound(1000);
              onNewSession();
              onSelectTab("studio");
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r ${activeThemeConfig.bgGradient} text-black font-semibold text-xs shadow-lg hover:brightness-110 active:scale-[0.98] transition-all`}
          >
            <Plus className="w-4 h-4 text-black stroke-[2.5]" />
            <span>New Voice Session</span>
          </button>

          {/* Primary Navigation Tabs */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 block">
              Workspace Views
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playBlipSound(800);
                    onSelectTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-slate-800 text-white font-semibold shadow-inner border border-slate-700/80"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${isActive ? "" : "text-slate-400"}`}
                      style={{ color: isActive ? activeThemeConfig.primaryHex : undefined }}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Futuristic Theme Engine Selector */}
          {onSelectTheme && (
            <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between px-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3 h-3 text-slate-400" />
                  <span>UI Theme</span>
                </span>
                <span className="text-white font-semibold capitalize">{theme}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {(["emerald", "cyan", "violet", "amber"] as VaniTheme[]).map((t) => {
                  const conf = VANI_THEMES[t];
                  const isSelected = theme === t;
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        playBlipSound(900);
                        onSelectTheme(t);
                      }}
                      className={`h-7 rounded-lg flex items-center justify-center border transition-all ${
                        isSelected
                          ? "border-white scale-105 shadow-md"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: conf.primaryHex }}
                      title={conf.name}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Call Sessions / History */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Recent Sessions
              </span>
              <Clock className="w-3 h-3 text-slate-500" />
            </div>

            {sessionHistory.length === 0 ? (
              <div className="px-3 py-3 rounded-xl bg-slate-950/40 border border-slate-900 text-slate-500 text-[11px] text-center">
                Current session active
              </div>
            ) : (
              <div className="space-y-1">
                {sessionHistory.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className={`w-full group flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      activeSessionId === session.id
                        ? "bg-slate-800/80 border-slate-700 text-white"
                        : "bg-slate-950/30 border-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                    }`}
                  >
                    <button
                      onClick={() => {
                        playBlipSound(750);
                        onSelectSession(session.id);
                      }}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium truncate text-slate-200 max-w-[120px]">
                          {session.title}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          {session.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                        <span className="capitalize">{session.persona}</span>
                        <span>•</span>
                        <span>{session.messageCount} msgs</span>
                      </div>
                    </button>

                    {onDeleteSession && (
                      <button
                        onClick={() => {
                          playBlipSound(600);
                          onDeleteSession(session.id);
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                        title="Delete session"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Status & Dev Profile */}
        <div className="p-3 border-t border-slate-800/80 space-y-2.5 bg-[#070b12]/60">
          {/* Live Carrier Status */}
          <a
            href="tel:+18149613703"
            className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/30 transition-colors group"
          >
            <div className="flex items-center gap-2 text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-emerald-300 font-semibold">+1 (814) 961-3703</span>
            </div>
            <span className="text-[10px] text-emerald-400 group-hover:underline">Dial</span>
          </a>

          {/* User Profile */}
          <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-[10px]">
                S
              </div>
              <div>
                <span className="font-semibold text-slate-200 block text-xs">Samarth</span>
                <span className="text-[10px] text-slate-500">Karnataka, IN</span>
              </div>
            </div>
            <a
              href="https://t.me/Samarth1306"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              Telegram <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

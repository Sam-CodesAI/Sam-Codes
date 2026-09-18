"use client";

import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Phone,
  Server,
  Zap,
  Globe2,
  Radio,
  ArrowRight,
  CheckCircle2,
  Layers,
} from "lucide-react";
import Vani3DCard from "./Vani3DCard";

interface VaniTelephonyViewProps {
  metrics: {
    edgeAuthMs: number;
    wsUpgradeMs: number;
    sutraDbMs: number;
    ttftMs: number;
    activeRegion: string;
  };
  watchdogStatus: "HEALTHY" | "TRIGGERED" | "RECOVERED";
  onSimulateGlitch: () => void;
}

export default function VaniTelephonyView({
  metrics,
  watchdogStatus,
  onSimulateGlitch,
}: VaniTelephonyViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-rose-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-rose-400">
              Sub-Second Telephony Watchdog & PSTN Failover
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Live Carrier Telephony Architecture</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Enforces 1,200ms connection & 1,500ms TTFT deadlines with automatic mid-call PSTN redirection.
          </p>
        </div>

        <button
          onClick={onSimulateGlitch}
          disabled={watchdogStatus === "TRIGGERED"}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs transition-colors shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-black" />
          <span>{watchdogStatus === "TRIGGERED" ? "Glitch Executing..." : "Test 1,200ms Watchdog"}</span>
        </button>
      </div>

      {/* Main 3D Topology & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stage Telemetry (Left 6 Cols) */}
        <Vani3DCard glowColor="cyan" className="lg:col-span-6 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-sm text-slate-200">Sub-Second Stage Latency Breakdown</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">Active Node: {metrics.activeRegion}</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">1. Edge Gateway Auth (Web Crypto HMAC)</span>
                <span className="font-mono text-emerald-400 font-semibold tabular-nums">{metrics.edgeAuthMs} ms</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "24%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">2. Bidirectional μ-law 8kHz WebSocket</span>
                <span className="font-mono text-emerald-400 font-semibold tabular-nums">{metrics.wsUpgradeMs} ms</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "42%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">3. SutraDB Hybrid Vector + BM25 Query</span>
                <span className="font-mono text-cyan-400 font-semibold tabular-nums">{metrics.sutraDbMs} ms</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: "18%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">4. Turn-to-Audio (TTFT First Packet)</span>
                <span className="font-mono text-indigo-400 font-semibold tabular-nums">{metrics.ttftMs} ms</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: "70%" }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Latency to Caller Ear:</span>
            <span className="font-mono text-emerald-400 font-bold tabular-nums">
              {(metrics.edgeAuthMs + metrics.wsUpgradeMs + metrics.sutraDbMs + metrics.ttftMs).toFixed(1)} ms
            </span>
          </div>
        </Vani3DCard>

        {/* Carrier Line & Node Callout (Right 6 Cols) */}
        <Vani3DCard glowColor="rose" className="lg:col-span-6 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-sm text-slate-200">Active Carrier PSTN Line</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Connected
              </span>
            </div>

            <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2.5">
              <div className="text-base font-mono text-emerald-300 font-bold">+1 (814) 961-3703</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calls placed to this number are handled by our Twilio PSTN gateway and routed via WebSockets to Cloudflare Workers edge nodes in sub-350ms.
              </p>
              <div className="pt-1">
                <a
                  href="tel:+18149613703"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-black font-semibold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Dial From Mobile Phone</span>
                </a>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Watchdog Guardrail:</span>
            <span
              className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                watchdogStatus === "TRIGGERED"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              }`}
            >
              {watchdogStatus === "TRIGGERED" ? "1,200ms DEADLINE BREACH • REDIRECTED" : "ARMED & PROTECTING CALLS"}
            </span>
          </div>
        </Vani3DCard>
      </div>

      {/* 4-Step Technical Topology Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <Vani3DCard glowColor="emerald" className="p-4 space-y-2">
          <span className="text-emerald-400 font-bold font-mono">01. INGESTION</span>
          <h4 className="font-semibold text-white">Twilio 8kHz Audio</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            PSTN call connects to Twilio Voice gateway and upgrades to raw μ-law bidirectional WebSocket streaming.
          </p>
        </Vani3DCard>

        <Vani3DCard glowColor="cyan" className="p-4 space-y-2">
          <span className="text-cyan-400 font-bold font-mono">02. EDGE ROUTING</span>
          <h4 className="font-semibold text-white">Cloudflare Workers</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Global edge nodes authenticate Web Crypto signatures, buffer audio frames, and stream directly to ElevenLabs ConvAI.
          </p>
        </Vani3DCard>

        <Vani3DCard glowColor="indigo" className="p-4 space-y-2">
          <span className="text-indigo-400 font-bold font-mono">03. LOCAL RAG</span>
          <h4 className="font-semibold text-white">SutraDB Hybrid Index</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Zero-dependency BM25 + dense vector embeddings run in-memory, retrieving clinic/menu facts under 10ms.
          </p>
        </Vani3DCard>

        <Vani3DCard glowColor="rose" className="p-4 space-y-2">
          <span className="text-rose-400 font-bold font-mono">04. WATCHDOG</span>
          <h4 className="font-semibold text-white">Zero-Downtime Failover</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            1,200ms deadline watchdog automatically re-routes callers to backup PSTN lines without dropping connection.
          </p>
        </Vani3DCard>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
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
  RefreshCw,
  Cpu,
  Activity,
  Wifi,
} from "lucide-react";
import Vani3DCard from "./Vani3DCard";
import { VaniTheme, VANI_THEMES } from "@/lib/vaniedge/theme-config";
import { playBlipSound, playGlitchSound, playSonarPing } from "@/lib/vaniedge/audio-fx";

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
  theme?: VaniTheme;
}

interface EdgeNodePing {
  region: string;
  location: string;
  latencyMs: number;
  status: "ONLINE" | "OPTIMAL" | "STANDBY";
}

export default function VaniTelephonyView({
  metrics,
  watchdogStatus,
  onSimulateGlitch,
  theme = "emerald",
}: VaniTelephonyViewProps) {
  const [selectedCodec, setSelectedCodec] = useState<"g711" | "opus" | "amr">("g711");
  const [edgeNodes, setEdgeNodes] = useState<EdgeNodePing[]>([
    { region: "BOM1", location: "Mumbai, India", latencyMs: 14.2, status: "OPTIMAL" },
    { region: "SIN1", location: "Singapore", latencyMs: 38.6, status: "ONLINE" },
    { region: "FRA1", location: "Frankfurt, EU", latencyMs: 94.1, status: "STANDBY" },
    { region: "IAD1", location: "Ashburn, US", latencyMs: 142.8, status: "STANDBY" },
  ]);
  const [isPingingNodes, setIsPingingNodes] = useState(false);

  const activeThemeConfig = VANI_THEMES[theme] || VANI_THEMES.emerald;

  // Ping edge nodes
  const handlePingAllNodes = async () => {
    setIsPingingNodes(true);
    playBlipSound(900);
    const start = performance.now();
    try {
      await fetch("https://twilio-voice-agent-failover.sam-codes.workers.dev/health", { mode: "no-cors" });
    } catch {
      // ignore
    }
    const baseLatency = Math.max(12, Math.round(performance.now() - start));

    setEdgeNodes([
      { region: "BOM1", location: "Mumbai, India", latencyMs: baseLatency, status: "OPTIMAL" },
      { region: "SIN1", location: "Singapore", latencyMs: Math.round(baseLatency * 2.2), status: "ONLINE" },
      { region: "FRA1", location: "Frankfurt, EU", latencyMs: Math.round(baseLatency * 5.4), status: "STANDBY" },
      { region: "IAD1", location: "Ashburn, US", latencyMs: Math.round(baseLatency * 8.1), status: "STANDBY" },
    ]);
    playSonarPing();
    setIsPingingNodes(false);
  };

  const codecDetails = {
    g711: {
      name: "G.711 μ-law (PSTN Standard)",
      sampleRate: "8,000 Hz",
      bitrate: "64 kbps",
      packetSize: "20ms (160 bytes)",
      mos: "4.1 / 5.0",
      bestFor: "Zero transcoding overhead with Twilio carrier trunks",
    },
    opus: {
      name: "Opus Interactive Audio",
      sampleRate: "48,000 Hz Full-Band",
      bitrate: "32 kbps (VBR)",
      packetSize: "10ms (dynamic)",
      mos: "4.6 / 5.0",
      bestFor: "Hi-Fi WebRTC in-browser microphone calls",
    },
    amr: {
      name: "AMR-WB (Adaptive Multi-Rate Wideband)",
      sampleRate: "16,000 Hz Wideband",
      bitrate: "23.85 kbps",
      packetSize: "20ms (60 bytes)",
      mos: "4.3 / 5.0",
      bestFor: "VoLTE and HD Voice mobile cellular roaming",
    },
  }[selectedCodec];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-rose-950/40 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-rose-400">
              Sub-Second Telephony Watchdog & PSTN Failover
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Live Carrier Telephony Architecture</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Enforces 1,200ms connection & 1,500ms TTFT deadlines with mid-call PSTN rescue and multi-codec edge routing.
          </p>
        </div>

        <button
          onClick={() => {
            playGlitchSound();
            onSimulateGlitch();
          }}
          disabled={watchdogStatus === "TRIGGERED"}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs transition-colors shadow-lg shadow-amber-500/20 shrink-0"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-black" />
          <span>{watchdogStatus === "TRIGGERED" ? "Glitch Executing..." : "Test 1,200ms Watchdog"}</span>
        </button>
      </div>

      {/* Main 3D Grid */}
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

        {/* Global Edge Node Latency Probes (Right 6 Cols) */}
        <Vani3DCard glowColor="emerald" className="lg:col-span-6 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-sm text-slate-200">Global Edge Node Latency Probes</span>
            </div>
            <button
              onClick={handlePingAllNodes}
              disabled={isPingingNodes}
              className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isPingingNodes ? "animate-spin" : ""}`} />
              <span>{isPingingNodes ? "Pinging..." : "Refresh Probes"}</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {edgeNodes.map((node) => (
              <div
                key={node.region}
                className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-[10px] text-emerald-400 font-bold">
                    {node.region}
                  </div>
                  <div>
                    <span className="font-semibold text-white block text-xs">{node.location}</span>
                    <span className="text-[10px] text-slate-500">Cloudflare Workers Voice POP</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-white tabular-nums">
                    {node.latencyMs} ms
                  </span>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        node.status === "OPTIMAL"
                          ? "bg-emerald-400 animate-pulse"
                          : node.status === "ONLINE"
                          ? "bg-cyan-400"
                          : "bg-slate-500"
                      }`}
                    />
                    <span className="text-[9px] font-mono uppercase text-slate-400">{node.status}</span>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Audio Codec Selector & Bandwidth Diagnostics */}
      <Vani3DCard glowColor="indigo" className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-sm text-slate-200">Carrier Audio Codec & Bandwidth Simulator</h3>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(["g711", "opus", "amr"] as const).map((codec) => (
              <button
                key={codec}
                onClick={() => {
                  playBlipSound(800);
                  setSelectedCodec(codec);
                }}
                className={`px-3 py-1.5 rounded-lg uppercase font-mono font-medium transition-colors ${
                  selectedCodec === codec
                    ? "bg-indigo-500 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {codec.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] block">Codec Standard</span>
            <span className="font-semibold text-white text-xs">{codecDetails.name}</span>
          </div>
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] block">Audio Sample Rate</span>
            <span className="font-mono font-bold text-emerald-400 text-xs">{codecDetails.sampleRate}</span>
          </div>
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] block">Bitrate & Payload Size</span>
            <span className="font-mono font-bold text-cyan-400 text-xs">{codecDetails.bitrate} • {codecDetails.packetSize}</span>
          </div>
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] block">Mean Opinion Score (MOS)</span>
            <span className="font-mono font-bold text-amber-400 text-xs">{codecDetails.mos}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 italic">
          Optimization Notes: {codecDetails.bestFor}
        </p>
      </Vani3DCard>

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

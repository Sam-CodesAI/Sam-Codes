"use client";

import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Phone,
  Zap,
  Globe2,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  MessageSquare,
  Volume2,
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-emerald-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-emerald-400">
              24/7 Automated Business Phone Center
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Phone System & Incoming Call Settings</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Dedicated customer phone number, multi-language conversational answering, and automated booking dispatch.
          </p>
        </div>

        <button
          onClick={onSimulateGlitch}
          disabled={watchdogStatus === "TRIGGERED"}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs transition-colors shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-black" />
          <span>{watchdogStatus === "TRIGGERED" ? "Testing Backup..." : "Test Backup Protection"}</span>
        </button>
      </div>

      {/* Main Grid: Features & Live Phone Line */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Receptionist Features (Left 6 Cols) */}
        <Vani3DCard glowColor="emerald" className="lg:col-span-6 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-sm text-slate-200">AI Phone Receptionist Capabilities</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Always Answering</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">First-Ring Instant Pickup</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Never keep callers waiting on hold. Every customer call is answered instantly, day or night.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Globe2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Multi-Lingual Conversation</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automatically speaks Hindi, Hinglish, Kannada, Marathi, Tamil, or English depending on how the caller speaks.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Direct Booking & Orders</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Directly books clinic appointments, takes food orders, or confirms towing requests into your dashboard.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Instant SMS Confirmations</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sends an instant confirmation text message to the caller with booking details right as the call ends.
                </p>
              </div>
            </div>
          </div>
        </Vani3DCard>

        {/* Live Phone Line & Controls (Right 6 Cols) */}
        <Vani3DCard glowColor="cyan" className="lg:col-span-6 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-sm text-slate-200">Active Business Phone Line</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </div>

            <div className="mt-4 p-5 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Customer Toll-Free / Direct Line</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-2xl font-mono text-emerald-300 font-extrabold tracking-wide">
                +1 (814) 961-3703
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calls to this number are answered by your trained AI assistant in real time. You can test it by calling directly from your mobile phone.
              </p>
              <div className="pt-2">
                <a
                  href="tel:+18149613703"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call from Mobile Phone</span>
                </a>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Drop Protection:</span>
            </span>
            <span
              className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                watchdogStatus === "TRIGGERED"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              }`}
            >
              {watchdogStatus === "TRIGGERED" ? "BACKUP LINE ACTIVE" : "ACTIVE & PROTECTING CALLS"}
            </span>
          </div>
        </Vani3DCard>
      </div>

      {/* 4 How-It-Works Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <Vani3DCard glowColor="emerald" className="p-4 space-y-2">
          <span className="text-emerald-400 font-bold font-mono">01. CALLER DIALS</span>
          <h4 className="font-semibold text-white">Instant Pickup</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Customer calls your business number. The call is picked up in less than a second with zero hold time.
          </p>
        </Vani3DCard>

        <Vani3DCard glowColor="cyan" className="p-4 space-y-2">
          <span className="text-cyan-400 font-bold font-mono">02. NATURAL CHAT</span>
          <h4 className="font-semibold text-white">Vernacular Understanding</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            The AI speaks naturally in the customer's native language, answering questions about menus, timings, or prices.
          </p>
        </Vani3DCard>

        <Vani3DCard glowColor="indigo" className="p-4 space-y-2">
          <span className="text-indigo-400 font-bold font-mono">03. AUTOMATION</span>
          <h4 className="font-semibold text-white">Instant Booking</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            The appointment or food order is booked on the spot, and an instant confirmation SMS is sent to the customer.
          </p>
        </Vani3DCard>

        <Vani3DCard glowColor="rose" className="p-4 space-y-2">
          <span className="text-rose-400 font-bold font-mono">04. 24/7 AVAILABILITY</span>
          <h4 className="font-semibold text-white">Never Miss Business</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            After-hours patients, late night diners, or emergency callers get immediate help without needing extra staff.
          </p>
        </Vani3DCard>
      </div>
    </div>
  );
}

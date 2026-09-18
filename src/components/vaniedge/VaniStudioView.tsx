"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Send,
  Bot,
  User,
  Sparkles,
  Settings,
  ChevronDown,
  Sliders,
  Loader2,
  ArrowRight,
} from "lucide-react";
import VaniVoiceOrb3D from "./VaniVoiceOrb3D";
import Vani3DCard from "./Vani3DCard";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  latencyMs?: number;
  matchedDoc?: string;
  audioUrl?: string;
}

interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
  speechLocale: string;
}

interface VoiceOption {
  id: string;
  name: string;
  desc: string;
  voiceId: string;
}

interface VaniStudioViewProps {
  isCalling: boolean;
  isConnecting?: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  callDuration: number;
  formatDuration: (s: number) => string;
  transcript: Message[];
  customQuery: string;
  setCustomQuery: (q: string) => void;
  isProcessing: boolean;
  onSend: (override?: string) => void;
  onToggleCall: () => void;
  onToggleMic: () => void;
  onReplayAudio: (text: string) => void;
  selectedPersona: "clinic" | "restaurant" | "auto";
  onSelectPersona: (p: "clinic" | "restaurant" | "auto") => void;
  selectedLanguage: string;
  onSelectLanguage: (l: string) => void;
  languages: LanguageOption[];
  speechEngine?: "elevenlabs" | "browser";
  onSelectSpeechEngine?: (e: "elevenlabs" | "browser") => void;
  selectedVoice?: string;
  onSelectVoice?: (v: string) => void;
  elevenVoices?: VoiceOption[];
  browserVoices?: SpeechSynthesisVoice[];
  speechRate?: number;
  onSelectSpeechRate?: (r: number) => void;
  speechPitch?: number;
  onSelectSpeechPitch?: (p: number) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  activeRegion?: string;
}

export default function VaniStudioView({
  isCalling,
  isConnecting = false,
  isListening,
  isSpeaking,
  callDuration,
  formatDuration,
  transcript,
  customQuery,
  setCustomQuery,
  isProcessing,
  onSend,
  onToggleCall,
  onToggleMic,
  onReplayAudio,
  selectedPersona,
  onSelectPersona,
  speechEngine = "elevenlabs",
  onSelectSpeechEngine,
  selectedVoice = "sarah",
  onSelectVoice,
  elevenVoices = [],
  browserVoices = [],
  speechRate = 1.05,
  onSelectSpeechRate,
  speechPitch = 1.0,
  onSelectSpeechPitch,
  activeRegion,
}: VaniStudioViewProps) {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [flashBadge, setFlashBadge] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Smooth auto-scroll to bottom of transcript as new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Context Switch Handler with Micro-Badge Animation
  const handleSwitchPersona = (p: "clinic" | "restaurant" | "auto") => {
    onSelectPersona(p);
    setFlashBadge(true);
    setTimeout(() => {
      setFlashBadge(false);
    }, 2400);
  };

  // Clickable prompt pills trimmed for instant action above the input
  const samplePrompts = {
    clinic: [
      { label: "Clinic Hours?", query: "What are Dr. Sharma's clinic hours?" },
      { label: "Book 10 AM", query: "Book an appointment for Rahul tomorrow at 10 AM" },
      { label: "Consultation Fee?", query: "What is the consultation fee?" },
    ],
    restaurant: [
      { label: "Today's Special?", query: "What is today's Bhojanalaya special?" },
      { label: "Order 2 Thalis", query: "Order 2 Special Thalis to Indiranagar" },
      { label: "Delivery Time?", query: "What is the delivery turnaround time?" },
    ],
    auto: [
      { label: "Highway Puncture", query: "I have a highway tyre puncture at Mile 44" },
      { label: "Towing Rate?", query: "What is the emergency towing rate?" },
      { label: "Dispatch Rescue", query: "Dispatch roadside rescue team immediately" },
    ],
  }[selectedPersona] || [
    { label: "Business Hours?", query: "What are your business hours?" },
    { label: "Book Appointment", query: "Can I schedule an appointment?" },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Hero Header - Clean hierarchy with no redundant double badge */}
      <div className="text-center space-y-1.5 max-w-2xl mx-auto pt-1">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          AI Voice Assistant <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">for Local Businesses</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Experience natural voice conversations in 3 clear steps: pick a business type, speak or call, and inspect the real-time transcript.
        </p>
      </div>

      {/* USER JOURNEY STEP 1: Pick a Business Type (Full Width Top) */}
      <Vani3DCard glowColor="emerald" className="p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500 text-black font-extrabold text-xs shadow-md shadow-emerald-500/30">
              1
            </span>
            <div>
              <span className="font-bold text-sm text-white block">Step 1: Pick a Business Type</span>
              <span className="text-[11px] text-slate-400">
                Preset automatically sets voice persona, pitch, and speed behind the scenes
              </span>
            </div>
          </div>

          {/* Micro-badge feedback when switching presets */}
          <div>
            {flashBadge ? (
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/50 shadow-sm shadow-emerald-500/30 animate-pulse flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Persona & Pitch Loaded</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono text-emerald-400/80 hidden sm:inline">
                Auto-tuning active
              </span>
            )}
          </div>
        </div>

        {/* 3 Interactive Business Presets with clear unselected interactive affordance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Clinic Preset */}
          <button
            type="button"
            onClick={() => handleSwitchPersona("clinic")}
            className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer relative ${
              selectedPersona === "clinic"
                ? "bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50"
                : "bg-slate-950/60 border-slate-800/80 hover:border-zinc-700 hover:bg-zinc-900/50 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🏥</span>
              {selectedPersona === "clinic" && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">
                  Active
                </span>
              )}
            </div>
            <div className="font-semibold text-xs text-white mt-2">Dr. Sharma Clinic</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Healthcare Appointments & Consultation</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-2 flex items-center gap-1.5">
              <Volume2 className="w-3 h-3" />
              <span>Voice: Sarah (Auto-Tuned 1.0x)</span>
            </div>
          </button>

          {/* Restaurant Preset */}
          <button
            type="button"
            onClick={() => handleSwitchPersona("restaurant")}
            className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer relative ${
              selectedPersona === "restaurant"
                ? "bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50"
                : "bg-slate-950/60 border-slate-800/80 hover:border-zinc-700 hover:bg-zinc-900/50 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🍲</span>
              {selectedPersona === "restaurant" && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40">
                  Active
                </span>
              )}
            </div>
            <div className="font-semibold text-xs text-white mt-2">Bhojanalaya Kitchen</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Food Menu & Home Delivery Orders</div>
            <div className="text-[10px] text-cyan-400 font-mono mt-2 flex items-center gap-1.5">
              <Volume2 className="w-3 h-3" />
              <span>Voice: Bella (Auto-Tuned 1.05x)</span>
            </div>
          </button>

          {/* Roadside Rescue Preset */}
          <button
            type="button"
            onClick={() => handleSwitchPersona("auto")}
            className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer relative ${
              selectedPersona === "auto"
                ? "bg-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50"
                : "bg-slate-950/60 border-slate-800/80 hover:border-zinc-700 hover:bg-zinc-900/50 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🚨</span>
              {selectedPersona === "auto" && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40">
                  Active
                </span>
              )}
            </div>
            <div className="font-semibold text-xs text-white mt-2">Apex Roadside Rescue</div>
            <div className="text-[11px] text-slate-400 mt-0.5">24/7 Emergency Towing & Tyre Assistance</div>
            <div className="text-[10px] text-amber-400 font-mono mt-2 flex items-center gap-1.5">
              <Volume2 className="w-3 h-3" />
              <span>Voice: Adam (Auto-Tuned 1.1x)</span>
            </div>
          </button>
        </div>
      </Vani3DCard>

      {/* 2-COLUMN SINGLE VIEWPORT GRID: STEP 2 (Left 5 cols) & STEP 3 (Right 7 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        {/* Left 5 Cols: STEP 2: Audio Engine */}
        <div className="md:col-span-5 lg:col-span-5 flex flex-col">
          <Vani3DCard glowColor="emerald" className="p-4 sm:p-5 flex flex-col justify-between text-center space-y-2.5 h-full">
            <div className="w-full flex items-center justify-between pb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan-400 text-black font-extrabold text-xs shadow-md shadow-cyan-400/30">
                  2
                </span>
                <span className="font-bold text-sm text-white">Step 2: Click to Speak or Call</span>
              </div>

              {/* Dynamic status indicator based on live telephony state */}
              <div className="flex items-center gap-1.5 text-[11px]">
                {isConnecting ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-mono text-amber-300 font-medium">Dialing SIP...</span>
                  </>
                ) : isSpeaking ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-emerald-300 font-medium">Speaking</span>
                  </>
                ) : isListening ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-mono text-cyan-300 font-medium">Listening</span>
                  </>
                ) : isCalling ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="font-mono text-emerald-300 font-medium">Connected</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    <span className="font-mono text-slate-400">Standby</span>
                  </>
                )}
              </div>
            </div>

            {/* Interactive 3D Voice Orb - Compact and centered with reduced vertical padding */}
            <div className="flex-1 flex items-center justify-center py-2">
              <VaniVoiceOrb3D
                isSpeaking={isSpeaking}
                isListening={isListening}
                isCalling={isCalling}
              />
            </div>

            {/* Call Actions with Dynamic Feedback & Streamlined Direct Fallback */}
            <div className="w-full pt-1 space-y-2">
              <button
                type="button"
                onClick={onToggleCall}
                disabled={isConnecting}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer disabled:cursor-wait ${
                  isConnecting
                    ? "bg-amber-500 text-black shadow-amber-500/25 animate-pulse"
                    : isCalling
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25"
                    : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black shadow-emerald-500/20"
                }`}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dialing SIP Gateway...</span>
                  </>
                ) : isCalling ? (
                  <>
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call ({formatDuration(callDuration)})</span>
                    {/* Animated soundwave mini-bars */}
                    <div className="flex items-center gap-0.5 ml-1.5">
                      <span className="w-0.5 h-2.5 bg-white/90 animate-pulse" style={{ animationDuration: "0.6s" }} />
                      <span className="w-0.5 h-4 bg-white/90 animate-pulse" style={{ animationDuration: "0.8s" }} />
                      <span className="w-0.5 h-2 bg-white/90 animate-pulse" style={{ animationDuration: "0.5s" }} />
                      <span className="w-0.5 h-3.5 bg-white/90 animate-pulse" style={{ animationDuration: "0.7s" }} />
                    </div>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    <span>Connect In-Browser Call</span>
                  </>
                )}
              </button>

              {/* Subtle, single text link below button (no sprawling box) */}
              <p className="text-center text-xs text-slate-400 pt-0.5">
                Or dial direct:{" "}
                <a
                  href="tel:+18149613703"
                  className="text-emerald-400 hover:text-emerald-300 font-mono font-medium hover:underline inline-flex items-center gap-1 ml-1"
                  title="Dial direct PSTN carrier number"
                >
                  <Phone className="w-3 h-3 inline" />
                  +1 (814) 961-3703
                </a>
              </p>
            </div>
          </Vani3DCard>
        </div>

        {/* Right 7 Cols: STEP 3: Live Telephony Feed */}
        <div className="md:col-span-7 lg:col-span-7 flex flex-col">
          <Vani3DCard glowColor="indigo" className="p-4 sm:p-5 flex flex-col justify-between h-full min-h-[440px]">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-400 text-black font-extrabold text-xs shadow-md shadow-indigo-400/30">
                  3
                </span>
                <span className="font-bold text-sm text-white">Step 3: Real-Time Transcript</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                {transcript.length} Messages
              </span>
            </div>

            {/* Transcript Scroll Area - Fixed Height (320px) with Smooth Auto-Scroll */}
            <div className="h-[320px] overflow-y-auto pr-1 my-2 text-xs space-y-3 scroll-smooth">
              {transcript.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 p-3.5 rounded-xl border transition-all ${
                    msg.sender === "agent"
                      ? "bg-slate-900/90 border-slate-800 text-slate-200"
                      : "bg-emerald-950/40 border-emerald-500/30 text-emerald-200 ml-6"
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center ${
                      msg.sender === "agent" ? "bg-emerald-500/10 text-emerald-400" : "bg-cyan-500/10 text-cyan-300"
                    }`}
                  >
                    {msg.sender === "agent" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-300">
                        {msg.sender === "agent" ? "AI Voice Assistant" : "You (Caller)"}
                      </span>
                      <span className="font-mono text-slate-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{msg.text}</p>

                    {msg.sender === "agent" && (
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onReplayAudio(msg.text)}
                          className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Re-play audio synthesis"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Listen Again</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Status Indicator & Click-to-Talk Prompt Pills with High-Contrast Neon Border */}
            <div className="space-y-2.5 pt-2.5 border-t border-slate-800/80">
              {/* Live Relationship Clarifier: Voice vs Text Intent */}
              <div className="flex items-center justify-between px-1 text-[11px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                        isListening
                          ? "bg-cyan-400 opacity-75"
                          : isCalling
                          ? "bg-emerald-400 opacity-75"
                          : "bg-emerald-400 opacity-30"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        isListening ? "bg-cyan-400" : isCalling ? "bg-emerald-400" : "bg-emerald-500"
                      }`}
                    />
                  </span>
                  <span className="font-medium">
                    {isListening
                      ? "Mic active — speaking to assistant..."
                      : isCalling
                      ? "Call connected — live audio & transcription active"
                      : "Mic active (or test via text simulation)"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                  Click prompt to hear instant voice
                </span>
              </div>

              {/* Click-to-Talk Quick Prompts with High Contrast Neon Styling */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 mr-1 font-medium">Quick Prompts:</span>
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSend(p.query)}
                    disabled={isProcessing}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 hover:text-white border border-emerald-500/40 hover:border-emerald-300 shadow-sm shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all cursor-pointer font-medium active:scale-95 disabled:opacity-50 flex items-center gap-1.5 group"
                    title="Click to immediately speak this query and hear AI response"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Input Form with Mic Button */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSend();
                }}
                className="flex items-center gap-2 pt-0.5"
              >
                <button
                  type="button"
                  onClick={onToggleMic}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:text-white"
                  }`}
                  title={isListening ? "Listening... click to stop" : "Start Voice Input (Microphone)"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder={isListening ? "Listening... speak now" : "Speak or type your customer query..."}
                  disabled={isProcessing}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />

                <button
                  type="submit"
                  disabled={isProcessing || !customQuery.trim()}
                  className="p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold rounded-xl transition-colors shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </Vani3DCard>
        </div>
      </div>

      {/* Commercial Acquisition & Conversion Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-cyan-950/40 border border-emerald-500/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="space-y-0.5">
          <div className="text-xs sm:text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Want VaniEdge AI for your clinic, restaurant, or business?</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Deploy a dedicated 24/7 autonomous phone answering line tailored to your local business in under 24 hours.
          </p>
        </div>
        <a
          href="https://t.me/Samarth1306"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Claim Your Dedicated Line</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Discrete ⚙ Advanced Voice Tuning Toggle at bottom */}
      <div className="pt-1 flex flex-col items-center">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95"
        >
          <Settings className="w-3.5 h-3.5 text-emerald-400" />
          <span>⚙ Advanced Voice Tuning</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="w-full mt-4 p-5 rounded-2xl bg-[#090e17]/90 border border-slate-800 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Edge Audio Synthesis Controls
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Active Region: {activeRegion || "BOM1 (Mumbai Edge)"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* 1. Speech Engine */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium block">Speech Engine</label>
                <select
                  value={speechEngine}
                  onChange={(e) => onSelectSpeechEngine?.(e.target.value as "elevenlabs" | "browser")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="elevenlabs">ElevenLabs Neural (Ultra-Low Latency)</option>
                  <option value="browser">Browser SpeechSynthesis (Local Fallback)</option>
                </select>
              </div>

              {/* 2. Voice Persona */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium block">Voice Persona</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => onSelectVoice?.(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {speechEngine === "elevenlabs" ? (
                    elevenVoices && elevenVoices.length > 0 ? (
                      elevenVoices.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} — {v.desc}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="sarah">Sarah (Mature, Reassuring)</option>
                        <option value="bella">Bella (Warm, Friendly)</option>
                        <option value="adam">Adam (Deep, Authoritative)</option>
                        <option value="rachel">Rachel (Calm, Professional)</option>
                      </>
                    )
                  ) : browserVoices && browserVoices.length > 0 ? (
                    browserVoices.slice(0, 20).map((v, i) => (
                      <option key={i} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))
                  ) : (
                    <option value="default">Default System Voice</option>
                  )}
                </select>
              </div>

              {/* 3. Speed / Rate Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <label className="font-medium">Playback Speed</label>
                  <span className="font-mono text-emerald-400 font-bold">{speechRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => onSelectSpeechRate?.(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* 4. Pitch Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <label className="font-medium">Vocal Pitch</label>
                  <span className="font-mono text-cyan-400 font-bold">{speechPitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.05"
                  value={speechPitch}
                  onChange={(e) => onSelectSpeechPitch?.(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Send,
  Play,
  RotateCcw,
  Bot,
  User,
  Sliders,
  Globe2,
  Radio,
  Clock,
  Flame,
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
  speechEngine: "elevenlabs" | "browser";
  onSelectSpeechEngine: (e: "elevenlabs" | "browser") => void;
  selectedVoice: string;
  onSelectVoice: (v: string) => void;
  elevenVoices: VoiceOption[];
  browserVoices: SpeechSynthesisVoice[];
  speechRate: number;
  onSelectSpeechRate: (r: number) => void;
  speechPitch: number;
  onSelectSpeechPitch: (p: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  activeRegion: string;
}

export default function VaniStudioView({
  isCalling,
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
  selectedLanguage,
  onSelectLanguage,
  languages,
  speechEngine,
  onSelectSpeechEngine,
  selectedVoice,
  onSelectVoice,
  elevenVoices,
  browserVoices,
  speechRate,
  onSelectSpeechRate,
  speechPitch,
  onSelectSpeechPitch,
  canvasRef,
  activeRegion,
}: VaniStudioViewProps) {
  const quickQueries = {
    clinic: [
      "What are Dr. Sharma's clinic hours?",
      "Book an appointment for Rahul tomorrow at 10 AM",
      "What is the consultation fee?",
    ],
    restaurant: [
      "What is today's Bhojanalaya special?",
      "Order 2 Special Thalis to Indiranagar",
      "What is the delivery turnaround time?",
    ],
    auto: [
      "I have a highway tyre puncture at Mile 44",
      "What is the emergency towing rate?",
      "Dispatch roadside rescue team immediately",
    ],
  }[selectedPersona];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sub-Second Edge Telephony Studio • Hack Devengers 2.0</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Autonomous <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Voice AI Telephony</span> Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Speak via microphone, dial the live US phone line, or switch personas to test instant vernacular dispatching.
        </p>
      </div>

      {/* Control Hub: Persona, Language, Engine & Voice (Clean Floating Bar) */}
      <Vani3DCard glowColor="emerald" className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-3 text-xs">
          {/* Persona Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectPersona("clinic")}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                selectedPersona === "clinic"
                  ? "bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🏥 Dr. Sharma Clinic
            </button>
            <button
              onClick={() => onSelectPersona("restaurant")}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                selectedPersona === "restaurant"
                  ? "bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🍲 Bhojanalaya Kitchen
            </button>
            <button
              onClick={() => onSelectPersona("auto")}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                selectedPersona === "auto"
                  ? "bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🚨 Apex Roadside Rescue
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Node: <span className="text-emerald-400 font-semibold">{activeRegion}</span>
          </span>
        </div>

        {/* Sliders and Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* Language Selector */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Spoken Language</span>
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label} ({l.nativeLabel})
                </option>
              ))}
            </select>
          </div>

          {/* Speech Engine */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Speech Engine</span>
            </label>
            <select
              value={speechEngine}
              onChange={(e) => onSelectSpeechEngine(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="elevenlabs">ElevenLabs Turbo v2.5 (High-Fidelity Edge)</option>
              <option value="browser">Browser Native Speech (0ms Zero-Cloud)</option>
            </select>
          </div>

          {/* Voice Persona */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Voice Persona</span>
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => onSelectVoice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {speechEngine === "elevenlabs" ? (
                elevenVoices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} • {v.desc}
                  </option>
                ))
              ) : (
                browserVoices.map((v, i) => (
                  <option key={i} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Speed & Pitch */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 font-medium">
              <span>Speed ({speechRate}x)</span>
              <span>Pitch ({speechPitch}x)</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="range"
                min="0.75"
                max="1.4"
                step="0.05"
                value={speechRate}
                onChange={(e) => onSelectSpeechRate(parseFloat(e.target.value))}
                className="w-1/2 accent-emerald-500 cursor-pointer"
                title="Speed"
              />
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={speechPitch}
                onChange={(e) => onSelectSpeechPitch(parseFloat(e.target.value))}
                className="w-1/2 accent-indigo-500 cursor-pointer"
                title="Pitch"
              />
            </div>
          </div>
        </div>
      </Vani3DCard>

      {/* Centerpiece 3D Stage & Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: 3D Holographic Voice Orb & Call Actions */}
        <Vani3DCard glowColor="cyan" className="lg:col-span-5 p-6 flex flex-col items-center justify-between text-center min-h-[460px]">
          <div className="w-full flex items-center justify-between text-xs pb-3 border-b border-slate-800/80">
            <span className="font-semibold text-slate-300">3D Holographic Audio Core</span>
            <span className="font-mono text-emerald-400">
              {isCalling ? formatDuration(callDuration) : "Standby"}
            </span>
          </div>

          {/* Interactive 3D Voice Orb */}
          <VaniVoiceOrb3D
            isSpeaking={isSpeaking}
            isListening={isListening}
            isCalling={isCalling}
            stateText={
              isSpeaking
                ? "Synthesizing Speech"
                : isListening
                ? "Listening (Microphone)"
                : isCalling
                ? "Call Connected"
                : "Awaiting Inbound Call"
            }
          />

          {/* 40-Bar FFT Waveform Canvas */}
          <div className="w-full bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
            <canvas ref={canvasRef} width={280} height={36} className="w-full h-9" />
          </div>

          {/* Main Call Toggle Button */}
          <div className="w-full pt-4 space-y-2">
            <button
              onClick={onToggleCall}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                isCalling
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
                  : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black shadow-emerald-500/20"
              }`}
            >
              {isCalling ? (
                <>
                  <PhoneOff className="w-4 h-4" />
                  <span>End Voice Call</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" />
                  <span>Connect In-Browser Call</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Carrier PSTN Line:</span>
              <a href="tel:+18149613703" className="font-mono text-emerald-400 hover:underline">
                +1 (814) 961-3703
              </a>
            </div>
          </div>
        </Vani3DCard>

        {/* Right 7 Cols: Conversational Stream & Mic Transcription */}
        <Vani3DCard glowColor="indigo" className="lg:col-span-7 p-6 flex flex-col justify-between min-h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-slate-200">Real-Time Conversation Stream</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {transcript.length} Events Logged
            </span>
          </div>

          {/* Transcript Scroll Area */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 my-4 text-xs">
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
                      {msg.sender === "agent" ? "VaniEdge AI (Edge)" : "You (Caller)"}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      {msg.latencyMs && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">
                          {msg.latencyMs}ms
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed">{msg.text}</p>

                  {msg.sender === "agent" && (
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => onReplayAudio(msg.text)}
                        className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
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
          </div>

          {/* Quick Preset Queries */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400 mr-1">Sample Queries:</span>
              {quickQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSend(q)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors truncate max-w-[200px]"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form with Mic Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSend();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <button
                type="button"
                onClick={onToggleMic}
                className={`p-2.5 rounded-xl border transition-all ${
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
                placeholder={isListening ? "Listening... speak now" : "Speak or type your customer query in any language..."}
                disabled={isProcessing}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />

              <button
                type="submit"
                disabled={isProcessing || !customQuery.trim()}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold rounded-xl transition-colors shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </Vani3DCard>
      </div>
    </div>
  );
}

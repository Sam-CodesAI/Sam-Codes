"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ShieldCheck,
  Activity,
  Zap,
  Globe2,
  Database,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Plus,
  Send,
  ArrowRight,
  ExternalLink,
  Code2,
  Bot,
  User,
  Clock,
  Check,
  Flame,
  Search,
  Sliders,
  Download,
  Trash2,
  Radio,
  FileText,
  Settings,
  PanelLeft,
  BarChart3,
  Server,
} from "lucide-react";
import { DEFAULT_KNOWLEDGE_PRESETS, DocumentEntry } from "@/lib/vaniedge/sutradb-engine";
import VaniSidebar, { NavTab } from "@/components/vaniedge/VaniSidebar";
import VaniDashboard from "@/components/vaniedge/VaniDashboard";
import VaniStudioView from "@/components/vaniedge/VaniStudioView";
import VaniKnowledgeView from "@/components/vaniedge/VaniKnowledgeView";
import VaniDispatchView, { DispatchTicket } from "@/components/vaniedge/VaniDispatchView";
import VaniTelephonyView from "@/components/vaniedge/VaniTelephonyView";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  latencyMs?: number;
  matchedDoc?: string;
  audioUrl?: string;
}

interface StoredSession {
  id: string;
  title: string;
  timestamp: string;
  persona: string;
  transcript: Message[];
}

interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
  speechLocale: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English (India)", nativeLabel: "English", speechLocale: "en-IN" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी", speechLocale: "hi-IN" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ", speechLocale: "kn-IN" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", speechLocale: "mr-IN" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", speechLocale: "ta-IN" },
  { code: "es", label: "Spanish", nativeLabel: "Español", speechLocale: "es-ES" },
];

const ELEVENLABS_VOICES = [
  { id: "sarah", name: "Sarah", desc: "Mature, Reassuring (Healthcare/Triage)", voiceId: "EXAVITQu4vr4xnSDxMaL" },
  { id: "rachel", name: "Rachel", desc: "Calm, Professional (Business Support)", voiceId: "21m00Tcm4TlvDq8ikWAM" },
  { id: "adam", name: "Adam", desc: "Authoritative, Deep (Emergency Rescue)", voiceId: "pNInz6obpgDQGcFmaJgB" },
  { id: "bella", name: "Bella", desc: "Warm, Friendly (Food Ordering & Hospitality)", voiceId: "piTKgcLEGmPE4e6mEKli" },
];

export default function VaniEdgePage() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>("studio");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [sessionHistory, setSessionHistory] = useState<StoredSession[]>([
    {
      id: "sess-default-1",
      title: "Clinic Dr. Sharma Booking",
      timestamp: "Today, 09:30 AM",
      persona: "clinic",
      transcript: [
        {
          id: "m-1",
          sender: "user",
          text: "What are Dr. Sharma clinic hours and consultation fee?",
          timestamp: "09:30 AM",
        },
        {
          id: "m-2",
          sender: "agent",
          text: "Dr. Sharma's clinic is open 9 AM to 1:30 PM. Consultation fee is ₹500.",
          timestamp: "09:30 AM",
          latencyMs: 0.66,
        },
      ],
    },
    {
      id: "sess-default-2",
      title: "Bhojanalaya Thali Order",
      timestamp: "Yesterday, 07:15 PM",
      persona: "restaurant",
      transcript: [
        {
          id: "m-3",
          sender: "user",
          text: "I want to order 2 Special North Indian Thalis to Indiranagar.",
          timestamp: "07:15 PM",
        },
        {
          id: "m-4",
          sender: "agent",
          text: "Order confirmed for 2 Special Thalis! Ticket VANI-RES-3304 created.",
          timestamp: "07:15 PM",
          latencyMs: 0.72,
        },
      ],
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>("current");

  // Telephony & Call State
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [transcript, setTranscript] = useState<Message[]>([
    {
      id: "initial-msg",
      sender: "agent",
      text: "Namaste! Welcome to VaniEdge Voice Telephony. How may I assist your business today?",
      timestamp: "Just now",
      latencyMs: 14.2,
    },
  ]);
  const [customQuery, setCustomQuery] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [watchdogStatus, setWatchdogStatus] = useState<"HEALTHY" | "TRIGGERED" | "RECOVERED">("HEALTHY");

  // Voice & Language Customization
  const [speechEngine, setSpeechEngine] = useState<"elevenlabs" | "browser">("elevenlabs");
  const [selectedVoice, setSelectedVoice] = useState<string>("sarah");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [speechRate, setSpeechRate] = useState<number>(1.05);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Business Context & Persona
  const [businessName, setBusinessName] = useState<string>("Dr. Sharma Healthcare Clinic");
  const [selectedPersona, setSelectedPersona] = useState<"clinic" | "restaurant" | "auto">("clinic");

  // Telemetry Metrics
  const [metrics, setMetrics] = useState({
    edgeAuthMs: 14.2,
    wsUpgradeMs: 38.6,
    sutraDbMs: 8.4,
    ttftMs: 340.0,
    activeRegion: "BOM1 (Mumbai Edge)",
  });

  // SutraDB Knowledge Base
  const [knowledgeList, setKnowledgeList] = useState<DocumentEntry[]>(DEFAULT_KNOWLEDGE_PRESETS);

  // Persistent Dispatch Tickets Feed
  const [tickets, setTickets] = useState<DispatchTicket[]>([]);

  // Audio Waveform & Mic Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Load saved tickets & browser voices on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vaniedge_tickets");
      if (saved) {
        try {
          setTickets(JSON.parse(saved));
        } catch {
          // fallback
        }
      } else {
        const initialTickets: DispatchTicket[] = [
          {
            ticketId: "VANI-CLI-8192",
            timestamp: "5 mins ago",
            category: "clinic",
            callerName: "Rohan Verma",
            callerPhone: "+91-98765-43210",
            serviceType: "General Physician Consultation",
            details: "Booked appointment for tomorrow 11:30 AM",
            status: "CONFIRMED",
            priority: "STANDARD",
            smsConfirmation: "[VaniEdge AI] Appointment confirmed with Dr. Sharma Clinic for tomorrow 11:30 AM. Ticket: VANI-CLI-8192.",
          },
          {
            ticketId: "VANI-RES-3304",
            timestamp: "22 mins ago",
            category: "restaurant",
            callerName: "Pooja Hegde",
            callerPhone: "+91-98123-77890",
            serviceType: "2x Special Thali + Veg Biryani",
            details: "Delivery address: 4th Cross, Indiranagar",
            status: "DISPATCHED",
            priority: "STANDARD",
            smsConfirmation: "[VaniEdge AI] Order dispatched from Bhojanalaya Kitchen. ETA: 25 mins. Ticket: VANI-RES-3304.",
          },
        ];
        setTickets(initialTickets);
        localStorage.setItem("vaniedge_tickets", JSON.stringify(initialTickets));
      }

      // Populate Browser Voices
      const updateVoices = () => {
        const available = window.speechSynthesis?.getVoices() || [];
        setBrowserVoices(available);
      };
      updateVoices();
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }

      // Setup Web Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;

        recog.onresult = (event: any) => {
          const text = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join("");
          setCustomQuery(text);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        recog.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, []);

  // Save tickets on change
  useEffect(() => {
    if (typeof window !== "undefined" && tickets.length > 0) {
      localStorage.setItem("vaniedge_tickets", JSON.stringify(tickets));
    }
  }, [tickets]);

  // Call duration counter
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  // Audio Waveform Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isSpeaking
        ? "#10b981"
        : isListening
        ? "#06b6d4"
        : isCalling
        ? "#6366f1"
        : "#334155";
      ctx.beginPath();

      const bars = 40;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        const x = i * barWidth;
        const multiplier = isSpeaking ? 1.5 : isListening ? 1.2 : isCalling ? 0.4 : 0.1;
        const wave = Math.sin(i * 0.3 + phase) * Math.cos(i * 0.2 + phase);
        const barHeight = Math.max(4, Math.abs(wave) * (height / 2.2) * multiplier);

        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(x + 1, centerY - barHeight / 2, barWidth - 2, barHeight);
      }

      phase += isSpeaking || isListening ? 0.15 : 0.04;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isCalling, isSpeaking, isListening]);

  // Speak text via ElevenLabs or Browser
  const speakVoiceResponse = useCallback(
    async (text: string) => {
      if (typeof window === "undefined") return;

      // 1. Try ElevenLabs Edge Streaming if selected
      if (speechEngine === "elevenlabs") {
        try {
          setIsSpeaking(true);
          const ttsRes = await fetch("/api/vaniedge/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              voiceId: selectedVoice,
            }),
          });

          if (ttsRes.ok) {
            const blob = await ttsRes.blob();
            const audioUrl = URL.createObjectURL(blob);
            if (audioPlayerRef.current) {
              audioPlayerRef.current.src = audioUrl;
              audioPlayerRef.current.playbackRate = speechRate;
              audioPlayerRef.current.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(audioUrl);
              };
              audioPlayerRef.current.onerror = () => {
                setIsSpeaking(false);
              };
              try {
                await audioPlayerRef.current.play();
                return;
              } catch (playErr) {
                console.warn("Audio play blocked, falling back to speech synthesis:", playErr);
              }
            }
          }
        } catch (ttsErr) {
          console.warn("ElevenLabs TTS error, falling back to browser speech:", ttsErr);
        }
      }

      // 2. Local Browser SpeechSynthesis Fallback
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;

        const langMeta = LANGUAGES.find((l) => l.code === selectedLanguage);
        if (langMeta) utterance.lang = langMeta.speechLocale;

        if (browserVoices.length > 0) {
          const matched =
            browserVoices.find((v) => v.name.toLowerCase().includes(selectedVoice.toLowerCase())) ||
            browserVoices.find((v) => v.lang.startsWith(selectedLanguage));
          if (matched) utterance.voice = matched;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    },
    [speechEngine, selectedVoice, selectedLanguage, speechRate, speechPitch, browserVoices]
  );

  // Send message
  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || customQuery;
    if (!textToSend.trim() || isProcessing) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setTranscript((prev) => [...prev, userMsg]);
    setCustomQuery("");
    setIsProcessing(true);

    const startTime = performance.now();

    try {
      const res = await fetch("/api/vaniedge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          persona: selectedPersona,
          language: selectedLanguage,
          customDocuments: knowledgeList,
          businessName,
        }),
      });

      const data = await res.json();
      const elapsedRoundtrip = parseFloat((performance.now() - startTime).toFixed(1));

      if (data.success) {
        const agentMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: "agent",
          text: data.voiceResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          latencyMs: data.retrieval?.latencyMs || 8.4,
          matchedDoc: data.retrieval?.matchedDocument?.title,
        };
        setTranscript((prev) => [...prev, agentMsg]);

        setMetrics((prev) => ({
          ...prev,
          sutraDbMs: data.retrieval?.latencyMs || 8.4,
          ttftMs: elapsedRoundtrip,
        }));

        speakVoiceResponse(data.voiceResponse);

        // Auto-create persistent dispatch ticket for operational intents
        if (["BOOK_APPOINTMENT", "ORDER_FOOD", "EMERGENCY_DISPATCH"].includes(data.intent)) {
          dispatchTicket({
            callerName: data.entities?.callerName || "Caller",
            callerPhone: data.entities?.phone || "+91-98765-43210",
            category: selectedPersona,
            serviceType:
              data.entities?.items ||
              (data.intent === "BOOK_APPOINTMENT"
                ? `Appointment (${data.entities?.scheduledTime || "Earliest Slot"})`
                : "Emergency Rescue"),
            details: data.voiceResponse.slice(0, 100),
            priority: data.intent === "EMERGENCY_DISPATCH" ? "URGENT" : "STANDARD",
          });
        }
      }
    } catch {
      const fallbackMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "agent",
        text: "I have recorded your request. Our desk will confirm via SMS shortly.",
        timestamp: "Just now",
      };
      setTranscript((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Dispatch new ticket
  const dispatchTicket = async (ticketData: Partial<DispatchTicket>) => {
    try {
      const res = await fetch("/api/vaniedge/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callerName: ticketData.callerName || "Walk-in Caller",
          callerPhone: ticketData.callerPhone || "+91-98765-43210",
          category: ticketData.category || selectedPersona,
          serviceType: ticketData.serviceType || "Service Consultation",
          details: ticketData.details || "In-call automatic extraction",
          priority: ticketData.priority || "STANDARD",
        }),
      });
      const data = await res.json();
      if (data.success && data.ticket) {
        setTickets((prev) => [data.ticket, ...prev]);
      }
    } catch (err) {
      console.error("Dispatch error:", err);
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.ticketId !== ticketId));
  };

  // Trigger Simulated Watchdog Glitch
  const triggerSimulatedGlitch = () => {
    setWatchdogStatus("TRIGGERED");
    setTimeout(() => {
      setWatchdogStatus("RECOVERED");
      const alertMsg: Message = {
        id: `glitch-${Date.now()}`,
        sender: "agent",
        text: "🛡️ [CALL BACKUP ACTIVATED]: Line delay detected. Live call was seamlessly protected and maintained with zero drop.",
        timestamp: "Just now",
      };
      setTranscript((prev) => [...prev, alertMsg]);
      speakVoiceResponse("Notice: Call protected by automated backup system.");
    }, 1200);
  };

  // Knowledge base actions
  const handleAddKnowledge = (title: string, content: string, cat?: string) => {
    const newDoc: DocumentEntry = {
      id: `custom-${Date.now()}`,
      title,
      content,
      category: (cat as any) || (selectedPersona as any) || "clinic",
    };
    setKnowledgeList((prev) => [newDoc, ...prev]);
  };

  const handleDeleteKnowledge = (id: string) => {
    setKnowledgeList((prev) => prev.filter((d) => d.id !== id));
  };

  const handleImportKnowledge = (docs: DocumentEntry[]) => {
    setKnowledgeList((prev) => [...docs, ...prev]);
  };

  // Ticket status toggle
  const updateTicketStatus = (ticketId: string, nextStatus: DispatchTicket["status"]) => {
    setTickets((prev) =>
      prev.map((t) => (t.ticketId === ticketId ? { ...t, status: nextStatus } : t))
    );
  };

  // Export tickets as CSV
  const exportTicketsCSV = () => {
    if (tickets.length === 0) return;
    const headers = "TicketID,Timestamp,Category,CallerName,Phone,ServiceType,Status,Priority\n";
    const rows = tickets
      .map(
        (t) =>
          `"${t.ticketId}","${t.timestamp}","${t.category}","${t.callerName}","${t.callerPhone}","${t.serviceType}","${t.status}","${t.priority}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vaniedge-dispatch-export-${Date.now()}.csv`;
    a.click();
  };

  // Call & Mic Toggles
  const handleToggleCall = () => {
    if (isCalling) {
      setIsCalling(false);
      setIsSpeaking(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    } else {
      setIsCalling(true);
      speakVoiceResponse(
        `Connected to ${businessName}. Namaste! How may I direct your call today?`
      );
    }
  };

  const handleToggleMic = () => {
    if (!recognitionRef.current) {
      alert("Microphone recognition is supported in Chrome, Edge, and Android mobile browsers.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const langMeta = LANGUAGES.find((l) => l.code === selectedLanguage);
        if (langMeta) recognitionRef.current.lang = langMeta.speechLocale;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Mic start error:", err);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Session Handlers
  const handleNewSession = () => {
    const hasUserMsg = transcript.some((m) => m.sender === "user");
    if (hasUserMsg) {
      const firstUserMsg = transcript.find((m) => m.sender === "user")?.text || "Voice Call Session";
      const newSession: StoredSession = {
        id: `sess-${Date.now()}`,
        title: firstUserMsg.slice(0, 30) + (firstUserMsg.length > 30 ? "..." : ""),
        timestamp: "Just now",
        persona: selectedPersona,
        transcript: [...transcript],
      };
      setSessionHistory((prev) => [newSession, ...prev]);
    }

    setTranscript([
      {
        id: `init-${Date.now()}`,
        sender: "agent",
        text: `Namaste! Welcome to ${businessName}. How may I assist your business today?`,
        timestamp: "Just now",
        latencyMs: 14.2,
      },
    ]);
    setActiveSessionId("current");
    setIsCalling(false);
    setIsListening(false);
    setIsSpeaking(false);
    setActiveTab("studio");
  };

  const handleSelectSession = (id: string) => {
    const found = sessionHistory.find((s) => s.id === id);
    if (found) {
      setTranscript(found.transcript);
      setActiveSessionId(id);
      setActiveTab("studio");
    }
  };

  const handleDeleteSession = (id: string) => {
    setSessionHistory((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      handleNewSession();
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-emerald-500 selection:text-black font-sans antialiased">
      {/* Hidden Audio Player for ElevenLabs Streaming */}
      <audio ref={audioPlayerRef} className="hidden" />

      {/* ChatGPT / Gemini Style Sidebar Navigation */}
      <VaniSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewSession={handleNewSession}
        sessionHistory={sessionHistory.map((s) => ({
          id: s.id,
          title: s.title,
          timestamp: s.timestamp,
          persona: s.persona,
          messageCount: s.transcript.length,
        }))}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        ticketsCount={tickets.length}
        knowledgeCount={knowledgeList.length}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Sticky Navigation Bar */}
        <header className="border-b border-slate-800/80 bg-[#090e17]/90 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Toggle Sidebar Navigation"
              >
                <PanelLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-md lg:hidden">
                  <div className="h-full w-full bg-[#070b12] rounded-[6px] flex items-center justify-center">
                    <Flame className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <span className="font-bold text-base sm:text-lg tracking-tight text-white hidden sm:inline">
                  VaniEdge AI
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Voice Studio
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Spoken Language Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs shadow-sm">
                <Globe2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
                  aria-label="Select Spoken Language"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                      {l.label} ({l.nativeLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Live PSTN Phone Line Badge */}
              <a
                href="tel:+18149613703"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono hover:bg-emerald-900/60 transition-colors shadow-sm cursor-pointer"
                title="Click to dial live production telephony line"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+1 (814) 961-3703</span>
                <span className="sm:hidden">Call</span>
              </a>

              <a
                href="https://github.com/Sam-CodesAI/VaniEdge-AI"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        </header>

        {/* Main View Container */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 flex-1">
          {/* 1. Voice Studio View */}
          {activeTab === "studio" && (
            <VaniStudioView
              isCalling={isCalling}
              isListening={isListening}
              isSpeaking={isSpeaking}
              callDuration={callDuration}
              formatDuration={formatDuration}
              transcript={transcript}
              customQuery={customQuery}
              setCustomQuery={setCustomQuery}
              isProcessing={isProcessing}
              onSend={handleSend}
              onToggleCall={handleToggleCall}
              onToggleMic={handleToggleMic}
              onReplayAudio={speakVoiceResponse}
              selectedPersona={selectedPersona}
              onSelectPersona={(p) => {
                setSelectedPersona(p);
                if (p === "clinic") {
                  setBusinessName("Dr. Sharma Healthcare Clinic");
                  setSelectedVoice("sarah");
                  setSpeechRate(1.0);
                  setSpeechPitch(1.0);
                  setSpeechEngine("elevenlabs");
                } else if (p === "restaurant") {
                  setBusinessName("Bhojanalaya Cloud Kitchen");
                  setSelectedVoice("bella");
                  setSpeechRate(1.05);
                  setSpeechPitch(1.05);
                  setSpeechEngine("elevenlabs");
                } else {
                  setBusinessName("Apex Roadside Assistance");
                  setSelectedVoice("adam");
                  setSpeechRate(1.1);
                  setSpeechPitch(0.95);
                  setSpeechEngine("elevenlabs");
                }
              }}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              languages={LANGUAGES}
              speechEngine={speechEngine}
              onSelectSpeechEngine={setSpeechEngine}
              selectedVoice={selectedVoice}
              onSelectVoice={setSelectedVoice}
              elevenVoices={ELEVENLABS_VOICES}
              browserVoices={browserVoices}
              speechRate={speechRate}
              onSelectSpeechRate={setSpeechRate}
              speechPitch={speechPitch}
              onSelectSpeechPitch={setSpeechPitch}
              canvasRef={canvasRef}
              activeRegion={metrics.activeRegion}
            />
          )}

          {/* 2. Intelligence Fleet Dashboard */}
          {activeTab === "dashboard" && (
            <VaniDashboard
              metrics={metrics}
              tickets={tickets}
              knowledgeList={knowledgeList}
              watchdogStatus={watchdogStatus}
              onSimulateGlitch={triggerSimulatedGlitch}
              onNavigateTo={(tab) => setActiveTab(tab)}
            />
          )}

          {/* 3. SutraDB Dedicated Knowledge Base View */}
          {activeTab === "sutradb" && (
            <VaniKnowledgeView
              knowledgeList={knowledgeList}
              onAddDocument={handleAddKnowledge}
              onDeleteDocument={handleDeleteKnowledge}
              onImportDocuments={handleImportKnowledge}
              averageLatencyMs={metrics.sutraDbMs}
            />
          )}

          {/* 4. Dispatch Queue Dedicated View */}
          {activeTab === "dispatch" && (
            <VaniDispatchView
              tickets={tickets}
              onUpdateStatus={updateTicketStatus}
              onDeleteTicket={handleDeleteTicket}
              onExportCSV={exportTicketsCSV}
            />
          )}

          {/* 5. Telephony & Watchdog Dedicated View */}
          {activeTab === "telephony" && (
            <VaniTelephonyView
              metrics={metrics}
              watchdogStatus={watchdogStatus}
              onSimulateGlitch={triggerSimulatedGlitch}
            />
          )}
        </main>
      </div>
    </div>
  );
}

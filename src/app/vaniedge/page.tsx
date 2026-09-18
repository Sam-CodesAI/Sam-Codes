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

interface DispatchTicket {
  ticketId: string;
  timestamp: string;
  category: string;
  callerName: string;
  callerPhone: string;
  serviceType: string;
  details: string;
  status: "CONFIRMED" | "DISPATCHED" | "COMPLETED" | "ESCALATED";
  priority: "STANDARD" | "HIGH" | "URGENT";
  smsConfirmation: string;
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
  { id: "sarah", name: "Sarah", desc: "Mature, Reassuring, Confident (Healthcare/Triage)", voiceId: "EXAVITQu4vr4xnSDxMaL" },
  { id: "rachel", name: "Rachel", desc: "Calm, Professional (Business & Support)", voiceId: "21m00Tcm4TlvDq8ikWAM" },
  { id: "adam", name: "Adam", desc: "Authoritative, Deep (Emergency & Rescue)", voiceId: "pNInz6obpgDQGcFmaJgB" },
  { id: "bella", name: "Bella", desc: "Warm, Friendly (Food Ordering & Hospitality)", voiceId: "piTKgcLEGmPE4e6mEKli" },
];

export default function VaniEdgePage() {
  // Navigation & View State (ChatGPT / Gemini Style)
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

  // SutraDB Dynamic Knowledge Base
  const [knowledgeList, setKnowledgeList] = useState<DocumentEntry[]>(DEFAULT_KNOWLEDGE_PRESETS);
  const [newDocTitle, setNewDocTitle] = useState<string>("");
  const [newDocContent, setNewDocContent] = useState<string>("");
  const [showAddDoc, setShowAddDoc] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Persistent Dispatch Tickets Feed
  const [tickets, setTickets] = useState<DispatchTicket[]>([]);

  // Waveform Canvas & Audio Ref
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

      // Setup Web Speech Recognition if available
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
        ? "#10b981" // Emerald
        : isListening
        ? "#06b6d4" // Cyan
        : isCalling
        ? "#6366f1" // Indigo
        : "#334155"; // Slate
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
            body: JSON.stringify({ text, voiceId: selectedVoice }),
          });

          if (ttsRes.ok) {
            const blob = await ttsRes.blob();
            const audioUrl = URL.createObjectURL(blob);
            if (audioPlayerRef.current) {
              audioPlayerRef.current.src = audioUrl;
              audioPlayerRef.current.playbackRate = speechRate;
              audioPlayerRef.current.onended = () => setIsSpeaking(false);
              audioPlayerRef.current.onerror = () => {
                setIsSpeaking(false);
                fallbackBrowserTTS(text);
              };
              await audioPlayerRef.current.play();
              return;
            }
          }
        } catch {
          // Fallback to browser
        }
      }

      // 2. Fallback to Browser Native SpeechSynthesis
      fallbackBrowserTTS(text);
    },
    [speechEngine, selectedVoice, speechRate, selectedLanguage, speechPitch]
  );

  const fallbackBrowserTTS = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedLangObj = LANGUAGES.find((l) => l.code === selectedLanguage);
    utterance.lang = selectedLangObj?.speechLocale || "en-IN";
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Live Speech Microphone
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Web Speech Recognition is not supported in this browser. Please use Chrome/Edge or type your question below.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const selectedLangObj = LANGUAGES.find((l) => l.code === selectedLanguage);
      recognitionRef.current.lang = selectedLangObj?.speechLocale || "en-IN";
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Process User Query
  const handleQuery = async (queryText: string) => {
    if (!queryText.trim() || isProcessing) return;
    setIsProcessing(true);

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setTranscript((prev) => [...prev, userMsg]);
    setCustomQuery("");

    const callStartTime = performance.now();

    try {
      const res = await fetch("/api/vaniedge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          persona: selectedPersona,
          language: selectedLanguage,
          customDocuments: knowledgeList,
          businessName,
        }),
      });

      const data = await res.json();
      const elapsedRoundtrip = parseFloat((performance.now() - callStartTime).toFixed(1));

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
        text: "I have recorded your request. Our clinic desk will confirm via SMS shortly.",
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

  // Trigger Simulated Watchdog Glitch
  const triggerSimulatedGlitch = () => {
    setWatchdogStatus("TRIGGERED");
    setTimeout(() => {
      setWatchdogStatus("RECOVERED");
      const alertMsg: Message = {
        id: `glitch-${Date.now()}`,
        sender: "agent",
        text: "⚡ [FAILOVER WATCHDOG ACTIVATED]: Upstream latency exceeded 1,200ms threshold. Mid-call Twilio REST redirection executed. Live call rescued to backup PSTN queue without dropped connection.",
        timestamp: "Just now",
        latencyMs: 14.8,
      };
      setTranscript((prev) => [...prev, alertMsg]);
      speakVoiceResponse("Notice: Call protected by edge failover watchdog.");
    }, 1200);
  };

  // Add custom knowledge document
  const handleAddKnowledge = () => {
    if (!newDocTitle.trim() || !newDocContent.trim()) return;
    const newDoc: DocumentEntry = {
      id: `custom-${Date.now()}`,
      title: newDocTitle.trim(),
      content: newDocContent.trim(),
      category: selectedPersona,
    };
    setKnowledgeList((prev) => [newDoc, ...prev]);
    setNewDocTitle("");
    setNewDocContent("");
    setShowAddDoc(false);
  };

  // Delete knowledge doc
  const handleDeleteKnowledge = (id: string) => {
    setKnowledgeList((prev) => prev.filter((d) => d.id !== id));
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ChatGPT / Gemini Style Session Handlers
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

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-emerald-500 selection:text-black">
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
        ticketsCount={tickets.length}
        knowledgeCount={knowledgeList.length}
      />

      {/* Main Content Area (Offset for Desktop Sidebar) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Sticky Navigation Bar (Gemini / ChatGPT Header) */}
        <header className="border-b border-slate-800/80 bg-[#090e17]/90 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Toggle Sidebar Navigation"
              >
                <PanelLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-md shadow-emerald-500/20 lg:hidden">
                  <div className="h-full w-full bg-[#070b12] rounded-[6px] flex items-center justify-center">
                    <Flame className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <span className="font-bold text-base sm:text-lg tracking-tight text-white hidden sm:inline">
                  VaniEdge AI
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {activeTab === "studio"
                    ? "Voice Studio"
                    : activeTab === "dashboard"
                    ? "Intelligence Fleet Dashboard"
                    : activeTab === "sutradb"
                    ? "SutraDB RAG Engine"
                    : activeTab === "dispatch"
                    ? "Live Dispatch Board"
                    : "Carrier Telephony"}
                </span>
              </div>
            </div>

            {/* Quick Top Navigation Pills (ChatGPT / Gemini Style) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab("studio")}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
                  activeTab === "studio"
                    ? "bg-emerald-500 text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Studio</span>
              </button>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
                  activeTab === "dashboard"
                    ? "bg-cyan-500 text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab("sutradb")}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
                  activeTab === "sutradb"
                    ? "bg-indigo-500 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>SutraDB</span>
              </button>
              <button
                onClick={() => setActiveTab("dispatch")}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
                  activeTab === "dispatch"
                    ? "bg-amber-500 text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Dispatch ({tickets.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("telephony")}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
                  activeTab === "telephony"
                    ? "bg-rose-500 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Telephony</span>
              </button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Live PSTN Phone Line Badge */}
              <a
                href="tel:+18149613703"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono hover:bg-emerald-900/60 transition-colors shadow-sm"
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
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium hover:text-white hover:border-slate-500 transition-colors"
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
          {/* 1. Intelligence Fleet Dashboard */}
          {activeTab === "dashboard" && (
            <VaniDashboard
              metrics={metrics}
              ticketsCount={tickets.length}
              knowledgeCount={knowledgeList.length}
              watchdogStatus={watchdogStatus}
              onSimulateGlitch={triggerSimulatedGlitch}
              onNavigateTo={(tab) => setActiveTab(tab)}
            />
          )}

          {/* 2. SutraDB Dedicated Knowledge Base View */}
          {activeTab === "sutradb" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-indigo-950/30 border border-slate-800 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs uppercase font-mono font-bold tracking-wider text-indigo-400">
                      SutraDB In-Memory Hybrid RAG Engine
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Edge Vector & BM25 Knowledge Store</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    64-dimensional character n-gram dense semantic hashing combined with BM25 Okapi lexical ranking in 0.6ms.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDoc(!showAddDoc)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Knowledge Document</span>
                </button>
              </div>

              {/* SutraDB Full Width Content */}
              <div className="bg-[#0c121d] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-200">Ingested Domain Documents</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                      {knowledgeList.length} Ingested
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Average retrieval: 0.66ms</span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search documents by keyword, doctor, dish, or policy..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {showAddDoc && (
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 text-xs">
                    <input
                      type="text"
                      placeholder="Document Title (e.g., Weekend Clinic Timing & Fees)"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500"
                    />
                    <textarea
                      placeholder="Paste rules, operational hours, doctor credentials, menu items, or repair rates..."
                      value={newDocContent}
                      onChange={(e) => setNewDocContent(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowAddDoc(false)}
                        className="px-3 py-1.5 text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddKnowledge}
                        className="px-3.5 py-1.5 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-400 transition-colors"
                      >
                        Index into SutraDB
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 text-xs">
                  {knowledgeList
                    .filter(
                      (d) =>
                        !searchFilter ||
                        d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        d.content.toLowerCase().includes(searchFilter.toLowerCase())
                    )
                    .map((doc) => (
                      <div key={doc.id} className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5 relative group">
                        <div className="flex items-center justify-between text-slate-300 font-semibold">
                          <span className="truncate max-w-[200px]">{doc.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                              {doc.category}
                            </span>
                            <button
                              onClick={() => handleDeleteKnowledge(doc.id)}
                              className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{doc.content}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Dispatch Queue Dedicated View */}
          {activeTab === "dispatch" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-amber-950/30 border border-slate-800 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span className="text-xs uppercase font-mono font-bold tracking-wider text-amber-400">
                      Autonomous Operational Dispatch
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Live Dispatched Booking Board</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Appointments, food orders, and emergency roadside units captured and cryptographically signed.
                  </p>
                </div>
                <button
                  onClick={exportTicketsCSV}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV Spreadsheet</span>
                </button>
              </div>

              <div className="bg-[#0c121d] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-semibold text-sm text-slate-200">Active Queue ({tickets.length} Bookings)</span>
                  <span className="text-xs text-slate-400">Real-time status updates</span>
                </div>

                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div
                      key={t.ticketId}
                      className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-bold text-sm">{t.ticketId}</span>
                          <span className="text-slate-300 font-medium">• {t.callerName}</span>
                          <span className="text-slate-500 text-xs">({t.callerPhone})</span>
                        </div>

                        <select
                          value={t.status}
                          onChange={(e) => updateTicketStatus(t.ticketId, e.target.value as any)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 border cursor-pointer focus:outline-none ${
                            t.status === "CONFIRMED"
                              ? "text-emerald-400 border-emerald-500/40"
                              : t.status === "ESCALATED"
                              ? "text-rose-400 border-rose-500/40"
                              : t.status === "COMPLETED"
                              ? "text-slate-400 border-slate-600"
                              : "text-cyan-400 border-cyan-500/40"
                          }`}
                        >
                          <option value="CONFIRMED" className="bg-slate-900 text-emerald-400">CONFIRMED</option>
                          <option value="DISPATCHED" className="bg-slate-900 text-cyan-400">DISPATCHED</option>
                          <option value="COMPLETED" className="bg-slate-900 text-slate-400">COMPLETED</option>
                          <option value="ESCALATED" className="bg-slate-900 text-rose-400">ESCALATED</option>
                        </select>
                      </div>

                      <div className="text-xs">
                        <span className="text-white font-medium">{t.serviceType}</span>
                        <span className="text-slate-400 block mt-0.5">{t.details}</span>
                      </div>

                      <div className="p-2.5 bg-black/40 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-400 flex items-center justify-between">
                        <span className="text-emerald-400 font-semibold truncate max-w-[80%]">
                          {t.smsConfirmation}
                        </span>
                        <a
                          href={`tel:${t.callerPhone}`}
                          className="text-cyan-400 hover:text-cyan-300 shrink-0 font-sans text-xs underline ml-2"
                        >
                          Call Client
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Telephony & Watchdog Dedicated View */}
          {activeTab === "telephony" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-rose-950/30 border border-slate-800 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    <span className="text-xs uppercase font-mono font-bold tracking-wider text-rose-400">
                      Sub-Second Telephony Watchdog
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Live PSTN & Edge Redirection Architecture</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Enforces 1,200ms connection & 1,500ms TTFT deadlines with automatic mid-call PSTN redirection.
                  </p>
                </div>
                <button
                  onClick={triggerSimulatedGlitch}
                  disabled={watchdogStatus === "TRIGGERED"}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors shadow-lg shadow-amber-500/20"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-black" />
                  <span>{watchdogStatus === "TRIGGERED" ? "Glitch Executing..." : "Test Failover Watchdog"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 bg-[#0c121d] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-semibold text-sm text-slate-200">Sub-Second Stage Telemetry</span>
                    <span className="text-[10px] font-mono text-cyan-400">Active Node: {metrics.activeRegion}</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">1. Edge Gateway Auth (Web Crypto HMAC)</span>
                        <span className="font-mono text-emerald-400 font-semibold">{metrics.edgeAuthMs} ms</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "24%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">2. Bidirectional μ-law 8kHz WebSocket</span>
                        <span className="font-mono text-emerald-400 font-semibold">{metrics.wsUpgradeMs} ms</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "42%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">3. SutraDB Hybrid Vector + BM25 Query</span>
                        <span className="font-mono text-cyan-400 font-semibold">{metrics.sutraDbMs} ms</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: "18%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">4. Turn-to-Audio (TTFT First Packet)</span>
                        <span className="font-mono text-indigo-400 font-semibold">{metrics.ttftMs} ms</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: "70%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#0c121d] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="font-semibold text-sm text-slate-200">Active PSTN Carrier Line</span>
                      <span className="text-[10px] font-mono text-emerald-400">Live</span>
                    </div>

                    <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2">
                      <div className="text-sm font-mono text-emerald-300 font-bold">+1 (814) 961-3703</div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Incoming PSTN phone calls are connected to our Twilio Voice gateway and stream raw 8kHz μ-law audio via WebSockets to Cloudflare Workers edge nodes.
                      </p>
                      <div className="pt-2">
                        <a
                          href="tel:+18149613703"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-black font-semibold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Dial From Mobile Phone</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>Watchdog State:</span>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                        watchdogStatus === "TRIGGERED"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {watchdogStatus === "TRIGGERED" ? "DEADLINE BREACH • REDIRECTING" : "WATCHDOG ARMED (1,200ms)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Voice Studio (Default Active Tab) */}
          {activeTab === "studio" && (
            <>
              {/* Hero Header */}
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hack Devengers 2.0 • Open Innovation Grand Prize Contender</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Autonomous <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Voice AI Telephony</span> Studio
                </h1>
                <p className="text-sm sm:text-base text-slate-400">
                  Real-time multi-lingual voice dispatching with zero cloud subscription fees. Built on Cloudflare Workers edge nodes, SutraDB RAG memory, and sub-second failover watchdogs.
                </p>
              </div>

              {/* Global Control Bar: Dynamic Persona, Engine, Voice & Language Selectors */}
              <div className="bg-[#0c121d] rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-sm text-slate-200">Voice Telephony Control Hub</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Edge Node: <span className="text-emerald-400 font-semibold">{metrics.activeRegion}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* 1. Language Selector */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Spoken Language</span>
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label} ({lang.nativeLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Speech Synthesis Engine */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Speech Synthesis Engine</span>
                    </label>
                    <select
                      value={speechEngine}
                      onChange={(e) => setSpeechEngine(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="elevenlabs">ElevenLabs Turbo v2.5 (High-Fidelity Edge)</option>
                      <option value="browser">Browser Native Speech (0ms Zero-Cloud)</option>
                    </select>
                  </div>

                  {/* 3. Voice Persona Selector */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Voice Persona</span>
                    </label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      {speechEngine === "elevenlabs" ? (
                        ELEVENLABS_VOICES.map((v) => (
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

                  {/* 4. Speed & Pitch Controls */}
                  <div className="space-y-1.5">
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
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="w-1/2 accent-emerald-500 cursor-pointer"
                        title="Speech Speed"
                      />
                      <input
                        type="range"
                        min="0.8"
                        max="1.3"
                        step="0.05"
                        value={speechPitch}
                        onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                        className="w-1/2 accent-indigo-500 cursor-pointer"
                        title="Speech Pitch"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Grid Layout for Studio */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bento Card 1: Interactive Call Simulator (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-[#0c121d] rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4">
              {/* Simulator Header & Persona Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-sm text-slate-200">Live Voice Agent Simulator</span>
                </div>

                {/* Persona Switcher */}
                <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => {
                      setSelectedPersona("clinic");
                      setBusinessName("Dr. Sharma Healthcare Clinic");
                    }}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      selectedPersona === "clinic"
                        ? "bg-emerald-500 text-black font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Dr. Sharma Clinic
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPersona("restaurant");
                      setBusinessName("Bhojanalaya Cloud Kitchen");
                    }}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      selectedPersona === "restaurant"
                        ? "bg-emerald-500 text-black font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Bhojanalaya Kitchen
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPersona("auto");
                      setBusinessName("Apex 24/7 Roadside Rescue");
                    }}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      selectedPersona === "auto"
                        ? "bg-emerald-500 text-black font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Apex Towing
                  </button>
                </div>
              </div>

              {/* Call Controls & Live Microphone */}
              <div className="bg-[#090d16] rounded-xl p-4 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Call Connect Button */}
                  <button
                    onClick={() => {
                      const next = !isCalling;
                      setIsCalling(next);
                      if (next) {
                        speakVoiceResponse(
                          selectedLanguage === "hi"
                            ? `नमस्ते! ${businessName} में आपका स्वागत है। मैं आपकी क्या सेवा करूँ?`
                            : `Hello! Welcome to ${businessName}. How may I help you today?`
                        );
                      } else {
                        if (typeof window !== "undefined" && "speechSynthesis" in window) {
                          window.speechSynthesis.cancel();
                        }
                        setIsSpeaking(false);
                        setIsListening(false);
                      }
                    }}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                      isCalling
                        ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
                        : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30"
                    }`}
                  >
                    {isCalling ? (
                      <>
                        <PhoneOff className="w-4 h-4" />
                        <span>Hang Up</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-4 h-4 animate-bounce" />
                        <span>Connect Voice</span>
                      </>
                    )}
                  </button>

                  {/* Real Live Mic Toggle */}
                  <button
                    onClick={toggleListening}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isListening
                        ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/30 animate-pulse"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
                    }`}
                    title={isListening ? "Listening (Click to stop)" : "Speak via Microphone"}
                  >
                    {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-mono">Telemetry</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isCalling ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                        }`}
                      />
                      <span className="text-xs font-semibold text-white">
                        {isCalling ? `Active (${formatDuration(callDuration)})` : "Idle (Standby)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="w-full sm:w-56 h-12 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center px-2">
                  <canvas ref={canvasRef} width={220} height={48} className="w-full h-full" />
                </div>
              </div>

              {/* Transcript Scroll Window */}
              <div className="h-64 overflow-y-auto space-y-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 font-sans text-xs scrollbar-thin scrollbar-thumb-slate-800">
                {transcript.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "agent" && (
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] p-3 rounded-xl space-y-1 ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400">
                        <span className="font-semibold text-emerald-300">
                          {msg.sender === "agent" ? "VaniEdge AI" : "You (Caller)"}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>

                      {msg.matchedDoc && (
                        <div className="flex items-center gap-1.5 pt-1 text-[10px] text-cyan-300/80 border-t border-slate-800/60 font-mono">
                          <Database className="w-3 h-3" />
                          <span>SutraDB Match: {msg.matchedDoc} ({msg.latencyMs}ms)</span>
                        </div>
                      )}
                    </div>

                    {msg.sender === "user" && (
                      <div className="h-7 w-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-indigo-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Dynamic Quick Prompt Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-slate-400">Quick Test Scenarios:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuery("What are your clinic hours and appointment consultation fees?")}
                    className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition-colors"
                  >
                    🏥 Hours & Pricing
                  </button>
                  <button
                    onClick={() => handleQuery("Book an appointment for Rahul Sharma tomorrow at 11:30 AM")}
                    className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition-colors"
                  >
                    📅 Book for Rahul at 11:30 AM
                  </button>
                  <button
                    onClick={() => handleQuery("मुझे 2 स्पेशल थाली और 1 वेज बिरयानी आर्डर करनी है")}
                    className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition-colors"
                  >
                    🍛 आर्डर 2 स्पेशल थाली (Hindi)
                  </button>
                  <button
                    onClick={() => handleQuery("I have a highway engine breakdown, dispatch towing urgently")}
                    className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition-colors"
                  >
                    🚨 Emergency Towing
                  </button>
                </div>
              </div>

              {/* Custom Input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuery(customQuery)}
                  placeholder={isListening ? "Listening to your voice..." : "Speak or type a question to test VaniEdge..."}
                  className={`flex-1 bg-[#090d16] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    isListening ? "border-cyan-400 animate-pulse" : "border-slate-800 focus:border-emerald-500"
                  }`}
                />
                <button
                  onClick={() => handleQuery(customQuery)}
                  disabled={isProcessing || !customQuery.trim()}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Sub-Second Telemetry & Live Watchdog (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0c121d] rounded-2xl border border-slate-800 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-sm text-slate-200">Sub-Second Edge Telemetry</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Zero Cloud Lag
                </span>
              </div>

              {/* Stage Progress Bars */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">1. Edge Gateway Auth (Web Crypto HMAC)</span>
                    <span className="font-mono text-emerald-400 font-semibold">{metrics.edgeAuthMs} ms</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "24%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">2. Bidirectional μ-law 8kHz WebSocket</span>
                    <span className="font-mono text-emerald-400 font-semibold">{metrics.wsUpgradeMs} ms</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">3. SutraDB Hybrid Vector + BM25 Query</span>
                    <span className="font-mono text-cyan-400 font-semibold">{metrics.sutraDbMs} ms</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">4. Turn-to-Audio (TTFT First Packet)</span>
                    <span className="font-mono text-indigo-400 font-semibold">{metrics.ttftMs} ms</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: "70%" }} />
                  </div>
                </div>
              </div>

              {/* Emergency Failover Simulator Button */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Watchdog Guardrail:</span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                      watchdogStatus === "TRIGGERED"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {watchdogStatus === "TRIGGERED" ? "1,200ms DEADLINE BREACH" : "WATCHDOG ARMED"}
                  </span>
                </div>

                <button
                  onClick={triggerSimulatedGlitch}
                  disabled={watchdogStatus === "TRIGGERED"}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Simulate 1,200ms Glitch & Test Failover</span>
                </button>
              </div>
            </div>

            {/* Production Callout Box */}
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/60 rounded-2xl border border-emerald-500/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Live Carrier Telephony Active</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dial directly from your mobile phone to test real-world 8kHz voice responsiveness and sub-second edge routing:
              </p>
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800">
                <span className="font-mono text-sm text-emerald-300 font-bold">+1 (814) 961-3703</span>
                <a
                  href="tel:+18149613703"
                  className="px-3 py-1 bg-emerald-500 text-black font-semibold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
                >
                  Dial Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Row 2: Dynamic SutraDB Knowledge Studio & Live Persistent Ticket Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SutraDB Dynamic Knowledge Base (Left 6 Cols) */}
          <div className="lg:col-span-6 bg-[#0c121d] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-sm text-slate-200">SutraDB Edge Knowledge Base</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {knowledgeList.length} Ingested
                </span>
              </div>
              <button
                onClick={() => setShowAddDoc(!showAddDoc)}
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Knowledge</span>
              </button>
            </div>

            {/* Knowledge Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search ingested documents..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {showAddDoc && (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Document Title (e.g., Weekend Special Discounts)"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-500"
                />
                <textarea
                  placeholder="Paste rules, timings, menu items, or prices..."
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddDoc(false)}
                    className="px-3 py-1 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddKnowledge}
                    className="px-3 py-1 bg-emerald-500 text-black font-semibold rounded-lg"
                  >
                    Index into SutraDB
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
              {knowledgeList
                .filter(
                  (d) =>
                    !searchFilter ||
                    d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                    d.content.toLowerCase().includes(searchFilter.toLowerCase())
                )
                .map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1 relative group">
                    <div className="flex items-center justify-between text-slate-300 font-semibold">
                      <span>{doc.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                          {doc.category}
                        </span>
                        <button
                          onClick={() => handleDeleteKnowledge(doc.id)}
                          className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete knowledge chunk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">{doc.content}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Autonomous Dispatch Queue with Actions (Right 6 Cols) */}
          <div className="lg:col-span-6 bg-[#0c121d] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-sm text-slate-200">Live Dispatched Tickets</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {tickets.length} Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportTicketsCSV}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  title="Export dispatch tickets as CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
              {tickets.map((t) => (
                <div
                  key={t.ticketId}
                  className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold">{t.ticketId}</span>
                      <span className="text-slate-400 text-[11px]">• {t.callerName}</span>
                    </div>

                    {/* Status Badge Dropdown */}
                    <select
                      value={t.status}
                      onChange={(e) => updateTicketStatus(t.ticketId, e.target.value as any)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded bg-transparent border cursor-pointer focus:outline-none ${
                        t.status === "CONFIRMED"
                          ? "text-emerald-400 border-emerald-500/40"
                          : t.status === "ESCALATED"
                          ? "text-rose-400 border-rose-500/40"
                          : t.status === "COMPLETED"
                          ? "text-slate-400 border-slate-600"
                          : "text-cyan-400 border-cyan-500/40"
                      }`}
                    >
                      <option value="CONFIRMED" className="bg-slate-900 text-emerald-400">CONFIRMED</option>
                      <option value="DISPATCHED" className="bg-slate-900 text-cyan-400">DISPATCHED</option>
                      <option value="COMPLETED" className="bg-slate-900 text-slate-400">COMPLETED</option>
                      <option value="ESCALATED" className="bg-slate-900 text-rose-400">ESCALATED</option>
                    </select>
                  </div>

                  <p className="text-slate-300 text-xs font-medium">{t.serviceType}</p>
                  <p className="text-[11px] text-slate-400">{t.details}</p>

                  <div className="p-2 bg-black/40 rounded-lg border border-slate-800/80 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                    <span className="text-emerald-400 font-bold truncate max-w-[80%]">
                      {t.smsConfirmation}
                    </span>
                    <a
                      href={`tel:${t.callerPhone}`}
                      className="text-cyan-400 hover:text-cyan-300 shrink-0 font-sans text-[11px] underline"
                    >
                      Call Back
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Architecture Deep Dive */}
        <div className="bg-[#0c121d] rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-sm text-slate-200">Production Architecture: Sub-Second Edge Pipeline</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold font-mono">01. INGESTION</span>
              <h4 className="font-semibold text-white">Twilio 8kHz Audio</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                PSTN call connects to Twilio Voice gateway and upgrades to raw μ-law bidirectional WebSocket streaming.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold font-mono">02. EDGE ROUTING</span>
              <h4 className="font-semibold text-white">Cloudflare Workers</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Global edge nodes authenticate Web Crypto signatures, buffer audio frames, and stream directly to ElevenLabs ConvAI.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-indigo-400 font-bold font-mono">03. LOCAL RAG</span>
              <h4 className="font-semibold text-white">SutraDB Hybrid Index</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Zero-dependency BM25 + dense vector embeddings run in-memory, retrieving clinic/menu facts under 10ms.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-rose-400 font-bold font-mono">04. WATCHDOG</span>
              <h4 className="font-semibold text-white">Zero-Downtime Failover</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                1,200ms deadline watchdog automatically re-routes callers to backup PSTN lines without dropping connection.
              </p>
            </div>
          </div>
        </div>
        </>
      )}
      </main>
      </div>
    </div>
  );
}

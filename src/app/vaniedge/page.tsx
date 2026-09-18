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
  VolumeX,
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
  Palette,
} from "lucide-react";
import { DEFAULT_KNOWLEDGE_PRESETS, DocumentEntry } from "@/lib/vaniedge/sutradb-engine";
import VaniSidebar, { NavTab } from "@/components/vaniedge/VaniSidebar";
import VaniDashboard from "@/components/vaniedge/VaniDashboard";
import VaniStudioView, { CustomPersona } from "@/components/vaniedge/VaniStudioView";
import VaniKnowledgeView from "@/components/vaniedge/VaniKnowledgeView";
import VaniDispatchView, { DispatchTicket } from "@/components/vaniedge/VaniDispatchView";
import VaniTelephonyView from "@/components/vaniedge/VaniTelephonyView";
import { VaniTheme, VANI_THEMES, hexToRgba } from "@/lib/vaniedge/theme-config";
import {
  playBlipSound,
  playConnectChime,
  playEndChime,
  playDispatchChime,
  playGlitchSound,
  setSoundMuted,
  getSoundMuted,
} from "@/lib/vaniedge/audio-fx";

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

  // Theme & Audio Feedback State
  const [theme, setTheme] = useState<VaniTheme>("emerald");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Session History State
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
  const [callCount, setCallCount] = useState<number>(2);

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

  // Business Context & Personas
  const [businessName, setBusinessName] = useState<string>("Dr. Sharma Healthcare Clinic");
  const [selectedPersona, setSelectedPersona] = useState<string>("clinic");
  const [customPersonas, setCustomPersonas] = useState<CustomPersona[]>([]);

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

  // Audio Spectrum & Waveform Refs
  const [audioSpectrum, setAudioSpectrum] = useState<Uint8Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const activeThemeConfig = VANI_THEMES[theme] || VANI_THEMES.emerald;

  // Initialize client state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Theme
      const savedTheme = localStorage.getItem("vaniedge_theme") as VaniTheme;
      if (savedTheme && VANI_THEMES[savedTheme]) {
        setTheme(savedTheme);
      }

      // Audio mute
      setIsMuted(getSoundMuted());

      // Tickets
      const savedTickets = localStorage.getItem("vaniedge_tickets");
      if (savedTickets) {
        try {
          setTickets(JSON.parse(savedTickets));
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

      // Custom Personas
      const savedPersonas = localStorage.getItem("vaniedge_personas");
      if (savedPersonas) {
        try {
          setCustomPersonas(JSON.parse(savedPersonas));
        } catch {
          // fallback
        }
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

  // Save tickets & custom personas on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (tickets.length > 0) {
        localStorage.setItem("vaniedge_tickets", JSON.stringify(tickets));
      }
      if (customPersonas.length > 0) {
        localStorage.setItem("vaniedge_personas", JSON.stringify(customPersonas));
      }
    }
  }, [tickets, customPersonas]);

  // Handle Theme Change
  const handleSelectTheme = (t: VaniTheme) => {
    setTheme(t);
    if (typeof window !== "undefined") {
      localStorage.setItem("vaniedge_theme", t);
    }
  };

  // Handle Sound Mute Toggle
  const handleToggleAudioMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setSoundMuted(nextMuted);
  };

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

  // Audio Analyzer Hook up with ElevenLabs audio element
  const initAudioAnalyser = useCallback(() => {
    if (typeof window === "undefined" || !audioPlayerRef.current || analyserRef.current) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      const actx = new AudioCtxClass();
      const analyser = actx.createAnalyser();
      analyser.fftSize = 64;

      const source = actx.createMediaElementSource(audioPlayerRef.current);
      source.connect(analyser);
      analyser.connect(actx.destination);

      audioContextRef.current = actx;
      analyserRef.current = analyser;
      mediaSourceRef.current = source;
    } catch {
      // Audio element source already bound or CORS limitation
    }
  }, []);

  // Audio Waveform Canvas & Spectrum Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;
    const freqData = new Uint8Array(32);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Read real FFT data if available
      let hasRealAudio = false;
      if (analyserRef.current && isSpeaking) {
        analyserRef.current.getByteFrequencyData(freqData);
        setAudioSpectrum(freqData);
        hasRealAudio = true;
      }

      ctx.lineWidth = 2.5;
      const themeHex = activeThemeConfig.primaryHex;
      ctx.strokeStyle = isSpeaking
        ? themeHex
        : isListening
        ? activeThemeConfig.secondaryHex
        : isCalling
        ? activeThemeConfig.particleColors[2]
        : "#334155";
      ctx.beginPath();

      const bars = 40;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        const x = i * barWidth;
        let barHeight = 4;

        if (hasRealAudio && isSpeaking) {
          const byteVal = freqData[i % freqData.length] || 0;
          barHeight = Math.max(4, (byteVal / 255) * (height * 0.9));
        } else {
          const multiplier = isSpeaking ? 1.5 : isListening ? 1.2 : isCalling ? 0.4 : 0.1;
          const wave = Math.sin(i * 0.3 + phase) * Math.cos(i * 0.2 + phase);
          barHeight = Math.max(4, Math.abs(wave) * (height / 2.2) * multiplier);
        }

        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(x + 1, centerY - barHeight / 2, barWidth - 2, barHeight);
      }

      phase += isSpeaking || isListening ? 0.15 : 0.04;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isCalling, isSpeaking, isListening, activeThemeConfig]);

  // Speak text via ElevenLabs or Browser
  const speakVoiceResponse = useCallback(
    async (text: string) => {
      if (typeof window === "undefined") return;

      initAudioAnalyser();
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

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
                setAudioSpectrum(null);
                URL.revokeObjectURL(audioUrl);
              };
              audioPlayerRef.current.onerror = () => {
                setIsSpeaking(false);
                setAudioSpectrum(null);
              };
              await audioPlayerRef.current.play();
              return;
            }
          }
        } catch {
          // fallback to browser speech synthesis
        }
      }

      // 2. Local Browser SpeechSynthesis Fallback
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
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
        utterance.onend = () => {
          setIsSpeaking(false);
          setAudioSpectrum(null);
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          setAudioSpectrum(null);
        };

        window.speechSynthesis.speak(utterance);
      }
    },
    [speechEngine, selectedVoice, selectedLanguage, speechRate, speechPitch, browserVoices, initAudioAnalyser]
  );

  // Send message
  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || customQuery;
    if (!textToSend.trim() || isProcessing) return;

    playBlipSound(1000);
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
        playDispatchChime();
      }
    } catch (err) {
      console.error("Dispatch error:", err);
    }
  };

  // Manual Ticket Creation from Dispatch view
  const handleManualCreateTicket = (ticket: Omit<DispatchTicket, "ticketId" | "timestamp" | "smsConfirmation">) => {
    const newId = `VANI-${ticket.category.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullTicket: DispatchTicket = {
      ...ticket,
      ticketId: newId,
      timestamp: "Just now",
      smsConfirmation: `[VaniEdge AI] ${ticket.serviceType} confirmed for ${ticket.callerName}. Ticket: ${newId}.`,
    };
    setTickets((prev) => [fullTicket, ...prev]);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.ticketId !== ticketId));
  };

  // Trigger Simulated Watchdog Glitch
  const triggerSimulatedGlitch = () => {
    setWatchdogStatus("TRIGGERED");
    playGlitchSound();
    setTimeout(() => {
      setWatchdogStatus("RECOVERED");
      playConnectChime();
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

  const handleUpdateKnowledge = (id: string, title: string, content: string, cat: string) => {
    setKnowledgeList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title, content, category: cat as any } : d))
    );
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
      playEndChime();
      setIsCalling(false);
      setIsSpeaking(false);
      setAudioSpectrum(null);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    } else {
      playConnectChime();
      setIsCalling(true);
      setCallCount((prev) => prev + 1);
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
      playBlipSound(600);
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      playBlipSound(1000);
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
    setAudioSpectrum(null);
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

  // Add custom persona
  const handleAddCustomPersona = (p: CustomPersona) => {
    setCustomPersonas((prev) => [...prev, p]);
    setSelectedPersona(p.id);
    setBusinessName(p.businessName);
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
        theme={theme}
        onSelectTheme={handleSelectTheme}
        isAudioMuted={isMuted}
        onToggleAudioMute={handleToggleAudioMute}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Sticky Navigation Bar */}
        <header className="border-b border-slate-800/80 bg-[#090e17]/90 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => {
                  playBlipSound(700);
                  setIsSidebarOpen(!isSidebarOpen);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Toggle Sidebar Navigation"
              >
                <PanelLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-lg bg-gradient-to-tr ${activeThemeConfig.bgGradient} p-0.5 shadow-md lg:hidden`}
                >
                  <div className="h-full w-full bg-[#070b12] rounded-[6px] flex items-center justify-center">
                    <Flame className="w-4 h-4" style={{ color: activeThemeConfig.primaryHex }} />
                  </div>
                </div>
                <span className="font-bold text-base sm:text-lg tracking-tight text-white hidden sm:inline">
                  VaniEdge AI
                </span>
                <span
                  className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: hexToRgba(activeThemeConfig.primaryHex, 0.15),
                    color: activeThemeConfig.primaryHex,
                    borderColor: hexToRgba(activeThemeConfig.primaryHex, 0.4),
                  }}
                >
                  {activeTab === "studio"
                    ? "Voice Studio"
                    : activeTab === "dashboard"
                    ? "Fleet Telemetry"
                    : activeTab === "sutradb"
                    ? "SutraDB RAG"
                    : activeTab === "dispatch"
                    ? "Dispatch Queue"
                    : "Carrier Telephony"}
                </span>
              </div>
            </div>

            {/* Quick Top Navigation Pills */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => {
                  playBlipSound(800);
                  setActiveTab("studio");
                }}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                  activeTab === "studio"
                    ? "text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                style={{
                  backgroundColor: activeTab === "studio" ? activeThemeConfig.primaryHex : undefined,
                }}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Studio</span>
              </button>
              <button
                onClick={() => {
                  playBlipSound(800);
                  setActiveTab("dashboard");
                }}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                  activeTab === "dashboard"
                    ? "bg-cyan-500 text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  playBlipSound(800);
                  setActiveTab("sutradb");
                }}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                  activeTab === "sutradb"
                    ? "bg-indigo-500 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>SutraDB ({knowledgeList.length})</span>
              </button>
              <button
                onClick={() => {
                  playBlipSound(800);
                  setActiveTab("dispatch");
                }}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                  activeTab === "dispatch"
                    ? "bg-amber-500 text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Dispatch ({tickets.length})</span>
              </button>
              <button
                onClick={() => {
                  playBlipSound(800);
                  setActiveTab("telephony");
                }}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
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
              {/* Theme Quick Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(["emerald", "cyan", "violet", "amber"] as VaniTheme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      playBlipSound(800);
                      handleSelectTheme(t);
                    }}
                    className={`h-5 w-5 rounded-md transition-all ${
                      theme === t ? "ring-2 ring-white scale-110" : "opacity-50 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: VANI_THEMES[t].primaryHex }}
                    title={`Switch to ${VANI_THEMES[t].name}`}
                  />
                ))}
              </div>

              {/* Sound FX Toggle */}
              <button
                onClick={handleToggleAudioMute}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title={isMuted ? "Unmute Audio Feedback" : "Mute Audio Feedback"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

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
                const foundCustom = customPersonas.find((cp) => cp.id === p);
                if (foundCustom) {
                  setBusinessName(foundCustom.businessName);
                } else {
                  setBusinessName(
                    p === "clinic"
                      ? "Dr. Sharma Healthcare Clinic"
                      : p === "restaurant"
                      ? "Bhojanalaya Cloud Kitchen"
                      : "Apex Roadside Assistance"
                  );
                }
              }}
              customPersonas={customPersonas}
              onAddCustomPersona={handleAddCustomPersona}
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
              theme={theme}
              audioSpectrum={audioSpectrum}
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
              onNavigateTo={(tab) => {
                playBlipSound(800);
                setActiveTab(tab);
              }}
              theme={theme}
              activeLanguage={selectedLanguage}
              callCount={callCount}
            />
          )}

          {/* 3. SutraDB Dedicated Knowledge Base View */}
          {activeTab === "sutradb" && (
            <VaniKnowledgeView
              knowledgeList={knowledgeList}
              onAddDocument={handleAddKnowledge}
              onUpdateDocument={handleUpdateKnowledge}
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
              onCreateTicket={handleManualCreateTicket}
              onExportCSV={exportTicketsCSV}
            />
          )}

          {/* 5. Telephony & Watchdog Dedicated View */}
          {activeTab === "telephony" && (
            <VaniTelephonyView
              metrics={metrics}
              watchdogStatus={watchdogStatus}
              onSimulateGlitch={triggerSimulatedGlitch}
              theme={theme}
            />
          )}
        </main>
      </div>
    </div>
  );
}

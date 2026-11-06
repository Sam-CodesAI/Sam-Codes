"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  queryDeterministicAssistant,
  assistantKnowledgeBase,
  KnowledgeQnA,
} from "@/data/assistantKnowledge";
import { soundFx } from "@/utils/sound";
import { Sparkles, Send, X, Bot, User, RotateCcw } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

const DEFAULT_CHIPS = [
  "What does Sam build?",
  "How can Sam help?",
  "What is Sam currently exploring?",
  "Show me Sam's work.",
  "How can I work with Sam?",
];

export default function AskSamAssistant({
  knowledge = assistantKnowledgeBase,
}: {
  knowledge?: KnowledgeQnA[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Hello! I am Sam's portfolio assistant. Ask me anything about what Sam builds, his approach to automation and web systems, or how to get in touch.",
      timestamp: "Just now",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-ask-sam", handleOpen);
    return () => window.removeEventListener("open-ask-sam", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    soundFx.playHover();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      let answerText = "";
      if (res.ok) {
        const data = (await res.json()) as { answer?: string };
        if (data.answer) {
          answerText = data.answer;
        }
      }

      if (!answerText) {
        answerText = queryDeterministicAssistant(query, knowledge);
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: answerText,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackAnswer = queryDeterministicAssistant(query, knowledge);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: fallbackAnswer,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
      soundFx.playChime(560, 0.08);
    }
  };

  const handleResetChat = () => {
    soundFx.playHover();
    setMessages([
      {
        id: "welcome",
        sender: "assistant",
        text: "Chat refreshed. What would you like to know about Sam?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Desktop Only, subtle glass button so it never obstructs content) */}
      <button
        type="button"
        onClick={() => {
          soundFx.playChime(600, 0.08);
          setIsOpen(!isOpen);
        }}
        aria-label="Toggle Ask Sam assistant"
        title="Ask Sam AI Assistant"
        className="hidden md:flex fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#080d1a]/85 hover:bg-blue-600 border border-white/10 hover:border-blue-400/50 text-slate-300 hover:text-white shadow-2xl shadow-black/80 transition-all duration-300 hover:scale-110 cursor-pointer backdrop-blur-xl group items-center justify-center min-h-[44px] min-w-[44px]"
      >
        <Sparkles size={17} className="text-[#ccff00] group-hover:text-white transition-colors" />
        <span className="sr-only">Ask Sam</span>
      </button>

      {/* Assistant Modal / Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ask Sam Assistant"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
        >
          <div className="relative w-full sm:max-w-lg h-[80vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl bg-[#080d1a] border border-[#1e293b] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#1e293b] flex items-center justify-between bg-[#0f172a]/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Ask Sam</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 font-semibold">
                      Zero Hallucination
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Grounded Knowledge Agent
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close assistant"
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-mono text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.sender === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <Bot size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                      m.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none font-sans text-xs sm:text-sm shadow-md shadow-blue-600/20"
                        : "bg-[#0f172a] border border-[#1e293b] text-slate-200 rounded-tl-none font-sans text-xs sm:text-sm"
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.sender === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 items-center text-slate-500 font-mono text-xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Bot size={14} />
                  </div>
                  <span className="animate-pulse">Retrieving grounded facts...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-t border-[#1e293b] bg-[#030509]/60 overflow-x-auto flex gap-1.5 no-scrollbar">
              {DEFAULT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(chip)}
                  className="px-2.5 py-1 rounded-full bg-[#080d1a] hover:bg-[#0f172a] border border-[#1e293b] hover:border-blue-500/40 text-[11px] text-slate-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 sm:p-4 border-t border-[#1e293b] bg-[#080d1a] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about turnaround, scoping, or how Sam builds..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#030509] border border-[#1e293b] text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-400 transition-colors min-h-[44px]"
              />

              <button
                type="submit"
                disabled={!inputValue.trim()}
                aria-label="Send question"
                className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-md shadow-blue-600/30"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

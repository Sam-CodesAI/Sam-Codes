"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
  Search,
  Sparkles,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import { KnowledgeQnA } from "@/data/assistantKnowledge";

export default function AdminAssistantPage() {
  const { showToast } = useToast();
  const [knowledge, setKnowledge] = useState<KnowledgeQnA[]>([]);
  const [initialKnowledge, setInitialKnowledge] = useState<KnowledgeQnA[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<KnowledgeQnA | null>(null);

  const fetchKnowledge = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/assistant");
      if (res.ok) {
        const json = await res.json();
        setKnowledge(json.knowledge || []);
        setInitialKnowledge(json.knowledge || []);
      }
    } catch {
      showToast("Failed to load assistant knowledge", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const isDirty =
    JSON.stringify(knowledge) !== JSON.stringify(initialKnowledge);

  const handleUpdateItem = (
    index: number,
    field: keyof KnowledgeQnA,
    val: any
  ) => {
    setKnowledge((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleAddKeyword = (index: number, keyword: string) => {
    if (!keyword.trim()) return;
    const item = knowledge[index];
    if (!item.keywords.includes(keyword.trim().toLowerCase())) {
      handleUpdateItem(index, "keywords", [
        ...item.keywords,
        keyword.trim().toLowerCase(),
      ]);
    }
  };

  const handleRemoveKeyword = (itemIndex: number, keyword: string) => {
    const item = knowledge[itemIndex];
    handleUpdateItem(
      itemIndex,
      "keywords",
      item.keywords.filter((k) => k !== keyword)
    );
  };

  const handleAddItem = () => {
    const newItem: KnowledgeQnA = {
      id: `qna-${Date.now()}`,
      question: "New Assistant Question?",
      keywords: ["question", "custom"],
      answer: "Accurate response grounded in Sam's genuine capabilities and services.",
    };
    setKnowledge((prev) => [newItem, ...prev]);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/assistant?id=${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setKnowledge((prev) => prev.filter((k) => k.id !== itemToDelete.id));
        showToast("Knowledge entry deleted", "info");
        setItemToDelete(null);
      }
    } catch {
      showToast("Failed to delete entry", "error");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const k of knowledge) {
        await fetch("/api/admin/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(k),
        });
      }
      setInitialKnowledge(knowledge);
      setLastSavedAt(new Date().toLocaleTimeString());
      showToast("Assistant knowledge base updated", "success");
    } catch {
      showToast("Failed to save knowledge", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setKnowledge(initialKnowledge);
    showToast("Changes reverted", "info");
  };

  const filteredKnowledge = knowledge.filter(
    (k) =>
      k.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.keywords.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminShell>
      <div className="space-y-6 pb-20 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <MessageSquare size={14} />
              <span>Ask Sam AI Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Knowledge Base Q&A
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Train the portfolio assistant with verified truth pairs. Eliminate hallucinations and fabrications.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all cursor-pointer min-h-[44px]"
          >
            <Plus size={15} />
            <span>Add Q&A Pair</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search questions, answers, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
          />
        </div>

        {/* List of Knowledge items */}
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-slate-500">
            Loading knowledge base...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredKnowledge.map((item, idx) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-6 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      Q
                    </span>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) =>
                        handleUpdateItem(idx, "question", e.target.value)
                      }
                      className="w-full text-sm sm:text-base font-bold text-white bg-transparent border-b border-transparent hover:border-white/[0.2] focus:border-sky-500/50 focus:outline-none font-mono py-1"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setItemToDelete(item)}
                    className="p-2 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Verified Answer (Assistant Prompt Grounding)
                  </label>
                  <textarea
                    rows={3}
                    value={item.answer}
                    onChange={(e) =>
                      handleUpdateItem(idx, "answer", e.target.value)
                    }
                    className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 font-sans"
                  />
                </div>

                {/* Keywords tags */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Matching Keywords
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-sky-400 flex items-center gap-1"
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(idx, kw)}
                          className="hover:text-rose-400 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      placeholder="+ add keyword"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddKeyword(
                            idx,
                            (e.target as HTMLInputElement).value
                          );
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                      className="px-2.5 py-1 rounded-md bg-transparent border border-dashed border-white/[0.1] text-[11px] font-mono text-slate-300 focus:outline-none focus:border-sky-400 w-28"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save Bar */}
        <SaveBar
          isDirty={isDirty}
          isSaving={isSaving}
          lastSavedAt={lastSavedAt}
          onSaveDraft={handleSave}
          onPublish={handleSave}
          onDiscard={handleDiscard}
          publishLabel="Save Knowledge"
        />

        {/* Delete Dialog */}
        <ConfirmDialog
          isOpen={!!itemToDelete}
          title="Delete Knowledge Item"
          message={`Are you sure you want to delete "${itemToDelete?.question}"?`}
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setItemToDelete(null)}
        />
      </div>
    </AdminShell>
  );
}

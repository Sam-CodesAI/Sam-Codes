"use client";

import React, { useEffect, useState } from "react";
import {
  Compass,
  Plus,
  Trash2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import { ExplorationItem } from "@/data/exploring";

const CATEGORIES: ExplorationItem["category"][] = [
  "AI",
  "Engineering",
  "Workflows",
  "Interface",
];

const STATUSES: ExplorationItem["status"][] = [
  "Active Research",
  "Experimenting",
  "Building",
];

export default function AdminExploringPage() {
  const { showToast } = useToast();
  const [topics, setTopics] = useState<ExplorationItem[]>([]);
  const [initialTopics, setInitialTopics] = useState<ExplorationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [topicToDelete, setTopicToDelete] = useState<ExplorationItem | null>(null);

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/exploring");
      if (res.ok) {
        const json = await res.json();
        setTopics(json.topics || []);
        setInitialTopics(json.topics || []);
      }
    } catch {
      showToast("Failed to load exploring topics", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const isDirty =
    JSON.stringify(topics) !== JSON.stringify(initialTopics);

  const handleUpdateTopic = <K extends keyof ExplorationItem>(
    index: number,
    field: K,
    val: ExplorationItem[K]
  ) => {
    setTopics((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleAddTopic = () => {
    const newTopic: ExplorationItem = {
      name: "New R&D Topic",
      category: "AI",
      status: "Active Research",
      focus: "Exploration objective and experimental questions...",
    };
    setTopics((prev) => [...prev, newTopic]);
  };

  const handleDeleteConfirm = async () => {
    if (!topicToDelete) return;
    try {
      const res = await fetch(
        `/api/admin/exploring?name=${encodeURIComponent(topicToDelete.name)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setTopics((prev) => prev.filter((t) => t.name !== topicToDelete.name));
        showToast(`Topic "${topicToDelete.name}" deleted`, "info");
        setTopicToDelete(null);
      }
    } catch {
      showToast("Failed to delete topic", "error");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const t of topics) {
        await fetch("/api/admin/exploring", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(t),
        });
      }
      setInitialTopics(topics);
      setLastSavedAt(new Date().toLocaleTimeString());
      showToast("All exploring topics saved successfully", "success");
    } catch {
      showToast("Failed to save topics", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setTopics(initialTopics);
    showToast("Changes reverted", "info");
  };

  return (
    <AdminShell>
      <div className="space-y-6 pb-20 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <Compass size={14} />
              <span>Research & Development</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Currently Exploring
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Signal your ongoing learning and active engineering curiosity to clients and builders.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddTopic}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all cursor-pointer min-h-[44px]"
          >
            <Plus size={15} />
            <span>Add Topic</span>
          </button>
        </div>

        {/* List of Topics */}
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-slate-500">
            Loading exploration topics...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((t, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => handleUpdateTopic(idx, "name", e.target.value)}
                    className="text-sm font-bold text-white bg-transparent border-b border-white/[0.1] focus:border-sky-400 focus:outline-none font-mono py-0.5 flex-1"
                  />

                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.status} />
                    <button
                      type="button"
                      onClick={() => setTopicToDelete(t)}
                      className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Category
                    </label>
                    <select
                      value={t.category}
                      onChange={(e) =>
                        handleUpdateTopic(idx, "category", e.target.value as ExplorationItem["category"])
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-xs font-mono text-slate-300 min-h-[38px]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Current Stage
                    </label>
                    <select
                      value={t.status}
                      onChange={(e) =>
                        handleUpdateTopic(idx, "status", e.target.value as ExplorationItem["status"])
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-xs font-mono text-slate-300 min-h-[38px]"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Focus / Technical Objective
                  </label>
                  <textarea
                    rows={2}
                    value={t.focus}
                    onChange={(e) =>
                      handleUpdateTopic(idx, "focus", e.target.value)
                    }
                    className="w-full p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 font-sans"
                  />
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
          publishLabel="Save Topics"
        />

        {/* Delete Dialog */}
        <ConfirmDialog
          isOpen={!!topicToDelete}
          title="Delete Exploring Topic"
          message={`Are you sure you want to delete "${topicToDelete?.name}"?`}
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setTopicToDelete(null)}
        />
      </div>
    </AdminShell>
  );
}

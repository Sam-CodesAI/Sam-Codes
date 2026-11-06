"use client";

import React, { useEffect, useState } from "react";
import {
  Cpu,
  Plus,
  Trash2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { useToast } from "@/components/admin/ToastProvider";
import { TechItem, CapabilityItem } from "@/data/capabilities";

interface CapabilitiesState {
  buildingWith: TechItem[];
  exploringStack: TechItem[];
  coreCapabilities: CapabilityItem[];
}

const CATEGORIES: TechItem["category"][] = [
  "Frontend",
  "Backend & AI",
  "Tools & Cloud",
  "Databases & APIs",
];

export default function AdminCapabilitiesPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<CapabilitiesState | null>(null);
  const [initialData, setInitialData] = useState<CapabilitiesState | null>(null);
  const [activeTab, setActiveTab] = useState<"building" | "exploring" | "core">("building");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const fetchCapabilities = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/capabilities");
      if (res.ok) {
        const json = await res.json();
        setData(json.capabilities);
        setInitialData(json.capabilities);
      }
    } catch {
      showToast("Failed to load capabilities", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCapabilities();
  }, []);

  const isDirty =
    data && initialData
      ? JSON.stringify(data) !== JSON.stringify(initialData)
      : false;

  const handleAddTechItem = (type: "buildingWith" | "exploringStack") => {
    if (!data) return;
    const newItem: TechItem = {
      name: "New Technology",
      category: "Backend & AI",
      description: "Production use case or architecture integration description.",
    };
    setData({
      ...data,
      [type]: [...data[type], newItem],
    });
  };

  const handleUpdateTechItem = (
    type: "buildingWith" | "exploringStack",
    index: number,
    field: keyof TechItem,
    val: string
  ) => {
    if (!data) return;
    const updated = [...data[type]];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, [type]: updated });
  };

  const handleRemoveTechItem = (
    type: "buildingWith" | "exploringStack",
    index: number
  ) => {
    if (!data) return;
    setData({
      ...data,
      [type]: data[type].filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/capabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setInitialData(data);
        setLastSavedAt(new Date().toLocaleTimeString());
        showToast("Capabilities & stack saved successfully", "success");
      } else {
        showToast("Failed to save capabilities", "error");
      }
    } catch {
      showToast("Network error while saving capabilities", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setData(initialData);
    showToast("Changes reverted", "info");
  };

  if (isLoading || !data) {
    return (
      <AdminShell>
        <div className="p-16 text-center text-xs font-mono text-slate-500">
          Loading capabilities...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6 pb-20 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <Cpu size={14} />
              <span>Technical Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Capabilities & Tech Stack
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Curate active production technologies, exploring R&D queue, and engineering pillars.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] overflow-x-auto scrollbar-none pb-px">
          <button
            type="button"
            onClick={() => setActiveTab("building")}
            className={`px-4 py-3 text-xs font-mono border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeTab === "building"
                ? "border-sky-400 text-sky-400 font-bold bg-sky-500/[0.04]"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Building With ({data.buildingWith.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("exploring")}
            className={`px-4 py-3 text-xs font-mono border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeTab === "exploring"
                ? "border-sky-400 text-sky-400 font-bold bg-sky-500/[0.04]"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Exploring Stack ({data.exploringStack.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("core")}
            className={`px-4 py-3 text-xs font-mono border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeTab === "core"
                ? "border-sky-400 text-sky-400 font-bold bg-sky-500/[0.04]"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Core Pillars ({data.coreCapabilities.length})
          </button>
        </div>

        {/* TAB: BUILDING WITH */}
        {activeTab === "building" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Active Production Technologies
                </h2>
                <p className="text-[11px] font-mono text-slate-400">
                  Tools and frameworks you actively use to deliver production systems
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleAddTechItem("buildingWith")}
                className="px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Plus size={14} />
                <span>Add Technology</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.buildingWith.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleUpdateTechItem("buildingWith", idx, "name", e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-bold text-white font-mono"
                    />

                    <select
                      value={item.category}
                      onChange={(e) =>
                        handleUpdateTechItem("buildingWith", idx, "category", e.target.value)
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-[11px] font-mono text-slate-300"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveTechItem("buildingWith", idx)}
                      className="p-1.5 hover:text-rose-400 text-slate-500 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateTechItem("buildingWith", idx, "description", e.target.value)
                    }
                    className="w-full p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 font-sans"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: EXPLORING STACK */}
        {activeTab === "exploring" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Exploring Technology Queue
                </h2>
                <p className="text-[11px] font-mono text-slate-400">
                  Technologies currently in your research and experimental validation queue
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleAddTechItem("exploringStack")}
                className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Plus size={14} />
                <span>Add Exploring Tool</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.exploringStack.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleUpdateTechItem("exploringStack", idx, "name", e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-bold text-white font-mono"
                    />

                    <select
                      value={item.category}
                      onChange={(e) =>
                        handleUpdateTechItem("exploringStack", idx, "category", e.target.value)
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-[11px] font-mono text-slate-300"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveTechItem("exploringStack", idx)}
                      className="p-1.5 hover:text-rose-400 text-slate-500 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateTechItem("exploringStack", idx, "description", e.target.value)
                    }
                    className="w-full p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 font-sans"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CORE PILLARS */}
        {activeTab === "core" && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Core Engineering Pillars
            </h2>

            <div className="space-y-4">
              {data.coreCapabilities.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const updated = [...data.coreCapabilities];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setData({ ...data, coreCapabilities: updated });
                      }}
                      className="w-full text-base font-bold text-white bg-transparent border-b border-white/[0.1] focus:border-sky-400 focus:outline-none pb-1 font-mono"
                    />
                  </div>

                  <textarea
                    rows={3}
                    value={pillar.description}
                    onChange={(e) => {
                      const updated = [...data.coreCapabilities];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setData({ ...data, coreCapabilities: updated });
                    }}
                    className="w-full p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 font-sans"
                  />
                </div>
              ))}
            </div>
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
          publishLabel="Save Tech Stack"
        />
      </div>
    </AdminShell>
  );
}

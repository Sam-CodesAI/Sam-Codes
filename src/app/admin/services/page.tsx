"use client";

import React, { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import { ServiceOffering } from "@/data/services";

export default function AdminServicesPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [initialServices, setInitialServices] = useState<ServiceOffering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceOffering | null>(null);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
        setInitialServices(data.services || []);
      }
    } catch {
      showToast("Failed to load services", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const isDirty =
    JSON.stringify(services) !== JSON.stringify(initialServices);

  const handleUpdateService = <K extends keyof ServiceOffering>(
    index: number,
    field: K,
    val: ServiceOffering[K]
  ) => {
    setServices((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleAddDeliverable = (serviceIndex: number, text: string) => {
    if (!text.trim()) return;
    setServices((prev) => {
      const updated = [...prev];
      updated[serviceIndex] = {
        ...updated[serviceIndex],
        deliverables: [...updated[serviceIndex].deliverables, text.trim()],
      };
      return updated;
    });
  };

  const handleRemoveDeliverable = (
    serviceIndex: number,
    delivIndex: number
  ) => {
    setServices((prev) => {
      const updated = [...prev];
      updated[serviceIndex] = {
        ...updated[serviceIndex],
        deliverables: updated[serviceIndex].deliverables.filter(
          (_, i) => i !== delivIndex
        ),
      };
      return updated;
    });
  };

  const handleAddNewService = () => {
    const newService: ServiceOffering = {
      id: `service-${Date.now()}`,
      title: "New Custom Service",
      tagline: "Tailored engineering solution for specific technical bottlenecks.",
      description: "Comprehensive scope covering architecture, implementation, and deployment.",
      deliverables: ["Custom software architecture", "Source code repository", "Production deployment"],
    };
    setServices((prev) => [...prev, newService]);
    showToast("New service added to editor", "info");
  };

  const handleDeleteService = () => {
    if (!serviceToDelete) return;
    setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
    setServiceToDelete(null);
    showToast(`Service "${serviceToDelete.title}" removed`, "info");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save all services
      for (const service of services) {
        await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(service),
        });
      }
      setInitialServices(services);
      setLastSavedAt(new Date().toLocaleTimeString());
      showToast("All services saved successfully", "success");
    } catch {
      showToast("Failed to save services", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setServices(initialServices);
    showToast("Changes reverted", "info");
  };

  return (
    <AdminShell>
      <div className="space-y-6 pb-20 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <Layers size={14} />
              <span>Commercial Offerings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Service Offerings
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Configure what you build for clients, deliverables checklists, and value propositions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddNewService}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all cursor-pointer min-h-[44px]"
          >
            <Plus size={15} />
            <span>Add Service</span>
          </button>
        </div>

        {/* Services List */}
        {isLoading ? (
          <div className="p-16 text-center text-xs font-mono text-slate-500">
            Loading service offerings...
          </div>
        ) : (
          <div className="space-y-6">
            {services.map((service, sIdx) => (
              <div
                key={service.id}
                className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      0{sIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) =>
                        handleUpdateService(sIdx, "title", e.target.value)
                      }
                      className="w-full text-base sm:text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-white/[0.2] focus:border-sky-500/50 focus:outline-none px-1 py-0.5"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setServiceToDelete(service)}
                    className="p-2 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete service"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Tagline (Value Proposition)
                  </label>
                  <input
                    type="text"
                    value={service.tagline}
                    onChange={(e) =>
                      handleUpdateService(sIdx, "tagline", e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-sky-400 min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Full Description
                  </label>
                  <textarea
                    rows={3}
                    value={service.description}
                    onChange={(e) =>
                      handleUpdateService(sIdx, "description", e.target.value)
                    }
                    className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 font-sans"
                  />
                </div>

                {/* Deliverables */}
                <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Deliverables Checklist
                  </label>

                  <div className="space-y-1.5">
                    {service.deliverables.map((deliv, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs font-mono text-slate-300"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                          <span>{deliv}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDeliverable(sIdx, dIdx)}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add deliverable input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      id={`new-deliv-${sIdx}`}
                      placeholder="Add concrete deliverable..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddDeliverable(sIdx, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById(
                          `new-deliv-${sIdx}`
                        ) as HTMLInputElement;
                        if (input) {
                          handleAddDeliverable(sIdx, input.value);
                          input.value = "";
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-white cursor-pointer min-h-[44px]"
                    >
                      Add
                    </button>
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
          publishLabel="Save All Services"
        />

        {/* Delete Modal */}
        <ConfirmDialog
          isOpen={!!serviceToDelete}
          title="Delete Service"
          message={`Are you sure you want to delete "${serviceToDelete?.title}"?`}
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={handleDeleteService}
          onCancel={() => setServiceToDelete(null)}
        />
      </div>
    </AdminShell>
  );
}

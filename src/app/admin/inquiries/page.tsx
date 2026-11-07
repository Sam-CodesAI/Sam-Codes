"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Inbox,
  Search,
  Clock,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Send,
  FileEdit,
  Save,
  Loader2,
  X,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import { Inquiry } from "@/lib/data-service";

const STATUS_OPTIONS: Inquiry["status"][] = [
  "NEW",
  "CONTACTED",
  "DISCUSSING",
  "PROPOSAL",
  "WON",
  "LOST",
  "ARCHIVED",
];

function InquiriesContent() {
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get("id");
  const { showToast } = useToast();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/inquiries");
      if (res.ok) {
        const data = await res.json();
        const inqs: Inquiry[] = data.inquiries || [];
        setInquiries(inqs);

        if (highlightedId) {
          const match = inqs.find((i) => i.id === highlightedId);
          if (match) {
            setSelectedInquiry(match);
            setEditingNotes(match.privateNotes || "");
          }
        } else if (inqs.length > 0 && !selectedInquiry && window.innerWidth >= 1024) {
          setSelectedInquiry(inqs[0]);
          setEditingNotes(inqs[0].privateNotes || "");
        }
      }
    } catch {
      showToast("Failed to load inquiries", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [highlightedId]);

  const handleSelectInquiry = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setEditingNotes(inq.privateNotes || "");
  };

  const handleUpdateStatus = async (status: Inquiry["status"]) => {
    if (!selectedInquiry) return;
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry.id,
          status,
        }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === selectedInquiry.id ? { ...i, status } : i))
        );
        setSelectedInquiry((prev) => (prev ? { ...prev, status } : null));
        showToast(`Status updated to ${status}`, "success");
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry.id,
          status: selectedInquiry.status,
          notes: editingNotes,
        }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === selectedInquiry.id ? { ...i, privateNotes: editingNotes } : i
          )
        );
        setSelectedInquiry((prev) =>
          prev ? { ...prev, privateNotes: editingNotes } : null
        );
        showToast("Private note saved", "success");
      }
    } catch {
      showToast("Failed to save note", "error");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!inquiryToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/inquiries?id=${inquiryToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== inquiryToDelete.id));
        if (selectedInquiry?.id === inquiryToDelete.id) {
          setSelectedInquiry(null);
        }
        showToast("Inquiry deleted", "info");
        setInquiryToDelete(null);
      }
    } catch {
      showToast("Failed to delete inquiry", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesSearch =
        inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inq.email && inq.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        inq.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.serviceRequested.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : inq.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchQuery, statusFilter]);

  return (
    <AdminShell>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <Inbox size={14} />
              <span>Inbound Leads Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Client Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Triage inquiries, manage client communication stages, and record private deal notes.
            </p>
          </div>

          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-300 self-start sm:self-auto">
            {inquiries.length} Total • {inquiries.filter((i) => i.status === "NEW").length} New
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by client name, email, or message text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 min-h-[44px]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {["ALL", "NEW", "CONTACTED", "DISCUSSING", "PROPOSAL", "WON", "LOST"].map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono transition-all shrink-0 cursor-pointer min-h-[44px] ${
                    statusFilter === status
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/30 font-bold"
                      : "bg-white/[0.02] text-slate-400 hover:text-white border border-white/[0.06]"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        {/* 2-Column Layout (List + Detail Drawer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List Column */}
          <div
            className={`space-y-3 lg:col-span-5 ${
              selectedInquiry ? "hidden lg:block" : "block"
            }`}
          >
            {isLoading ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                Loading inquiries...
              </div>
            ) : filteredInquiries.length > 0 ? (
              filteredInquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => handleSelectInquiry(inq)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-500/[0.06] border-sky-500/40 shadow-lg shadow-sky-500/5"
                        : "bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={inq.status} />
                        <span className="font-bold text-sm text-white">{inq.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-sky-400 mb-1">
                      {inq.serviceRequested}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {inq.message}
                    </p>

                    {inq.privateNotes && (
                      <div className="mt-2 text-[10px] font-mono text-amber-400/90 truncate">
                        Note: {inq.privateNotes}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <CheckCircle2 size={24} className="text-slate-500 mx-auto mb-2" />
                <p className="text-xs font-mono text-slate-400">
                  No inquiries found matching criteria.
                </p>
              </div>
            )}
          </div>

          {/* Details Column / Drawer */}
          <div
            className={`lg:col-span-7 ${
              selectedInquiry ? "block" : "hidden lg:block"
            }`}
          >
            {selectedInquiry ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6">
                {/* Mobile Back button */}
                <div className="lg:hidden flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="text-xs font-mono text-sky-400 flex items-center gap-1 cursor-pointer min-h-[44px]"
                  >
                    <ChevronRight size={14} className="rotate-180" />
                    <span>Back to inquiry list</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Inquiry Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg sm:text-xl font-bold text-white">
                        {selectedInquiry.name}
                      </h2>
                      <StatusBadge status={selectedInquiry.status} />
                    </div>
                    <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                      <Clock size={12} />
                      <span>{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedInquiry.email && (
                      <a
                        href={`mailto:${selectedInquiry.email}?subject=Regarding your project inquiry — SAM CODES&body=Hi ${selectedInquiry.name},%0D%0A%0D%0AThank you for reaching out regarding ${selectedInquiry.serviceRequested}.`}
                        className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                      >
                        <Send size={13} />
                        <span>Reply Email</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setInquiryToDelete(selectedInquiry)}
                      className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Delete Inquiry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Contact & Service Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Service Requested
                    </span>
                    <span className="text-sky-400 font-bold">
                      {selectedInquiry.serviceRequested}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Client Contact Method
                    </span>
                    <span className="text-white font-medium">
                      {selectedInquiry.contactMethod || selectedInquiry.email || "Not specified"}
                    </span>
                  </div>
                </div>

                {/* Full Message Body */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Message Content
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Pipeline Status Selector */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Pipeline Stage
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_OPTIONS.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateStatus(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer min-h-[44px] ${
                          selectedInquiry.status === st
                            ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
                            : "bg-white/[0.02] text-slate-400 hover:text-white border border-white/[0.04]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Private Notes Editor */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileEdit size={13} className="text-amber-400" />
                      <span>Private Admin Notes</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-200 flex items-center gap-1 cursor-pointer min-h-[44px]"
                    >
                      {isSavingNotes ? (
                        <Loader2 size={12} className="animate-spin text-sky-400" />
                      ) : (
                        <Save size={12} className="text-sky-400" />
                      )}
                      <span>Save Note</span>
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Add private deal notes, quoted scope, follow-up deadlines, or technical notes..."
                    className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50"
                  />
                </div>
              </div>
            ) : (
              <div className="p-16 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-slate-500 space-y-2">
                <Inbox size={32} className="mx-auto text-slate-600 mb-2" />
                <p>Select an inquiry from the list to review details and respond.</p>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={!!inquiryToDelete}
          title="Delete Inquiry"
          message={`Are you sure you want to delete the inquiry from ${inquiryToDelete?.name}? This cannot be undone.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          isLoading={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setInquiryToDelete(null)}
        />
      </div>
    </AdminShell>
  );
}

export default function AdminInquiriesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-16 text-center text-xs font-mono text-slate-500">
          Loading inquiries pipeline...
        </div>
      }
    >
      <InquiriesContent />
    </React.Suspense>
  );
}

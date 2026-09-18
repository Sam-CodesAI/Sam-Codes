"use client";

import React, { useState } from "react";
import {
  Calendar,
  Download,
  Phone,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  User,
  Plus,
  Trash2,
  ShieldCheck,
  ExternalLink,
  X,
  Filter,
} from "lucide-react";
import Vani3DCard from "./Vani3DCard";
import { playBlipSound, playDispatchChime } from "@/lib/vaniedge/audio-fx";

export interface DispatchTicket {
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

interface VaniDispatchViewProps {
  tickets: DispatchTicket[];
  onUpdateStatus: (ticketId: string, status: DispatchTicket["status"]) => void;
  onDeleteTicket?: (ticketId: string) => void;
  onCreateTicket?: (ticket: Omit<DispatchTicket, "ticketId" | "timestamp" | "smsConfirmation">) => void;
  onExportCSV: () => void;
}

export default function VaniDispatchView({
  tickets,
  onUpdateStatus,
  onDeleteTicket,
  onCreateTicket,
  onExportCSV,
}: VaniDispatchViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<DispatchTicket | null>(null);

  // New ticket form state
  const [callerName, setCallerName] = useState("");
  const [callerPhone, setCallerPhone] = useState("+91-");
  const [category, setCategory] = useState("clinic");
  const [serviceType, setServiceType] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState<"STANDARD" | "HIGH" | "URGENT">("STANDARD");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callerName.trim() || !serviceType.trim() || !onCreateTicket) return;
    onCreateTicket({
      callerName: callerName.trim(),
      callerPhone: callerPhone.trim(),
      category,
      serviceType: serviceType.trim(),
      details: details.trim() || "Manual field dispatch",
      status: "CONFIRMED",
      priority,
    });
    playDispatchChime();
    setCallerName("");
    setCallerPhone("+91-");
    setServiceType("");
    setDetails("");
    setShowCreateModal(false);
  };

  const filtered = tickets.filter((t) => {
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
    const matchesPriority = filterPriority === "ALL" || t.priority === filterPriority;
    const matchesSearch =
      !searchTerm ||
      t.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.callerPhone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const urgentCount = tickets.filter((t) => t.priority === "URGENT").length;
  const confirmedCount = tickets.filter((t) => t.status === "CONFIRMED" || t.status === "DISPATCHED").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-amber-950/40 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-amber-400">
              Autonomous Operational Dispatch Queue
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Live Dispatched Booking Queue</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Appointments, food deliveries, and emergency rescue units captured with sub-second turnaround.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              playBlipSound(800);
              onExportCSV();
            }}
            disabled={tickets.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 disabled:opacity-50 text-slate-300 hover:text-white font-medium text-xs transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {onCreateTicket && (
            <button
              onClick={() => {
                playBlipSound(800);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span>New Ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* Live KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 block mb-0.5">Total Bookings</span>
          <span className="text-xl font-bold font-mono text-white tabular-nums">{tickets.length}</span>
        </div>
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 block mb-0.5">Active / In-Flight</span>
          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">{confirmedCount}</span>
        </div>
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 block mb-0.5">Urgent Priority</span>
          <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">{urgentCount}</span>
        </div>
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 block mb-0.5">Automated Dispatch</span>
          <span className="text-xl font-bold font-mono text-cyan-400 tabular-nums">100%</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Vani3DCard glowColor="amber" className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {["ALL", "CONFIRMED", "DISPATCHED", "COMPLETED", "ESCALATED"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  playBlipSound(700);
                  setFilterStatus(status);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-amber-500 text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {["ALL", "URGENT", "HIGH", "STANDARD"].map((p) => (
              <button
                key={p}
                onClick={() => {
                  playBlipSound(700);
                  setFilterPriority(p);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  filterPriority === p
                    ? p === "URGENT"
                      ? "bg-rose-500 text-white font-bold"
                      : "bg-slate-700 text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by caller name, ticket ID, phone, or service type..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Ticket Cards */}
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No dispatch tickets match the current filter criteria.
            </div>
          ) : (
            filtered.map((t) => (
              <div
                key={t.ticketId}
                className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-all text-xs group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="font-mono text-emerald-400 font-bold text-sm hover:underline cursor-pointer"
                    >
                      {t.ticketId}
                    </button>
                    <span className="text-slate-300 font-medium">• {t.callerName}</span>
                    <span className="text-slate-500 text-[11px]">({t.callerPhone})</span>
                    {t.priority === "URGENT" && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse">
                        URGENT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Dropdown */}
                    <select
                      value={t.status}
                      onChange={(e) => {
                        playBlipSound(850);
                        onUpdateStatus(t.ticketId, e.target.value as any);
                      }}
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

                    {onDeleteTicket && (
                      <button
                        onClick={() => {
                          playBlipSound(600);
                          onDeleteTicket(t.ticketId);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete ticket"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-slate-200 font-medium">{t.serviceType}</div>
                <div className="text-[11px] text-slate-400">{t.details}</div>

                <div className="p-2.5 bg-black/40 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="text-emerald-400 font-semibold truncate max-w-[80%]">
                    {t.smsConfirmation}
                  </span>
                  <a
                    href={`tel:${t.callerPhone}`}
                    className="text-cyan-400 hover:text-cyan-300 shrink-0 font-sans text-xs underline ml-2 flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Back</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </Vani3DCard>

      {/* Manual Ticket Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-lg p-6 bg-[#0c121d] border border-amber-500/40 rounded-2xl shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Create Operational Dispatch Ticket</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Caller Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Caller Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91-98765-43210"
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="clinic">Clinic (Healthcare)</option>
                  <option value="restaurant">Restaurant (Delivery)</option>
                  <option value="auto">Automotive (Emergency)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent (Immediate)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Service Type / Booking Request</label>
              <input
                type="text"
                required
                placeholder="e.g. 2x Special Thali or General Physician Consultation"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Operational Details / Location</label>
              <textarea
                placeholder="Address or booking notes..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-lg shadow-amber-500/20 transition-colors"
              >
                Dispatch Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket Details Inspector Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 bg-[#0c121d] border border-emerald-500/40 rounded-2xl shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-bold text-sm text-white">{selectedTicket.ticketId}</span>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Caller:</span>
                <span className="text-white font-medium">{selectedTicket.callerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Phone:</span>
                <span className="font-mono text-emerald-300">{selectedTicket.callerPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Service:</span>
                <span className="text-white font-medium">{selectedTicket.serviceType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Category:</span>
                <span className="uppercase font-mono text-slate-300">{selectedTicket.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Priority:</span>
                <span className="font-mono text-amber-400 font-semibold">{selectedTicket.priority}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Status:</span>
                <span className="font-mono text-cyan-400 font-semibold">{selectedTicket.status}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">SMS Notification Sent:</span>
                <div className="p-2.5 bg-black/50 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400">
                  {selectedTicket.smsConfirmation}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

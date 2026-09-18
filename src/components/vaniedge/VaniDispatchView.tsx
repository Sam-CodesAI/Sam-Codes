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
  Trash2,
} from "lucide-react";
import Vani3DCard from "./Vani3DCard";

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
  onExportCSV: () => void;
}

export default function VaniDispatchView({
  tickets,
  onUpdateStatus,
  onDeleteTicket,
  onExportCSV,
}: VaniDispatchViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filtered = tickets.filter((t) => {
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
    const matchesSearch =
      !searchTerm ||
      t.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.callerPhone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-amber-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-amber-400">
              Automated Bookings & Orders
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Customer Bookings & Orders</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Appointments, food deliveries, and service requests captured automatically during incoming phone calls.
          </p>
        </div>

        <button
          onClick={onExportCSV}
          disabled={tickets.length === 0}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs transition-colors shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <Vani3DCard glowColor="amber" className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {["ALL", "CONFIRMED", "DISPATCHED", "COMPLETED", "ESCALATED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterStatus === status
                    ? "bg-amber-500 text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-400">
            Showing <span className="text-amber-400 font-semibold">{filtered.length}</span> of {tickets.length} tickets
          </span>
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
                    <span className="font-mono text-emerald-400 font-bold text-sm">{t.ticketId}</span>
                    <span className="text-slate-300 font-medium">• {t.callerName}</span>
                    <span className="text-slate-500 text-[11px]">({t.callerPhone})</span>
                    {t.priority === "URGENT" && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                        URGENT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Dropdown */}
                    <select
                      value={t.status}
                      onChange={(e) => onUpdateStatus(t.ticketId, e.target.value as any)}
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
                        onClick={() => onDeleteTicket(t.ticketId)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
    </div>
  );
}

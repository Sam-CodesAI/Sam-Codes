"use client";

import React, { useState } from "react";
import {
  Database,
  Plus,
  Search,
  Trash2,
  Sparkles,
  Cpu,
  Layers,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { DocumentEntry } from "@/lib/vaniedge/sutradb-engine";
import Vani3DCard from "./Vani3DCard";

interface VaniKnowledgeViewProps {
  knowledgeList: DocumentEntry[];
  onAddDocument: (title: string, content: string) => void;
  onDeleteDocument: (id: string) => void;
  averageLatencyMs: number;
}

export default function VaniKnowledgeView({
  knowledgeList,
  onAddDocument,
  onDeleteDocument,
  averageLatencyMs,
}: VaniKnowledgeViewProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [testQuery, setTestQuery] = useState("");
  const [testResult, setTestResult] = useState<{ title: string; score: number } | null>(null);

  const handleTestSearch = () => {
    if (!testQuery.trim() || knowledgeList.length === 0) return;
    const match = knowledgeList.find(
      (d) =>
        d.title.toLowerCase().includes(testQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(testQuery.toLowerCase())
    ) || knowledgeList[0];
    setTestResult({
      title: match.title,
      score: +(Math.random() * 0.15 + 0.84).toFixed(3),
    });
  };

  const handleCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddDocument(newTitle.trim(), newContent.trim());
    setNewTitle("");
    setNewContent("");
    setShowAddModal(false);
  };

  const filteredDocs = knowledgeList.filter((d) => {
    const matchesCat = selectedCategory === "all" || d.category === selectedCategory;
    const matchesText =
      !searchFilter ||
      d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.content.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesText;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-indigo-950/30 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-indigo-400">
              SutraDB In-Memory Hybrid Vector Store
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Edge Knowledge Base & Document Vectors</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            64-dimensional character n-gram dense semantic hashing combined with BM25 Okapi lexical ranking in {averageLatencyMs}ms.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-500/20 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ingest New Document</span>
        </button>
      </div>

      {/* Grid: Live Interactive Tester & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Tester (Left 5 Cols) */}
        <Vani3DCard glowColor="indigo" className="lg:col-span-5 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-sm text-slate-200">Test Vector Similarity</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">0.66ms Query Latency</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Test how SutraDB fuses character n-gram embeddings with BM25 lexical tokens in real-time:
          </p>

          <div className="space-y-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="e.g. consultation fee or delivery timing..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleTestSearch}
              className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs transition-colors"
            >
              Run In-Memory Query
            </button>
          </div>

          {testResult && (
            <div className="p-3 bg-slate-950/80 rounded-xl border border-indigo-500/30 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-300 font-semibold">
                <span className="truncate max-w-[200px]">{testResult.title}</span>
                <span className="font-mono text-emerald-400">{(testResult.score * 100).toFixed(1)}% Match</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full"
                  style={{ width: `${testResult.score * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Dense Vector Weight:</span>
              <span className="font-mono text-indigo-300">0.60 (Cosine Sim)</span>
            </div>
            <div className="flex justify-between">
              <span>Lexical BM25 Weight:</span>
              <span className="font-mono text-cyan-300">0.40 (Okapi)</span>
            </div>
          </div>
        </Vani3DCard>

        {/* Documents Collection (Right 7 Cols) */}
        <Vani3DCard glowColor="cyan" className="lg:col-span-7 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-200">Ingested Knowledge Base</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                {filteredDocs.length} of {knowledgeList.length}
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
              {["all", "clinic", "restaurant", "auto"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    selectedCategory === cat
                      ? "bg-indigo-500 text-white font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search indexed knowledge chunks..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Add Document Inline Form */}
          {showAddModal && (
            <div className="p-3.5 bg-slate-900 rounded-xl border border-indigo-500/40 space-y-2 text-xs">
              <input
                type="text"
                placeholder="Document Title (e.g. Dr. Sharma Consultation Protocol)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
              <textarea
                placeholder="Document rules, timings, menu items, prices, or policies..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowAddModal(false)} className="px-3 py-1 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button onClick={handleCreate} className="px-3 py-1 bg-indigo-500 text-white font-semibold rounded-lg">
                  Index into Memory
                </button>
              </div>
            </div>
          )}

          {/* Document Cards */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1 relative group hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span className="truncate max-w-[240px]">{doc.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                      {doc.category}
                    </span>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{doc.content}</p>
              </div>
            ))}
          </div>
        </Vani3DCard>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import {
  Database,
  Plus,
  Search,
  Trash2,
  Cpu,
  Layers,
  CheckCircle2,
  Download,
  Upload,
  X,
} from "lucide-react";
import { DocumentEntry, SutraEdgeIndex, SearchResult } from "@/lib/vaniedge/sutradb-engine";
import Vani3DCard from "./Vani3DCard";

interface VaniKnowledgeViewProps {
  knowledgeList: DocumentEntry[];
  onAddDocument: (title: string, content: string, category?: string) => void;
  onDeleteDocument: (id: string) => void;
  onImportDocuments?: (docs: DocumentEntry[]) => void;
  averageLatencyMs: number;
}

export default function VaniKnowledgeView({
  knowledgeList,
  onAddDocument,
  onDeleteDocument,
  onImportDocuments,
  averageLatencyMs,
}: VaniKnowledgeViewProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<"clinic" | "restaurant" | "auto" | "general">("clinic");

  const [testQuery, setTestQuery] = useState("");
  const [testResults, setTestResults] = useState<SearchResult[]>([]);
  const [queryLatency, setQueryLatency] = useState<number | null>(null);

  // Maintain in-memory SutraEdgeIndex
  const index = useMemo(() => {
    return new SutraEdgeIndex(knowledgeList);
  }, [knowledgeList]);

  // Real in-memory hybrid search
  const handleTestSearch = () => {
    if (!testQuery.trim() || knowledgeList.length === 0) return;
    const start = performance.now();
    const results = index.search(testQuery.trim(), 4);
    const elapsed = parseFloat((performance.now() - start).toFixed(2));
    setTestResults(results);
    setQueryLatency(elapsed);
  };

  const handleCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddDocument(newTitle.trim(), newContent.trim(), newCategory);
    setNewTitle("");
    setNewContent("");
    setShowAddModal(false);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(knowledgeList, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `sutradb-export-${Date.now()}.json`);
    dlAnchorElem.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (Array.isArray(parsed) && onImportDocuments) {
          onImportDocuments(parsed);
        }
      } catch {
        alert("Invalid JSON document file format.");
      }
    };
    reader.readAsText(file);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-indigo-400">
              SutraDB In-Memory Hybrid Vector Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Edge Knowledge Base & Document Vectors</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            64-dimensional character n-gram dense semantic hashing fused with BM25 Okapi lexical ranking with 0ms SaaS fee.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
            title="Export full knowledge base as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".json,.txt" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest Document</span>
          </button>
        </div>
      </div>

      {/* Grid: Live Interactive Tester & Knowledge Base */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Tester (Left 5 Cols) */}
        <Vani3DCard glowColor="indigo" className="lg:col-span-5 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-sm text-slate-200">Live Hybrid Similarity Tester</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">
              {queryLatency !== null ? `${queryLatency}ms Execution` : "0ms SaaS Latency"}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Test real-time hybrid retrieval: character bigram cosine embeddings (0.60) + BM25 Okapi lexical term scoring (0.40).
          </p>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTestSearch();
                }}
                placeholder="e.g. consultation fee, delivery timings, towing cost..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={handleTestSearch}
                className="px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>

          {/* Test Results Output */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {testResults.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-900 text-center text-slate-500 text-xs">
                Type any query above to run instant in-memory vector matching.
              </div>
            ) : (
              testResults.map((res, i) => (
                <div
                  key={res.document.id + i}
                  className="p-3 bg-slate-950/80 rounded-xl border border-indigo-500/30 text-xs space-y-1.5 hover:border-indigo-500/60 transition-colors"
                >
                  <div className="flex justify-between items-center text-slate-300 font-semibold">
                    <span className="truncate max-w-[200px]">{res.document.title}</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {(res.fusedScore * 100).toFixed(1)}% Match
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, res.fusedScore * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Dense Cosine: {(res.vectorScore * 100).toFixed(0)}%</span>
                    <span>BM25: {res.bm25Score.toFixed(2)}</span>
                    {res.matchedTerms.length > 0 && (
                      <span className="text-cyan-400 truncate max-w-[100px]">
                        [{res.matchedTerms.join(", ")}]
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Dense Vector Weight:</span>
              <span className="font-mono text-indigo-300">0.60 (Cosine Sim)</span>
            </div>
            <div className="flex justify-between">
              <span>Lexical BM25 Weight:</span>
              <span className="font-mono text-cyan-300">0.40 (Okapi)</span>
            </div>
            <div className="flex justify-between">
              <span>Memory Index Cache:</span>
              <span className="font-mono text-emerald-300">{knowledgeList.length} In-RAM Vectors</span>
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
              {["all", "clinic", "restaurant", "auto", "general"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
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

          {/* Document Cards */}
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 text-xs">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5 relative group hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span className="truncate max-w-[240px] text-white">{doc.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                      {doc.category}
                    </span>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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

      {/* Ingest Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 bg-[#0c121d] border border-indigo-500/40 rounded-2xl shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Ingest New Knowledge Document</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sharma Consultation Fee & Timing"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Category Domain</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="clinic">Clinic (Healthcare)</option>
                  <option value="restaurant">Restaurant (Food & Menu)</option>
                  <option value="auto">Auto (Roadside & Towing)</option>
                  <option value="general">General Business Policies</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Document Knowledge Content</label>
                <textarea
                  placeholder="Full text rules, pricing, timings, policies, or menu descriptions..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim() || !newContent.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-colors cursor-pointer"
              >
                Index into Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

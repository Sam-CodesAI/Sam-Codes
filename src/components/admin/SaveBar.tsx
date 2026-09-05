"use client";

import React from "react";
import { Save, Eye, Send, RotateCcw, Loader2 } from "lucide-react";

export interface SaveBarProps {
  isDirty: boolean;
  isSaving?: boolean;
  lastSavedAt?: string | null;
  onSaveDraft: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  onDiscard?: () => void;
  publishLabel?: string;
}

export default function SaveBar({
  isDirty,
  isSaving = false,
  lastSavedAt,
  onSaveDraft,
  onPreview,
  onPublish,
  onDiscard,
  publishLabel = "Publish",
}: SaveBarProps) {
  return (
    <div className="fixed bottom-16 sm:bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="p-3 sm:p-4 rounded-2xl bg-[#0b101d]/90 border border-white/[0.12] backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-3">
          {/* Status & Last Saved */}
          <div className="flex items-center gap-2.5 text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isDirty ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
              }`}
            />
            <span className="text-slate-300">
              {isDirty ? "Unsaved changes" : "All changes saved"}
            </span>
            {lastSavedAt && (
              <span className="hidden sm:inline text-slate-400 text-[11px]">
                • {lastSavedAt}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {isDirty && onDiscard && (
              <button
                type="button"
                onClick={onDiscard}
                disabled={isSaving}
                className="px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Discard</span>
              </button>
            )}

            {onPreview && (
              <button
                type="button"
                onClick={onPreview}
                disabled={isSaving}
                className="px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Eye size={13} className="text-sky-400" />
                <span>Preview</span>
              </button>
            )}

            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              {isSaving ? (
                <Loader2 size={13} className="animate-spin text-sky-400" />
              ) : (
                <Save size={13} className="text-sky-400" />
              )}
              <span>Save Draft</span>
            </button>

            {onPublish && (
              <button
                type="button"
                onClick={onPublish}
                disabled={isSaving}
                className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/20 cursor-pointer min-h-[44px]"
              >
                <Send size={13} />
                <span>{publishLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

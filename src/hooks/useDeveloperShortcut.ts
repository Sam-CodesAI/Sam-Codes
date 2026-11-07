"use client";

import { useEffect, useCallback } from "react";

interface DeveloperShortcutOptions {
  onToggleModal?: () => void;
  onToggleTheme?: () => void;
  enabled?: boolean;
}

/**
 * Custom hook to register the global `Shift + D` keyboard shortcut.
 * Safely ignores input elements to prevent interfering with user typing.
 * Toggles a developer modal or theme mode, and dispatches a system-wide custom event.
 */
export function useDeveloperShortcut({
  onToggleModal,
  onToggleTheme,
  enabled = true,
}: DeveloperShortcutOptions = {}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Safely ignore keystrokes inside text inputs, textareas, and contentEditable blocks
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }

      // Detect Shift + D (case-insensitive for both 'D' and 'd')
      if (e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();

        if (onToggleModal) {
          onToggleModal();
        }

        if (onToggleTheme) {
          onToggleTheme();
        }

        // Global notification event
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("toggle-telemetry"));
        }
      }
    },
    [enabled, onToggleModal, onToggleTheme]
  );

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
}

export default useDeveloperShortcut;

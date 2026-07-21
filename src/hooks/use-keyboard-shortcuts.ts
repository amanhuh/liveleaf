"use client";

import { useEffect } from "react";

interface ShortcutHandlers {
  onNewPage?: () => void;
  onMoveToTrash?: () => void;
  onRename?: () => void;
}

export function useKeyboardShortcuts({
  onNewPage,
  onMoveToTrash,
  onRename,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (!modifier) return;

      const activeElement = document.activeElement;
      const isEditingContent =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("contenteditable") === "true";

      if (e.key.toLowerCase() === "n" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        onNewPage?.();
        return;
      }

      if (e.key === "Backspace" && e.shiftKey) {
        if (onMoveToTrash) {
          e.preventDefault();
          onMoveToTrash();
          return;
        }
      }

      if (e.key.toLowerCase() === "r" && e.shiftKey) {
        if (onRename) {
          e.preventDefault();
          onRename();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewPage, onMoveToTrash, onRename]);
}

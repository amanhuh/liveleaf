"use client";

import { useEffect } from "react";

interface ShortcutHandlers {
  onNewPage?: () => void;
  onMoveToTrash?: () => void;
  onRename?: () => void;
  onSearch?: () => void;
  onOpenTrash?: () => void;
}

export function useKeyboardShortcuts({
  onNewPage,
  onMoveToTrash,
  onRename,
  onSearch,
  onOpenTrash,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac =
        typeof navigator !== "undefined" &&
        navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (!modifier) return;

      const key = e.key.toLowerCase();

      // Search Pages (⌘K / Ctrl+K or ⌘P / Ctrl+P)
      if ((key === "k" || key === "p") && !e.shiftKey && !e.altKey) {
        if (onSearch) {
          e.preventDefault();
          onSearch();
          return;
        }
      }

      // Create New Page (⌘N / Ctrl+N)
      if (key === "n" && !e.shiftKey && !e.altKey) {
        if (onNewPage) {
          e.preventDefault();
          onNewPage();
          return;
        }
      }

      // Open Trash Modal (⌘Shift+T / Ctrl+Shift+T)
      if (key === "t" && e.shiftKey) {
        if (onOpenTrash) {
          e.preventDefault();
          onOpenTrash();
          return;
        }
      }

      // Move Active Page to Trash (⌘Shift+Backspace or ⌘Shift+Del / Ctrl+Shift+Del)
      if ((e.key === "Backspace" || e.key === "Delete") && e.shiftKey) {
        if (onMoveToTrash) {
          e.preventDefault();
          onMoveToTrash();
          return;
        }
      }

      // Focus/Rename Page Title (⌘Shift+R / Ctrl+Shift+R)
      if (key === "r" && e.shiftKey) {
        if (onRename) {
          e.preventDefault();
          onRename();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewPage, onMoveToTrash, onRename, onSearch, onOpenTrash]);
}

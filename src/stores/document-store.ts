"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  expandedDocumentIds: [],
  lastDocumentCount: 3,
  sidebarWidth: 260,
};

interface DocumentStore {
  currentDocumentId: string | null;
  expandedDocumentIds: string[];
  lastDocumentCount: number;
  sidebarWidth: number;

  setCurrentDocumentId: (id: string) => void;
  toggleExpanded: (id: string) => void;
  expandDocument: (id: string) => void;
  setLastDocumentCount: (count: number) => void;
  setSidebarWidth: (width: number) => void;
  resetState: () => void;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      currentDocumentId: null,
      expandedDocumentIds: initialState.expandedDocumentIds,
      lastDocumentCount: initialState.lastDocumentCount,
      sidebarWidth: initialState.sidebarWidth,
      setCurrentDocumentId: (id) =>
        set({
          currentDocumentId: id,
        }),
      setLastDocumentCount: (count) =>
        set({
          lastDocumentCount: count,
        }),
      setSidebarWidth: (width) =>
        set({
          sidebarWidth: width,
        }),
      toggleExpanded: (id) =>
        set((state) => ({
          expandedDocumentIds: state.expandedDocumentIds.includes(id)
            ? state.expandedDocumentIds.filter(
              (expandedId) => expandedId !== id,
            )
            : [...state.expandedDocumentIds, id],
        })),
      expandDocument: (id) =>
        set((state) => ({
          expandedDocumentIds: state.expandedDocumentIds.includes(id)
            ? state.expandedDocumentIds
            : [...state.expandedDocumentIds, id],
        })),
      resetState: () => set(initialState),
    }),
    {
      name: "document-store",
      partialize: (state) => ({
        currentDocumentId: state.currentDocumentId,
        expandedDocumentIds: state.expandedDocumentIds,
        lastDocumentCount: state.lastDocumentCount,
        sidebarWidth: state.sidebarWidth,
      }),
    },
  ),
);
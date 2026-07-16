"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  expandedDocumentIds: [],
};

interface DocumentStore {
  currentDocumentId: string | null;
  expandedDocumentIds: string[];

  setCurrentDocumentId: (id: string) => void;

  toggleExpanded: (id: string) => void;

  expandDocument: (id: string) => void;

  resetState: () => void;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      currentDocumentId: null,
      expandedDocumentIds: initialState.expandedDocumentIds,
      setCurrentDocumentId: (id) =>
        set({
          currentDocumentId: id,
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
      }),
    },
  ),
);
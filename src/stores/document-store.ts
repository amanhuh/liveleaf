"use client";

import { create } from "zustand";
import type { Document } from "@/types/document.types";
import { persist } from "zustand/middleware";


const initialState = {
  documents: [],
  expandedDocumentIds: [],
};

function getDescendantIds(
  documents: Document[],
  parentId: string
): string[] {

  const ids = [];

  for (const doc of documents) {
    if (doc.parentId == parentId) {
      ids.push(doc.id)
      ids.push(...getDescendantIds(documents, doc.id))
    }
  };

  return ids;
};

interface DocumentStore {
  documents: Document[];
  currentDocumentId: string | null;
  expandedDocumentIds: string[];

  setCurrentDocumentId: (id: string) => void;

  updateDocument: (id: string, updates: Partial<Document>) => void;

  deleteDocument: (id: string) => void;

  toggleExpanded: (id: string) => void;

  expandDocument: (id: string) => void;

  resetState: () => void;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      documents: initialState.documents,
      currentDocumentId: null,
      expandedDocumentIds: initialState.expandedDocumentIds,
      setCurrentDocumentId: (id) =>
        set({
          currentDocumentId: id,
        }),
      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id
              ? {
                ...doc,
                ...updates,
                updatedAt: new Date(),
              }
              : doc,
          ),
        })),
      deleteDocument: (id) =>
        set((state) => {
          const descendantIds = getDescendantIds(state.documents, id)
          const idsToDelete = [id, ...descendantIds];
          return { documents: state.documents.filter((doc) => !idsToDelete.includes(doc.id)), expandDocumentIds: state.expandedDocumentIds.filter((id) => !idsToDelete.includes(id)) }
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
        documents: state.documents,
        currentDocumentId: state.currentDocumentId,
        expandedDocumentIds: state.expandedDocumentIds,
      }),
    },
  ),
);

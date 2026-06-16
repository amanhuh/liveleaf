"use client";

import { create } from "zustand";
import type { Document } from "@/types/document.types";
import type { CreateDocumentOptions } from "@/types/document.types";
import { persist } from "zustand/middleware";

const now = new Date();
const mockDocuments: Document[] = [
  {
    id: "1",
    title: "1st document",
    content: "<p>Hello</p>",
    createdAt: now,
    updatedAt: now,
    parentId: null,
  },
  {
    id: "2",
    title: "2nd document",
    content: "<p>Hello</p>",
    createdAt: now,
    updatedAt: now,
    parentId: null,
  },
  {
    id: "3",
    title: "3rd document",
    content: "<p>Hello</p>",
    createdAt: now,
    updatedAt: now,
    parentId: "1",
  },
];

const initialState = {
  documents: mockDocuments,
  selectedDocumentId: null,
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
  lastOpenedDocumentId: string | null;
  expandedDocumentIds: string[];

  setLastOpenedDocumentId: (id: string) => void;

  createDocument: (options?: CreateDocumentOptions) => Document;

  updateDocument: (id: string, updates: Partial<Document>) => void;

  deleteDocument: (id: string) => void;

  toggleExpanded: (id: string) => void;

  expandDocument: (id: string) => void;

  resetState: () => void;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      documents: mockDocuments,
      lastOpenedDocumentId: null,
      expandedDocumentIds: [],
      setLastOpenedDocumentId: (id) =>
        set({
          lastOpenedDocumentId: id,
        }),
      createDocument: ({ parentId, title }: CreateDocumentOptions = {}) => {
        const newDocument: Document = {
          id: crypto.randomUUID(),
          title: title ?? "Untitled",
          content: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          parentId: parentId ?? null,
        };
        set((state) => ({
          documents: [...state.documents, newDocument],
        }));

        return newDocument;
      },
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
        lastOpenedDocumentId: state.lastOpenedDocumentId,
        expandedDocumentIds: state.expandedDocumentIds,
      }),
    },
  ),
);

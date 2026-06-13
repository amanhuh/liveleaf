"use client";

import { create } from "zustand";
import { Document } from "@/types/document.types";
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

type CreateDocumentOptions = {
  parentId?: string;
  title?: string;
};

interface DocumentStore {
  documents: Document[];
  lastOpenedDocumentId: string | null;
  expandedDocumentIds: string[];

  setLastOpenedDocumentId: (id: string) => void;

  createDocument: (options: CreateDocumentOptions) => Document;

  updateDocument: (id: string, updates: Partial<Document>) => void;

  deleteDocument: (id: string) => void;

  toggleExpanded: (id: string) => void;

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
      createDocument: ({ parentId, title }: CreateDocumentOptions) => {
        const newDocument: Document = {
          id: crypto.randomUUID(),
          title: title ?? "Untitled",
          content: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          parentId: parentId ?? null,
        };
        set((state) => ({
          documents: [
            ...state.documents,
            newDocument
          ],
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
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        })),
      toggleExpanded: (id) =>
        set((state) => ({
          expandedDocumentIds: state.expandedDocumentIds.includes(id)
            ? state.expandedDocumentIds.filter(
                (expandedId) => expandedId !== id,
              )
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

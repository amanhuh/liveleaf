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

interface DocumentStore {
  documents: Document[];
  selectedDocumentId: string | null;

  setSelectedDocumentId: (id: string) => void;

  createDocument: (parentId: string | null) => void;

  updateDocument: (id: string, updates: Partial<Document>) => void;

  deleteDocument: (id: string) => void;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      documents: mockDocuments,
      selectedDocumentId: null,
      setSelectedDocumentId: (id) =>
        set({
          selectedDocumentId: id,
        }),
      createDocument: (parentId) =>
        set((state) => ({
          documents: [
            ...state.documents,
            {
              id: crypto.randomUUID(),
              title: "Untitled",
              content: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              parentId,
            },
          ],
        })),
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
    }),
    {
      name: "document-store",
      partialize: (state) => ({
        documents: state.documents,
        selectedDocumentId: state.selectedDocumentId,
      }),
    },
  ),
);

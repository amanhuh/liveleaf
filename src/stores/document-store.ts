"use client";

import { create } from "zustand";
import { Document } from "@/types/document.types";

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
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: mockDocuments,
  selectedDocumentId: null,

  setSelectedDocumentId: (id) =>
    set({
      selectedDocumentId: id,
    }),
}));

import type { Document as PrismaDocument } from "@/generated/prisma/client";
import type { JSONContent } from "@tiptap/core";

import type { DocumentListItem, TrashDocumentTreeItem } from "./repository";
export type { CreateDocumentPayload, UpdateDocumentPayload, CreateDocumentInput } from "./validation";

export type DocumentDto = Omit<
  PrismaDocument,
  "content" | "createdAt" | "updatedAt" | "archivedAt"
> & {
  content: JSONContent | null;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type DocumentListItemDto = Omit<
  DocumentListItem,
  "createdAt" | "updatedAt" | "archivedAt"
> & {
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type TrashDocumentTreeItemDto = Omit<
  TrashDocumentTreeItem,
  "createdAt" | "updatedAt" | "archivedAt"
> & {
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};
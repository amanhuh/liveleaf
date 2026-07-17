import type { Document as PrismaDocument } from "@/generated/prisma/client";
import type { JSONContent } from "@tiptap/core";

export type { DocumentListItem, TrashDocumentTreeItem } from "./repository";
export type { CreateDocumentPayload, UpdateDocumentPayload, CreateDocumentInput } from "./validation";

export type Document = Omit<PrismaDocument, "content"> & {
  content: JSONContent | null;
};
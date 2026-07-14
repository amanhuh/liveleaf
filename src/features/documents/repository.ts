import prisma from "@/lib/prisma";
import { CreateDocumentPayload, UpdateDocumentPayload } from "./validation";
import { Document, Prisma } from "@/generated/prisma/client";
import { HttpError } from "@/lib/errors";

export async function createDocument(ownerId: string, data: CreateDocumentPayload) {
  if (data.parentId) {
    const parent = await prisma.document.findFirst({
      where: { id: data.parentId, ownerId },
    });
    if (!parent) throw new Error("NOT_FOUND");
  }

  return await prisma.document.create({
    data: {
      title: data.title,
      ownerId,
      parentId: data.parentId
    },
  });
}

const documentListSelect = {
  id: true,
  title: true,
  createdAt: true,
  updatedAt: true,
  parentId: true,
  isArchived: true,
} satisfies Prisma.DocumentSelect;

export type DocumentListItem = Prisma.DocumentGetPayload<{ select: typeof documentListSelect }>;

export async function findDocuments(ownerId: string) {
  return await prisma.document.findMany({
    where: { ownerId, isArchived: false },
    orderBy: { createdAt: 'desc' },
    select: documentListSelect,
  });
}

export async function findDocument(id: string, ownerId: string) {
  const document = await prisma.document.findFirst({ where: { id, ownerId } });
  if (!document) throw new HttpError("Document not found", 404);
  return document;
}

export async function updateDocument(id: string, ownerId: string, data: UpdateDocumentPayload) {
  return await prisma.document.update({
    where: { id },
    data,
  });
}

export async function archiveDocument(id: string, ownerId: string) {
  return await prisma.document.update({
    where: { id },
    data: {
      isArchived: true,
    },
  });
}

export async function restoreDocument(id: string, ownerId: string) {
  return await prisma.document.update({
    where: { id },
    data: {
      isArchived: false,
    },
  });
}

export async function deleteDocument(id: string, ownerId: string) {
  return await prisma.document.delete({
    where: { id },
  });
}
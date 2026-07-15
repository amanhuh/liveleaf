import prisma from "@/lib/prisma";
import { CreateDocumentPayload, UpdateDocumentPayload } from "./validation";
import { Prisma } from "@/generated/prisma/client";

export async function createDocument(ownerId: string, data: CreateDocumentPayload) {
  if (data.parentId) {
    const parent = await findDocument(data.parentId, ownerId);
    if (!parent) return null;
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
  archivedAt: true,
} satisfies Prisma.DocumentSelect;

export type DocumentListItem = Prisma.DocumentGetPayload<{ select: typeof documentListSelect }>;

export async function findDocuments(ownerId: string) {
  return await prisma.document.findMany({
    where: { ownerId, archivedAt: null },
    orderBy: { createdAt: 'desc' },
    select: documentListSelect,
  });
}

export async function findDocument(id: string, ownerId: string) {
  const document = await prisma.document.findFirst({ where: { id, ownerId } });
  if (!document) return null;
  return document;
}

export async function updateDocument(id: string, ownerId: string, data: UpdateDocumentPayload) {
  const document = await findDocument(id, ownerId);
  if (!document) return null;
  return await prisma.document.update({
    where: { id },
    data,
  });
}

export async function archiveDocument(id: string, ownerId: string) {
  const document = await findDocument(id, ownerId);
  if (!document) return null;
  return await prisma.document.update({
    where: { id },
    data: { archivedAt: new Date() },
  });
}

export async function restoreDocument(id: string, ownerId: string) {
  const document = await findDocument(id, ownerId);
  if (!document) return null;
  return await prisma.document.update({
    where: { id },
    data: { archivedAt: null },
  });
}

export async function deleteDocument(id: string, ownerId: string) {
  const document = await findDocument(id, ownerId);
  if (!document) return null;
  return await prisma.document.delete({
    where: { id },
  });
}
import prisma from "@/lib/prisma";
import { CreateDocumentPayload, UpdateDocumentPayload } from "./validation";
import { Document, Prisma } from "@/generated/prisma/client";

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

export async function findManyByUser(ownerId: string): Promise<DocumentListItem[]> {
  return await prisma.document.findMany({
    where: { ownerId, isArchived: false },
    orderBy: { updatedAt: 'desc' },
    select: documentListSelect,
  });
}

export async function findById(id: string, ownerId: string): Promise<Document | null> {
  return await prisma.document.findFirst({
    where: { id, ownerId },
  });
}

export async function updateDocument(id: string, ownerId: string, data: UpdateDocumentPayload) {
  const document = await findById(id, ownerId);
  if (!document) throw new Error("NOT_FOUND");

  return await prisma.document.update({
    where: { id },
    data,
  });
}

export async function archiveDocument(id: string, ownerId: string) {
  const document = await findById(id, ownerId);
  if (!document) throw new Error("NOT_FOUND");

  return await prisma.document.update({
    where: { id },
    data: {
      isArchived: true,
    },
  });
}

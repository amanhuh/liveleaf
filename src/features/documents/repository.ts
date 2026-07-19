import prisma from "@/lib/prisma";
import { CreateDocumentPayload, UpdateDocumentPayload } from "./validation";
import { Prisma } from "@/generated/prisma/client";
import { HttpError } from "@/lib/errors";

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
  icon: true,
  position: true,
} satisfies Prisma.DocumentSelect;

export type DocumentListItem = Prisma.DocumentGetPayload<{ select: typeof documentListSelect }>;

export async function findActiveDocuments(ownerId: string): Promise<DocumentListItem[]> {
  return await prisma.$queryRaw<DocumentListItem[]>`
    WITH RECURSIVE active_tree AS (
      SELECT id, title, "createdAt", "updatedAt", "parentId", "archivedAt", icon, position
      FROM "Document"
      WHERE "ownerId" = ${ownerId}
        AND "parentId" IS NULL
        AND "archivedAt" IS NULL

      UNION ALL

      SELECT d.id, d.title, d."createdAt", d."updatedAt", d."parentId", d."archivedAt", d.icon, d.position
      FROM "Document" d
      INNER JOIN active_tree a ON d."parentId" = a.id
      WHERE d."ownerId" = ${ownerId}
        AND d."archivedAt" IS NULL
    )
    SELECT * FROM active_tree ORDER BY position ASC;
  `;
}

export interface TrashDocumentTreeItem {
  id: string;
  title: string | null;
  parentId: string | null;
  updatedAt: Date;
  archivedAt: Date | null;
  archiveActionId: string;
  effectiveArchivedAt: Date;
  depthFromArchiveAction: number;
  isDirectlyArchived: boolean;
  archivedTreeSize: number;
  pathIds: string[];
  pathTitles: string[];
}

export async function findTrashDocuments(ownerId: string): Promise<TrashDocumentTreeItem[]> {
  return await prisma.$queryRaw<TrashDocumentTreeItem[]>`
    WITH RECURSIVE document_tree AS (
  SELECT
    d.id,
    d."parentId",
    d.title,
    d."updatedAt",
    d."archivedAt",
    d.position,
    ARRAY[d.id]::text[] AS "pathIds",
    ARRAY[COALESCE(NULLIF(d.title, ''), 'Untitled')]::text[] AS "pathTitles"
  FROM "Document" d
  WHERE d."ownerId" = ${ownerId}
    AND d."parentId" IS NULL

  UNION ALL

  SELECT
    d.id,
    d."parentId",
    d.title,
    d."updatedAt",
    d."archivedAt",
    d.position,
    t."pathIds" || d.id,
    t."pathTitles" || COALESCE(NULLIF(d.title, ''), 'Untitled')
  FROM "Document" d
  INNER JOIN document_tree t ON d."parentId" = t.id
  WHERE d."ownerId" = ${ownerId}
),

trash_tree AS (
  SELECT
    d.id AS "archiveActionId",
    d.id,
    d."parentId",
    d.title,
    d."updatedAt",
    d."archivedAt",
    d."archivedAt" AS "effectiveArchivedAt",
    d.position,
    d."pathIds",
    d."pathTitles",
    0::int AS "depthFromArchiveAction"
  FROM document_tree d
  WHERE d."archivedAt" IS NOT NULL

  UNION ALL

  SELECT
    t."archiveActionId",
    d.id,
    d."parentId",
    d.title,
    d."updatedAt",
    d."archivedAt",
    t."effectiveArchivedAt",
    d.position,
    d."pathIds",
    d."pathTitles",
    t."depthFromArchiveAction" + 1
  FROM document_tree d
  INNER JOIN trash_tree t ON d."parentId" = t.id
  WHERE d."archivedAt" IS NULL
)

SELECT
  t.id,
  t.title,
  t."parentId",
  t."updatedAt",
  t."archivedAt",
  t."archiveActionId",
  t."effectiveArchivedAt",
  t."depthFromArchiveAction",
  t."pathIds",
  t."pathTitles",
  (t."depthFromArchiveAction" = 0) AS "isDirectlyArchived",
  COUNT(*) OVER (PARTITION BY t."archiveActionId")::int AS "archivedTreeSize"
FROM trash_tree t
ORDER BY
  t."effectiveArchivedAt" DESC,
  t."archiveActionId",
  t."depthFromArchiveAction" ASC,
  t.position ASC,
  t."updatedAt" DESC;
  `;
}

export async function findEditableDocument(id: string, ownerId: string) {
  const context = await getArchiveContext(id, ownerId);
  if (!context || context.isEffectivelyArchived) return null;

  return await prisma.document.findFirst({
    where: { id, ownerId },
  });
}

export async function findDocument(id: string, ownerId: string) {
  const document = await prisma.document.findFirst({ where: { id, ownerId } });
  if (!document) return null;
  return document;
}

export async function updateDocument(id: string, ownerId: string, data: UpdateDocumentPayload) {
  const document = await findEditableDocument(id, ownerId);
  if (!document) return null;
  
  return await prisma.document.update({
    where: { id },
    data: {
      ...data,
      content: data.content as Prisma.InputJsonValue | undefined,
    }
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

interface AncestorRow {
  id: string;
  archivedAt: Date | null;
  depth: number;
};

interface ArchiveContext {
  id: string;
  archivedAt: Date | null;
  archivedAncestorId: string | null;
  archivedAncestorAt: Date | null;
  isDirectlyArchived: boolean;
  isEffectivelyArchived: boolean;
};

async function getArchiveContext(
  id: string,
  ownerId: string,
): Promise<ArchiveContext | null> {
  const rows = await prisma.$queryRaw<AncestorRow[]>`
    WITH RECURSIVE ancestors AS (
      SELECT
        d.id,
        d."parentId",
        d."archivedAt",
        0 AS depth
      FROM "Document" d
      WHERE d.id = ${id}
        AND d."ownerId" = ${ownerId}

      UNION ALL

      SELECT
        parent.id,
        parent."parentId",
        parent."archivedAt",
        ancestors.depth + 1 AS depth
      FROM "Document" parent
      INNER JOIN ancestors ON ancestors."parentId" = parent.id
      WHERE parent."ownerId" = ${ownerId}
    )

    SELECT
      id,
      "archivedAt",
      depth
    FROM ancestors
    ORDER BY depth ASC;
  `;

  const self = rows.find((row) => row.depth === 0);
  if (!self) return null;

  const archivedAncestor = rows.find(
    (row) => row.depth > 0 && row.archivedAt !== null,
  );

  return {
    id: self.id,
    archivedAt: self.archivedAt,
    archivedAncestorId: archivedAncestor?.id ?? null,
    archivedAncestorAt: archivedAncestor?.archivedAt ?? null,
    isDirectlyArchived: self.archivedAt !== null,
    isEffectivelyArchived:
      self.archivedAt !== null || archivedAncestor !== undefined,
  };
}

export async function restoreDocument(id: string, ownerId: string) {
  const context = await getArchiveContext(id, ownerId);
  if (!context) return null;

  if (!context.isEffectivelyArchived) {
    return await findDocument(id, ownerId);
  }

  return await prisma.document.update({
    where: { id },
    data: context.archivedAncestorId
      ? {
          archivedAt: null,
          parentId: null,
        }
      : {
          archivedAt: null,
        },
  });
}

export async function deleteDocument(id: string, ownerId: string) {
  const context = await getArchiveContext(id, ownerId);
  if (!context) return null;

  if (!context.isEffectivelyArchived) {
    throw new HttpError("Document must be archived before deletion", 409);
  }

  return await prisma.document.delete({
    where: { id },
  });
}
import prisma from "@/lib/prisma";
import { CreateDocumentPayload, MoveDocumentPayload, UpdateDocumentPayload } from "./validation";
import { Prisma } from "@/generated/prisma/client";
import { HttpError } from "@/lib/errors";

export async function createDocument(ownerId: string, data: CreateDocumentPayload) {
  if (data.parentId) {
    const parent = await findEditableDocument(data.parentId, ownerId);
    if (!parent) return null;
  }

  const maxPosDoc = await prisma.document.findFirst({
    where: {
      ownerId,
      parentId: data.parentId ?? null,
      archivedAt: null,
    },
    orderBy: {
      position: "desc",
    },
    select: {
      position: true,
    },
  });

  const nextPosition = maxPosDoc ? maxPosDoc.position + 1000 : 0;

  return await prisma.document.create({
    data: {
      title: data.title,
      ownerId,
      parentId: data.parentId,
      position: nextPosition,
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

type DbClient = typeof prisma | Prisma.TransactionClient;

const POSITION_STEP = 1000;
const MIN_POSITION_GAP = 0.000001;

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
    SELECT * FROM active_tree ORDER BY position ASC, "createdAt" ASC, id ASC;
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
        ARRAY[COALESCE(NULLIF(d.title, ''), 'New Page')]::text[] AS "pathTitles"
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
        t."pathTitles" || COALESCE(NULLIF(d.title, ''), 'New Page')
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

type SiblingPosition = {
  id: string;
  position: number;
};

function getPositionBetween(
  previous: SiblingPosition | null,
  next: SiblingPosition | null,
) {
  if (previous && next) {
    return (previous.position + next.position) / 2;
  }

  if (previous) {
    return previous.position + POSITION_STEP;
  }

  if (next) {
    return next.position - POSITION_STEP;
  }

  return 0;
}

async function getActiveSiblings(
  client: DbClient,
  ownerId: string,
  parentId: string | null,
  excludingId: string,
): Promise<SiblingPosition[]> {
  return await client.document.findMany({
    where: {
      ownerId,
      parentId,
      archivedAt: null,
      id: { not: excludingId },
    },
    orderBy: [
      { position: "asc" },
      { createdAt: "asc" },
      { id: "asc" },
    ],
    select: {
      id: true,
      position: true,
    },
  });
}

async function rebalanceSiblingPositions(
  client: DbClient,
  ownerId: string,
  parentId: string | null,
) {
  const siblings = await client.document.findMany({
    where: {
      ownerId,
      parentId,
      archivedAt: null,
    },
    orderBy: [
      { position: "asc" },
      { createdAt: "asc" },
      { id: "asc" },
    ],
    select: {
      id: true,
    },
  });

  await Promise.all(
    siblings.map((sibling, index) =>
      client.document.update({
        where: { id: sibling.id },
        data: { position: index * POSITION_STEP },
      }),
    ),
  );
}

async function hasDescendant(
  client: DbClient,
  ownerId: string,
  rootId: string,
  possibleDescendantId: string,
) {
  const rows = await client.$queryRaw<{ id: string }[]>`
    WITH RECURSIVE descendants AS (
      SELECT id, "parentId"
      FROM "Document"
      WHERE id = ${rootId}
        AND "ownerId" = ${ownerId}

      UNION ALL

      SELECT child.id, child."parentId"
      FROM "Document" child
      INNER JOIN descendants d ON child."parentId" = d.id
      WHERE child."ownerId" = ${ownerId}
    )

    SELECT id
    FROM descendants
    WHERE id = ${possibleDescendantId}
    LIMIT 1;
  `;

  return rows.length > 0;
}

function getAdjacentSiblings(
  siblings: SiblingPosition[],
  beforeId?: string,
  afterId?: string,
) {
  if (beforeId) {
    const nextIndex = siblings.findIndex((sibling) => sibling.id === beforeId);
    if (nextIndex === -1) {
      throw new HttpError("Target sibling not found", 404);
    }

    return {
      previous: siblings[nextIndex - 1] ?? null,
      next: siblings[nextIndex],
    };
  }

  if (afterId) {
    const previousIndex = siblings.findIndex((sibling) => sibling.id === afterId);
    if (previousIndex === -1) {
      throw new HttpError("Target sibling not found", 404);
    }

    return {
      previous: siblings[previousIndex],
      next: siblings[previousIndex + 1] ?? null,
    };
  }

  return {
    previous: siblings[siblings.length - 1] ?? null,
    next: null,
  };
}

export async function moveDocument(
  id: string,
  ownerId: string,
  data: MoveDocumentPayload,
) {
  return await prisma.$transaction(async (tx) => {
    const documentContext = await getArchiveContext(id, ownerId, tx);
    if (!documentContext) return null;

    if (documentContext.isEffectivelyArchived) {
      throw new HttpError("Archived documents cannot be moved", 409);
    }

    if (data.parentId === id || data.beforeId === id || data.afterId === id) {
      throw new HttpError("Document cannot be moved relative to itself", 409);
    }

    if (data.parentId) {
      const parentContext = await getArchiveContext(data.parentId, ownerId, tx);
      if (!parentContext) {
        throw new HttpError("Parent document not found", 404);
      }

      if (parentContext.isEffectivelyArchived) {
        throw new HttpError("Cannot move document inside an archived page", 409);
      }

      const targetParentIsDescendant = await hasDescendant(
        tx,
        ownerId,
        id,
        data.parentId,
      );

      if (targetParentIsDescendant) {
        throw new HttpError("Document cannot be moved inside its own child", 409);
      }
    }

    let siblings = await getActiveSiblings(tx, ownerId, data.parentId, id);
    let { previous, next } = getAdjacentSiblings(
      siblings,
      data.beforeId,
      data.afterId,
    );

    if (
      previous &&
      next &&
      Math.abs(next.position - previous.position) < MIN_POSITION_GAP
    ) {
      await rebalanceSiblingPositions(tx, ownerId, data.parentId);
      siblings = await getActiveSiblings(tx, ownerId, data.parentId, id);
      ({ previous, next } = getAdjacentSiblings(
        siblings,
        data.beforeId,
        data.afterId,
      ));
    }

    const position = getPositionBetween(previous, next);

    return await tx.document.update({
      where: { id },
      data: {
        parentId: data.parentId,
        position,
      },
    });
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
  client: DbClient = prisma,
): Promise<ArchiveContext | null> {
  const rows = await client.$queryRaw<AncestorRow[]>`
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

export async function purgeExpiredTrashDocuments(days: number = 30) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const result = await prisma.document.deleteMany({
    where: {
      archivedAt: {
        lt: cutoffDate,
      },
    },
  });
  return result.count;
}

export interface SearchDocumentItem {
  id: string;
  title: string | null;
  parentId: string | null;
  icon: string | null;
  updatedAt: Date;
  rank: number;
  pathIds: string[];
  pathTitles: string[];
}

export async function searchActiveDocuments(
  ownerId: string,
  query: string,
  limit: number = 20
): Promise<SearchDocumentItem[]> {
  if (!query) return [];

  return await prisma.$queryRaw<SearchDocumentItem[]>`
    WITH RECURSIVE search_input AS (
      SELECT websearch_to_tsquery('english', ${query}) AS tsq
    ),

    matched_docs AS (
      SELECT
        d.id,
        d."parentId",
        d.title,
        d.icon,
        d."updatedAt",
        ts_rank_cd(d."searchVector", search_input.tsq) AS rank
      FROM "Document" d
      CROSS JOIN search_input
      WHERE d."ownerId" = ${ownerId}
        AND d."archivedAt" IS NULL
        AND d."searchVector" @@ search_input.tsq
    ),

    ancestors AS (
      SELECT
        m.id AS "matchId",
        d.id,
        d."parentId",
        d.title,
        d."archivedAt",
        0 AS depth
      FROM matched_docs m
      INNER JOIN "Document" d ON d.id = m.id

      UNION ALL

      SELECT
        a."matchId",
        parent.id,
        parent."parentId",
        parent.title,
        parent."archivedAt",
        a.depth + 1
      FROM ancestors a
      INNER JOIN "Document" parent ON parent.id = a."parentId"
      WHERE a."parentId" IS NOT NULL
    ),

    valid_matches AS (
      SELECT
        m.id,
        m."parentId",
        m.title,
        m.icon,
        m."updatedAt",
        m.rank
      FROM matched_docs m
      WHERE NOT EXISTS (
        SELECT 1
        FROM ancestors a
        WHERE a."matchId" = m.id
          AND a.depth > 0
          AND a."archivedAt" IS NOT NULL
      )
    ),

    paths AS (
      SELECT
        a."matchId",
        ARRAY_AGG(a.id ORDER BY a.depth DESC) AS "pathIds",
        ARRAY_AGG(COALESCE(NULLIF(a.title, ''), 'New Page') ORDER BY a.depth DESC) AS "pathTitles"
      FROM ancestors a
      INNER JOIN valid_matches vm ON vm.id = a."matchId"
      GROUP BY a."matchId"
    )

    SELECT
      vm.id,
      vm.title,
      vm."parentId",
      vm.icon,
      vm."updatedAt",
      vm.rank,
      p."pathIds",
      p."pathTitles"
    FROM valid_matches vm
    INNER JOIN paths p ON p."matchId" = vm.id
    ORDER BY
      vm.rank DESC,
      vm."updatedAt" DESC
    LIMIT ${limit};
  `;
};
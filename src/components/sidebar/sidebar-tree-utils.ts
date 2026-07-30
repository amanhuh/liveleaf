import { arrayMove } from "@dnd-kit/sortable";
import type { DocumentListItemDto, MoveDocumentPayload } from "@/features/documents";

export type FlatSidebarDocument = {
  document: DocumentListItemDto;
  id: string;
  parentId: string | null;
  depth: number;
};

export type ProjectedSidebarMove = MoveDocumentPayload & {
  depth: number;
  overId: string;
  projectedIndex: number;
};

export type DropIndicatorState = {
  type: "above" | "below" | "nest";
  depth: number;
} | null;

export const SIDEBAR_INDENTATION_WIDTH = 12;

export function sortDocumentsByPosition(docs: DocumentListItemDto[]) {
  return [...docs].sort(
    (a, b) =>
      a.position - b.position ||
      a.createdAt.localeCompare(b.createdAt) ||
      a.id.localeCompare(b.id),
  );
}

export function buildVisibleSidebarTree(
  docs: DocumentListItemDto[],
  expandedDocumentIds: string[],
) {
  const expanded = new Set(expandedDocumentIds);
  const sortedDocs = sortDocumentsByPosition(docs);
  const byParentId = new Map<string | null, DocumentListItemDto[]>();

  for (const doc of sortedDocs) {
    const siblings = byParentId.get(doc.parentId) ?? [];
    siblings.push(doc);
    byParentId.set(doc.parentId, siblings);
  }

  const visibleItems: FlatSidebarDocument[] = [];

  const walk = (parentId: string | null, depth: number) => {
    const children = byParentId.get(parentId) ?? [];

    for (const child of children) {
      visibleItems.push({
        document: child,
        id: child.id,
        parentId: child.parentId,
        depth,
      });

      if (expanded.has(child.id)) {
        walk(child.id, depth + 1);
      }
    }
  };

  walk(null, 0);
  return visibleItems;
}

export function getProjectedMove(
  visibleItems: FlatSidebarDocument[],
  activeId: string,
  overId: string,
  dragOffsetX: number,
): ProjectedSidebarMove | null {
  const activeIndex = visibleItems.findIndex((item) => item.id === activeId);
  const overIndex = visibleItems.findIndex((item) => item.id === overId);

  if (activeIndex === -1 || overIndex === -1) return null;

  const movedItems = arrayMove(visibleItems, activeIndex, overIndex);
  const projectedIndex = movedItems.findIndex((item) => item.id === activeId);
  const activeItem = visibleItems[activeIndex];
  const previousItem = movedItems[projectedIndex - 1] ?? null;
  const nextItem = movedItems[projectedIndex + 1] ?? null;
  const projectedDepth = getProjectedDepth(
    activeItem.depth,
    dragOffsetX,
    previousItem,
    nextItem,
  );
  const parentId = getProjectedParentId(movedItems, projectedIndex, projectedDepth);
  const previousSibling = findPreviousSibling(movedItems, projectedIndex, projectedDepth, parentId);
  const nextSibling = findNextSibling(movedItems, projectedIndex, projectedDepth, parentId);

  if (nextSibling) {
    return {
      parentId,
      beforeId: nextSibling.id,
      depth: projectedDepth,
      overId,
      projectedIndex,
    };
  }

  if (previousSibling) {
    return {
      parentId,
      afterId: previousSibling.id,
      depth: projectedDepth,
      overId,
      projectedIndex,
    };
  }

  return {
    parentId,
    depth: projectedDepth,
    overId,
    projectedIndex,
  };
}

export function getDropIndicator(
  itemId: string,
  projectedMove: ProjectedSidebarMove | null,
  visibleItems: FlatSidebarDocument[],
): DropIndicatorState {
  if (!projectedMove) return null;

  const itemIndex = visibleItems.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) return null;

  if (projectedMove.parentId === itemId) {
    return { type: "nest", depth: projectedMove.depth };
  }

  if (projectedMove.projectedIndex === itemIndex) {
    return { type: "above", depth: projectedMove.depth };
  }

  if (
    projectedMove.projectedIndex === visibleItems.length &&
    itemIndex === visibleItems.length - 1
  ) {
    return { type: "below", depth: projectedMove.depth };
  }

  if (projectedMove.projectedIndex === itemIndex + 1) {
    return { type: "below", depth: projectedMove.depth };
  }

  return null;
}

function getProjectedDepth(
  activeDepth: number,
  dragOffsetX: number,
  previousItem: FlatSidebarDocument | null,
  nextItem: FlatSidebarDocument | null,
) {
  const dragDepth = Math.round(dragOffsetX / SIDEBAR_INDENTATION_WIDTH);
  const projectedDepth = activeDepth + dragDepth;
  const maxDepth = previousItem ? previousItem.depth + 1 : 0;
  const minDepth = nextItem ? nextItem.depth : 0;

  return Math.min(Math.max(projectedDepth, minDepth), maxDepth);
}

function getProjectedParentId(
  items: FlatSidebarDocument[],
  projectedIndex: number,
  projectedDepth: number,
) {
  if (projectedDepth === 0) return null;

  for (let index = projectedIndex - 1; index >= 0; index--) {
    const item = items[index];

    if (item.depth === projectedDepth - 1) {
      return item.id;
    }
  }

  return null;
}

function findPreviousSibling(
  items: FlatSidebarDocument[],
  projectedIndex: number,
  projectedDepth: number,
  parentId: string | null,
) {
  for (let index = projectedIndex - 1; index >= 0; index--) {
    const item = items[index];
    if (item.depth < projectedDepth) return null;
    if (item.depth === projectedDepth && item.parentId === parentId) return item;
  }

  return null;
}

function findNextSibling(
  items: FlatSidebarDocument[],
  projectedIndex: number,
  projectedDepth: number,
  parentId: string | null,
) {
  for (let index = projectedIndex + 1; index < items.length; index++) {
    const item = items[index];
    if (item.depth < projectedDepth) return null;
    if (item.depth === projectedDepth && item.parentId === parentId) return item;
  }

  return null;
}

import type { DocumentListItemDto } from "@/features/documents";

export type FlatSidebarDocument = {
  document: DocumentListItemDto;
  id: string;
  parentId: string | null;
  depth: number;
};

export type ProjectedSidebarMove = {
  parentId: string | null;
  beforeId?: string;
  afterId?: string;
  dropType: "between" | "nest";
  depth: number;
  overId: string;
  insertionAnchor: { itemId: string; position: "above" | "below" };
};

export type DropIndicatorState =
  | { type: "between-before"; depth: number }
  | { type: "between-after"; depth: number }
  | { type: "nest"; position: "single" | "top" | "middle" | "bottom" }
  | null;

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
      visibleItems.push({ document: child, id: child.id, parentId: child.parentId, depth });
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
  mouseY: number,
  overItemRect: { top: number; bottom: number; height: number },
  dragOffsetX: number,
): ProjectedSidebarMove | null {
  const overIndex = visibleItems.findIndex((item) => item.id === overId);
  const activeIndex = visibleItems.findIndex((item) => item.id === activeId);
  if (overIndex === -1 || activeIndex === -1) return null;

  const overItem = visibleItems[overIndex];
  const activeItem = visibleItems[activeIndex];

  // Direct mouse Y percentage relative to hovered item rect (0.0 = top edge, 1.0 = bottom edge)
  const relativeY = mouseY - overItemRect.top;
  const percentage = overItemRect.height > 0 ? relativeY / overItemRect.height : 0.5;

  // Middle 65% (0.175 to 0.825) => nest into overId
  if (percentage >= 0.175 && percentage <= 0.825) {
    return {
      parentId: overId,
      dropType: "nest",
      depth: overItem.depth + 1,
      overId,
      insertionAnchor: { itemId: overId, position: "above" },
    };
  }

  // Top 17.5% (< 0.175) => insert before overId. Bottom 17.5% (> 0.825) => insert after overId.
  const insertBefore = percentage < 0.175;

  const itemsWithoutActive = visibleItems.filter((item) => item.id !== activeId);
  const overIndexInFiltered = itemsWithoutActive.findIndex((item) => item.id === overId);
  if (overIndexInFiltered === -1) return null;

  const previousItem = insertBefore
    ? (itemsWithoutActive[overIndexInFiltered - 1] ?? null)
    : (itemsWithoutActive[overIndexInFiltered] ?? null);

  const nextItem = insertBefore
    ? (itemsWithoutActive[overIndexInFiltered] ?? null)
    : (itemsWithoutActive[overIndexInFiltered + 1] ?? null);

  const dragDepth = Math.round(dragOffsetX / SIDEBAR_INDENTATION_WIDTH);
  const maxDepth = previousItem ? previousItem.depth + 1 : 0;
  const minDepth = nextItem ? nextItem.depth : 0;
  const projectedDepth = Math.min(Math.max(activeItem.depth + dragDepth, minDepth), maxDepth);

  const insertionRefIndex = insertBefore ? overIndexInFiltered : overIndexInFiltered + 1;

  let parentId: string | null = null;
  if (projectedDepth > 0) {
    for (let i = insertionRefIndex - 1; i >= 0; i--) {
      const item = itemsWithoutActive[i];
      if (item.depth === projectedDepth - 1) {
        parentId = item.id;
        break;
      }
      if (item.depth < projectedDepth - 1) break;
    }
  }

  if (!insertBefore && parentId === overId) {
    let lastInSubtree = overId;
    for (let i = overIndex + 1; i < visibleItems.length; i++) {
      if (visibleItems[i].depth <= overItem.depth) break;
      lastInSubtree = visibleItems[i].id;
    }
    return {
      parentId: overId,
      dropType: "between",
      depth: overItem.depth + 1,
      overId,
      insertionAnchor: { itemId: lastInSubtree, position: "below" },
    };
  }

  let beforeId: string | undefined;
  let afterId: string | undefined;

  if (insertBefore) {
    for (let i = insertionRefIndex; i < itemsWithoutActive.length; i++) {
      const item = itemsWithoutActive[i];
      if (item.depth < projectedDepth) break;
      if (item.depth === projectedDepth && item.parentId === parentId) {
        beforeId = item.id;
        break;
      }
    }
  } else {
    for (let i = insertionRefIndex - 1; i >= 0; i--) {
      const item = itemsWithoutActive[i];
      if (item.depth < projectedDepth) break;
      if (item.depth === projectedDepth && item.parentId === parentId) {
        afterId = item.id;
        break;
      }
    }
  }

  let anchorItemId: string;
  let anchorPosition: "above" | "below";

  if (insertBefore) {
    anchorItemId = overId;
    anchorPosition = "above";
  } else {
    let lastInSubtree = overId;
    for (let i = overIndex + 1; i < visibleItems.length; i++) {
      if (visibleItems[i].depth <= overItem.depth) break;
      lastInSubtree = visibleItems[i].id;
    }
    anchorItemId = lastInSubtree;
    anchorPosition = "below";
  }

  return {
    parentId,
    beforeId,
    afterId,
    dropType: "between",
    depth: projectedDepth,
    overId,
    insertionAnchor: { itemId: anchorItemId, position: anchorPosition },
  };
}

export function getDropIndicator(
  itemId: string,
  projectedMove: ProjectedSidebarMove | null,
  visibleItems: FlatSidebarDocument[] = [],
): DropIndicatorState {
  if (!projectedMove) return null;

  if (projectedMove.dropType === "nest") {
    const overIndex = visibleItems.findIndex((item) => item.id === projectedMove.overId);
    if (overIndex !== -1) {
      const overItem = visibleItems[overIndex];
      const subtreeItems: FlatSidebarDocument[] = [overItem];

      for (let i = overIndex + 1; i < visibleItems.length; i++) {
        if (visibleItems[i].depth <= overItem.depth) break;
        subtreeItems.push(visibleItems[i]);
      }

      const itemSubtreeIndex = subtreeItems.findIndex((item) => item.id === itemId);
      if (itemSubtreeIndex !== -1) {
        if (subtreeItems.length === 1) {
          return { type: "nest", position: "single" };
        }
        if (itemSubtreeIndex === 0) {
          return { type: "nest", position: "top" };
        }
        if (itemSubtreeIndex === subtreeItems.length - 1) {
          return { type: "nest", position: "bottom" };
        }
        return { type: "nest", position: "middle" };
      }
    }
  }

  if (projectedMove.dropType === "between") {
    const { itemId: anchorId, position } = projectedMove.insertionAnchor;
    if (anchorId === itemId) {
      return {
        type: position === "above" ? "between-before" : "between-after",
        depth: projectedMove.depth,
      };
    }
  }

  return null;
}

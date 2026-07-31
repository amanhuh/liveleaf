"use client";

import * as React from "react";
import { useState } from "react";
import {
  closestCenter,
  pointerWithin,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { PlusIcon, LogOut, ChevronDown, Trash2, Settings, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import TreeItem from "./tree-item";
import { useGetDocuments, useCreateDocument, useMoveDocument } from "@/hooks/use-document";
import { SidebarSkeleton } from "@/components/skeleton/sidebar-skeleton";
import { authClient } from "@/lib/auth/auth-client";
import { useDocumentStore } from "@/stores/document-store";
import { TrashModal } from "@/components/modals/trash-modal";
import { SearchCommand } from "@/components/modals/search-command";
import { SettingsModal } from "@/components/modals/settings-modal";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DocumentListItemDto } from "@/features/documents";
import {
  buildVisibleSidebarTree,
  getDropIndicator,
  getProjectedMove,
  type FlatSidebarDocument,
  type ProjectedSidebarMove,
} from "./sidebar-tree-utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ documentId: string }>();
  const selectedDocumentId = params.documentId;
  const router = useRouter();
  const { data: documents = [], isLoading: isDocsLoading } = useGetDocuments();
  const rootDocs = documents.filter((doc) => doc.parentId === null);
  const createDocument = useCreateDocument();
  const moveDocument = useMoveDocument();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [renamingDocumentId, setRenamingDocumentId] = useState<string | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [projectedMove, setProjectedMove] = useState<ProjectedSidebarMove | null>(null);
  const suppressNavigationRef = React.useRef(false);
  const expandedDocumentIds = useDocumentStore((state) => state.expandedDocumentIds);
  const expandDocument = useDocumentStore((state) => state.expandDocument);
  const visibleItems = React.useMemo(
    () => buildVisibleSidebarTree(documents, expandedDocumentIds),
    [documents, expandedDocumentIds],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useKeyboardShortcuts({
    onNewPage: () => createDocument.mutate({}),
    onSearch: () => setIsSearchOpen(true),
  });

  const lastDocumentCount = useDocumentStore((state) => state.lastDocumentCount);
  const setLastDocumentCount = useDocumentStore((state) => state.setLastDocumentCount);

  const [hydrated, setHydrated] = useState(false);
  React.useEffect(() => {
    requestAnimationFrame(() => {
      setHydrated(true);
    });
  }, []);

  React.useEffect(() => {
    if (!isDocsLoading) {
      setLastDocumentCount(rootDocs.length);
    }
  }, [isDocsLoading, rootDocs.length, setLastDocumentCount]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    suppressNavigationRef.current = true;
    setActiveDragId(String(event.active.id));
    setProjectedMove(null);
  };

  const autoExpandTimerRef = React.useRef<number | null>(null);
  const autoExpandTargetIdRef = React.useRef<string | null>(null);

  const clearAutoExpand = React.useCallback(() => {
    if (autoExpandTimerRef.current) {
      window.clearTimeout(autoExpandTimerRef.current);
      autoExpandTimerRef.current = null;
    }
    autoExpandTargetIdRef.current = null;
  }, []);

  const scheduleAutoExpand = React.useCallback(
    (targetId: string) => {
      if (autoExpandTargetIdRef.current === targetId) return;
      clearAutoExpand();
      autoExpandTargetIdRef.current = targetId;
      autoExpandTimerRef.current = window.setTimeout(() => {
        expandDocument(targetId);
        clearAutoExpand();
      }, 600);
    },
    [expandDocument, clearAutoExpand],
  );

  const updateProjectedMove = (
    activeId: string,
    overId: string | null,
    mouseY: number,
    overRect: { top: number; bottom: number; height: number } | undefined,
    dragOffsetX: number,
  ) => {
    if (!overId) {
      clearAutoExpand();
      // Mouse is in empty space below the list -> fall back to placing at bottom of root
      if (visibleItems.length > 0) {
        const lastVisible = visibleItems[visibleItems.length - 1];
        if (activeId !== lastVisible.id) {
          // Find the last root-level item to set as afterId
          const rootItems = visibleItems.filter((i) => i.depth === 0 && i.id !== activeId);
          const lastRoot = rootItems[rootItems.length - 1];
          setProjectedMove({
            parentId: null,
            afterId: lastRoot?.id,
            dropType: "between",
            depth: 0,
            overId: lastVisible.id,
            insertionAnchor: { itemId: lastVisible.id, position: "below" },
          });
          return;
        }
      }
      setProjectedMove(null);
      return;
    }

    if (activeId === overId || !overRect) {
      clearAutoExpand();
      setProjectedMove(null);
      return;
    }

    // Auto-expand collapsed parent after 600ms of hovering
    if (!expandedDocumentIds.includes(overId)) {
      scheduleAutoExpand(overId);
    } else {
      clearAutoExpand();
    }

    const move = getProjectedMove(visibleItems, activeId, overId, mouseY, overRect, dragOffsetX);
    if (!move || wouldMoveInsideDescendant(documents, activeId, move.parentId)) {
      setProjectedMove(null);
      return;
    }

    setProjectedMove(move);
  };

  const getEventMouseY = (event: DragMoveEvent | DragOverEvent) => {
    const activator = event.activatorEvent as PointerEvent | undefined;
    const initialY = activator?.clientY ?? 0;
    return initialY + event.delta.y;
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const overRect = event.over?.rect;
    updateProjectedMove(
      String(event.active.id),
      event.over ? String(event.over.id) : null,
      getEventMouseY(event),
      overRect ?? undefined,
      event.delta.x,
    );
  };

  const handleDragOver = (event: DragOverEvent) => {
    const overRect = event.over?.rect;
    updateProjectedMove(
      String(event.active.id),
      event.over ? String(event.over.id) : null,
      getEventMouseY(event),
      overRect ?? undefined,
      event.delta.x,
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    clearAutoExpand();
    const activeId = String(event.active.id);
    const lastProjectedMove = projectedMove;
    suppressNavigationRef.current = true;
    window.setTimeout(() => {
      suppressNavigationRef.current = false;
    }, 400);
    setActiveDragId(null);
    setProjectedMove(null);

    if (!lastProjectedMove) return;
    if (wouldMoveInsideDescendant(documents, activeId, lastProjectedMove.parentId)) return;

    moveDocument.mutate({
      id: activeId,
      parentId: lastProjectedMove.parentId,
      beforeId: lastProjectedMove.beforeId,
      afterId: lastProjectedMove.afterId,
    });

    if (lastProjectedMove.parentId) {
      expandDocument(lastProjectedMove.parentId);
    }
  };

  const handleDragCancel = () => {
    clearAutoExpand();
    setActiveDragId(null);
    setProjectedMove(null);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="py-2.5 px-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            {isSessionLoading ? (
              <SidebarMenuButton size="default" className="pointer-events-none py-1.5 h-auto">
                <div className="flex aspect-square size-8 animate-pulse rounded-lg bg-sidebar-accent" />
                <div className="grid flex-1 space-y-1.5 text-left leading-tight">
                  <div className="h-3 w-16 animate-pulse rounded bg-sidebar-accent" />
                  <div className="h-2 w-28 animate-pulse rounded bg-sidebar-accent" />
                </div>
                <ChevronDown className="ml-auto size-4 text-sidebar-foreground/20" />
              </SidebarMenuButton>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="default"
                    className="py-1.5 h-auto data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground text-xs font-semibold">
                      {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {session?.user?.name || "User"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {session?.user?.email || ""}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto size-3.5 text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Pages</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                createDocument.mutate({});
              }}
              className="ml-auto rounded-sm p-0.5 hover:bg-accent transition-colors cursor-pointer"
            >
              <PlusIcon className="size-3.5" />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {isDocsLoading ? (
                <SidebarSkeleton count={hydrated ? lastDocumentCount : 3} />
              ) : (() => {
                const activeDragItem = visibleItems.find((item) => item.id === activeDragId);
                const draggedSubtree = getDraggedSubtree(activeDragId, visibleItems, documents);
                const activeDragIdSet = new Set(draggedSubtree.map((item) => item.id));

                return (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={pointerWithin}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                  >
                    <SortableContext
                      items={visibleItems.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {visibleItems.map((item) => (
                        <SortableSidebarItem
                          key={item.id}
                          item={item}
                          docs={documents}
                          selectedDocumentId={selectedDocumentId}
                          renamingDocumentId={renamingDocumentId}
                          setRenamingDocumentId={setRenamingDocumentId}
                          disabled={renamingDocumentId !== null}
                          isActiveDragItem={activeDragIdSet.has(item.id)}
                          dropIndicator={getDropIndicator(item.id, projectedMove, visibleItems)}
                          suppressNavigationRef={suppressNavigationRef}
                        />
                      ))}
                    </SortableContext>
                    <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                      {activeDragItem && (
                        <div className="opacity-20 shadow-sm rounded-md bg-sidebar/70 border border-sidebar-border/40 backdrop-blur-none pointer-events-none py-1 overflow-hidden">
                          {draggedSubtree.map((item) => (
                            <TreeItem
                              key={item.id}
                              selectedDocumentId={selectedDocumentId}
                              item={item.document}
                              docs={documents}
                              depth={item.depth - activeDragItem.depth}
                              renamingDocumentId={null}
                              setRenamingDocumentId={() => {}}
                              isDragging={false}
                            />
                          ))}
                        </div>
                      )}
                    </DragOverlay>
                  </DndContext>
                );
              })()}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="relative border-t border-sidebar-border/40 bg-sidebar/80 backdrop-blur-md">
        <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-sidebar via-sidebar/80 to-transparent" />
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton className="cursor-pointer" onClick={() => setIsSearchOpen(true)}>
                  <Search className="size-4" />
                  <span>Search</span>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Search (⌘K)</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton className="cursor-pointer" onClick={() => setIsTrashOpen(true)}>
                  <Trash2 className="size-4" />
                  <span>Trash</span>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Trash (⇧⌘⌫)</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton className="cursor-pointer" onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="size-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>

      </SidebarFooter>
      <SidebarRail />
      <TrashModal open={isTrashOpen} onOpenChange={setIsTrashOpen} />
      <SearchCommand open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </Sidebar>
  );
}

function SortableSidebarItem({
  item,
  docs,
  selectedDocumentId,
  renamingDocumentId,
  setRenamingDocumentId,
  disabled,
  isActiveDragItem,
  dropIndicator,
  suppressNavigationRef,
}: {
  item: FlatSidebarDocument;
  docs: DocumentListItemDto[];
  selectedDocumentId: string;
  renamingDocumentId: string | null;
  setRenamingDocumentId: React.Dispatch<React.SetStateAction<string | null>>;
  disabled: boolean;
  isActiveDragItem: boolean;
  dropIndicator: ReturnType<typeof getDropIndicator>;
  suppressNavigationRef: React.MutableRefObject<boolean>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled,
    animateLayoutChanges: () => false,
  });

  return (
    <TreeItem
      selectedDocumentId={selectedDocumentId}
      item={item.document}
      docs={docs}
      depth={item.depth}
      renamingDocumentId={renamingDocumentId}
      setRenamingDocumentId={setRenamingDocumentId}
      isDragging={isDragging || isActiveDragItem}
      dropIndicator={dropIndicator}
      suppressNavigationRef={suppressNavigationRef}
      itemRef={setNodeRef}
      dragAttributes={attributes}
      dragListeners={listeners}
    />
  );
}

function wouldMoveInsideDescendant(
  docs: DocumentListItemDto[],
  activeId: string,
  targetParentId: string | null,
) {
  if (!targetParentId) return false;

  let current = docs.find((doc) => doc.id === targetParentId);
  while (current) {
    if (current.id === activeId) return true;
    current = current.parentId
      ? docs.find((doc) => doc.id === current?.parentId)
      : undefined;
  }

  return false;
}

function getDraggedSubtree(
  activeId: string | null,
  visibleItems: FlatSidebarDocument[],
  docs: DocumentListItemDto[]
): FlatSidebarDocument[] {
  if (!activeId) return [];

  const activeIndex = visibleItems.findIndex((item) => item.id === activeId);
  if (activeIndex === -1) return [];

  const activeItem = visibleItems[activeIndex];
  const result: FlatSidebarDocument[] = [activeItem];

  for (let i = activeIndex + 1; i < visibleItems.length; i++) {
    const item = visibleItems[i];
    if (isDescendantOf(item.document, activeId, docs)) {
      result.push(item);
    } else {
      break;
    }
  }

  return result;
}

function isDescendantOf(
  doc: DocumentListItemDto,
  ancestorId: string,
  docs: DocumentListItemDto[]
): boolean {
  let currentParentId = doc.parentId;
  while (currentParentId) {
    if (currentParentId === ancestorId) return true;
    const parentDoc = docs.find((d) => d.id === currentParentId);
    currentParentId = parentDoc?.parentId ?? null;
  }
  return false;
}

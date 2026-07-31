import { useState, useRef, useEffect } from "react";
import type { DocumentListItemDto } from "@/features/documents";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DropdownMenuEllipsis } from "./dropdown-menu-ellipsis";
import { ContextMenuEllipsis } from "./context-menu-ellipsis";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FileIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { useDocumentStore } from "@/stores/document-store";
import { useCreateDocument, useUpdateDocument } from "@/hooks/use-document";
import {
  SIDEBAR_INDENTATION_WIDTH,
  type DropIndicatorState,
} from "./sidebar-tree-utils";

export type TreeItemProps = {
  item: DocumentListItemDto;
  docs: DocumentListItemDto[];
  selectedDocumentId: string;
  renamingDocumentId: string | null;
  setRenamingDocumentId: React.Dispatch<React.SetStateAction<string | null>>;
  depth?: number;
  isDragging?: boolean;
  dropIndicator?: DropIndicatorState;
  suppressNavigationRef?: React.MutableRefObject<boolean>;
  itemRef?: (node: HTMLLIElement | null) => void;
  itemStyle?: React.CSSProperties;
  dragAttributes?: React.HTMLAttributes<HTMLElement>;
  dragListeners?: React.HTMLAttributes<HTMLElement>;
};

export default function TreeItem({
  selectedDocumentId,
  item,
  docs,
  renamingDocumentId,
  setRenamingDocumentId,
  depth = 0,
  isDragging = false,
  dropIndicator = null,
  suppressNavigationRef,
  itemRef,
  itemStyle,
  dragAttributes,
  dragListeners,
}: TreeItemProps) {
  const router = useRouter();
  const expandedDocumentIds = useDocumentStore((state) => state.expandedDocumentIds);
  const isOpen = expandedDocumentIds.includes(item.id);
  const toggleExpanded = useDocumentStore((state) => state.toggleExpanded);
  const expandDocument = useDocumentStore((state) => state.expandDocument);

  const children = docs.filter((doc) => doc.parentId === item.id);
  const hasChildren = children.length > 0;

  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument(item.id);

  const documentName = item.title.trim() ? item.title : "New Page";
  const [draftTitle, setDraftTitle] = useState(documentName);
  const inputRef = useRef<HTMLInputElement>(null);

  const isRenaming = renamingDocumentId === item.id;

  useEffect(() => {
    if (isRenaming) {
      const timeoutId = setTimeout(() => {
        setDraftTitle(item.title);
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isRenaming, item.title]);

  const handleSave = () => {
    updateDocument.mutate({ title: draftTitle.trim() || "New Page" });
    setRenamingDocumentId(null);
  };

  const handleCancel = () => {
    setDraftTitle(documentName);
    setRenamingDocumentId(null);
  };

  const handleNavigate = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressNavigationRef?.current) {
      suppressNavigationRef.current = false;
      event.preventDefault();
      return;
    }

    if (event.metaKey || event.ctrlKey) {
      window.open(`/d/${item.id}`, "_blank", "noopener,noreferrer");
      return;
    }

    router.push(`/d/${item.id}`);
  };

  const buttonContent = isRenaming ? (
    <div className="flex items-center w-full min-w-0 px-2 py-0.5 rounded-md bg-sidebar-accent/60 ring-1 ring-border/80">
      <FileIcon className="size-4 mr-2 shrink-0 text-muted-foreground" />
      <input
        autoFocus
        ref={inputRef}
        className="bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 p-0 m-0 w-full min-w-0 text-sm font-medium text-foreground"
        value={draftTitle}
        onChange={(e) => setDraftTitle(e.target.value)}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          else if (e.key === "Escape") handleCancel();
        }}
      />
    </div>
  ) : (
    <div
      role="link"
      tabIndex={0}
      className="flex items-center w-full min-w-0 cursor-pointer"
      style={{ paddingLeft: 6 + depth * SIDEBAR_INDENTATION_WIDTH }}
      onClick={handleNavigate}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        if (suppressNavigationRef?.current) {
          suppressNavigationRef.current = false;
          return;
        }
        router.push(`/d/${item.id}`);
      }}
    >
      <div className="relative size-4 mr-2 shrink-0 flex items-center justify-center">
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleExpanded(item.id);
            }}
            className="absolute -inset-[2px] flex items-center justify-center opacity-0 group-hover/item:opacity-100 border border-transparent hover:border-border/40 hover:bg-sidebar-foreground/10 rounded-sm cursor-pointer z-10"
          >
            <ChevronRightIcon className={cn("size-3.5 text-foreground", isOpen && "rotate-90")} />
          </button>
        )}
        <FileIcon className={cn("size-4", hasChildren && "group-hover/item:opacity-0")} />
      </div>
      <span
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setRenamingDocumentId(item.id);
        }}
        className="truncate flex-1 select-none"
        title="Double-click to rename"
      >
        {documentName}
      </span>
      <ActionButtons
        item={item}
        setRenamingDocumentId={setRenamingDocumentId}
        createDocument={createDocument}
        expandDocument={expandDocument}
      />
    </div>
  );

  const menuButton = (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <SidebarMenuButton
          isActive={selectedDocumentId === item.id}
          className={cn(
            "group/item data-[active=true]:bg-accent cursor-pointer px-2 py-1.5 h-8 transition-colors",
            dropIndicator?.type === "nest" &&
              cn(
                "bg-sidebar-accent/50 text-sidebar-accent-foreground font-medium z-10",
                dropIndicator.position === "single" && "rounded-md border border-primary/70",
                dropIndicator.position === "top" && "rounded-t-md rounded-b-none border-t border-x border-primary/70 relative z-10",
                dropIndicator.position === "middle" && "rounded-none border-x border-primary/70 -mt-[1px] relative z-10",
                dropIndicator.position === "bottom" && "rounded-b-md rounded-t-none border-b border-x border-primary/70 -mt-[1px] relative z-10",
              ),
          )}
          asChild
        >
          {buttonContent}
        </SidebarMenuButton>
      </ContextMenuTrigger>
      <ContextMenuEllipsis
        document={item}
        onRename={() => setRenamingDocumentId(item.id)}
      />
    </ContextMenu>
  );

  const lineDepth = dropIndicator?.type === "between-before" || dropIndicator?.type === "between-after"
    ? dropIndicator.depth
    : depth;
  const dropLineOffset = lineDepth * SIDEBAR_INDENTATION_WIDTH + 8;

  return (
    <SidebarMenuItem
      ref={itemRef}
      style={itemStyle}
      className={cn("relative", isDragging && "opacity-40")}
      {...dragAttributes}
      {...dragListeners}
    >
      {dropIndicator?.type === "between-before" && (
        <div
          className="pointer-events-none absolute right-2 top-0 z-20 h-0.5 bg-primary"
          style={{ left: dropLineOffset }}
        >
          <div className="absolute -left-1 -top-[3px] size-2 rounded-full bg-primary" />
        </div>
      )}
      {dropIndicator?.type === "between-after" && (
        <div
          className="pointer-events-none absolute right-2 bottom-0 z-20 h-0.5 bg-primary"
          style={{ left: dropLineOffset }}
        >
          <div className="absolute -left-1 -top-[3px] size-2 rounded-full bg-primary" />
        </div>
      )}
      {menuButton}
    </SidebarMenuItem>
  );
}

function ActionButtons({
  item,
  setRenamingDocumentId,
  createDocument,
  expandDocument,
}: {
  item: DocumentListItemDto;
  setRenamingDocumentId: (id: string | null) => void;
  createDocument: ReturnType<typeof useCreateDocument>;
  expandDocument: (id: string) => void;
}) {
  return (
    <div className="relative flex ml-auto gap-1 shrink-0 invisible group-hover/item:visible">
      <div className="size-[20px] border border-transparent hover:border-border/40 hover:bg-sidebar-foreground/10 rounded-sm cursor-pointer flex items-center justify-center text-foreground">
        <DropdownMenuEllipsis
          document={item}
          onRename={() => setRenamingDocumentId(item.id)}
        />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              createDocument.mutate({ parentId: item.id });
              expandDocument(item.id);
            }}
            className="size-[20px] border border-transparent hover:border-border/40 hover:bg-sidebar-foreground/10 rounded-sm cursor-pointer flex items-center justify-center text-foreground"
          >
            <PlusIcon className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          Add page inside
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

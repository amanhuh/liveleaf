import { useState, useRef } from "react";
import type { DocumentListItemDto } from "@/features/documents";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DropdownMenuEllipsis } from "./drorpdown-menu-ellipsis";
import { ContextMenuEllipsis } from "./context-menu-ellipsis";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FileIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { useDocumentStore } from "@/stores/document-store";
import { useCreateDocument, useUpdateDocument } from "@/hooks/use-document";

export type TreeItemProps = {
  item: DocumentListItemDto;
  docs: DocumentListItemDto[];
  selectedDocumentId: string;
  renamingDocumentId: string | null;
  setRenamingDocumentId: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function TreeItem({
  selectedDocumentId,
  item,
  docs,
  renamingDocumentId,
  setRenamingDocumentId,
}: TreeItemProps) {
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

  const handleSave = () => {
    updateDocument.mutate({ title: draftTitle.trim() || "New Page" });
    setRenamingDocumentId(null);
  };

  const handleCancel = () => {
    setDraftTitle(documentName);
    setRenamingDocumentId(null);
  };

  const buttonContent = isRenaming ? (
    <div className="p-2">
      <FileIcon />
      <input
        autoFocus
        ref={inputRef}
        className="bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 p-0 m-0"
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
    <Link href={`/d/${item.id}`} className="flex items-center w-full min-w-0">
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
      <span className="truncate flex-1">{documentName}</span>
      <ActionButtons
        item={item}
        setRenamingDocumentId={setRenamingDocumentId}
        createDocument={createDocument}
        expandDocument={expandDocument}
      />
    </Link>
  );

  const menuButton = (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <SidebarMenuButton
          isActive={selectedDocumentId === item.id}
          className={cn(
            "group/item data-[active=true]:bg-accent cursor-pointer",
            isRenaming && "bg-blue-600/15! border border-blue-600",
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

  return (
    <SidebarMenuItem>
      {hasChildren ? (
        <Collapsible
          className="group/collapsible"
          open={isOpen}
          onOpenChange={() => toggleExpanded(item.id)}
        >
          {menuButton}
          <CollapsibleContent>
            <SidebarMenuSub>
              {children.map((child) => (
                <TreeItem
                  key={child.id}
                  selectedDocumentId={selectedDocumentId}
                  item={child}
                  docs={docs}
                  renamingDocumentId={renamingDocumentId}
                  setRenamingDocumentId={setRenamingDocumentId}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        menuButton
      )}
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
        <TooltipContent side="bottom">
          <p>Add a page</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
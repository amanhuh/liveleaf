import { useState, useEffect, useRef } from "react";
import type { Document } from "@/types/document.types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
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
import { useRouter } from "next/navigation";

export type TreeItemProps = {
  item: Document;
  docs: Document[];
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
  const router = useRouter();
  const expandedDocumentIds = useDocumentStore(
    (state) => state.expandedDocumentIds,
  );
  const toggleExpanded = useDocumentStore((state) => state.toggleExpanded);
  const createDocument = useDocumentStore((state) => state.createDocument);
  const expandDocument = useDocumentStore((state) => state.expandDocument);
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const children = docs.filter((doc) => doc.parentId === item.id);
  const hasChildren = children.length > 0;
  const isOpen = expandedDocumentIds.includes(item.id);
  const documentName = item.title.trim() ? item.title : "New Page";
  const [draftTitle, setDraftTitle] = useState(documentName);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (renamingDocumentId === item.id) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [renamingDocumentId, item.id]);

  const handleSave = () => {
    updateDocument(item.id, {
      title: draftTitle.trim() || "Untitled",
    });

    setRenamingDocumentId(null);
  };
  const handleCancel = () => {
    setDraftTitle(item.title);
    setRenamingDocumentId(null);
  };

  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <Collapsible
          className={"group/collapsible"}
          open={isOpen}
          onOpenChange={() => toggleExpanded(item.id)}
        >
          <ContextMenu>
            <CollapsibleTrigger asChild>
              <ContextMenuTrigger asChild>
                <SidebarMenuButton
                  isActive={selectedDocumentId == item.id}
                  className={cn(
                    "group/item data-[active=true]:bg-accent cursor-pointer",
                    renamingDocumentId == item.id &&
                      "bg-blue-600/15! border border-blue-600",
                  )}
                  asChild
                >
                  {renamingDocumentId == item.id ? (
                    <div className="p-2">
                      <FileIcon />
                      <input
                        autoFocus
                        className="
                          bg-transparent
                          border-none
                          outline-none
                          ring-0
                          focus:outline-none
                          focus:ring-0
                          p-0
                          m-0
                        "
                        ref={inputRef}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        value={draftTitle}
                        onChange={(e) => {
                          setDraftTitle(e.target.value);
                        }}
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                          if (e.key == "Enter") {
                            handleSave();
                          } else if (e.key == "Escape") {
                            handleCancel();
                          }
                        }}
                      ></input>
                    </div>
                  ) : (
                    <Link href={`/d/${item.id}`}>
                      <FileIcon />
                      {documentName}
                      <div className="relative flex ml-auto gap-2">
                        <ChevronRightIcon
                          className={cn(
                            "group-hover/item:hidden absolute right-0 transition-transform",
                            isOpen && "rotate-90",
                          )}
                        />
                        <div className="flex gap-2 ml-auto invisible group-hover/item:visible">
                          <DropdownMenuEllipsis
                            document={item}
                            onRename={() => setRenamingDocumentId(item.id)}
                          />
                          <Tooltip>
                            <TooltipTrigger className="cursor-pointer" asChild>
                              <PlusIcon
                                className="
                                  invisible
                                  group-hover/item:visible
                                "
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const doc = createDocument({
                                    parentId: item.id,
                                  });
                                  expandDocument(item.id);
                                  router.push(`/d/${doc.id}`);
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Add a page</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </Link>
                  )}
                </SidebarMenuButton>
              </ContextMenuTrigger>
            </CollapsibleTrigger>
            <ContextMenuEllipsis
              document={item}
              onRename={() => setRenamingDocumentId(item.id)}
            />
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
          </ContextMenu>
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <SidebarMenuButton
          isActive={selectedDocumentId == item.id}
          className={cn(
            "group/item data-[active=true]:bg-accent cursor-pointer",
            renamingDocumentId == item.id &&
              "bg-blue-600/15! border border-blue-600",
          )}
          asChild
        >
          {renamingDocumentId == item.id ? (
            <div className="p-2">
              <FileIcon />
              <input
                autoFocus
                className="
                  bg-transparent
                  border-none
                  outline-none
                  ring-0
                  focus:outline-none
                  focus:ring-0
                  p-0
                  m-0
                "
                ref={inputRef}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                value={draftTitle}
                onChange={(e) => {
                  setDraftTitle(e.target.value);
                }}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    handleSave();
                  } else if (e.key == "Escape") {
                    handleCancel();
                  }
                }}
              ></input>
            </div>
          ) : (
            <Link href={`/d/${item.id}`}>
              <FileIcon />
              {documentName}
              <div className="flex ml-auto gap-2 invisible group-hover/item:visible">
                <DropdownMenuEllipsis
                  document={item}
                  onRename={() => setRenamingDocumentId(item.id)}
                />
                <Tooltip>
                  <TooltipTrigger className="cursor-pointer" asChild>
                    <PlusIcon
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const doc = createDocument({ parentId: item.id });
                        expandDocument(item.id);
                        router.push(`/d/${doc.id}`);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Add a page</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </Link>
          )}
        </SidebarMenuButton>
      </ContextMenuTrigger>
      <ContextMenuEllipsis
        document={item}
        onRename={() => setRenamingDocumentId(item.id)}
      />
    </ContextMenu>
  );
}

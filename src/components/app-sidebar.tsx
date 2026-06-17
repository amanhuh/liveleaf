"use client";

import * as React from "react";
import { Document as Doc } from "@/types/document.types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DropdownMenuEllipsis } from "./actions/drorpdown-menu-ellipsis";
import { FileIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { useDocumentStore } from "@/stores/document-store";
import { useParams, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{
    documentId: string;
  }>();
  const selectedDocumentId = params.documentId;
  const router = useRouter();
  const documents = useDocumentStore((state) => state.documents);
  const rootDocs = documents.filter((doc) => doc.parentId === null);
  const createDocument = useDocumentStore((state) => state.createDocument);
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Documents</span>
            <PlusIcon
              className="ml-auto cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const doc = createDocument();
                router.push(`/d/${doc.id}`);
              }}
            />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {rootDocs.map((doc) => (
                <Tree
                  key={doc.id}
                  selectedDocumentId={selectedDocumentId}
                  item={doc}
                  docs={documents}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function Tree({
  selectedDocumentId,
  item,
  docs,
}: {
  selectedDocumentId: string;
  item: Doc;
  docs: Doc[];
}) {
  const router = useRouter();

  const expandedDocumentIds = useDocumentStore(
    (state) => state.expandedDocumentIds,
  );
  const toggleExpanded = useDocumentStore((state) => state.toggleExpanded);
  const createDocument = useDocumentStore((state) => state.createDocument);
  const expandDocument = useDocumentStore((state) => state.expandDocument);
  const children = docs.filter((doc) => doc.parentId === item.id);
  const hasChildren = children.length > 0;
  const isOpen = expandedDocumentIds.includes(item.id);

  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <Collapsible
          className={"group/collapsible"}
          open={isOpen}
          onOpenChange={() => toggleExpanded(item.id)}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={selectedDocumentId == item.id}
              className="group/item data-[active=true]:bg-accent cursor-pointer"
              asChild
            >
              <Link href={`/d/${item.id}`}>
                <FileIcon />
                {item.title.trim() ? item.title : "New Page"}
                <div className="relative flex ml-auto gap-2">
                  <ChevronRightIcon
                    className={cn(
                      "group-hover/item:hidden absolute right-0 transition-transform",
                      isOpen && "rotate-90",
                    )}
                  />
                  <div className="flex gap-2 ml-auto invisible group-hover/item:visible">
                    <DropdownMenuEllipsis docId={item.id} />
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
                </div>
              </Link>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {children.map((child) => (
                <Tree
                  key={child.id}
                  selectedDocumentId={selectedDocumentId}
                  item={child}
                  docs={docs}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuButton
      isActive={selectedDocumentId == item.id}
      className="group/item data-[active=true]:bg-accent cursor-pointer"
      asChild
    >
      <Link href={`/d/${item.id}`}>
        <FileIcon />
        {item.title.trim() ? item.title : "New Page"}
        <div className="flex ml-auto gap-2 invisible group-hover/item:visible">
          <DropdownMenuEllipsis docId={item.id} />
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
    </SidebarMenuButton>
  );
}

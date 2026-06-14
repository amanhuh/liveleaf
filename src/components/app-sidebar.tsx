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
import {
  FileIcon,
  ChevronRightIcon,
  EllipsisIcon,
  PlusIcon,
} from "lucide-react";
import { useDocumentStore } from "@/stores/document-store";
import { useParams, useRouter } from "next/navigation";

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
                const doc = createDocument({ });
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
  const children = docs.filter((doc) => doc.parentId === item.id);
  const hasChildren = children.length > 0;

  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <Collapsible
          className="group/collapsible"
          open={expandedDocumentIds.includes(item.id)}
          onOpenChange={() => toggleExpanded(item.id)}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={selectedDocumentId == item.id}
              onClick={() => router.push(`/d/${item.id}`)}
              className="group/item data-[active=true]:bg-accent cursor-pointer"
            >
              <FileIcon />
              {item.title.trim() ? item.title : "New Page"}
              <div className="flex ml-auto gap-2">
                <EllipsisIcon className="ml-auto hidden group-hover/item:block" />
                <ChevronRightIcon
                  className="
                    group-data-[state=open]/collapsible:rotate-90
                    group-hover/item:hidden
                  "
                />
                <PlusIcon
                  className="
                    hidden
                    group-hover/item:block
                  "
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const doc = createDocument({ parentId: item.id });
                    router.push(`/d/${doc.id}`);
                  }}
                />
              </div>
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
      onClick={() => router.push(`/d/${item.id}`)}
      className="group/item data-[active=true]:bg-accent cursor-pointer"
    >
      <FileIcon />
      {item.title.trim() ? item.title : "New Page"}
      <div className="flex ml-auto gap-2">
        <EllipsisIcon className="ml-auto hidden group-hover/item:block" />
        <PlusIcon
          className="
            hidden
            group-hover/item:block
          "
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const doc = createDocument({ parentId: item.id });
            router.push(`/d/${doc.id}`);
          }}
        />
      </div>
    </SidebarMenuButton>
  );
}

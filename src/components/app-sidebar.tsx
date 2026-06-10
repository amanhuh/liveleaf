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
import { FileIcon, ChevronRightIcon } from "lucide-react";
import { useDocumentStore } from "@/stores/document-store";
import { useParams, useRouter } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{
    documentId: string;
  }>();
  const selectedDocumentId = params.documentId;
  const documents = useDocumentStore((state) => state.documents);
  const rootDocs = documents.filter((doc) => doc.parentId === null);

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
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
  // const selectedDocumentId = useDocumentStore(
  //   (state) => state.selectedDocumentId,
  // );

  const router = useRouter();
  const setSelectedDocumentId = useDocumentStore(
    (state) => state.setSelectedDocumentId,
  );

  const expandedDocumentIds = useDocumentStore((state) => state.expandedDocumentIds);
  const toggleExpanded = useDocumentStore(
    (state) => state.toggleExpanded,
  );

  const children = docs.filter((doc) => doc.parentId === item.id);
  const hasChildren = children.length > 0;

  if (!item.title) console.log(item.title);
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
              className="data-[active=true]:bg-accent"
            >
              <FileIcon />
              {item.title.trim() ? item.title : "New Page"}
              <ChevronRightIcon
                className="
                  transition-transform
                  group-data-[state=open]/collapsible:rotate-90
                  ml-auto
                "
              />
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
      className="data-[active=true]:bg-accent"
    >
      <FileIcon />
      {item.title.trim() ? item.title : "New Page"}
    </SidebarMenuButton>
  );
}

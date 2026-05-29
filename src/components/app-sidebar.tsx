"use client";

import * as React from "react";
import { useState } from "react";
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  FileIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
} from "lucide-react";

export function AppSidebar({
  documents,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  documents: Doc[];
}) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );

  const rootDocs = documents.filter((doc) => doc.parentId === null);

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {rootDocs.map((doc) => (
                <Tree
                  key={doc.id}
                  item={doc}
                  docs={documents}
                  selectedDocumentId={selectedDocumentId}
                  onSelect={setSelectedDocumentId}
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
  item,
  docs,
  selectedDocumentId,
  onSelect,
}: {
  item: Doc;
  docs: Doc[];
  selectedDocumentId: string | null;
  onSelect: (id: string) => void;
}) {
  const children = docs.filter((doc) => doc.parentId === item.id);

  const hasChildren = children.length > 0;

  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <Collapsible className="group/collapsible">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={selectedDocumentId == item.id}
              onClick={() => onSelect(item.id)}
              className="data-[active=true]:bg-accent"
            >
              <FileIcon />
              {item.title}
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
                  item={child}
                  docs={docs}
                  selectedDocumentId={selectedDocumentId}
                  onSelect={onSelect}
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
      onClick={() => onSelect(item.id)}
      className="data-[active=true]:bg-accent"
    >
      <FileIcon />
      {item.title}
    </SidebarMenuButton>
  );
}

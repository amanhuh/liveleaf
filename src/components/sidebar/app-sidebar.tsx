"use client";

import * as React from "react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react";
import { useDocumentStore } from "@/stores/document-store";
import { useParams, useRouter } from "next/navigation";
import TreeItem from "./tree-item";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{
    documentId: string;
  }>();
  const selectedDocumentId = params.documentId;
  const router = useRouter();
  const documents = useDocumentStore((state) => state.documents);
  const rootDocs = documents.filter((doc) => doc.parentId === null);
  const createDocument = useDocumentStore((state) => state.createDocument);
  const [renamingDocumentId, setRenamingDocumentId] = useState<string | null>(
    null,
  );
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
                <TreeItem
                  key={doc.id}
                  selectedDocumentId={selectedDocumentId}
                  item={doc}
                  docs={documents}
                  renamingDocumentId={renamingDocumentId}
                  setRenamingDocumentId={setRenamingDocumentId}
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


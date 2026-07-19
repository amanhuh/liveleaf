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
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { PlusIcon, LogOut, ChevronDown, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import TreeItem from "./tree-item";
import { useGetDocuments, useCreateDocument } from "@/hooks/use-document";
import { SidebarSkeleton } from "@/components/skeleton/sidebar-skeleton";
import { authClient } from "@/lib/auth/auth-client";
import { useDocumentStore } from "@/stores/document-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ documentId: string }>();
  const selectedDocumentId = params.documentId;
  const router = useRouter();
  const { data: documents = [], isLoading: isDocsLoading } = useGetDocuments();
  const rootDocs = documents.filter((doc) => doc.parentId === null);
  const createDocument = useCreateDocument();
  const { data: session } = authClient.useSession();
  const [renamingDocumentId, setRenamingDocumentId] = useState<string | null>(null);

  const lastDocumentCount = useDocumentStore((state) => state.lastDocumentCount);
  const setLastDocumentCount = useDocumentStore((state) => state.setLastDocumentCount);

  const [hydrated, setHydrated] = useState(false);
  React.useEffect(() => {
    setHydrated(true);
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

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <User className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user?.name || "User"}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user?.email || ""}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Documents</span>
            <PlusIcon
              className="ml-auto cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                createDocument.mutate({});
              }}
            />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isDocsLoading ? (
                <SidebarSkeleton count={hydrated ? lastDocumentCount : 3} />
              ) : (
                rootDocs.map((doc) => (
                  <TreeItem
                    key={doc.id}
                    selectedDocumentId={selectedDocumentId}
                    item={doc}
                    docs={documents}
                    renamingDocumentId={renamingDocumentId}
                    setRenamingDocumentId={setRenamingDocumentId}
                  />
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

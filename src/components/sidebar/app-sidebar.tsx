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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { PlusIcon, LogOut, ChevronDown, Trash2, Settings, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import TreeItem from "./tree-item";
import { useGetDocuments, useCreateDocument } from "@/hooks/use-document";
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ documentId: string }>();
  const selectedDocumentId = params.documentId;
  const router = useRouter();
  const { data: documents = [], isLoading: isDocsLoading } = useGetDocuments();
  const rootDocs = documents.filter((doc) => doc.parentId === null);
  const createDocument = useCreateDocument();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [renamingDocumentId, setRenamingDocumentId] = useState<string | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {isSessionLoading ? (
              <SidebarMenuButton size="default" className="pointer-events-none">
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
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
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

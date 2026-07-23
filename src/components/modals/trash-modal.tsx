"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  useGetTrashDocuments,
  useRestoreDocument,
  useDeleteDocument,
} from "@/hooks/use-document";
import {
  Search,
  Undo2,
  Trash2,
  FileText,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import type { TrashDocumentTreeItemDto } from "@/features/documents";
import { cn } from "@/lib/utils";

interface TrashModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TrashArchiveGroup = {
  root: TrashDocumentTreeItemDto;
  descendants: TrashDocumentTreeItemDto[];
};

function buildTrashGroups(items: TrashDocumentTreeItemDto[]): TrashArchiveGroup[] {
  const roots = items.filter((item) => item.isDirectlyArchived);

  return roots.map((root) => ({
    root,
    descendants: items.filter(
      (item) =>
        item.archiveActionId === root.id &&
        item.id !== root.id &&
        !item.isDirectlyArchived,
    ),
  }));
}

export function TrashModal({ open, onOpenChange }: TrashModalProps) {
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { data: trashItems = [], isLoading } = useGetTrashDocuments();
  const restoreDocument = useRestoreDocument();
  const deleteDocument = useDeleteDocument();

  const filteredGroups = useMemo(() => {
    const groups = buildTrashGroups(trashItems);
    const query = search.toLowerCase().trim();

    if (!query) {
      return groups;
    }
    
    return groups.filter(({ root, descendants }) => {
      const matches = (item: TrashDocumentTreeItemDto) =>
        (item.title || "New Page").toLowerCase().includes(query);

      return matches(root) || descendants.some(matches);
    });
  }, [trashItems, search]);

  const handleRestore = (id: string, title: string | null) => {
    restoreDocument.mutate(id, {
      onSuccess: () => {
        toast.success(`Restored "${title || "New Page"}"`);
      },
    });
  };

  const handleDelete = (id: string, title: string | null) => {
    deleteDocument.mutate(id, {
      onSuccess: () => {
        toast.success(`Permanently deleted "${title || "New Page"}"`);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Trash2 className="size-4 text-muted-foreground" />
            Trash
          </DialogTitle>
        </DialogHeader>

        <div className="p-3 border-b bg-muted/30">
          <div className="relative flex items-center">
            <Search className="absolute left-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Filter trash pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background h-9 border-border/60"
            />
          </div>
        </div>

        <div className="max-h-[380px] overflow-y-auto overscroll-contain p-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-xs font-medium">Loading trash...</span>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm font-medium">No items found in trash</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Pages you move to trash will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredGroups.map(({ root, descendants }) => {
                const isOpen = openGroups[root.id] ?? descendants.length > 0;

                return (
                <Collapsible
                  key={root.id}
                  open={isOpen}
                  onOpenChange={(nextOpen) =>
                    setOpenGroups((current) => ({ ...current, [root.id]: nextOpen }))
                  }
                  className={cn(
                    "rounded-lg border transition-colors duration-150",
                    isOpen ? "border-border bg-accent/25" : "border-transparent",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between gap-3 p-2 rounded-lg transition-colors duration-150",
                      isOpen ? "bg-accent/40" : "hover:bg-accent/60",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {descendants.length > 0 ? (
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            className="group/toggle flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-background cursor-pointer data-[state=open]:bg-background"
                            title="Toggle archived children"
                          >
                            <ChevronRight className="size-3.5 transition-transform group-data-[state=open]/toggle:rotate-90" />
                          </button>
                        </CollapsibleTrigger>
                      ) : (
                        <div className="size-5 shrink-0" />
                      )}

                      <TrashRow item={root} showIcon />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleRestore(root.id, root.title)}
                        disabled={restoreDocument.isPending}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md hover:bg-background border border-transparent hover:border-border text-foreground transition-colors duration-150 cursor-pointer"
                        title="Restore page"
                      >
                        <Undo2 className="size-3.5" />
                        Restore
                      </button>
                      <button
                        onClick={() => handleDelete(root.id, root.title)}
                        disabled={deleteDocument.isPending}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md hover:bg-destructive/10 text-destructive border border-transparent hover:border-destructive/20 transition-colors duration-150 cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {descendants.length > 0 && (
                    <CollapsibleContent className="ml-7 mr-2 mt-1 border-l border-border/60 pb-2 pl-3">
                      {descendants.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-md px-2 py-1.5 hover:bg-accent/30 transition-colors duration-150"
                          style={{
                            marginLeft: `${Math.max(0, item.depthFromArchiveAction - 1) * 14}px`,
                          }}
                        >
                          <TrashRow item={item} />
                        </div>
                      ))}
                    </CollapsibleContent>
                  )}
                </Collapsible>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TrashRow({
  item,
  showIcon = false,
}: {
  item: TrashDocumentTreeItemDto;
  showIcon?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0 flex-1">
      {showIcon && <FileText className="size-4 shrink-0 text-muted-foreground" />}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-foreground",
            showIcon ? "text-sm font-medium" : "text-[13px] font-medium",
          )}
        >
          {item.title || "New Page"}
        </p>
        {item.pathTitles.length > 1 && (
          <p
            className={cn(
              "truncate text-muted-foreground",
              showIcon ? "text-[11px]" : "text-[10px]",
            )}
          >
            {item.pathTitles.join(" / ")}
          </p>
        )}
      </div>
    </div>
  );
}

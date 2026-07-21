"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useGetTrashDocuments,
  useRestoreDocument,
  useDeleteDocument,
} from "@/hooks/use-document";
import { Search, Undo2, Trash2, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TrashModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrashModal({ open, onOpenChange }: TrashModalProps) {
  const [search, setSearch] = useState("");
  const { data: trashItems = [], isLoading } = useGetTrashDocuments();
  const restoreDocument = useRestoreDocument();
  const deleteDocument = useDeleteDocument();

  const filteredItems = useMemo(() => {
    const directlyArchived = trashItems.filter((item) => item.isDirectlyArchived);
    const query = search.toLowerCase().trim();
    if (!query) return directlyArchived;
    return directlyArchived.filter((item) => {
      const title = item.title || "New Page";
      return title.toLowerCase().includes(query);
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
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm font-medium">No items found in trash</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Pages you move to trash will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/60 transition-colors duration-150"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate text-foreground">
                        {item.title || "New Page"}
                      </p>
                      {item.pathTitles && item.pathTitles.length > 1 && (
                        <p className="text-[11px] text-muted-foreground truncate">
                          {item.pathTitles.join(" / ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleRestore(item.id, item.title)}
                      disabled={restoreDocument.isPending}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md hover:bg-background border border-transparent hover:border-border text-foreground transition-colors duration-150 cursor-pointer"
                      title="Restore page"
                    >
                      <Undo2 className="size-3.5" />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      disabled={deleteDocument.isPending}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md hover:bg-destructive/10 text-destructive border border-transparent hover:border-destructive/20 transition-colors duration-150 cursor-pointer"
                      title="Delete permanently"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import {
  FilePlusCorner,
  SquarePen,
  Trash,
  Link,
  EllipsisIcon,
} from "lucide-react";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator
} from "@/components/ui/context-menu"
import { toast } from "sonner";
import { useDocumentStore } from "@/stores/document-store";
import { useRouter } from "next/navigation";


export function ContextMenuEllipsis({
  documentId,
  onRename,
}: {
  documentId: string;
  onRename: () => void;
}) {
  const deleteDocument = useDocumentStore((state) => state.deleteDocument);
  const createDocument = useDocumentStore((state) => state.createDocument);
  const expandDocument = useDocumentStore((state) => state.expandDocument);

  const router = useRouter();

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/d/${documentId}`
    );
    toast("Copied page link to clipboard", { position: "bottom-right" })
  };

  return (
      <ContextMenuContent
        className="w-44"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <ContextMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const doc = createDocument({ parentId: documentId });
            router.push(`/d/${doc.id}`);
            expandDocument(doc.id);
          }}
        >
          Add Page
        </ContextMenuItem>
        <ContextMenuItem onClick={onRename}>Rename</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            handleCopyLink();
          }}
        >
          Copy Link
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          variant="destructive"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteDocument(documentId);
          }}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
  );
}

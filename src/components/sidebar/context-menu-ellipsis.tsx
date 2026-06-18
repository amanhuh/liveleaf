"use client";

import type { Document } from "@/types/document.types";
import { FilePlusCorner, SquarePen, Trash, Link } from "lucide-react";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { useDocumentStore } from "@/stores/document-store";
import { useRouter, useParams } from "next/navigation";

export function ContextMenuEllipsis({
  document,
  onRename,
}: {
  document: Document;
  onRename: () => void;
}) {
  const router = useRouter();
  const params = useParams<{
    documentId: string;
  }>();
  const selectedDocumentId = params.documentId;

  const deleteDocument = useDocumentStore((state) => state.deleteDocument);
  const createDocument = useDocumentStore((state) => state.createDocument);
  const expandDocument = useDocumentStore((state) => state.expandDocument);
  const documents = useDocumentStore((state) => state.documents);
  const rootDocs = documents.filter((doc) => doc.parentId === null);
  const isCurrentDocument = selectedDocumentId === document.id;
  const fallbackDocumentId =
    document.parentId ?? rootDocs.find((doc) => doc.id !== document.id)?.id;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/d/${document.id}`,
    );
    toast("Copied page link to clipboard", { position: "bottom-right" });
  };

  const handleDelete = () => {
    deleteDocument(document.id);

    if (!isCurrentDocument) {
      return;
    }

    if (!fallbackDocumentId) {
      const doc = createDocument();
      router.push(`/d/${doc.id}`);
      return;
    }

    router.push(`/d/${fallbackDocumentId}`);
  };

  return (
    <ContextMenuContent
      className="w-44 p-2"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <ContextMenuItem
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const doc = createDocument({ parentId: document.id });
          router.push(`/d/${doc.id}`);
          expandDocument(document.id);
        }}
      >
        <FilePlusCorner />
        Add Page
      </ContextMenuItem>
      <ContextMenuItem onSelect={onRename}>
        <SquarePen />
        Rename
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();

          handleCopyLink();
        }}
      >
        <Link />
        Copy Link
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        variant="destructive"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDelete();
        }}
      >
        <Trash />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
}

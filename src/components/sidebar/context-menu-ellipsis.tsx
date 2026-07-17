"use client";

import type { DocumentListItem } from "@/features/documents/repository";
import { FilePlusCorner, SquarePen, Trash, Link } from "lucide-react";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { useDocumentStore } from "@/stores/document-store";
import { useRouter, useParams } from "next/navigation";
import { useDeleteDocument, useCreateDocument, useGetDocuments } from "@/hooks/use-document";

export function ContextMenuEllipsis({
  document,
  onRename,
}: {
  document: DocumentListItem;
  onRename: () => void;
}) {
  const router = useRouter();
  const params = useParams<{
    documentId: string;
  }>();
  const selectedDocumentId = params.documentId;

  const { data: documents = [] } = useGetDocuments();
  const deleteDocument = useDeleteDocument(document.id);
  const createDocument = useCreateDocument();
  const expandDocument = useDocumentStore((state) => state.expandDocument);
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
    deleteDocument.mutate(undefined, {
      onSuccess: () => {
        if (!isCurrentDocument) {
          return;
        }

        if (!fallbackDocumentId) {
          createDocument.mutate({});
          return;
        }

        router.push(`/d/${fallbackDocumentId}`);
      }
    });
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
          createDocument.mutate({ parentId: document.id });
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

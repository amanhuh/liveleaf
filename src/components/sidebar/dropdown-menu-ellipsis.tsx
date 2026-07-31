"use client";

import {
  FilePlusCorner,
  SquarePen,
  Trash,
  Link,
  EllipsisIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useDocumentStore } from "@/stores/document-store";
import { useCreateDocument, useGetDocuments, useArchiveDocument } from "@/hooks/use-document";
import { useRouter, useParams } from "next/navigation";
import type { DocumentListItemDto } from "@/features/documents";

export function DropdownMenuEllipsis({
  document,
  onRename,
}: {
  document: DocumentListItemDto;
  onRename: () => void;
}) {
  const router = useRouter();
  const params = useParams<{
    documentId: string;
  }>();
  const selectedDocumentId = params.documentId;
  const { data: documents = [] } = useGetDocuments();
  const archiveDocument = useArchiveDocument(document.id);
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

  const handleArchive = () => {
    if (isCurrentDocument) {
      if (fallbackDocumentId) {
        router.push(`/d/${fallbackDocumentId}`);
      } else {
        createDocument.mutate({});
        return;
      }
    }
    archiveDocument.mutate(undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <EllipsisIcon className="size-3.5 text-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-44 p-2"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            createDocument.mutate({ parentId: document.id });
            expandDocument(document.id);
          }}
        >
          <FilePlusCorner />
          Add Page
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRename}>
          <SquarePen />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            handleCopyLink();
          }}
        >
          <Link />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleArchive();
          }}
        >
          <Trash />
          Move To Trash
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

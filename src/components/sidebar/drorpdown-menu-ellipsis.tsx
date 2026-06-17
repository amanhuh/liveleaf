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
import { useRouter } from "next/navigation";

export function DropdownMenuEllipsis({
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
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <EllipsisIcon />
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
            const doc = createDocument({ parentId: documentId });
            router.push(`/d/${doc.id}`);
            expandDocument(doc.id);
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
            deleteDocument(documentId);
          }}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import * as React from "react";
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDocumentStore } from "@/stores/document-store";
import { useRouter } from "next/navigation";

export function DropdownMenuEllipsis({ docId }: { docId: string}) {
  const deleteDocument = useDocumentStore((state) => state.deleteDocument);
  const createDocument = useDocumentStore((state) => state.createDocument);
  const expandDocument = useDocumentStore((state) => state.expandDocument);

  const router = useRouter();

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
        className="w-44"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();   
        }}
      >
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const doc = createDocument({ parentId: docId });
            router.push(`/d/${doc.id}`);
            expandDocument(doc.id);
          }}
        >
          Add Page
        </DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Copy Link</DropdownMenuItem>
        <DropdownMenuSeparator  />
        <DropdownMenuItem 
          variant="destructive"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteDocument(docId)
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

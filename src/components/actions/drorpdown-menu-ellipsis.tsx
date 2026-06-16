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

export function DropdownMenuEllipsis() {
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
      <DropdownMenuContent className="w-44">
        <DropdownMenuItem>Add Page</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Copy Link</DropdownMenuItem>
        <DropdownMenuSeparator  />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

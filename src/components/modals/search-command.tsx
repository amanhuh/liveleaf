"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useSearchDocuments } from "@/hooks/use-document";
import { FileText, Loader2 } from "lucide-react";
import debounce from "lodash/debounce";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const updateDebouncedQuery = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedQuery(val);
      }, 250),
    [],
  );

  useEffect(() => {
    return () => {
      updateDebouncedQuery.cancel();
    };
  }, [updateDebouncedQuery]);

  const handleInputChange = (val: string) => {
    setInput(val);
    updateDebouncedQuery(val);
  };

  const { data: results = [], isLoading } = useSearchDocuments(debouncedQuery);

  const handleSelect = (documentId: string) => {
    onOpenChange(false);
    router.push(`/d/${documentId}`);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Documents"
      description="Search active documents by title or text"
      shouldFilter={false}
    >
      <CommandInput
        placeholder="Search documents..."
        value={input}
        onValueChange={handleInputChange}
      />
      <CommandList>
        {isLoading && (
          <div className="flex items-center justify-center p-6 text-muted-foreground gap-2 text-xs">
            <Loader2 className="size-4 animate-spin" />
            <span>Searching...</span>
          </div>
        )}
        {!isLoading && debouncedQuery.trim().length > 0 && results.length === 0 && (
          <CommandEmpty>No matching pages found.</CommandEmpty>
        )}
        {results.length > 0 && (
          <CommandGroup heading="Documents">
            {results.map((doc) => (
              <CommandItem
                key={doc.id}
                value={doc.id}
                onSelect={() => handleSelect(doc.id)}
                className="cursor-pointer py-2"
              >
                <span className="text-base mr-1.5 shrink-0">
                  {doc.icon || <FileText className="size-4 text-muted-foreground" />}
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-medium truncate text-foreground">
                    {doc.title?.trim() ? doc.title : "New Page"}
                  </span>
                  {doc.pathTitles && doc.pathTitles.length > 1 && (
                    <span className="text-[11px] text-muted-foreground truncate">
                      {doc.pathTitles.join(" / ")}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

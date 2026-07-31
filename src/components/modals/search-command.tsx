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

function renderSnippet(snippet: string) {
  const parts = snippet.split(/<<|>>/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground not-italic">
        {part}
      </strong>
    ) : (
      <em key={i}>{part}</em>
    ),
  );
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
      <CommandList className="min-h-[180px]">
        {isLoading && (
          <div className="flex items-center justify-center p-8 text-muted-foreground gap-2 text-xs">
            <Loader2 className="size-4 animate-spin" />
            <span>Searching...</span>
          </div>
        )}
        {!isLoading && debouncedQuery.trim().length === 0 && (
          <div className="text-center py-10 px-4 text-muted-foreground select-none">
            <p className="text-sm font-medium text-foreground/80">Search your pages</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Type a title or keyword to quickly find any page.
            </p>
          </div>
        )}
        {!isLoading && debouncedQuery.trim().length > 0 && results.length === 0 && (
          <CommandEmpty>No pages match your search.</CommandEmpty>
        )}
        {results.length > 0 && (
          <CommandGroup heading="Pages">
            {results.map((doc) => {
              const bodySnippet =
                doc.snippet && doc.snippet.trim() ? doc.snippet : null;

              return (
                <CommandItem
                  key={doc.id}
                  value={doc.id}
                  onSelect={() => handleSelect(doc.id)}
                  className="cursor-pointer py-2.5"
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
                    {bodySnippet && (
                      <span className="text-[11px] text-muted-foreground truncate mt-0.5 italic">
                        {renderSnippet(bodySnippet)}
                      </span>
                    )}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
      <div className="flex items-center justify-between px-3 py-2 border-t text-[11px] text-muted-foreground bg-muted/20 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 font-mono text-[10px] shadow-2xs">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 font-mono text-[10px] shadow-2xs">↓</kbd>
            <span className="ml-0.5">navigate</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 font-mono text-[10px] shadow-2xs">↵</kbd>
            <span className="ml-0.5">select</span>
          </span>
        </div>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 font-mono text-[10px] shadow-2xs">esc</kbd>
          <span className="ml-0.5">exit</span>
        </span>
      </div>
    </CommandDialog>
  );
}

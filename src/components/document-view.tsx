"use client";

import Tiptap from "@/components/editor/editor";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, useRef, useEffect, useState, useMemo } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import type { DocumentListItemDto } from "@/features/documents";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  useGetDocuments,
  useGetDocument,
  useUpdateDocument,
  useArchiveDocument,
  useCreateDocument,
} from "@/hooks/use-document";
import debounce from "lodash/debounce";
import { DocumentSkeleton } from "@/components/skeleton/document-skeleton";
import { toast } from "sonner";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { HttpError } from "@/lib/errors";
import type { Editor } from "@tiptap/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CloudUpload,
  Check,
  Star,
  MoreHorizontal,
  FilePlus,
  MoveHorizontal,
  FileCode,
  Copy,
  Undo,
  Trash2,
  WifiOff,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DocumentView() {
  const router = useRouter();
  const params = useParams<{
    documentId: string;
  }>();
  const selectedDocumentId = params.documentId;
  const { data: documents = [], isLoading: isListLoading } = useGetDocuments();
  const { data: selectedDocument, isLoading: isDocLoading, error: docError } = useGetDocument(selectedDocumentId);
  const archiveDocument = useArchiveDocument(selectedDocumentId);
  const createDocument = useCreateDocument();
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<Editor | null>(null);

  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "idle">("idle");
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [stats, setStats] = useState<{ words: number; chars: number }>({ words: 0, chars: 0 });

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    setIsOffline(typeof navigator !== "undefined" ? !navigator.onLine : false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const updateDocument = useUpdateDocument(selectedDocumentId);
  const isFavorite = selectedDocument?.isFavorite ?? false;
  const isFullWidth = selectedDocument?.isFullWidth ?? false;

  const toggleFavorite = () => {
    if (!selectedDocumentId) return;
    const next = !isFavorite;
    updateDocument.mutate(
      { isFavorite: next },
      {
        onSuccess: () => {
          toast.success(next ? "Added to favorites" : "Removed from favorites");
        },
      },
    );
  };

  const toggleFullWidth = () => {
    if (!selectedDocumentId) return;
    updateDocument.mutate({ isFullWidth: !isFullWidth });
  };

  const handleSaveStatusChange = (status: "saving" | "saved" | "idle") => {
    if (status === "saved") {
      setSaveStatus("saved");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } else {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      setSaveStatus(status);
    }
  };

  const handleAddSubpage = () => {
    if (!selectedDocumentId) return;
    createDocument.mutate(
      { parentId: selectedDocumentId, title: "" },
      {
        onSuccess: (newDoc) => {
          toast.success("Subpage created");
          router.push(`/d/${newDoc.id}`);
        },
      },
    );
  };

  const handleExportMarkdown = () => {
    if (!selectedDocument) return;
    const title = selectedDocument.title?.trim() || "Untitled";
    const content = selectedDocument.plainText || "";
    const markdown = `# ${title}\n\n${content}`;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title.replace(/[/\\?%*:|"<>]/g, "-")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported as Markdown");
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleCopyContent = () => {
    if (!selectedDocument) return;
    const text = selectedDocument.plainText || "";
    navigator.clipboard.writeText(text).then(
      () => toast.success("Page content copied to clipboard"),
      () => toast.error("Failed to copy content"),
    );
  };

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.chain().focus().undo().run();
    }
  };

  const handleMoveToTrash = () => {
    if (!selectedDocumentId) return;
    archiveDocument.mutate(undefined, {
      onSuccess: () => {
        toast.success("Page moved to trash");
        router.push("/d");
      },
    });
  };

  useKeyboardShortcuts({
    onMoveToTrash: handleMoveToTrash,
    onRename: () => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    },
  });

  useEffect(() => {
    if (!selectedDocumentId) return;
    document.cookie = `liveleaf_last_doc=${selectedDocumentId}; path=/; max-age=2592000; SameSite=Lax`;
  }, [selectedDocumentId]);

  const breadcrumb = selectedDocument
    ? getBreadCrumbs(documents, selectedDocumentId)
    : [];

  useEffect(() => {
    if (isListLoading || isDocLoading) return;
    if (selectedDocument) return;
    if (!docError) return;

    if (docError instanceof HttpError && docError.status === 401) {
      router.replace("/sign-in");
      return;
    }

    if (docError instanceof HttpError && docError.status === 404) {
      toast.error("Page not found", {
        description: "This page may have been deleted or moved.",
        position: "bottom-right",
      });
      router.replace("/d");
      return;
    }

    toast.error("Failed to load page", {
      description: docError.message || "An unexpected error occurred.",
      position: "bottom-right",
    });
  }, [selectedDocument, docError, isListLoading, isDocLoading, router]);

  if (isDocLoading) {
    return <DocumentSkeleton />;
  }

  if (!selectedDocument) {
    return null;
  }

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-11 shrink-0 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-xs px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumb.map((doc, index) => (
                <Fragment key={doc.id}>
                  <BreadcrumbItem className="hidden md:block">
                    {index === breadcrumb.length - 1 ? (
                      <BreadcrumbPage>
                        <span className="max-w-[120px] truncate block" title={doc.title}>
                          {doc.title.trim() ? doc.title : "New Page"}
                        </span>
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={`/d/${doc.id}`}>
                          <span className="max-w-[120px] truncate block" title={doc.title}>
                            {doc.title.trim() ? doc.title : "New Page"}
                          </span>
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index !== breadcrumb.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-1.5">
          {isOffline ? (
            <span className="flex items-center gap-1.5 text-xs text-amber-500 font-medium px-2 py-0.5 rounded bg-amber-500/10">
              <WifiOff className="size-3.5" />
              Offline
            </span>
          ) : (
            <>
              {saveStatus === "saving" && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
                  <CloudUpload className="size-3.5 animate-pulse" />
                  Saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mr-1">
                  <Check className="size-3.5" />
                  Saved
                </span>
              )}
            </>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleFavorite}
                className="p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors cursor-pointer"
              >
                <Star
                  className={`size-4 ${
                    isFavorite
                      ? "fill-amber-400 text-amber-400"
                      : "hover:text-foreground"
                  }`}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Page options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleAddSubpage} className="cursor-pointer">
                <FilePlus className="mr-2 size-4 text-muted-foreground" />
                <span>Add Subpage</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  toggleFullWidth();
                }}
                className="cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center">
                  <MoveHorizontal className="mr-2 size-4 text-muted-foreground" />
                  <span>Full Width</span>
                </div>
                <div
                  className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors ${
                    isFullWidth ? "bg-primary justify-end" : "bg-muted-foreground/30 justify-start"
                  }`}
                >
                  <div
                    className={`size-3 rounded-full transition-transform ${
                      isFullWidth ? "bg-primary-foreground" : "bg-muted-foreground"
                    }`}
                  />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportMarkdown} className="cursor-pointer">
                <FileCode className="mr-2 size-4 text-muted-foreground" />
                <span>Export as Markdown</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyContent} className="cursor-pointer">
                <Copy className="mr-2 size-4 text-muted-foreground" />
                <span>Copy Page Content</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUndo} className="cursor-pointer">
                <Undo className="mr-2 size-4 text-muted-foreground" />
                <span>Undo</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={handleMoveToTrash}
                className="cursor-pointer"
              >
                <Trash2 className="mr-2 size-4" />
                <span>Move to Trash</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto min-w-0 flex flex-col justify-between">
        <div id="printable-document" className={`mx-auto w-full px-8 py-16 transition-all min-w-0 break-words ${isFullWidth ? "max-w-full md:px-20" : "max-w-2xl"}`}>
          <TitleEditor
            key={selectedDocument.id}
            documentId={selectedDocument.id}
            initialTitle={selectedDocument.title ?? ""}
            inputRef={titleInputRef}
            onSaveStatusChange={handleSaveStatusChange}
          />
          <div className="text-[1.0625rem] leading-relaxed">
            <Tiptap
              key={selectedDocument.id}
              document={selectedDocument}
              content={selectedDocument.content}
              onSaveStatusChange={handleSaveStatusChange}
              onStatsChange={setStats}
              editorRef={editorRef}
            />
          </div>
        </div>

        <footer className="py-3 px-8 text-xs text-muted-foreground/60 select-none border-t border-border/30 flex justify-end">
          <span>{stats.words} words · {stats.chars} characters</span>
        </footer>
      </div>
    </SidebarInset>
  );
}

function TitleEditor({
  documentId,
  initialTitle,
  inputRef,
  onSaveStatusChange,
}: {
  documentId: string;
  initialTitle: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  onSaveStatusChange?: (status: "saving" | "saved" | "idle") => void;
}) {
  const updateDocument = useUpdateDocument(documentId);
  const { mutate, isPending } = updateDocument;
  const [title, setTitle] = useState(initialTitle);
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef || localRef;
  const isFocusedRef = useRef(false);

  const onSaveStatusChangeRef = useRef(onSaveStatusChange);
  useEffect(() => {
    onSaveStatusChangeRef.current = onSaveStatusChange;
  }, [onSaveStatusChange]);

  const debouncedSaveTitleRef = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    debouncedSaveTitleRef.current = debounce((newTitle: string) => {
      onSaveStatusChangeRef.current?.("saving");
      mutate(
        { title: newTitle },
        {
          onSuccess: () => {
            onSaveStatusChangeRef.current?.("saved");
          },
          onError: () => {
            onSaveStatusChangeRef.current?.("idle");
          },
        },
      );
    }, 300);

    return () => {
      debouncedSaveTitleRef.current?.cancel();
    };
  }, [mutate]);

  // Sync initialTitle when changing documents
  useEffect(() => {
    setTitle(initialTitle);
    isFocusedRef.current = false;
  }, [documentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Only sync server updates when not actively focused or saving
  useEffect(() => {
    if (!isFocusedRef.current && !updateDocument.isPending) {
      setTitle(initialTitle);
    }
  }, [initialTitle, updateDocument.isPending]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [title]);

  return (
    <textarea
      placeholder="New Page"
      rows={1}
      ref={textareaRef}
      className="w-full font-bold text-[2.75rem] leading-[1.1] tracking-[-0.03em] mb-4 text-foreground focus-visible:outline-0 resize-none overflow-hidden border-none bg-transparent shadow-none placeholder:text-muted-foreground/30"
      value={title}
      onFocus={() => {
        isFocusedRef.current = true;
      }}
      onBlur={() => {
        isFocusedRef.current = false;
        debouncedSaveTitleRef.current?.flush();
      }}
      onChange={(e) => {
        setTitle(e.target.value);
        debouncedSaveTitleRef.current?.(e.target.value);
      }}
    />
  );
}

function getBreadCrumbs(
  documents: DocumentListItemDto[],
  selectedDocumentId: string,
): DocumentListItemDto[] {
  const breadCrumb: DocumentListItemDto[] = [];
  let current = documents.find((doc) => doc.id === selectedDocumentId);

  while (current) {
    breadCrumb.unshift(current);

    const parentId = current.parentId;
    if (!parentId) break;

    current = documents.find((doc) => doc.id === parentId);
  }

  return breadCrumb;
}

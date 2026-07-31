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
import { Separator } from "@/components/ui/separator";
import { Fragment, useRef, useEffect, useState, useMemo } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import type { DocumentListItemDto } from "@/features/documents";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetDocuments, useGetDocument, useUpdateDocument, useArchiveDocument } from "@/hooks/use-document";
import debounce from "lodash/debounce";
import { DocumentSkeleton } from "@/components/skeleton/document-skeleton";
import { toast } from "sonner";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { HttpError } from "@/lib/errors";

export default function DocumentView() {
  const router = useRouter();
  const params = useParams<{
    documentId: string;
  }>();
  const selectedDocumentId = params.documentId;
  const { data: documents = [], isLoading: isListLoading } = useGetDocuments();
  const { data: selectedDocument, isLoading: isDocLoading, error: docError } = useGetDocument(selectedDocumentId);
  const archiveDocument = useArchiveDocument(selectedDocumentId);
  const titleInputRef = useRef<HTMLTextAreaElement>(null);

  useKeyboardShortcuts({
    onMoveToTrash: () => {
      if (!selectedDocumentId) return;
      archiveDocument.mutate(undefined, {
        onSuccess: () => {
          toast.success("Page moved to trash");
          router.push("/d");
        },
      });
    },
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
      <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border/50 px-4">
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
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-8 py-20">
          <TitleEditor
            key={selectedDocument.id}
            documentId={selectedDocument.id}
            initialTitle={selectedDocument.title ?? ""}
            inputRef={titleInputRef}
          />
          <div className="text-[1.0625rem] leading-relaxed">
            <Tiptap
              key={selectedDocument.id}
              document={selectedDocument}
              content={selectedDocument.content}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}

function TitleEditor({
  documentId,
  initialTitle,
  inputRef,
}: {
  documentId: string;
  initialTitle: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const updateDocument = useUpdateDocument(documentId);
  const { mutate } = updateDocument;
  const [title, setTitle] = useState(initialTitle);
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef || localRef;
  const isFocusedRef = useRef(false);

  const debouncedSaveTitle = useMemo(
    () =>
      debounce((newTitle: string) => {
        mutate({ title: newTitle });
      }, 300),
    [mutate],
  );

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
    return () => debouncedSaveTitle.cancel();
  }, [debouncedSaveTitle]);

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
        debouncedSaveTitle.flush();
      }}
      onChange={(e) => {
        setTitle(e.target.value);
        debouncedSaveTitle(e.target.value);
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

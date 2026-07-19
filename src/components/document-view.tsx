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
import { useGetDocuments, useGetDocument, useUpdateDocument } from "@/hooks/use-document";
import debounce from "lodash/debounce";
import { DocumentSkeleton } from "@/components/skeleton/document-skeleton";
import { toast } from "sonner";

export default function DocumentView() {
  const router = useRouter();
  const params = useParams<{
    documentId: string;
  }>();
  const selectedDocumentId = params.documentId;
  const { data: documents = [], isLoading: isListLoading } = useGetDocuments();
  const { data: selectedDocument, isLoading: isDocLoading, error: docError } = useGetDocument(selectedDocumentId);

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

    toast.error("Page not found", {
      description: "This page may have been deleted or moved.",
      position: "bottom-right",
    });
    router.replace("/d");
  }, [selectedDocument, docError, isListLoading, isDocLoading, router]);

  if (isDocLoading) {
    return <DocumentSkeleton />;
  }

  if (!selectedDocument) {
    return null;
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
        <div className="mx-auto max-w-3xl px-8 py-16">
          <TitleEditor
            key={selectedDocument.id}
            documentId={selectedDocument.id}
            initialTitle={selectedDocument.title ?? ""}
          />
          <div className="text-base leading-relaxed">
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
}: {
  documentId: string;
  initialTitle: string;
}) {
  const updateDocument = useUpdateDocument(documentId);
  const { mutate } = updateDocument;
  const [title, setTitle] = useState(initialTitle);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const debouncedSaveTitle = useMemo(
    () =>
      debounce((newTitle: string) => {
        mutate({ title: newTitle });
      }, 300),
    [mutate],
  );

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
      className="w-full font-bold text-4xl tracking-tight mb-2 focus-visible:outline-0 resize-none overflow-hidden border-none bg-transparent shadow-none placeholder:text-muted-foreground/40"
      value={title}
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

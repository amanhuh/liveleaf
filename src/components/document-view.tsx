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

export default function DocumentView() {
  const router = useRouter();
  const params = useParams<{
    documentId: string;
  }>();
  const selectedDocumentId = params.documentId;
  const { data: documents = [], isLoading: isListLoading } = useGetDocuments();
  const { data: selectedDocument, isLoading: isDocLoading } = useGetDocument(selectedDocumentId);

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

    if (documents.length > 0) {
      router.replace(`/d/${documents[0].id}`);
    } else {
      router.replace("/");
    }
  }, [selectedDocument, documents, isListLoading, isDocLoading, router]);

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
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.map((doc, index) => (
              <Fragment key={doc.id}>
                <BreadcrumbItem className="hidden md:block">
                  {index === breadcrumb.length - 1 ? (
                    <BreadcrumbPage>
                      {doc.title.trim() ? doc.title : "Untitled"}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={`/d/${doc.id}`}>
                        {doc.title.trim() ? doc.title : "Untitled"}
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
  const [title, setTitle] = useState(initialTitle);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const mutateRef = useRef(updateDocument.mutate);
  mutateRef.current = updateDocument.mutate;

  const debouncedSaveTitle = useMemo(
    () =>
      debounce((newTitle: string) => {
        mutateRef.current({ title: newTitle });
      }, 300),
    [],
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
      placeholder="Untitled"
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

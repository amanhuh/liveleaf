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
import { Fragment } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useDocumentStore } from "@/stores/document-store";
import type { Document, DocumentListItem } from "@/features/documents";
import { useRef, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetDocuments, useGetDocument, useUpdateDocument } from "@/hooks/use-document";
import debounce from "lodash/debounce";

export default function DocumentView() {
  const router = useRouter();
  const params = useParams<{
    documentId: string;
  }>();
  const selectedDocumentId = params.documentId;
  const { data: documents = [], isLoading: isListLoading } = useGetDocuments();
  const { data: selectedDocument, isLoading: isDocLoading } = useGetDocument(selectedDocumentId);
  const updateDocument = useUpdateDocument(selectedDocumentId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(selectedDocument?.title ?? "");
  }, [selectedDocument?.id, selectedDocument?.title]);

  const debouncedSaveTitle = useMemo(
    () =>
      debounce((newTitle: string) => {
        updateDocument.mutate({ title: newTitle });
      }, 500),
    [updateDocument],
  );

  useEffect(() => {
    return () => {
      debouncedSaveTitle.cancel();
    };
  }, [debouncedSaveTitle]);

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

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [selectedDocument?.title]);

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
                      {doc.title.trim() ? doc.title : "New Page"}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={`/d/${doc.id}`}>
                        {doc.title.trim() ? doc.title : "New Page"}
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
          <div className="text-base leading-relaxed">
            {selectedDocument ? (
              <Tiptap
                key={selectedDocument.id}
                document={selectedDocument}
                content={selectedDocument.content}
              />
            ) : null}
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}

function getBreadCrumbs(
  documents: DocumentListItem[],
  selectedDocumentId: string,
): DocumentListItem[] {
  const breadCrumb: DocumentListItem[] = [];
  let current = documents.find((doc) => doc.id === selectedDocumentId);

  while (current) {
    breadCrumb.unshift(current);

    const parentId = current.parentId;
    if (!parentId) break;

    current = documents.find((doc) => doc.id === parentId);
  }

  return breadCrumb;
}

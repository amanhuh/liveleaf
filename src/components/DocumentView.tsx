"use client";

import Tiptap from "@/components/editor";
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
import { Document } from "@/types/document.types";

export default function DocumentView() {
  const documents = useDocumentStore((state) => state.documents);
  const selectedDocumentId = useDocumentStore(
    (state) => state.selectedDocumentId,
  );
  const selectedDocument = documents.find((doc) => doc.id === selectedDocumentId);
  console.log(selectedDocument)
  const breadcrumb = selectedDocumentId
    ? getBreadCrumbs(documents, selectedDocumentId)
    : [];

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
                    <BreadcrumbPage>{doc.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href="#">{doc.title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index !== breadcrumb.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="px-18 py-14">
        <p className="font-bold text-3xl mb-14">{selectedDocument?.title}</p>
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min text-lg ">
          <Tiptap />
        </div>
      </div>
    </SidebarInset>
  );
}

function getBreadCrumbs(
  documents: Document[],
  selectedDocumentId: string,
): Document[] {
  const breadCrumb: Document[] = [];
  let current = documents.find((doc) => doc.id === selectedDocumentId);

  while (current) {
    breadCrumb.unshift(current);

    const parentId = current.parentId;
    if (!parentId) break;

    current = documents.find((doc) => doc.id === parentId);
  }

  return breadCrumb;
}

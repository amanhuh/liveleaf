"use client";

import { useRouter } from "next/navigation";
import { useDocumentStore } from "@/stores/document-store";
import type { CreateDocumentOptions } from "@/types/document.types";

export function useCreateDocument() {
  const router = useRouter();
  const createDocument =
    useDocumentStore(
      state => state.createDocument
    );

  return (options: CreateDocumentOptions = {}) => {
    const document = createDocument(options);

    router.push(`/d/${document.id}`);

    return document;
  }
}
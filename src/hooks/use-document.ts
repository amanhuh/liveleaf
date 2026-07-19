import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DocumentDto, DocumentListItemDto, TrashDocumentTreeItemDto, UpdateDocumentPayload, CreateDocumentInput } from "@/features/documents";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export function useGetDocuments() {
    return useQuery<DocumentListItemDto[]>({
        queryKey: ["documents"],
        queryFn: () => api.documents.getAll(),
    });
}

export function useGetDocument(docId: string) {
    return useQuery<DocumentDto>({
        queryKey: ["documents", docId],
        queryFn: () => api.documents.get(docId),
        retry: false,
    });
}

export function useGetTrashDocuments() {
    return useQuery({
        queryKey: ['documents', 'trash'],
        queryFn: () => api.documents.getTrash(),
    });
}

function removeDocumentSubtree(docs: DocumentListItemDto[], rootId: string): DocumentListItemDto[] {
    const removedIds = new Set<string>();
    const collect = (id: string) => {
        removedIds.add(id);
        docs.filter((d) => d.parentId === id).forEach((d) => collect(d.id));
    };
    collect(rootId);
    return docs.filter((d) => !removedIds.has(d.id));
}

export function useCreateDocument() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: CreateDocumentInput) => api.documents.create(payload),
        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey: ["documents"] });
            const previousDocuments = queryClient.getQueryData<DocumentListItemDto[]>(["documents"]);
            const tempId = `optimistic-${Date.now()}`;
            const newDoc: DocumentListItemDto = {
                id: tempId,
                title: payload.title || "",
                parentId: payload.parentId || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                archivedAt: null,
                position: 0,
                icon: null,
            };
            queryClient.setQueryData<DocumentListItemDto[]>(
                ["documents"],
                (old) => [...(old || []), newDoc]
            );
            return { previousDocuments, tempId };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousDocuments) {
                queryClient.setQueryData(["documents"], context.previousDocuments);
            }
        },
        onSuccess: (document, _variables, context) => {
            queryClient.setQueryData<DocumentListItemDto[]>(
                ["documents"],
                (old) => old?.map((d) => d.id === context?.tempId ? {
                    ...d,
                    id: document.id,
                    title: document.title,
                    updatedAt: document.updatedAt,
                    icon: document.icon,
                    parentId: document.parentId,
                    archivedAt: document.archivedAt,
                    position: document.position,
                } : d) || []
            );
            router.push(`/d/${document.id}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
}

export function useUpdateDocument(docId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDocumentPayload) =>
      api.documents.update(docId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["documents"] });
      await queryClient.cancelQueries({ queryKey: ["documents", docId] });
      const previousDocuments = queryClient.getQueryData<DocumentListItemDto[]>(["documents"]);
      const previousDocument = queryClient.getQueryData<DocumentDto>(["documents", docId]);

      queryClient.setQueryData<DocumentListItemDto[]>(
        ["documents"],
        (old) => old?.map((doc) => doc.id === docId ? {
          ...doc,
          title: payload.title !== undefined ? (payload.title.trim() || "") : doc.title,
          icon: payload.icon !== undefined ? payload.icon : doc.icon,
          updatedAt: new Date().toISOString(),
        } : doc) ?? []
      );

      if (previousDocument) {
        queryClient.setQueryData<DocumentDto>(["documents", docId], {
          ...previousDocument,
          title: payload.title !== undefined ? (payload.title.trim() || "") : previousDocument.title,
          content: payload.content !== undefined ? (payload.content as DocumentDto["content"]) : previousDocument.content,
          plainText: payload.plainText !== undefined ? (payload.plainText ?? null) : previousDocument.plainText,
          icon: payload.icon !== undefined ? payload.icon : previousDocument.icon,
          bannerUrl: payload.bannerUrl !== undefined ? payload.bannerUrl : previousDocument.bannerUrl,
          updatedAt: new Date().toISOString(),
        });
      }
      return { previousDocuments, previousDocument };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(["documents"], context.previousDocuments);
      }
      if (context?.previousDocument) {
        queryClient.setQueryData(["documents", docId], context.previousDocument);
      }
    },
    onSuccess: (updatedDocument) => {
      queryClient.setQueryData(["documents", docId], updatedDocument);
      queryClient.setQueryData<DocumentListItemDto[]>(
        ["documents"],
        (old) => old?.map((doc) => doc.id === updatedDocument.id ? {
          ...doc,
          title: updatedDocument.title,
          updatedAt: updatedDocument.updatedAt,
          icon: updatedDocument.icon,
          parentId: updatedDocument.parentId,
          archivedAt: updatedDocument.archivedAt,
          position: updatedDocument.position,
        } : doc) ?? []
      );
    }
  });
}

export function useArchiveDocument(docId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.documents.archive(docId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["documents"] });
            const previousDocuments = queryClient.getQueryData<DocumentListItemDto[]>(["documents"]);
            queryClient.setQueryData<DocumentListItemDto[]>(
                ["documents"],
                (old) => old ? removeDocumentSubtree(old, docId) : []
            );
            return { previousDocuments };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousDocuments) {
                queryClient.setQueryData(["documents"], context.previousDocuments);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
            queryClient.invalidateQueries({ queryKey: ["documents", docId] });
        },
    });
}

export function useRestoreDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.documents.restore(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["documents"] });
      await queryClient.cancelQueries({ queryKey: ["documents", "trash"] });
      const previousDocuments = queryClient.getQueryData<DocumentListItemDto[]>(["documents"]);
      const previousTrash = queryClient.getQueryData<TrashDocumentTreeItemDto[]>(["documents", "trash"]);

      queryClient.setQueryData<TrashDocumentTreeItemDto[]>(
        ["documents", "trash"],
        (old) => old?.filter((doc) => doc.archiveActionId !== id) ?? []
      );

      return { previousDocuments, previousTrash };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(["documents"], context.previousDocuments);
      }
      if (context?.previousTrash) {
        queryClient.setQueryData(["documents", "trash"], context.previousTrash);
      }
    },
    onSuccess: (document) => {
      queryClient.setQueryData(["documents", document.id], document);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.documents.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["documents"] });
      await queryClient.cancelQueries({ queryKey: ["documents", "trash"] });
      const previousDocuments = queryClient.getQueryData<DocumentListItemDto[]>(["documents"]);
      const previousTrash = queryClient.getQueryData<TrashDocumentTreeItemDto[]>(["documents", "trash"]);

      queryClient.setQueryData<TrashDocumentTreeItemDto[]>(
        ["documents", "trash"],
        (old) => old?.filter((doc) => doc.archiveActionId !== id) ?? []
      );
      queryClient.setQueryData<DocumentListItemDto[]>(
        ["documents"],
        (old) => old?.filter((doc) => doc.id !== id) ?? []
      );
      queryClient.removeQueries({ queryKey: ["documents", id] });

      return { previousDocuments, previousTrash };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(["documents"], context.previousDocuments);
      }
      if (context?.previousTrash) {
        queryClient.setQueryData(["documents", "trash"], context.previousTrash);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
    },
  });
}
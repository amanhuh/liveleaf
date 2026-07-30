import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DocumentDto, DocumentListItemDto, TrashDocumentTreeItemDto, SearchDocumentItemDto, UpdateDocumentPayload, MoveDocumentPayload, CreateDocumentInput } from "@/features/documents";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
        enabled: !!docId,
        retry: false,
    });
}

export function useGetTrashDocuments() {
    return useQuery<TrashDocumentTreeItemDto[]>({
        queryKey: ['documents', 'trash'],
        queryFn: () => api.documents.getTrash(),
    });
}

export function useSearchDocuments(query: string, limit: number = 20) {
  return useQuery<SearchDocumentItemDto[]>({
    queryKey: ["documents", "search", query, limit],
    queryFn: ({ signal }) => api.documents.search(query, signal, limit),
    enabled: query.trim().length > 0,
    staleTime: 0,
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

function getMovedDocumentPosition(
  docs: DocumentListItemDto[],
  payload: MoveDocumentPayload,
  movingDocumentId: string,
) {
  const siblings = docs
    .filter((doc) => doc.parentId === payload.parentId && doc.id !== movingDocumentId)
    .sort((a, b) => a.position - b.position || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));

  const getBetween = (
    previous: DocumentListItemDto | null,
    next: DocumentListItemDto | null,
  ) => {
    if (previous && next) return (previous.position + next.position) / 2;
    if (previous) return previous.position + 1000;
    if (next) return next.position - 1000;
    return 0;
  };

  if (payload.beforeId) {
    const nextIndex = siblings.findIndex((doc) => doc.id === payload.beforeId);
    const next = nextIndex >= 0 ? siblings[nextIndex] : null;
    const previous = nextIndex > 0 ? siblings[nextIndex - 1] : null;
    return getBetween(previous, next);
  }

  if (payload.afterId) {
    const previousIndex = siblings.findIndex((doc) => doc.id === payload.afterId);
    const previous = previousIndex >= 0 ? siblings[previousIndex] : null;
    const next = previousIndex >= 0 ? siblings[previousIndex + 1] ?? null : null;
    return getBetween(previous, next);
  }

  return getBetween(siblings[siblings.length - 1] ?? null, null);
}

function getDocumentTitle(document?: Pick<DocumentListItemDto, "title"> | null) {
  return document?.title?.trim() || "New Page";
}

export function useCreateDocument() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: CreateDocumentInput) => api.documents.create(payload),
        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey: ["documents"], exact: true });
            const previousDocuments = queryClient.getQueryData<DocumentListItemDto[]>(["documents"]) || [];
            const siblings = previousDocuments.filter((d) => d.parentId === (payload.parentId || null));
            const maxPos = siblings.reduce((max, d) => Math.max(max, d.position), 0);
            const nextPosition = maxPos + 1000;
            const tempId = `optimistic-${Date.now()}`;
            const newDoc: DocumentListItemDto = {
                id: tempId,
                title: payload.title || "",
                parentId: payload.parentId || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                archivedAt: null,
                position: nextPosition,
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
            queryClient.invalidateQueries({ queryKey: ["documents"], exact: true });
        },
    });
}

export function useUpdateDocument(docId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDocumentPayload) =>
      api.documents.update(docId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["documents"], exact: true });
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
            await queryClient.cancelQueries({ queryKey: ["documents"], exact: true });
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
            queryClient.invalidateQueries({ queryKey: ["documents"], exact: true });
            queryClient.invalidateQueries({ queryKey: ["documents", "trash"], exact: true });
            queryClient.invalidateQueries({ queryKey: ["documents", docId] });
        },
    });
}

export function useRestoreDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.documents.restore(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["documents"], exact: true });
      await queryClient.cancelQueries({ queryKey: ["documents", "trash"], exact: true });
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
      queryClient.invalidateQueries({ queryKey: ["documents"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["documents", "trash"], exact: true });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.documents.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["documents"], exact: true });
      await queryClient.cancelQueries({ queryKey: ["documents", "trash"], exact: true });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["documents", "trash"], exact: true });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["documents", "trash"], exact: true });
    },
  });
}

export function useMoveDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & MoveDocumentPayload) =>
      api.documents.move(id, payload),
    onMutate: async ({ id, ...payload }) => {
      await queryClient.cancelQueries({ queryKey: ["documents"], exact: true });

      const previousDocuments = queryClient.getQueryData<DocumentListItemDto[]>(["documents"]);
      const movingDocument = previousDocuments?.find((doc) => doc.id === id);
      const targetParent = payload.parentId
        ? previousDocuments?.find((doc) => doc.id === payload.parentId)
        : null;
      const nextPosition = previousDocuments
        ? getMovedDocumentPosition(previousDocuments, payload, id)
        : 0;

      queryClient.setQueryData<DocumentListItemDto[]>(
        ["documents"],
        (old) => old?.map((doc) => doc.id === id ? {
          ...doc,
          parentId: payload.parentId,
          position: nextPosition,
          updatedAt: new Date().toISOString(),
        } : doc) ?? [],
      );

      return { previousDocuments, movingDocument, targetParent };
    },
    onError: (error, _variables, context) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(["documents"], context.previousDocuments);
      }

      toast.error(error instanceof Error ? error.message : "Could not move page");
    },
    onSuccess: (document, variables, context) => {
      queryClient.setQueryData(["documents", document.id], document);
      queryClient.setQueryData<DocumentListItemDto[]>(
        ["documents"],
        (old) => old?.map((doc) => doc.id === document.id ? {
          ...doc,
          title: document.title,
          parentId: document.parentId,
          updatedAt: document.updatedAt,
          archivedAt: document.archivedAt,
          icon: document.icon,
          position: document.position,
        } : doc) ?? [],
      );

      const movedTitle = getDocumentTitle(context?.movingDocument);
      if (variables.parentId) {
        toast.success(`Moved "${movedTitle}" inside "${getDocumentTitle(context?.targetParent)}"`);
      } else {
        toast.success(`Moved "${movedTitle}" to root`);
      }
    },
  });
}

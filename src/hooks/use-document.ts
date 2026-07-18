import { useQuery, useMutation } from "@tanstack/react-query";
import type { DocumentDto, DocumentListItemDto, TrashDocumentTreeItemDto, UpdateDocumentPayload, CreateDocumentPayload, CreateDocumentInput } from "@/features/documents";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

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
    })
}

export function useGetTrashDocuments() {
    return useQuery({
        queryKey: ['documents', 'trash'],
        queryFn: () => api.documents.getTrash(),
    });
}

export function useCreateDocument() {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: CreateDocumentInput) => api.documents.create(payload),
        onSuccess: (document) => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            router.push(`/d/${document.id}`);
        }
    });
}

export function useUpdateDocument(docId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDocumentPayload) =>
      api.documents.update(docId, payload),

    onSuccess: (updatedDocument) => {
      queryClient.setQueryData(["documents", docId], updatedDocument);

      queryClient.setQueryData<DocumentListItemDto[]>(
        ["documents"],
        (documents) =>
          documents?.map((doc) =>
            doc.id === updatedDocument.id
              ? {
                  ...doc,
                  title: updatedDocument.title,
                  updatedAt: updatedDocument.updatedAt,
                  icon: updatedDocument.icon,
                  parentId: updatedDocument.parentId,
                  archivedAt: updatedDocument.archivedAt,
                  position: updatedDocument.position,
                }
              : doc,
          ),
      );
    },
  });
}

export function useArchiveDocument(docId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.documents.archive(docId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
            queryClient.invalidateQueries({ queryKey: ["documents", docId] });
        },
    });
}

export function useRestoreDocument(docId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.documents.restore(docId),
        onSuccess: (document) => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
            queryClient.setQueryData(["documents", docId], document);
        },
    });
}

export function useDeleteDocument(docId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.documents.delete(docId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
            queryClient.removeQueries({ queryKey: ["documents", docId] });
        },
    });
}
import { useQuery, useMutation } from "@tanstack/react-query";
import type { CreateDocumentPayload, UpdateDocumentPayload } from "@/features/documents/validation";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function useGetDocuments() {
    return useQuery({
        queryKey: ["documents"],
        queryFn: () => api.documents.getAll(),
    });
}

export function useGetDocument(docId: string) {
    return useQuery({
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
        mutationFn: (payload: CreateDocumentPayload) => api.documents.create(payload),
        onSuccess: (newData) => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            router.push(`/d/${newData.id}`);
        }
    });
}

export function useUpdateDocument(docId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateDocumentPayload) => api.documents.update(docId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] })
    });
}

export function useArchiveDocument(docId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => api.documents.archive(docId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] })
    });
}

export function useRestoreDocument(docId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => api.documents.restore(docId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] })
    });
}

export function useDeleteDocument(docId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => api.documents.delete(docId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] })
    });
}
import { useQuery, useMutation } from "@tanstack/react-query";
import type { CreateDocumentPayload, UpdateDocumentPayload } from "@/features/documents/validation";
import { api } from "@/lib/api";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

export function useDocuments() {
    return useQuery({
        queryKey: ["documents"],
        queryFn: () => api.documents.getAll(),
    });
}

export function useCreateDocument(payload: CreateDocumentPayload) {
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

export function useUpdateDocument(docId: string, payload: UpdateDocumentPayload) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => api.documents.update(docId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] })
    });
}

import type { DocumentDto, DocumentListItemDto, TrashDocumentTreeItemDto, UpdateDocumentPayload, CreateDocumentInput } from "@/features/documents";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  return res.json();
}

export const documents = {
  getAll: (): Promise<DocumentListItemDto[]> => request('/api/documents'),

  get: (id: string): Promise<DocumentDto> => request(`/api/documents/${id}`),

  getTrash: (): Promise<TrashDocumentTreeItemDto[]> => request('/api/documents/trash'),

  create: (payload: CreateDocumentInput): Promise<DocumentDto> =>
    request('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateDocumentPayload): Promise<DocumentDto> =>
    request(`/api/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  archive: (id: string): Promise<DocumentDto> =>
    request(`/api/documents/${id}/archive`, { method: 'POST' }),

  restore: (id: string): Promise<DocumentDto> =>
    request(`/api/documents/${id}/restore`, { method: 'POST' }),
    
  delete: (id: string): Promise<DocumentDto> =>
    request(`/api/documents/${id}`, {
      method: 'DELETE',
    }),
};
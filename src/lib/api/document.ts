import type { Document, DocumentListItem, TrashDocumentTreeItem, UpdateDocumentPayload, CreateDocumentPayload, CreateDocumentInput } from "@/features/documents";

async function request<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  return res.json();
}

export const documents = {
  getAll: (): Promise<DocumentListItem[]> => request('/api/documents'),

  get: (id: string): Promise<Document> => request(`/api/documents/${id}`),

  getTrash: (): Promise<TrashDocumentTreeItem[]> => request('/api/documents/trash'),

  create: (payload: CreateDocumentInput): Promise<Document> =>
    request('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateDocumentPayload): Promise<Document> =>
    request(`/api/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  archive: (id: string): Promise<Document> =>
    request(`/api/documents/${id}/archive`, { method: 'POST' }),

  restore: (id: string): Promise<Document> =>
    request(`/api/documents/${id}/restore`, { method: 'POST' }),
    
  delete: (id: string): Promise<void> =>
    request(`/api/documents/${id}`, {
      method: 'DELETE',
    }),
}


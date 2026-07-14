import type { UpdateDocumentPayload, CreateDocumentPayload } from "@/features/documents/validation";

async function request(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  return res.json();
}

export const documents = {
  getAll: () => request('/api/documents'),

  get: (id: string) => request(`/api/documents/${id}`),

  create: (payload: CreateDocumentPayload) => 
    request('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateDocumentPayload) =>
    request(`/api/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  archive: (id: string) => 
    request(`/api/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isArchived: true }),
    }),
    
  restore: (id: string) => 
    request(`/api/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isArchived: false }),
    }),
    
  delete: (id: string) =>
    request(`/api/documents/${id}`, {
      method: 'DELETE',
    }),
}


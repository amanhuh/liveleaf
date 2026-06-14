export interface Document {
  id: string,
  title: string,
  content: string,
  createdAt: Date,
  updatedAt: Date,
  parentId: string | null
}

export interface CreateDocumentOptions {
  parentId?: string;
  title?: string;
};
import type { SearchDocumentItem } from "./repository";

export type { SearchDocumentItem };

export type SearchDocumentItemDto = Omit<SearchDocumentItem, "updatedAt"> & {
  updatedAt: string;
};

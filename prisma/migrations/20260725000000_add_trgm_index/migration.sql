CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX document_title_trgm_idx
ON "Document"
USING GIN (title gin_trgm_ops);

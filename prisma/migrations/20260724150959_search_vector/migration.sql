ALTER TABLE "Document"
ADD COLUMN "searchVector" tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE("plainText", '')), 'B')
) STORED;

CREATE INDEX document_search_vector_idx
ON "Document"
USING GIN ("searchVector");

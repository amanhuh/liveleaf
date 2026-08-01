-- ==========================================
-- Favorites & Layout
-- ==========================================

ALTER TABLE "Document"
ADD COLUMN "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "isFullWidth" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Document_ownerId_isFavorite_archivedAt_idx"
ON "Document"("ownerId", "isFavorite", "archivedAt");

CREATE INDEX "Document_owner_parent_archived_position_idx"
ON "Document"("ownerId", "parentId", "archivedAt", "position");



-- ==========================================
-- Search Infrastructure
-- ==========================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE "Document"
ADD COLUMN "searchVector" tsvector;

CREATE OR REPLACE FUNCTION update_document_search_vector()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW."searchVector" :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A')
        ||
        setweight(to_tsvector('english', COALESCE(NEW."plainText", '')), 'B');

    RETURN NEW;
END;
$$;

CREATE TRIGGER update_document_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, "plainText"
ON "Document"
FOR EACH ROW
EXECUTE FUNCTION update_document_search_vector();

CREATE INDEX "document_search_vector_idx"
ON "Document"
USING GIN ("searchVector");

CREATE INDEX "document_title_trgm_idx"
ON "Document"
USING GIN (title gin_trgm_ops);
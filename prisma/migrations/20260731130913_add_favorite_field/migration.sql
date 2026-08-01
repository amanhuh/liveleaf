/*
  Warnings:

  - You are about to drop the column `searchVector` on the `Document` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "document_search_vector_idx";

-- DropIndex
DROP INDEX "document_title_trgm_idx";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "searchVector",
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFullWidth" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Document_ownerId_isFavorite_archivedAt_idx" ON "Document"("ownerId", "isFavorite", "archivedAt");

-- CreateIndex
CREATE INDEX "Document_owner_parent_archived_position_idx" ON "Document"("ownerId", "parentId", "archivedAt", "position");

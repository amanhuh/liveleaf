CREATE INDEX "Document_owner_parent_archived_position_idx"
ON "Document" ("ownerId", "parentId", "archivedAt", "position");

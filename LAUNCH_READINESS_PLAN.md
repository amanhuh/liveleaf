# LiveLeaf Public Launch Readiness Plan

This plan lists the fixes needed before LiveLeaf is comfortable to launch as a public product. It focuses on correctness, type safety, security boundaries, archive/trash behavior, build health, and product reliability.

## 1. Archive And Trash Correctness

### 1.1 Harden active document ownership filtering

Problem: `findActiveDocuments` anchors the tree by `ownerId`, but the recursive child step must also enforce `ownerId`. This protects the query if bad data is ever created manually, imported, or introduced by a future move-page bug.

Change:

```ts
export async function findActiveDocuments(ownerId: string): Promise<DocumentListItem[]> {
  return await prisma.$queryRaw<DocumentListItem[]>`
    WITH RECURSIVE active_tree AS (
      SELECT id, title, "createdAt", "updatedAt", "parentId", "archivedAt", icon, position
      FROM "Document"
      WHERE "ownerId" = ${ownerId}
        AND "parentId" IS NULL
        AND "archivedAt" IS NULL

      UNION ALL

      SELECT d.id, d.title, d."createdAt", d."updatedAt", d."parentId", d."archivedAt", d.icon, d.position
      FROM "Document" d
      INNER JOIN active_tree a ON d."parentId" = a.id
      WHERE d."ownerId" = ${ownerId}
        AND d."archivedAt" IS NULL
    )
    SELECT * FROM active_tree ORDER BY "createdAt" DESC;
  `;
}
```

Acceptance:

- A document only appears in the active tree if it belongs to the authenticated owner.
- Active descendants under archived parents remain hidden.

### 1.2 Decide and enforce editor behavior for archived documents

Problem: direct navigation to `/d/[documentId]` can still load an archived or inherited-archived document if `GET /api/documents/[documentId]` only checks ownership.

Recommended behavior for launch:

- Normal editor routes should only open active documents.
- Archived documents should be accessed through trash UI actions, not edited in the main editor.
- `GET /api/documents/[documentId]` should return `404` for effectively archived documents in the normal editor context.

Implementation shape:

```ts
export async function findEditableDocument(id: string, ownerId: string) {
  const context = await getArchiveContext(id, ownerId);
  if (!context || context.isEffectivelyArchived) return null;

  return await prisma.document.findFirst({
    where: { id, ownerId },
  });
}
```

Then use `findEditableDocument` in the `GET /api/documents/[documentId]` route and in `updateDocument`.

Acceptance:

- Archived documents do not open in the normal editor by direct URL.
- Active documents continue to load normally.
- Restore/delete still operate through archive context.

### 1.3 Keep hard delete trash-only

Current direction is good: `deleteDocument` should only delete effectively archived documents.

Keep:

```ts
if (!context.isEffectivelyArchived) {
  throw new HttpError("Document must be archived before deletion", 409);
}
```

Acceptance:

- `DELETE /api/documents/[id]` returns `409` for active documents.
- `DELETE /api/documents/[id]` succeeds for directly or inherited archived documents.
- Deleting a parent permanently removes its database subtree.

### 1.4 Clarify trash counts

Problem: `archivedTreeSize` currently means the size of the visible trash action group, not necessarily the full subtree that permanent delete will remove.

Required decision:

- Keep `archivedTreeSize` for UI group size.
- Add `deleteTreeSize` later if delete confirmation needs exact permanent-delete impact.

Acceptance:

- UI copy does not claim `archivedTreeSize` is the full permanent delete count unless it truly is.

## 2. API Contracts And DTOs

### 2.1 Stop typing HTTP responses as raw Prisma models

Problem: Prisma returns `Date` objects on the server, but `fetch().json()` returns date strings in the browser. A client type like `Promise<Document>` is not honest if `Document.updatedAt` is a `Date`.

Add a reusable JSON serializer type:

```ts
type Jsonify<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
      ? string | null
      : T[K];
};
```

Use Prisma selects as the server-side source of truth:

```ts
const documentSelect = {
  id: true,
  title: true,
  content: true,
  plainText: true,
  icon: true,
  bannerUrl: true,
  createdAt: true,
  updatedAt: true,
  parentId: true,
  archivedAt: true,
  position: true,
} satisfies Prisma.DocumentSelect;

type ServerDocument = Prisma.DocumentGetPayload<{
  select: typeof documentSelect;
}>;

export type DocumentDto = Jsonify<ServerDocument>;
```

Do the same for list and trash rows:

```ts
export type DocumentListItemDto = Jsonify<DocumentListItem>;
export type TrashDocumentTreeItemDto = Jsonify<TrashDocumentTreeItem>;
```

Acceptance:

- Client API helpers return DTO types, not raw Prisma model types.
- Date fields are typed as `string` on fetch responses unless explicitly parsed.

### 2.2 Make API client generics explicit

Problem: `request<T = any>` weakens type safety.

Change:

```ts
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}
```

Use explicit response types:

```ts
export const documents = {
  getAll: (): Promise<DocumentListItemDto[]> =>
    request<DocumentListItemDto[]>("/api/documents"),

  get: (id: string): Promise<DocumentDto> =>
    request<DocumentDto>(`/api/documents/${id}`),

  getTrash: (): Promise<TrashDocumentTreeItemDto[]> =>
    request<TrashDocumentTreeItemDto[]>("/api/documents/trash"),

  create: (payload: CreateDocumentInput): Promise<DocumentDto> =>
    request<DocumentDto>("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateDocumentPayload): Promise<DocumentDto> =>
    request<DocumentDto>(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  archive: (id: string): Promise<DocumentDto> =>
    request<DocumentDto>(`/api/documents/${id}/archive`, { method: "POST" }),

  restore: (id: string): Promise<DocumentDto> =>
    request<DocumentDto>(`/api/documents/${id}/restore`, { method: "POST" }),

  delete: (id: string): Promise<DocumentDto> =>
    request<DocumentDto>(`/api/documents/${id}`, { method: "DELETE" }),
};
```

Acceptance:

- No `any` default in the API client.
- Delete response type matches the route response.

### 2.3 Defer response Zod schemas unless boundary becomes public or risky

For launch, use DTO types for internal API responses. Add Zod response schemas later when:

- a mobile app consumes the API,
- third-party integrations consume the API,
- old frontend versions may hit newer backend versions,
- imported/third-party data is returned,
- billing, permissions, or security-critical responses are involved.

Incoming request schemas should remain mandatory now.

## 3. TanStack Query Cache Behavior

### 3.1 Update document cache without refetching everything

Problem: invalidating list and detail after every autosave is correct but noisy. It can cause extra traffic and stale-response flicker.

Change:

```ts
export function useUpdateDocument(docId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDocumentPayload) =>
      api.documents.update(docId, payload),

    onSuccess: (updatedDocument) => {
      queryClient.setQueryData(["documents", docId], updatedDocument);

      queryClient.setQueryData<DocumentListItemDto[]>(
        ["documents"],
        (documents) =>
          documents?.map((doc) =>
            doc.id === updatedDocument.id
              ? {
                  ...doc,
                  title: updatedDocument.title,
                  updatedAt: updatedDocument.updatedAt,
                  icon: updatedDocument.icon,
                  parentId: updatedDocument.parentId,
                  archivedAt: updatedDocument.archivedAt,
                  position: updatedDocument.position,
                }
              : doc,
          ),
      );
    },
  });
}
```

Acceptance:

- Title updates reflect in sidebar without full refetch.
- Detail cache stays synchronized after autosave.

### 3.2 Invalidate archive/trash-related caches completely

Change:

```ts
export function useArchiveDocument(docId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.documents.archive(docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
      queryClient.invalidateQueries({ queryKey: ["documents", docId] });
    },
  });
}

export function useRestoreDocument(docId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.documents.restore(docId),
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
      queryClient.setQueryData(["documents", docId], document);
    },
  });
}

export function useDeleteDocument(docId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.documents.delete(docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["documents", "trash"] });
      queryClient.removeQueries({ queryKey: ["documents", docId] });
    },
  });
}
```

Acceptance:

- Trash updates after archive, restore, and permanent delete.
- Deleted document detail cache is removed.

## 4. Editor And Validation Type Safety

### 4.1 Replace `z.any()` for editor content

Short-term launch-safe version:

```ts
export const updateDocumentSchema = z.object({
  title: z.string().optional(),
  content: z.unknown().optional(),
  plainText: z.string().optional(),
  icon: z.string().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
});
```

Better later:

- Add a recursive JSON schema.
- Add a Tiptap-specific content guard if editor corruption becomes a concern.

Acceptance:

- No `z.any()` in request validation.

### 4.2 Type Tiptap JSON content

Change:

```ts
import type { JSONContent } from "@tiptap/core";

const debouncedSave = useMemo(
  () =>
    debounce((jsonContent: JSONContent) => {
      updateDocument.mutate({ content: jsonContent });
    }, 500),
  [updateDocument],
);
```

Acceptance:

- No `jsonContent: any` in editor autosave.

### 4.3 Fix title editor local state

Problem: setting title state from an effect causes a React lint error and can race with autosave refetches.

Extract a keyed child:

```tsx
function TitleEditor({
  documentId,
  initialTitle,
}: {
  documentId: string;
  initialTitle: string;
}) {
  const updateDocument = useUpdateDocument(documentId);
  const [title, setTitle] = useState(initialTitle);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const debouncedSaveTitle = useMemo(
    () =>
      debounce((newTitle: string) => {
        updateDocument.mutate({ title: newTitle });
      }, 500),
    [updateDocument],
  );

  useEffect(() => {
    return () => debouncedSaveTitle.cancel();
  }, [debouncedSaveTitle]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [title]);

  return (
    <textarea
      placeholder="New Page"
      rows={1}
      ref={textareaRef}
      className="w-full font-bold text-4xl tracking-tight mb-2 focus-visible:outline-0 resize-none overflow-hidden border-none bg-transparent shadow-none placeholder:text-muted-foreground/40"
      value={title}
      onChange={(event) => {
        setTitle(event.target.value);
        debouncedSaveTitle(event.target.value);
      }}
    />
  );
}
```

Use it with a key:

```tsx
<TitleEditor
  key={selectedDocument.id}
  documentId={selectedDocument.id}
  initialTitle={selectedDocument.title}
/>
```

Acceptance:

- No `set-state-in-effect` lint error.
- Switching documents resets the local title intentionally.
- Typing does not snap back during autosave.

## 5. Build, Lint, And Documentation

### 5.1 Fix stale Next dev types in TypeScript config

Problem: `pnpm build` type-checks `.next/dev/types` and fails on stale deleted routes.

Change `tsconfig.json`:

```json
"include": [
  "next-env.d.ts",
  "**/*.ts",
  "**/*.tsx",
  ".next/types/**/*.ts",
  "**/*.mts"
]
```

Acceptance:

- `pnpm build` does not fail because of `.next/dev/types`.

### 5.2 Clean lint errors and warnings in touched areas

Required cleanup:

- Remove unused imports in document routes and hooks.
- Remove unused `Document` and `useDocumentStore` imports from `DocumentView`.
- Fix auth layout unescaped quote lint errors.
- Remove `CreateDocumentPayload` imports from client files if unused.

Acceptance:

- `pnpm lint` passes.

### 5.3 Update stale docs

Current docs still mention `isArchived` and old delete behavior. Update:

- `docs/api.md`
- `docs/architecture.md`
- `docs/roadmap.md`

Required documentation truth:

- Archive state is `archivedAt`, not `isArchived`.
- Direct archive is stored on the selected document only.
- Effective archive is computed from ancestors.
- Active `DELETE` is not a normal active-document action.
- Permanent delete is trash-only.
- Trash route exists.

Acceptance:

- Public docs match actual product behavior.

## 6. Security And Reliability Before Public Launch

### 6.1 Ownership checks

Every document operation must enforce `ownerId` server-side:

- create child under parent,
- get document,
- list active documents,
- list trash documents,
- update document,
- archive document,
- restore document,
- permanently delete document.

Acceptance:

- No route trusts a client-provided owner id.
- No recursive query can leak another owner document.

### 6.2 Request validation

Keep Zod validation at every route accepting JSON.

Required:

- `POST /api/documents`
- `PATCH /api/documents/[documentId]`

Later when move-page exists:

- validate `parentId`,
- reject moving a page under itself,
- reject moving a page under one of its descendants.

Acceptance:

- Invalid payloads return `400`.
- Ownership and domain errors return `404` or `409` intentionally.

### 6.3 Error handling

Keep `withApiHandler` as the route safety net, but confirm:

- auth failures return `401`,
- validation failures return `400`,
- not found returns `404`,
- invalid active permanent delete returns `409`,
- unexpected errors return generic `500`.

Acceptance:

- API does not leak internal stack traces.

### 6.4 Data loss prevention

Before public launch:

- permanent delete should only be available from trash UI,
- permanent delete should show confirmation,
- confirmation copy must say nested pages are permanently deleted,
- consider disabling hard delete until trash UI is fully tested.

Acceptance:

- No accidental hard delete path exists from active document UI.

## 7. Product Launch Essentials

### 7.1 Authentication and route protection

Verify:

- unauthenticated users cannot access document pages,
- unauthenticated users cannot call document API routes,
- session expiration behaves cleanly,
- sign in/sign up flows are stable.

Acceptance:

- Protected routes redirect or return `401` consistently.

### 7.2 Editor persistence

Verify:

- title autosaves,
- content autosaves,
- switching pages does not lose unsaved debounced content,
- reload shows latest saved content,
- empty document content does not crash Tiptap.

Acceptance:

- Basic writing workflow feels reliable.

### 7.3 Empty and loading states

Required UI states:

- no documents,
- loading document list,
- loading document detail,
- document not found,
- archived document direct URL,
- API error during save,
- API error during archive/restore/delete.

Acceptance:

- App never shows a blank screen for expected states.

### 7.4 Deployment readiness

Before public launch:

- configure production database,
- run migrations in production,
- set all auth environment variables,
- set `DATABASE_URL`,
- verify Better Auth trusted origins/callback URLs,
- configure error logging,
- configure analytics or basic usage tracking,
- ensure `.env` is not committed.

Acceptance:

- Production deployment can create, edit, archive, restore, and delete documents.

### 7.5 Minimum CI gate

Add a CI workflow before launch:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm build
```

Acceptance:

- Main branch cannot drift into a broken build unnoticed.

## 8. Manual Launch Test Checklist

Run these before calling the archive system launch-ready:

- Create root document.
- Create nested child document.
- Create nested grandchild document.
- Rename root, child, and grandchild.
- Edit content and reload.
- Archive root and confirm whole tree leaves active sidebar.
- Confirm trash shows explicit archive action and inherited children.
- Restore root and confirm inherited children return.
- Archive child explicitly.
- Archive root.
- Restore root and confirm explicitly archived child stays in trash.
- Restore child while parent is archived and confirm it moves to root.
- Permanently delete archived parent and confirm subtree is gone.
- Try permanent delete on active document and confirm `409`.
- Open archived document URL directly and confirm normal editor does not open.
- Sign out and confirm document APIs reject access.
- Sign in as another user and confirm no documents leak.

## Launch Gate

LiveLeaf is not public-launch ready until:

- `pnpm lint` passes,
- `pnpm build` passes,
- active/trash archive flows pass manual tests,
- no active hard-delete UI exists,
- client DTOs no longer pretend JSON date strings are `Date` objects,
- ownership is enforced in all recursive queries,
- docs match actual behavior.

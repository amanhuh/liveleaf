import { requireUser } from "@/lib/auth/helper";
import {
  findEditableDocument,
  updateDocument,
  deleteDocument,
} from "@/features/documents/repository";
import { updateDocumentSchema } from "@/features/documents/validation";
import { withApiHandler } from "@/lib/api/withApiHandler";
import { HttpError } from "@/lib/errors";

export const GET = withApiHandler<{ documentId: string }>(async (req, params) => {
  const { documentId } = params;
  const session = await requireUser();
  console.log("session", session.user.id);

  const document = await findEditableDocument(documentId, session.user.id);

  console.log("document", document);
  if (!document) throw new HttpError("Document not found", 404);
  return Response.json(document);
});

export const PATCH = withApiHandler<{ documentId: string }>(async (req, params) => {
  const { documentId } = params;
  const session = await requireUser();
  const payload = updateDocumentSchema.parse(await req.json());
  const document = await updateDocument(documentId, session.user.id, payload);
  if (!document) throw new HttpError("Document not found", 404);
  return Response.json(document);
});

export const DELETE = withApiHandler<{ documentId: string }>(async (req, params) => {
  const { documentId } = params;
  const session = await requireUser();
  const document = await deleteDocument(documentId, session.user.id);
  if (!document) throw new HttpError("Document not found", 404);
  return Response.json(document);
});
import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/helper";
import {
  findDocument,
  updateDocument,
  deleteDocument,
  DocumentListItem,
} from "@/features/documents/repository";
import { updateDocumentSchema } from "@/features/documents/validation";
import { withApiHandler } from "@/lib/api/withApiHandler";
import { HttpError } from "@/lib/errors";

export const GET = withApiHandler<{ documentId: string }>(async (req, params) => {
  const { documentId } = params;
  const session = await requireUser();
  const document = await findDocument(documentId, session.user.id);
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
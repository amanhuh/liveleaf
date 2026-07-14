import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/helper";
import {
  findDocument,
  updateDocument,
  deleteDocument,
  archiveDocument,
  restoreDocument
} from "@/features/documents/repository";
import { updateDocumentSchema } from "@/features/documents/validation";
import { withApiHandler } from "@/lib/api/withApiHandler";

export const GET = withApiHandler<{ documentId: string }>
  (async (req, params) => {
    const { documentId } = params;
    const session = await requireUser();
    const document = await findDocument(documentId, session.user.id);
    return Response.json(document)
  });

export const PATCH = withApiHandler<{ documentId: string }>
  (async (req, params) => {
    const { documentId } = params;
    const session = await requireUser();
    const payload = updateDocumentSchema.parse(await req.json());
    const document = await updateDocument(documentId, session.user.id, payload);
    return Response.json(document)
  });

export const DELETE = withApiHandler<{ documentId: string }>
  (async (req, params) => {
    const { documentId } = params;
    const session = await requireUser();
    const document = await deleteDocument(documentId, session.user.id);
    return Response.json(document)
  });
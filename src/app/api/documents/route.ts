import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/helper";
import {
  findActiveDocuments,
  createDocument,
} from "@/features/documents/repository";
import { createDocumentSchema } from "@/features/documents/validation";
import { withApiHandler } from "@/lib/api/withApiHandler";
import { HttpError } from "@/lib/errors";

export const GET = withApiHandler(async (request: NextRequest) => {
  const session = await requireUser();

  const documents = await findActiveDocuments(session.user.id);
  return Response.json(documents)
})

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const session = await requireUser();
  const payload = createDocumentSchema.parse(body);
  const document = await createDocument(session.user.id, payload);
  if (!document) throw new HttpError("Parent document not found", 404);
  return Response.json(document)
})
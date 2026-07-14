import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/helper";
import {
  findManyByUser,
  createDocument,
} from "@/features/documents/repository";
import { createDocumentSchema } from "@/features/documents/validation";
import { withApiHandler } from "@/lib/api/withApiHandler";

export const GET = withApiHandler(async (request: NextRequest) => {
  const session = await requireUser();

  const documents = await findManyByUser(session.user.id);
  return Response.json(documents)
})

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const session = await requireUser();
  const payload = createDocumentSchema.parse(body);
  const document = await createDocument(session.user.id, payload);
  return Response.json(document)
})
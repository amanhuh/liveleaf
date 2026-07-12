import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/helper";
import {
  findManyByUser,
  createDocument,
} from "@/features/documents/repository";
import { createDocumentSchema } from "@/features/documents/validation";
import { ZodError } from "zod";

export async function GET() {
  const session = await requireUser();

  const documents = await findManyByUser(session.user.id);
  return Response.json(documents)
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const session = await requireUser();
    const payload = createDocumentSchema.parse(body);
    const document = await createDocument(session.user.id, payload);
    return Response.json(document)
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.flatten() }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
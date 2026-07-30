import { requireUser } from "@/lib/auth/helper";
import { moveDocument } from "@/features/documents/repository";
import { moveDocumentSchema } from "@/features/documents/validation";
import { withApiHandler } from "@/lib/api/withApiHandler";
import { HttpError } from "@/lib/errors";

export const PATCH = withApiHandler<{ documentId: string }>(async (req, params) => {
  const { documentId } = params;
  const session = await requireUser();
  const payload = moveDocumentSchema.parse(await req.json());
  const document = await moveDocument(documentId, session.user.id, payload);
  if (!document) throw new HttpError("Document not found", 404);
  return Response.json(document);
});

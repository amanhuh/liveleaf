import { requireUser } from "@/lib/auth/helper";
import { restoreDocument } from "@/features/documents/repository";
import { withApiHandler } from "@/lib/api/withApiHandler";
import { HttpError } from "@/lib/errors";

export const POST = withApiHandler<{ documentId: string }>(async (req, params) => {
  const { documentId } = params;
  const session = await requireUser();
  const document = await restoreDocument(documentId, session.user.id);
  if (!document) throw new HttpError("Document not found", 404);
  return Response.json(document);
});

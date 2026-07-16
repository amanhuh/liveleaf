import { requireUser } from "@/lib/auth/helper";
import { findTrashDocuments } from "@/features/documents/repository";
import { withApiHandler } from "@/lib/api/withApiHandler";

export const GET = withApiHandler(async () => {
  const session = await requireUser();
  const documents = await findTrashDocuments(session.user.id);
  return Response.json(documents);
});

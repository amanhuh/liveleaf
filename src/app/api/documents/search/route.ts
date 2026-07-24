import { requireUser } from "@/lib/auth/helper";
import { searchActiveDocuments } from "@/features/documents/repository";
import { withApiHandler } from "@/lib/api/withApiHandler";

export const GET = withApiHandler(async (req) => {
  const session = await requireUser();
  const { searchParams } = new URL(req.url);

  const rawQ = searchParams.get("q") ?? "";
  const normalizedQuery = rawQ.trim().replace(/\s+/g, " ");

  if (!normalizedQuery) {
    return Response.json([]);
  }

  const parsedLimit = Number(searchParams.get("limit"));
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 50)
    : 20;

  const results = await searchActiveDocuments(session.user.id, normalizedQuery, limit);
  return Response.json(results);
});

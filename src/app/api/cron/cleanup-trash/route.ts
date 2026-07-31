import { purgeExpiredTrashDocuments } from "@/features/documents/repository";

export async function GET() {
  const deletedCount = await purgeExpiredTrashDocuments(30);
  return Response.json({ status: "success", deletedCount });
}

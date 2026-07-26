import { z } from "zod";

export const searchDocumentsQuerySchema = z.object({
  q: z.string().min(1).max(200),
  limit: z.number().int().min(1).max(50).default(20),
});

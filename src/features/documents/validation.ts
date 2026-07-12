import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().optional().default("Untitled"),
  parentId: z.string().cuid().nullable().optional().default(null),
});

export type CreateDocumentPayload = z.infer<typeof createDocumentSchema>;

import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().optional().default("Untitled"),
  parentId: z.string().cuid().nullable().optional().default(null),
});

export type CreateDocumentPayload = z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema = z.object({
  title: z.string().optional(),
  content: z.any().optional(),
  plainText: z.string().optional(),
  icon: z.string().optional(),
  bannerUrl: z.string().url().optional(),
});

export type UpdateDocumentPayload = z.infer<typeof updateDocumentSchema>;
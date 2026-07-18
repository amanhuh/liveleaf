import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().optional().default("Untitled"),
  parentId: z.string().cuid().nullable().optional().default(null),
});

export type CreateDocumentPayload = z.output<typeof createDocumentSchema>;
export type CreateDocumentInput = z.input<typeof createDocumentSchema>;

export const updateDocumentSchema = z.object({
  title: z.string().optional(),
  content: z.unknown().optional(),
  plainText: z.string().optional(),
  icon: z.string().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
});

export type UpdateDocumentPayload = z.infer<typeof updateDocumentSchema>;
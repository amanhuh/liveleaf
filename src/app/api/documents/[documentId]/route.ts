import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/helper";
import {
  findManyByUser,
  createDocument,
} from "@/features/documents/repository";
import { createDocumentSchema } from "@/features/documents/validation";
import { withApiHandler } from "@/lib/api/withApiHandler";

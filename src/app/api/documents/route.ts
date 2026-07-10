import prisma from '@/lib/prisma'
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { requireUser } from '@/lib/auth/helper';

export async function GET(request: NextRequest) {
  const session = await requireUser();
}
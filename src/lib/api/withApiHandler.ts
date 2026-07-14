import type { NextRequest } from "next/server";
import { HttpError } from "../errors";
import { ZodError } from "zod";

export function withApiHandler(
  handler: (req: NextRequest) => Promise<Response>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      if (error instanceof HttpError) {
        return Response.json({ error: error.message }, { status: error.status });
      }
      if (error instanceof ZodError) {
        return Response.json({ error: error.flatten() }, { status: 400 });
      }
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}
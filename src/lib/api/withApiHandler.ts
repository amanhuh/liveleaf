import type { NextRequest } from "next/server";
import { HttpError } from "../errors";
import { ZodError } from "zod";

export function withApiHandler<TParams = Record<string, string>>(
  handler: (req: NextRequest, params: TParams) => Promise<Response>
) {
  return async (req: NextRequest, context: { params: Promise<TParams> }) => {
    try {
      const params = await context.params;
      return await handler(req, params);
    } catch (error) {
      console.error("[API Handler Error]", req.method, req.url, error);
      if (error instanceof HttpError) {
        return Response.json({ error: error.message }, { status: error.status });
      }
      if (error instanceof ZodError) {
        const message = error.issues.map((i) => i.message).join("; ");
        return Response.json({ error: message }, { status: 400 });
      }
      return Response.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
  };
}

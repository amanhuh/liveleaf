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

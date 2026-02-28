import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getOrdersAnalytics } from "@/modules/orders.controller";

export const dynamic = "force-dynamic";

/**
 * @swagger
   *  "/v1/analytics/orders": {
 *     get: {
 *        
 *       tags: ["Analytics Reports"],
 *       parameters: [
 *         {
 *           name: "userId",
 *           in: "query",
 *           required: true,
 *           schema: { type: "string" },
 *         },
 *       ],
 *       responses: {
 *         "200": { description: "Project members retrieved successfully" },
 *         "401": { description: "Unauthorized" },
 *         "500": { description: "Internal server error" },
 *       },
 *     },
 *   },
 */

/**
 * Normalizes and validates the `userId` query param.
 * Returns `null` when missing or blank.
 * @param value Raw query param value.
 * @returns Sanitized `userId` or `null` when invalid.
 */
function parseUserIdParam(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }

  return trimmed;
}

/**
 * GET handler for orders analytics.
 * Requires `userId` in query params and delegates business logic to controller.
 * @param req Incoming Next.js request.
 * @returns JSON response with orders analytics or validation error.
 */
export async function getOrder(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const userId = parseUserIdParam(searchParams.get("userId"));

  if (!userId) {
    return NextResponse.json(
      {
        status: "error",
        message: "Query parameter 'userId' is required",
      },
      { status: 400 }
    );
  }

  return getOrdersAnalytics(userId);
}

export { getOrder as GET };

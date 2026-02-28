import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getOrdersAnalytics } from "@/modules/orders.controller";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";

export const dynamic = "force-dynamic";

/**
 * GET handler for orders analytics.
 * Requires `projectId` in query params and delegates business logic to controller.
 * @param req Incoming Next.js request.
 * @returns JSON response with orders analytics or validation error.
 */
export async function getOrder(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Query parameter 'projectId' is required",
        },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    return getOrdersAnalytics(projectId, user.id);
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unauthorized",
      },
      { status: 401 }
    );
  }
}

export { getOrder as GET };

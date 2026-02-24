import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getOrdersAnalytics } from "@/modules/orders.controller";

export const dynamic = "force-dynamic";

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

export async function getOrder(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const forceError = searchParams.get("forceError");

  if (process.env.NODE_ENV !== "production" && forceError === "500") {
    return NextResponse.json(
      {
        status: "error",
        message: "Internal Server Error (forced for testing)",
      },
      { status: 500 }
    );
  }

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

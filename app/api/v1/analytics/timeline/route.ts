import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAnalyticsTimeline, parseLimitParam } from "@/modules/analytics.controller";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseLimitParam(searchParams.get("limit"), 100);

  if (limit === null) {
    return NextResponse.json(
      {
        status: "error",
        message: "Query parameter 'limit' must be a positive integer",
      },
      { status: 400 }
    );
  }

  return getAnalyticsTimeline(limit);
}

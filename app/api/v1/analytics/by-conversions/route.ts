import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAnalyticsByConversions,
  parseConversionsParam,
  parseLimitParam,
} from "@/modules/analytics.controller";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversions = parseConversionsParam(searchParams.get("conversions"));
  const limit = parseLimitParam(searchParams.get("limit"), 50);

  if (conversions === null) {
    return NextResponse.json(
      {
        status: "error",
        message: "Query parameter 'conversions' is required and must be a positive integer",
      },
      { status: 400 }
    );
  }

  if (limit === null) {
    return NextResponse.json(
      {
        status: "error",
        message: "Query parameter 'limit' must be a positive integer",
      },
      { status: 400 }
    );
  }

  return getAnalyticsByConversions(conversions, limit);
}

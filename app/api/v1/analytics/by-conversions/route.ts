import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAnalyticsByConversions } from "@/modules/analytics.controller";

export const dynamic = "force-dynamic";

function parseConversions(req: NextRequest): number | null {
  const { searchParams } = new URL(req.url);
  const conversionsParam = searchParams.get("conversions");

  if (!conversionsParam) {
    return null;
  }

  const parsed = Number(conversionsParam);

  if (!Number.isInteger(parsed)) {
    return null;
  }

  return parsed;
}

export async function GET(req: NextRequest) {
  const conversions = parseConversions(req);

  if (conversions === null) {
    return NextResponse.json(
      {
        status: "error",
        message: "Query parameter 'conversions' is required and must be an integer",
      },
      { status: 400 }
    );
  }

  return getAnalyticsByConversions(conversions);
}

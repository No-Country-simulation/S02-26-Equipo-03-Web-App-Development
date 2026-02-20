import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAnalyticsAlerts, parseLimitParam } from "@/modules/analytics.controller";

type AlertSeverity = "low" | "medium" | "high" | "critical";
const ALLOWED_SEVERITIES: AlertSeverity[] = ["low", "medium", "high", "critical"];

function isAlertSeverity(value: string): value is AlertSeverity {
  return ALLOWED_SEVERITIES.includes(value as AlertSeverity);
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseLimitParam(searchParams.get("limit"), 50);
  const severity = searchParams.get("severity");

  if (limit === null) {
    return NextResponse.json(
      {
        status: "error",
        message: "Query parameter 'limit' must be a positive integer",
      },
      { status: 400 }
    );
  }

  if (severity && !isAlertSeverity(severity)) {
    return NextResponse.json(
      {
        status: "error",
        message: "Query parameter 'severity' must be one of: low, medium, high, critical",
      },
      { status: 400 }
    );
  }

  return getAnalyticsAlerts(limit, severity && isAlertSeverity(severity) ? severity : undefined);
}

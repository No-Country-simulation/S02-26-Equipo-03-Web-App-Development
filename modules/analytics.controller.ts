import { NextResponse } from "next/server";
import { db } from "@infrastructure/database";
import {
  alertsTable,
  analyticsTable,
  analyticsSnapshotsTable,
} from "@infrastructure/database/schemas/schema";
import { and, desc, eq } from "drizzle-orm";

type AlertSeverity = "low" | "medium" | "high" | "critical";
type AggregatedMetrics = {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  adSpend: number;
};

function internalError(message: string, error: unknown) {
  console.error(message, error);
  return NextResponse.json(
    {
      status: "error",
      message: "Internal Server Error",
    },
    { status: 500 }
  );
}

function parsePositiveInt(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export async function getAnalytics(limit = 50) {
  try {
    const records = await db
      .select()
      .from(analyticsTable)
      .orderBy(desc(analyticsTable.periodStart))
      .limit(limit);

    return NextResponse.json({
      status: "success",
      data: records,
      count: records.length,
    });
  } catch (error: unknown) {
    return internalError("Failed to fetch analytics:", error);
  }
}

export async function getAnalyticsByConversions(conversions: number, limit = 50) {
  try {
    const records = await db
      .select()
      .from(analyticsTable)
      .where(eq(analyticsTable.conversions, conversions))
      .orderBy(desc(analyticsTable.periodStart))
      .limit(limit);

    return NextResponse.json({
      status: "success",
      data: records,
      count: records.length,
    });
  } catch (error: unknown) {
    return internalError("Failed to fetch analytics by conversions:", error);
  }
}

export async function getAnalyticsMetrics(limit = 200) {
  try {
    const rows = await db
      .select({
        impressions: analyticsTable.impressions,
        clicks: analyticsTable.clicks,
        conversions: analyticsTable.conversions,
        revenue: analyticsTable.revenue,
        adSpend: analyticsTable.adSpend,
      })
      .from(analyticsTable)
      .orderBy(desc(analyticsTable.periodStart))
      .limit(limit);

    const totals = rows.reduce<AggregatedMetrics>(
      (acc, row) => {
        acc.impressions += row.impressions ?? 0;
        acc.clicks += row.clicks ?? 0;
        acc.conversions += row.conversions ?? 0;
        acc.revenue += row.revenue ?? 0;
        acc.adSpend += row.adSpend ?? 0;
        return acc;
      },
      { impressions: 0, clicks: 0, conversions: 0, revenue: 0, adSpend: 0 }
    );

    const ctr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;
    const cvr = totals.clicks > 0 ? totals.conversions / totals.clicks : 0;
    const roi = totals.adSpend > 0 ? (totals.revenue - totals.adSpend) / totals.adSpend : 0;

    return NextResponse.json({
      status: "success",
      data: {
        ...totals,
        ctr,
        cvr,
        roi,
      },
      sampleSize: rows.length,
    });
  } catch (error: unknown) {
    return internalError("Failed to fetch metrics:", error);
  }
}

export async function getAnalyticsAlerts(limit = 50, severity?: AlertSeverity) {
  try {
    const filters = severity
      ? and(eq(alertsTable.isResolved, false), eq(alertsTable.severity, severity))
      : eq(alertsTable.isResolved, false);

    const records = await db
      .select()
      .from(alertsTable)
      .where(filters)
      .orderBy(desc(alertsTable.triggeredAt))
      .limit(limit);

    return NextResponse.json({
      status: "success",
      data: records,
      count: records.length,
    });
  } catch (error: unknown) {
    return internalError("Failed to fetch alerts:", error);
  }
}

export async function getAnalyticsTimeline(limit = 100) {
  try {
    const records = await db
      .select({
        analyticsId: analyticsSnapshotsTable.analyticsId,
        snapshotDate: analyticsSnapshotsTable.snapshotDate,
        metrics: analyticsSnapshotsTable.metrics,
      })
      .from(analyticsSnapshotsTable)
      .orderBy(desc(analyticsSnapshotsTable.snapshotDate))
      .limit(limit);

    return NextResponse.json({
      status: "success",
      data: records,
      count: records.length,
    });
  } catch (error: unknown) {
    return internalError("Failed to fetch timeline:", error);
  }
}

export async function getAnalyticsAnomalies(limit = 50) {
  try {
    const records = await db
      .select()
      .from(alertsTable)
      .where(eq(alertsTable.type, "anomaly_detected"))
      .orderBy(desc(alertsTable.triggeredAt))
      .limit(limit);

    return NextResponse.json({
      status: "success",
      data: records,
      count: records.length,
    });
  } catch (error: unknown) {
    return internalError("Failed to fetch anomalies:", error);
  }
}

export function parseLimitParam(value: string | null, fallback: number): number | null {
  if (!value) {
    return fallback;
  }
  return parsePositiveInt(value);
}

export function parseConversionsParam(value: string | null): number | null {
  const parsed = parsePositiveInt(value);
  return parsed;
}

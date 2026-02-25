import { NextResponse } from "next/server";
import { db } from "@infrastructure/database";

export interface OrderAnalyticsDTO {
  id: string;
  client_name: string | null;
  client_email: string | null;
  service_name: string | null;
  payment_type: string | null;
  source_name: string | null;
  total_amount: number;
  status: string;
  order_date_iso: string | null;
  stripe_id: string | null;
  campaign_id: string | null;
  project_id: string;
  expires_at_iso: string | null;
}

const ORDERS_ANALYTICS_QUERY = `
SELECT DISTINCT
    o.id,
    o.client_name,
    o.client_email,
    c.name AS service_name,
    o.payment_type,
    i.name AS source_name,
    o.total_amount,
    o.status,
    datetime(o.order_date / 1000, 'unixepoch') AS order_date_iso,
    o.stripe_id,
    c.id AS campaign_id,
    o.project_id,
    datetime(s.expires_at / 1000, 'unixepoch') AS expires_at_iso
FROM orders o
LEFT JOIN attributions a ON o.id = a.order_id
LEFT JOIN campaigns c ON a.campaign_id = c.id
LEFT JOIN integrations i ON c.ads_integration_id = i.id
JOIN project_members pm ON o.project_id = pm.project_id
JOIN session s ON pm.user_id = s.user_id
WHERE s.user_id = ?
  AND s.expires_at > strftime('%s', 'now') * 1000
`;

const ACTIVE_SESSION_QUERY = `
SELECT 1 AS has_session
FROM session s
WHERE s.user_id = ?
  AND s.expires_at > strftime('%s', 'now') * 1000
LIMIT 1
`;

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

function asStringOrNull(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return String(value);
}

function asRequiredString(value: unknown, field: string): string {
  if (typeof value === "string") {
    return value;
  }
  if (value === null || value === undefined) {
    throw new Error(`Invalid null value for required field '${field}'`);
  }
  return String(value);
}

function asRequiredNumber(value: unknown, field: string): number {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid number for field '${field}'`);
  }
  return parsed;
}

function mapToOrderAnalyticsDTO(row: Record<string, unknown>): OrderAnalyticsDTO {
  return {
    id: asRequiredString(row.id, "id"),
    client_name: asStringOrNull(row.client_name),
    client_email: asStringOrNull(row.client_email),
    service_name: asStringOrNull(row.service_name),
    payment_type: asStringOrNull(row.payment_type),
    source_name: asStringOrNull(row.source_name),
    total_amount: asRequiredNumber(row.total_amount, "total_amount"),
    status: asRequiredString(row.status, "status"),
    order_date_iso: asStringOrNull(row.order_date_iso),
    stripe_id: asStringOrNull(row.stripe_id),
    campaign_id: asStringOrNull(row.campaign_id),
    project_id: asRequiredString(row.project_id, "project_id"),
    expires_at_iso: asStringOrNull(row.expires_at_iso),
  };
}

export async function getOrdersAnalytics(userId: string) {
  try {
    const sessionResult = await db.$client.execute({
      sql: ACTIVE_SESSION_QUERY,
      args: [userId],
    });

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const result = await db.$client.execute({
      sql: ORDERS_ANALYTICS_QUERY,
      args: [userId],
    });

    const data = result.rows.map((row) => mapToOrderAnalyticsDTO(row as Record<string, unknown>));

    return NextResponse.json({
      count: data.length,
      data,
    });
  } catch (error: unknown) {
    return internalError("Failed to fetch orders analytics report:", error);
  }
}

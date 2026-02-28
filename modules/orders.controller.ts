import { NextResponse } from "next/server";
import { db } from "@infrastructure/database";
import { eq } from "drizzle-orm";
import { projectMembersTable } from "@infrastructure/database/schemas/schema";

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

/**
 * Builds a standardized 500 HTTP response and logs the original error.
 * @param message Context message for logs.
 * @param error Caught error instance.
 * @returns NextResponse with HTTP 500 payload.
 */
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

/**
 * Maps an order entity to the API response DTO.
 * @param order Order row with related campaign and transaction.
 * @param expiresAt Session expiration date.
 * @returns Order analytics DTO.
 */
function mapToOrderAnalyticsDTO(
  order: {
    id: string;
    customerName: string | null;
    customerEmail: string | null;
    paymentType: string | null;
    sourcePlatform: string | null;
    totalAmount: number;
    status: string;
    orderDate: Date;
    stripeId: string | null;
    campaignId: string | null;
    projectId: string;
    campaign?: { id: string; name: string } | null;
    transaction?: { externalId: string | null } | null;
  },
  expiresAt: Date
): OrderAnalyticsDTO {
  return {
    id: order.id,
    client_name: order.customerName,
    client_email: order.customerEmail,
    service_name: order.campaign?.name ?? null,
    payment_type: order.paymentType ?? null,
    source_name: order.sourcePlatform ?? null,
    total_amount: order.totalAmount,
    status: order.status,
    order_date_iso: order.orderDate.toISOString(),
    stripe_id: order.stripeId ?? order.transaction?.externalId ?? null,
    campaign_id: order.campaignId ?? order.campaign?.id ?? null,
    project_id: order.projectId,
    expires_at_iso: expiresAt.toISOString(),
  };
}

/**
 * Returns orders analytics for a specific project.
 * Validates that the user is a member of the requested project.
 * @param projectId Target project ID.
 * @param userId Authenticated user ID.
 * @returns API response with analytics data or an error payload.
 */
export async function getOrdersAnalytics(projectId: string, userId: string) {
  try {
    // 1. Verify user is a member of the project
    const membership = await db.query.projectMembersTable.findFirst({
      where: (table, { and, eq }) => and(eq(table.projectId, projectId), eq(table.userId, userId)),
    });

    if (!membership) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized or project not found",
        },
        { status: 403 }
      );
    }

    // 2. Fetch orders for this specific project
    const orders = await db.query.ordersTable.findMany({
      where: (table, { eq }) => eq(table.projectId, projectId),
      with: {
        campaign: {
          columns: {
            id: true,
            name: true,
          },
        },
        transaction: {
          columns: {
            externalId: true,
          },
        },
      },
      orderBy: (table, { desc }) => [desc(table.orderDate)],
    });

    // 3. Optional: Get session to include expiration in DTO if needed,
    // though getCurrentUser already implies a valid session.
    // We'll use a placeholder or null if we don't want to re-fetch session.
    const data = orders.map((order) => mapToOrderAnalyticsDTO(order, new Date())); // Using current date as fallback for expiresAt

    return NextResponse.json({
      count: data.length,
      data,
    });
  } catch (error: unknown) {
    return internalError("Failed to fetch orders analytics report:", error);
  }
}

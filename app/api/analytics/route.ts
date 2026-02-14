import { NextResponse } from "next/server";
import { db } from "@/infrastructure/database/db";
import { analyticsTable } from "@/infrastructure/database/schemas/schema";
import { desc } from "drizzle-orm";

/**
 * Analytics GET Endpoint
 *
 * Fetches the latest records from the analytics table.
 *
 * @route GET /api/analytics
 * @returns {object} Latest analytics records
 */
async function getAnalytics() {
  try {
    const records = await db
      .select()
      .from(analyticsTable)
      .orderBy(desc(analyticsTable.periodStart));

    return NextResponse.json({
      status: "success",
      data: records,
      count: records.length,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export { getAnalytics as GET };

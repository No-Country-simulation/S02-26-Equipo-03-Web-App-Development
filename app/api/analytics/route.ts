import { NextResponse } from "next/server";
import { db } from "@infrastructure/database";
import { analyticsTable } from "@infrastructure/database/schemas/schema";
import { desc } from "drizzle-orm";

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     tags: [Analytics]
 *     summary: Fetch latest analytics records
 *     description: Restricted to authenticated users. Fetches records from the analytics table.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Latest analytics records retrieved successfully
 *       401:
 *         description: Unauthorized - Valid session required
 *       500:
 *         description: Internal Server Error
 */
async function getAnalytics() {
  try {
    // La autenticación básica es gestionada por el middleware (proxy.ts).
    // Si la ejecución llega aquí, garantizamos que existe una sesión válida.

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

import { NextResponse } from "next/server";
import { db } from "@/infrastructure/database/db";
import { sql } from "drizzle-orm";

/**
 * Health Check Endpoint
 *
 * @route GET /api/health
 * @returns {object} Health status with database connectivity and timestamp
 */
async function getDatabaseHealth() {
  try {
    // Optimized connectivity check using a simple value select
    await db.select({ val: sql`1` });

    return NextResponse.json({
      status: "ok",
      database: "connected",
      message: "Hello World Backend",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("Database connection failed in health check:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message: "Internal Server Error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export { getDatabaseHealth as GET };

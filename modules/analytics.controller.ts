import { NextRequest, NextResponse } from "next/server";
import { db } from "@infrastructure/database";
import { analyticsTable } from "@infrastructure/database/schemas/schema";
import { desc, eq } from "drizzle-orm";
import { CustomError } from "@/shared/lib/errors";

/**
 * Analytics Controller
 *
 * Handles the logic for fetching analytics data.
 */
export const analyticsController = {
  getAnalytics: async () => {
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
  },

  getAnalyticsByConversions: async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const conversionsParam = searchParams.get("conversions");

      if (!conversionsParam) {
        throw CustomError.badRequest("Missing conversions parameter");
      }

      const conversions = parseInt(conversionsParam);

      if (isNaN(conversions)) {
        throw CustomError.badRequest("Conversions parameter must be a number");
      }

      const records = await db
        .select()
        .from(analyticsTable)
        .where(eq(analyticsTable.conversions, conversions))
        .orderBy(desc(analyticsTable.periodStart));

      return NextResponse.json({
        status: "success",
        data: records,
        count: records.length,
      });
    } catch (error: any) {
      if (error instanceof CustomError) {
        return NextResponse.json(
          { status: "error", message: error.message },
          { status: error.statusCode }
        );
      }
      console.error("Failed to fetch analytics by conversions:", error);
      return NextResponse.json(
        {
          status: "error",
          message: "Internal Server Error",
        },
        { status: 500 }
      );
    }
  },
};

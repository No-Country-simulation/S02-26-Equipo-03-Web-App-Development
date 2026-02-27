import { NextRequest, NextResponse } from "next/server";
import { getReportStats } from "@/modules/reports/report.controller";

export const dynamic = "force-dynamic";

/**
 * @openapi
 * /v1/reports/stats:
 *   get:
 *     summary: Get report statistics for the authenticated user
 *     tags: [Reports]
 *     parameters:
 *       - name: projectId
 *         in: query
 *         required: true
 *         schema: { type: string }
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Report stats retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 exportsThisMonth: 8
 *                 lastReportDate: "2026-02-24T10:30:00.000Z"
 *                 pdfCount: 5
 *                 csvCount: 3
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { status: "error", message: "Query parameter 'projectId' is required" },
      { status: 400 }
    );
  }

  return getReportStats(projectId);
}

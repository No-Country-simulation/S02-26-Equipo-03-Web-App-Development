import { NextRequest, NextResponse } from "next/server";
import { createReport, listReports } from "@/modules/reports/report.controller";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";

export const dynamic = "force-dynamic";

/**
 * @openapi
 * /v1/reports:
 *   get:
 *     summary: List reports for the authenticated user
 *     tags: [Reports]
 *     parameters:
 *       - name: name
 *         in: query
 *         schema: { type: string }
 *         description: Partial match on report name
 *       - name: format
 *         in: query
 *         schema: { type: string, enum: [pdf, csv] }
 *       - name: createdFrom
 *         in: query
 *         schema: { type: string, format: date-time }
 *         description: Minimum creation date (ISO 8601)
 *       - name: createdTo
 *         in: query
 *         schema: { type: string, format: date-time }
 *         description: Maximum creation date (ISO 8601)
 *       - name: periodStart
 *         in: query
 *         schema: { type: string, format: date-time }
 *       - name: periodEnd
 *         in: query
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *       400:
 *         description: Invalid filter parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return listReports(searchParams);
}

/**
 * @openapi
 * /v1/reports:
 *   post:
 *     summary: Create a new report
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId, name, format, fileUrl, periodStart, periodEnd]
 *             properties:
 *               projectId: { type: string }
 *               name: { type: string }
 *               format: { type: string, enum: [pdf, csv] }
 *               fileUrl: { type: string, format: uri }
 *               periodStart: { type: string, format: date-time }
 *               periodEnd: { type: string, format: date-time }
 *           example:
 *             projectId: "proj_abc123"
 *             name: "Resumen Ejecutivo - Feb 2026"
 *             format: "pdf"
 *             fileUrl: "https://storage.example.com/reports/report-feb-2026.pdf"
 *             periodStart: "2026-01-16T00:00:00.000Z"
 *             periodEnd: "2026-02-16T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    return createReport(body, user.id);
  } catch {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }
}

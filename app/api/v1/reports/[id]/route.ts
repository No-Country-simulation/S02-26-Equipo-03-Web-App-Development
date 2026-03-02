import { NextRequest, NextResponse } from "next/server";
import { getReportById, deleteReport } from "@/modules/reports/report.controller";

export const dynamic = "force-dynamic";

/**
 * @openapi
 * /v1/reports/{id}:
 *   get:
 *     summary: Get a specific report by ID
 *     tags: [Reports]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal Server Error
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return getReportById(id);
}

/**
 * @openapi
 * /v1/reports/{id}:
 *   delete:
 *     summary: Delete a report by ID
 *     tags: [Reports]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return deleteReport(id);
}

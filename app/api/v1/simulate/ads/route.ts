import { NextRequest, NextResponse } from "next/server";
import { AdsSimulatorService } from "@infrastructure/services/AdsSimulatorService";
import { db } from "@infrastructure/database";

/**
 * @swagger
 * /api/v1/simulate/ads:
 *   get:
 *     summary: Simulates Meta and Google Ads data for a project
 *     description: |
 *       Generates mock campaigns and analytics for testing purposes.
 *       ⚠️ **WARNING**: New projects are already created with simulated campaigns automatically.
 *       Running this manually will duplicate metrics in the dashboard.
 *     tags:
 *       - Simulation
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: The ID of the project to simulate data for. If not provided, it uses the first project found.
 *     responses:
 *       200:
 *         description: Simulation successful
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let projectId = searchParams.get("projectId");

    if (!projectId) {
      // Find the first project if none provided
      const project = await db.query.projectsTable.findFirst();
      if (!project) {
        return NextResponse.json({ error: "No projects found to simulate data." }, { status: 404 });
      }
      projectId = project.id;
    }

    await AdsSimulatorService.simulateProjectAds(projectId);

    return NextResponse.json({
      success: true,
      message: `Simulation completed for project ${projectId}. Campaigns and analytics generated for the last 7 days.`,
    });
  } catch (error: any) {
    console.error("Simulation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

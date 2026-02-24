import { NextRequest, NextResponse } from "next/server";
import { db } from "@/infrastructure/database";
import { ordersTable } from "@/infrastructure/database/schemas/schema";
import { desc, eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { ProjectMemberRepository } from "@/modules/projects/members/projectMember.repository";

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: List all orders for a project
 *     description: Returns a list of all orders for the specified project if the user has access.
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to fetch orders from
 *     responses:
 *       200:
 *         description: A list of orders
 *       400:
 *         description: Missing projectId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not a member of the project)
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Missing projectId query parameter" },
        { status: 400 }
      );
    }

    // Verificar si el usuario es miembro del proyecto
    const isMember = await ProjectMemberRepository.isMember(projectId, user.id, db);
    if (!isMember) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You are not a member of this project" },
        { status: 403 }
      );
    }

    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.projectId, projectId))
      .orderBy(desc(ordersTable.orderDate));

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

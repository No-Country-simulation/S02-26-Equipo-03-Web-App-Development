import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/modules/projects/project.service";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { z } from "zod";
import { createProjectSchema } from "@/modules/projects/project.validators";

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Get user projects
 *     description: Returns a list of all projects belonging to the authenticated user.
 *     tags:
 *       - Projects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of projects
 *       401:
 *         description: Unauthorized
 */
export async function getProjectsFromUser() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const projects = await ProjectService.getUserProjects(user.id);

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("GET /projects error:", error);

    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Create a new project
 *     description: Creates a new project for the authenticated user.
 *     tags:
 *       - Projects
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
export async function createProject(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createProjectSchema.parse(body);

    const result = await ProjectService.createProject(user.id, parsed.name, parsed.description);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: z.treeifyError(error) },
        { status: 400 }
      );
    }

    console.error("POST /projects error:", error);

    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export { getProjectsFromUser as GET, createProject as POST };

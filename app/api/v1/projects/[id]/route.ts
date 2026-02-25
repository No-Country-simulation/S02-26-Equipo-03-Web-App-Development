import { ProjectService } from "@/modules/projects/project.service";
import { NextResponse, NextRequest } from "next/server";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { updateProjectSchema } from "@/modules/projects/project.validators";

/**
 * GET /api/projects/id
 * Returns a project by id if the user is a member
 */
export async function getProject(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const project = await ProjectService.getProject(user.id, id);

    if (!project) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error: any) {
    if (error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    console.error("GET /projects/:id error:", error);

    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PUT /api/projects/id
 * Edits an existing project if the user has permissions of edit
 */
export async function editProject(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const parsed = updateProjectSchema.parse(body);

    const updated = await ProjectService.updateProject(user.id, id, parsed);

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("UPDATE /projects error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

/**
 * DELETE /api/projects/id
 * Deletes an existing project
 */
export async function archiveProject(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deleted = await ProjectService.archiveProject(user.id, id);

    return NextResponse.json(deleted, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /projects error:", error);
    if (error.message === "AlreadyArchivedOrNotFound") {
      return NextResponse.json(
        { message: "Project already archived or not found" },
        { status: 409 }
      );
    }

    if (error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export { getProject as GET, editProject as PUT, archiveProject as DELETE };

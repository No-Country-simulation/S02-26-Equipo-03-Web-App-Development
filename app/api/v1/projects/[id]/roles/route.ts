import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { ProjectRoleService } from "@/modules/projects/roles/projectRole.service";

export async function listRoles(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await ProjectRoleService.listRoles(user.id, id);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("GET /projects/:id/roles error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export { listRoles as GET };

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { addMemberSchema, removeMemberSchema } from "@/modules/projects/project.validators";
import { ProjectMemberService } from "@/modules/projects/members/projectMember.service";
import z from "zod";

/**
 * GET /api/projects/id/members
 * List members of the project
 */
export async function listMembers(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await ProjectMemberService.listMembers(user.id, id);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("GET /projects/:id/members error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/projects/id/members
 * Adds a member to the project. Only project owner can add members
 */
export async function addMember(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = addMemberSchema.parse(body);

    const result = await ProjectMemberService.addMember(
      user.id,
      id,
      parsed.targetUserId,
      parsed.roleId
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: z.treeifyError(error) },
        { status: 400 }
      );
    }

    console.error("POST /projects/:id/members error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/projects/id/members
 * Removes a member from the project
 */
export async function removeMember(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = removeMemberSchema.parse(body);

    await ProjectMemberService.removeMember(user.id, id, parsed.targetUserId);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: z.treeifyError(error) },
        { status: 400 }
      );
    }

    console.error("DELETE /projects/:id/members error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export { listMembers as GET, addMember as POST, removeMember as DELETE };

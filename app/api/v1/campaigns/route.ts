import { NextRequest, NextResponse } from "next/server";
import { CampaignRepository } from "@/modules/campaigns/campaign.repository";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { ProjectMemberRepository } from "@/modules/projects/members/projectMember.repository";
import { db } from "@/infrastructure/database";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, name, budget, status } = body;

    if (!projectId || !name) {
      return NextResponse.json({ message: "Missing projectId or name" }, { status: 400 });
    }

    // Verify user is member of project
    const isMember = await ProjectMemberRepository.isMember(projectId, user.id, db);
    if (!isMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const campaign = await CampaignRepository.create({
      projectId,
      name,
      budget: budget || 0,
      status: status || "active",
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

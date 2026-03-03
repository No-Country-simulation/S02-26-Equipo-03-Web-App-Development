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
    const { projectId, name, budget, status, externalId, startDate, endDate } = body;

    if (!projectId || !name) {
      return NextResponse.json({ message: "Missing projectId or name" }, { status: 400 });
    }

    // Verify user is member of project
    const isMember = await ProjectMemberRepository.isMember(projectId, user.id, db);
    if (!isMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : null;

    const campaign = await CampaignRepository.create({
      projectId,
      name,
      externalId,
      budget,
      startDate: start,
      endDate: end,
      status,
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/campaigns
 * Returns a list of all campaigns in a project
 */
export async function getCampaign(req: NextRequest){
  try {  
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    let page = parseInt((searchParams.get("page") || "1"), 10);
    if(!projectId){
      return NextResponse.json({ message: "Missing projectId" },{ status: 400 });
    }
    if(isNaN(page) || page <= 0){
      page = 1;
    }

    const isMember = await ProjectMemberRepository.isMember(projectId, user.id, db);
    if (!isMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const campaigns = await CampaignRepository.allByProjectId(projectId, db, page);

    return NextResponse.json({
      success: true,
      ...campaigns
    }, { status: 200});

  } catch (error) {
    console.error("[GET_CAMPAIGNS_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

export { getCampaign as GET };
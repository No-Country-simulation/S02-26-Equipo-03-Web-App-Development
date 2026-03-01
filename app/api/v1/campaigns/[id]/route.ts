import { NextResponse } from "next/server";
import { CampaignRepository } from "@/modules/campaigns/campaign.repository";
import { db } from "@/infrastructure/database";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { ProjectMemberRepository } from "@/modules/projects/members/projectMember.repository";

/**
 * GET /api/v1/campaigns/[id]
 * Returns a campaign by id
 */
export async function getCampaignDetail(req: Request) {
  try {

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const projectId = searchParams.get("projectId")
    if(!id ){
      return NextResponse.json({ message: "Missing id" },{ status: 400 });
    }
    if(!projectId){
      return NextResponse.json({ message: "Missing projectId" },{ status: 400 });
    }

    console.log("id", id);
    console.log("projectId", projectId);

    const isMember = await ProjectMemberRepository.isMember(projectId, user.id, db);
    if (!isMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    let page = parseInt((searchParams.get("page") || "1"), 10);
    if(isNaN(page) || page <= 0){
      page = 1;
    }

    const campaignData = await CampaignRepository.findById(projectId, id, db, page);

     return NextResponse.json({
      success: true,
      ...campaignData
    }, { status: 200});

  } catch (error) {
    console.error("[GET_CAMPAIGNS_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

export { getCampaignDetail as GET };
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { NextResponse } from "next/server";
import { db } from "@/infrastructure/database";
import { CampaignRepository } from "@/modules/campaigns/campaign.repository";
import { ProjectMemberRepository } from "@/modules/projects/members/projectMember.repository";

/**
 * GET /api/v1/campaigns/search?page=[NUMERO]&projectId=[ID]&name=[NOMBRE]
 * Returns campaigns that match the name
 */
export async function getCampaignSearch(req: Request){
    try {
        // 1. Autenticación
        // verificar si el usuario tiene permisos
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
        // 2. Validación de parámetros
        //Obtener y validar el projectId y el nombre de la campaña
        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get("projectId");
        const name = searchParams.get("name");
        let page = parseInt((searchParams.get("page") || "1"), 10);

        if(!projectId){
            return NextResponse.json({ error: "Missing projectId" },{ status: 400 });
        }
        if(!name){
            return NextResponse.json({ error: "Missing name" },{ status: 400 });
        }
        // Si 'page' no es un número válido o es negativo, establecer a 1.
        if(isNaN(page) || page <= 0){
            page = 1;
        }
    
        // 3. Autorización
        // Verificar que el usuario pertenece al proyecto
        const isMember = await ProjectMemberRepository.isMember(projectId, user.id, db);
        if (!isMember) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
    
        // 4. Búsqueda en repositorio
        const searchResult = await CampaignRepository.findByName(projectId, name, db, page);
    
        return NextResponse.json({
            success: true,
            ...searchResult
        }, { status: 200});

  } catch (error) {
    console.error("[GET_CAMPAIGNS_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

export { getCampaignSearch as GET };

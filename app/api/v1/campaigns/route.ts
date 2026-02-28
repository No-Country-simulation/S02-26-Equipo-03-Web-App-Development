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
    // const { projectId, name, budget, status } = body;
    const { projectId, name, budget, status, externalId, startDate, endDate } = body;

    if (!projectId || !name) {
      return NextResponse.json({ message: "Missing projectId or name" }, { status: 400 });
    }

    // Verify user is member of project
    const isMember = await ProjectMemberRepository.isMember(projectId, user.id, db);
    if (!isMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    /*const campaign = await CampaignRepository.create({
      projectId,
      name,
      budget: budget || 0,
      status: status || "active",
    }, db);*/

    // 🚀 DELEGAMOS TODO AL SERVICE
    // El service se encarga de: 
    // 1. Permisos 2. Validar solapamiento de nombres 3. Crear el ID Mock 4. Insertar
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
    }, db);

    return NextResponse.json(campaign, { status: 201 });
  } catch (error: any) {
    console.error("POST_CAMPAIGN_ERROR:", error);

    const errorMap: Record<string, { status: number; msg: string }> = {
      "Forbidden": { status: 403, msg: "No tienes permisos." },
      "CampaignNameAlreadyExistsInThisPeriod": { status: 400, msg: "Ya existe una campaña activa con ese nombre este mes." },
      "Invalid startDate": { status: 400, msg: "La fecha de inicio no es válida." }
      // "CampaignNameAlreadyExists": { status: 400, msg: "Ese nombre ya está en uso." }
    };
    
    if (errorMap[error.message]) {
      return NextResponse.json(
        { message: errorMap[error.message].msg },
        { status: errorMap[error.message].status }
      );
    }

    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


/**
 * Crear una ruta que reciba el projectId y devuelva el listado de campañas.
 * 
 * El Reto Técnico (JOIN): No debe devolver solo la fila de campaignsTable. 
 * Debe hacer un JOIN con la tabla de analyticsTable para sumar el gasto total.
 * 
 * Campos requeridos: name, platform, spent (suma de analytics), status.
 * 
 * ROAS = Revenue de stripe / ad spend (meta/google)
*/

/**
 * GET /api/v1/campaigns
 * Returns a list of all campaigns in a project
 */
export async function getCampaign(req: NextRequest){

  try {  
    // 1. Autenticación
    // verificar si el usuario tiene permisos
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Validación de parámetros
    //Obtener y validar el projectId
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    if(!projectId){
      return NextResponse.json({ error: "Missing projectId" },{ status: 400 });
    }

    // 3. Autorización (¿Es miembro del proyecto?)
    // Verificar que el usuario pertenece al proyecto
    const isMember = await ProjectMemberRepository.isMember(projectId, user.id, db);
    if (!isMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 4. Lógica de negocio:
    //Traer todas las campañas que pertenecen al proyecto
    const campaigns = await CampaignRepository.getAllByProjectId(projectId, db);

    // 5. Respuesta 
    // Un 404 se usa si el RECURSO (el proyecto) no existe, 
    // Si no hay campañas, lo ideal es devolver un array vacío [] con status 200.
    // pero si el proyecto existe y simplemente no tiene campañas, devolver [] es lo correcto.
    return NextResponse.json({
      success: true,
      count: campaigns?.length  || 0,
      data: campaigns || [],
    }, { status: 200});

  } catch (error) {
    console.error("[GET_CAMPAIGNS_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

export async function getCampaignSearch(){}
export async function getCampaignFilter(){}
// Endpoint de Detalle: GET /api/v1/campaigns/[id]/analysis
export async function getCampaignDetail(){}

export { getCampaign as GET };
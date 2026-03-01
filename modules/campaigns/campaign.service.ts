import { DBConnection, db } from "@/infrastructure/database";
import { CampaignRepository, type CampaignReportDTO } from "./campaign.repository";
import { ProjectService } from "@/modules/projects/project.service";
import crypto from "node:crypto";


export class CampaignService {
  /**
   * Obtiene el reporte detallado. 
   * Valida permisos antes de consultar la base de datos.
   */
  static async getProjectCampaigns(userId: string, projectId: string): Promise<CampaignReportDTO[]> {
    return db.transaction(async (tx) => {
      await ProjectService.assertPermission(userId, projectId, "campaign", "read", tx);

      const campaigns = await CampaignRepository.allByProjectId(projectId, tx);

      return campaigns.data;
    });
  }

  /**
   * Crea una campaña y dispara la simulación de datos iniciales.
   */
  static async createCampaign(
        userId: string,
        projectId: string,
        payload: {
            externalId: string;
            endDate: any;
            startDate: any; 
            name: string; 
            budget?: number; 
            status?: string; 
            adsIntegrationId?: string 
        }
    ) {
        // 1. Iniciamos transacción
        return db.transaction(async (tx) => {
        
        // 2. Autorización
        await ProjectService.assertPermission(userId, projectId, "campaign", "create", tx);

        // 3. Validación de Negocio: Evitar solapamiento de nombres
        const matchingCampaigns = await CampaignRepository.findByName(projectId, payload.name, tx);
        const existing = matchingCampaigns.data.find(c => c.name.toLowerCase() === payload.name.toLowerCase());

        if (existing) {
          const newStart = new Date(payload.startDate || Date.now()).getTime();
          const existingStart = existing.startDate ? new Date(existing.startDate).getTime() : null;

          // Si el nombre es igual pero la fecha de inicio es la misma (o muy cercana),
          // asumimos que es un error de duplicado.
          const isSamePeriod = existingStart && Math.abs(newStart - existingStart) < 30 * 24 * 60 * 60 * 1000; // 30 días

          if (isSamePeriod) {
            throw new Error("CampaignNameAlreadyExistsInThisPeriod");
          }

          // Si no es el mismo periodo, permitimos la creación pero forzamos un sufijo para que el Dashboard sea legible.
          const dateSuffix = new Date(newStart).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
          payload.name = `${payload.name} [${dateSuffix}]`;
        }

        // 4. Inserción
        const startDate = payload.startDate ? new Date(payload.startDate) : new Date(Date.now() - 30*24*60*60*1000);
        if (isNaN(startDate.getTime())) throw new Error("Invalid startDate");

        await CampaignRepository.create({
            projectId,
            name: payload.name,
            adsIntegrationId: payload.adsIntegrationId, 
            externalId: payload.externalId || `mock_${crypto.randomBytes(4).toString("hex")}`,
            budget: payload.budget || 1000,
            startDate,
            endDate: payload.endDate ? new Date(payload.endDate) : null,
            status: (payload.status as any) || "active",
        }, tx);
        });
    }


}
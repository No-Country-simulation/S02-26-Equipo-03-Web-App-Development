import { db } from "@/infrastructure/database";
import { CampaignRepository, type PagCampaignResponse } from "./campaign.repository";
import { ProjectService } from "@/modules/projects/project.service";

export class CampaignService {
  /**
   * Obtiene el reporte detallado con paginación.
   * Valida permisos de 'read' en el recurso 'campaign' antes de consultar.
   */
  static async getProjectCampaigns(userId: string, projectId: string, page: number = 1): Promise<PagCampaignResponse> {
    return db.transaction(async (tx) => {
      await ProjectService.assertPermission(userId, projectId, "campaign", "read", tx);
      const campaigns = await CampaignRepository.allByProjectId(projectId, tx, page);
      return campaigns;
    });
  }
}
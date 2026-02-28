import { db, DBConnection } from "@/infrastructure/database";
import { campaignsTable, Campaign, InsertCampaign, analyticsTable, integrationsTable } from "@/infrastructure/database/schemas/schema";
import { eq, and, sql } from "drizzle-orm";
import crypto from "crypto";

export interface CampaignReportDTO {
  id: string;
  name: string;
  platform: string | null;
  status: string;
  adSpend: number;
  revenue: number;
  roas: number;
  cpa: number;
  startDate: Date | null;
  endDate: Date | null;
}

export class CampaignRepository {
  static async create(data: Omit<InsertCampaign, "id">, db: DBConnection): Promise<Campaign> {
    const id = crypto.randomUUID();
    const [result] = await db
      .insert(campaignsTable)
      .values({
        ...data,
        id,
      } as InsertCampaign)
      .returning();

    if (!result) throw new Error("Failed to create campaign");
    return result;
  }

  static async findByName(projectId: string, name: string, db: DBConnection): Promise<Campaign | null> {
    const result = await db
      .select()
      .from(campaignsTable)
      .where(and(eq(campaignsTable.projectId, projectId), eq(campaignsTable.name, name)))
      .limit(1);

    return result[0] ?? null;
  }

  static async getAllByProjectId(projectId: string, db: DBConnection): Promise<CampaignReportDTO[]> {
    const result = await db
      .select({
        id: campaignsTable.id,
        name: campaignsTable.name,
        externalId: campaignsTable.externalId,
        platform: sql<string>`MAX(${integrationsTable.platform})`,
        projectId: campaignsTable.projectId,
        /**calculas el total "al vuelo" sumando los registros de la tabla analytics.
         * Siempre es el dato real y exacto de lo que ha pasado día por día.*/
        adSpend: sql<number>`CAST(COALESCE(SUM(${analyticsTable.adSpend}), 0) AS REAL)`,
        revenue: sql<number>`CAST(COALESCE(SUM(${analyticsTable.revenue}), 0) AS REAL)`,
        // ROAS = Revenue de stripe / ad spend (meta/google)
        roas: sql<number>`CASE WHEN SUM(${analyticsTable.adSpend}) > 0 
                       THEN ROUND(SUM(${analyticsTable.revenue}) / SUM(${analyticsTable.adSpend}), 2) 
                       ELSE 0 END`,
        // Calculamos el CPA (Gasto / Conversiones)
        cpa: sql<number>`CASE WHEN SUM(${analyticsTable.conversions}) > 0 
                         THEN ROUND(SUM(${analyticsTable.adSpend}) / SUM(${analyticsTable.conversions}), 2) 
                         ELSE 0 END`,
        startDate: campaignsTable.startDate,
        endDate: campaignsTable.endDate,
        status: campaignsTable.status,
      })
      .from(campaignsTable)
      .leftJoin(analyticsTable, eq(campaignsTable.id, analyticsTable.campaignId))
      .leftJoin(integrationsTable, eq(campaignsTable.adsIntegrationId, integrationsTable.id)) 
      .where(eq(campaignsTable.projectId, projectId))
      .groupBy(
        campaignsTable.id, 
        campaignsTable.name, 
        campaignsTable.status, 
        campaignsTable.startDate, 
        campaignsTable.endDate
      )
      .orderBy(sql`${campaignsTable.startDate} DESC`); // Ordenar por fecha de inicio
    return result as CampaignReportDTO[];
  }
}




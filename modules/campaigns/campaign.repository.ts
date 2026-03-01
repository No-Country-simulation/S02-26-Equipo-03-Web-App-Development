import { db, DBConnection } from "@/infrastructure/database";
import { campaignsTable, Campaign, InsertCampaign, analyticsTable, integrationsTable } from "@/infrastructure/database/schemas/schema";
import { eq, and, sql, SQL, desc } from "drizzle-orm";
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
};

export interface PagCampaignResponse {
  data: CampaignReportDTO[];
  totalCampaigns: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

export class CampaignRepository {
  private static readonly ROWS_PER_PAGE = 5;

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

  static async findByName(projectId: string, name: string, db: DBConnection, page: number = 1): Promise<PagCampaignResponse> {
    const nameFilter = sql`LOWER(${campaignsTable.name}) LIKE LOWER(${`%${name}%`})`;
    const [data, totalCampaigns] = await Promise.all([
      this.campaignBase(projectId, db, page, nameFilter),
      this.countCampaigns(projectId, db, nameFilter)
    ]);
    const totalPages = Math.ceil(totalCampaigns / this.ROWS_PER_PAGE);
    
    console.log(`currentPage: ${page}`)
    return { data, totalCampaigns, totalPages, currentPage: page, limit: this.ROWS_PER_PAGE };
  }

  static async allByProjectId(projectId: string, db: DBConnection, page: number = 1): Promise<PagCampaignResponse> {
    const [data, totalCampaigns] = await Promise.all ([
      this.campaignBase(projectId, db, page),
      this.countCampaigns(projectId, db)
    ]);

    const totalPages = Math.ceil(totalCampaigns / this.ROWS_PER_PAGE);
    
    return { data, totalCampaigns, totalPages, currentPage: page, limit: this.ROWS_PER_PAGE };
  }

  private static async campaignBase(projectId: string, db: DBConnection, page: number = 1, filters?: SQL){
    const conditions = [eq(campaignsTable.projectId, projectId)];
    if (filters) {
      conditions.push(filters);
    }

    return await db
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
      .where(and(...conditions))
      .groupBy(
        campaignsTable.id, 
        campaignsTable.name, 
        campaignsTable.status, 
        campaignsTable.startDate, 
        campaignsTable.endDate
      )
      .orderBy(desc(campaignsTable.startDate), desc(campaignsTable.id) )
      .limit(this.ROWS_PER_PAGE)
      .offset((page - 1) * this.ROWS_PER_PAGE);
  }

  private static async countCampaigns(projectId: string, db: DBConnection, filters?: SQL): Promise<number> {
    const conditions = [eq(campaignsTable.projectId, projectId)];
    if (filters) {
      conditions.push(filters);
    }

    const result = await db
      .select({ count: sql<number>`CAST(COUNT(${campaignsTable.id}) AS INTEGER)` })
      .from(campaignsTable)
      .where(and(...conditions));

    return result[0]?.count ?? 0;
  }
}




import { db, DBConnection } from "@/infrastructure/database";
import { campaignsTable, Campaign, InsertCampaign, analyticsTable, integrationsTable, ordersTable } from "@/infrastructure/database/schemas/schema";
import { eq, and, sql, SQL, desc } from "drizzle-orm";
import crypto from "crypto";
import { CampaignById, OrdersDTO, PagCampaignResponse } from "@/modules/campaigns/campaign.types";

export class CampaignRepository {
  private static readonly ROWS_PER_PAGE = 5;

  static async create(data: Omit<InsertCampaign, "id">): Promise<Campaign> {
    const id = crypto.randomUUID();
    const [result] = await db
      .insert(campaignsTable)
      .values({
        ...data,
        id,
      } as InsertCampaign)
      .returning();
    return result;
  }

  static async findByName(projectId: string, name: string, db: DBConnection, page: number = 1): Promise<PagCampaignResponse> {
    const nameFilter = sql`LOWER(${campaignsTable.name}) LIKE LOWER(${`%${name}%`})`;
    const [data, totalCampaigns] = await Promise.all([
      this.campaignBase(projectId, db, page, nameFilter),
      this.countRecords(projectId, campaignsTable, db, nameFilter)
    ]);
    const totalPages = Math.ceil(totalCampaigns / this.ROWS_PER_PAGE);
    
    return { data, totalCampaigns, totalPages, currentPage: page, limit: this.ROWS_PER_PAGE };
  }

  static async allByProjectId(projectId: string, db: DBConnection, page: number = 1): Promise<PagCampaignResponse> {
    const [data, totalCampaigns] = await Promise.all ([
      this.campaignBase(projectId, db, page),
      this.countRecords(projectId, campaignsTable, db)
    ]);

    const totalPages = Math.ceil(totalCampaigns / this.ROWS_PER_PAGE);
    
    return { data, totalCampaigns, totalPages, currentPage: page, limit: this.ROWS_PER_PAGE };
  }

  private static async campaignBase(projectId: string, db: DBConnection, page: number = 1, filters?: SQL, limit?: number){
    const conditions = [eq(campaignsTable.projectId, projectId)];
    if (filters) {
      conditions.push(filters);
    }
    const finalLimit = limit || this.ROWS_PER_PAGE;

    // 1. Subconsulta para Métricas de Ads (Gasto y Conversiones)
    const adsMetrics = db
      .select({
        campaignId: analyticsTable.campaignId,
        totalSpend: sql<number>`CAST(SUM(${analyticsTable.adSpend}) AS NUMERIC)`.mapWith(Number).as("totalSpend"),
        totalConversions: sql<number>`CAST(SUM(${analyticsTable.conversions}) AS NUMERIC)`.mapWith(Number).as("totalConversions"),
      })
      .from(analyticsTable)
      .groupBy(analyticsTable.campaignId)
      .as("adsMetrics");

    // 2. Subconsulta para Métricas de Stripe (Ingresos Reales)
    const stripeMetrics = db
      .select({
        campaignId: ordersTable.campaignId,
        totalRevenue: sql<number>`CAST(SUM(${ordersTable.totalAmount}) AS NUMERIC)`.mapWith(Number).as("totalRevenue"),
      })
      .from(ordersTable)
      .groupBy(ordersTable.campaignId)
      .as("stripeMetrics");

    return await db
      .select({
        id: campaignsTable.id,
        name: campaignsTable.name,
        externalId: campaignsTable.externalId,
        platform: sql<string>`MAX(${integrationsTable.platform})`,
        projectId: campaignsTable.projectId,
        adSpend: sql<number>`CAST(COALESCE(${adsMetrics.totalSpend}, 0) AS REAL)`.mapWith(Number),
        revenue: sql<number>`CAST(COALESCE(${stripeMetrics.totalRevenue}, 0) AS REAL)`.mapWith(Number),
        // ROAS = Revenue de stripe / ad spend (meta/google)
        roas: sql<number>`CASE WHEN (${adsMetrics.totalSpend}) > 0 
                       THEN ROUND(CAST(COALESCE(${stripeMetrics.totalRevenue}, 0) AS NUMERIC)/ CAST(COALESCE(${adsMetrics.totalSpend}, 0) AS NUMERIC), 2) 
                       ELSE 0 END`.mapWith(Number),
        // Calculamos el CPA (Gasto / Conversiones)
        cpa: sql<number>`CASE WHEN (${adsMetrics.totalConversions}) > 0 
                         THEN ROUND(CAST(COALESCE(${adsMetrics.totalSpend}, 0) AS NUMERIC)/ CAST(COALESCE(${adsMetrics.totalConversions}, 0) AS NUMERIC), 2) 
                         ELSE 0 END`.mapWith(Number),
        startDate: campaignsTable.startDate,
        endDate: campaignsTable.endDate,
        status: campaignsTable.status,
      })
      .from(campaignsTable)
      .leftJoin(stripeMetrics, eq(campaignsTable.id, stripeMetrics.campaignId))
      .leftJoin(adsMetrics, eq(campaignsTable.id, adsMetrics.campaignId))
      .leftJoin(integrationsTable, eq(campaignsTable.adsIntegrationId, integrationsTable.id)) 
      .where(and(...conditions))
      .groupBy(
        campaignsTable.id,
        sql`adsMetrics.totalSpend`,
        sql`adsMetrics.totalConversions`,
        sql`stripeMetrics.totalRevenue`
      )
      .orderBy(desc(campaignsTable.startDate), desc(campaignsTable.id) )
      .limit(finalLimit)
      .offset((page - 1) * finalLimit);
  }

  private static async countRecords(projectId: string, table: any, db: DBConnection, filters?: SQL): Promise<number> {
    const conditions = [eq(table.projectId, projectId)];
    if (filters) {
      conditions.push(filters);
    }

    const result = await db
      .select({ count: sql<number>`CAST(COUNT(${table.id}) AS INTEGER)` })
      .from(table)
      .where(and(...conditions));

    return result[0]?.count ?? 0;
  }

  static async findById(projectId: string, campaignId: string, db: DBConnection, page: number = 1): Promise<CampaignById> {
    const campaignFilter = and(eq(campaignsTable.id, campaignId), eq(campaignsTable.projectId, projectId));
    const ordenCondition = eq(ordersTable.campaignId, campaignId);
    
    // Desestructuramos data para obtener solo el primer elemento: [campaign]
    const [[campaign], ordersCampaign, totalOrders] = await Promise.all([
      this.campaignBase(projectId, db, page, campaignFilter, 1),
      this.allOrdersByCampaignId(campaignId, db, page),
      this.countRecords(projectId, ordersTable, db, ordenCondition)
    ]);
    const totalPages = Math.ceil(totalOrders / this.ROWS_PER_PAGE);
    
    return { 
      campaign: campaign || null, 
      ordersCampaign, 
      totalOrders, 
      totalPages, 
      currentPage: page, 
      limit: this.ROWS_PER_PAGE };
  }
  
  static async allOrdersByCampaignId(campaignId: string, db: DBConnection, page: number = 1): Promise<OrdersDTO[]> {
    const orders = await db
      .select({
        id: ordersTable.id,
        idOrden: ordersTable.stripeId,      
        clientName: ordersTable.customerName,   
        clientEmail: ordersTable.customerEmail,   
        serviceName: campaignsTable.name,       
        paymentType: ordersTable.paymentType,      
        sourceName: ordersTable.sourcePlatform,          
        totalAmount: ordersTable.totalAmount,         
        status: ordersTable.status,
        orderDate: ordersTable.orderDate,
        campaignId: ordersTable.campaignId,
        projectId: ordersTable.projectId,
      })
      .from(ordersTable)
      .leftJoin(campaignsTable, eq(ordersTable.campaignId, campaignsTable.id))
      .where(eq(ordersTable.campaignId, campaignId))
      .orderBy(desc(ordersTable.orderDate), desc(ordersTable.id))
      .limit(this.ROWS_PER_PAGE)
      .offset((page - 1) * this.ROWS_PER_PAGE);

    return orders.map(order => ({
      ...order,
      orderDate: order.orderDate ? order.orderDate.toISOString() : null
    }));
  }
}

export type { PagCampaignResponse, OrdersDTO };


import { db } from "@/infrastructure/database";
import { campaignsTable, Campaign, InsertCampaign } from "@/infrastructure/database/schemas/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export class CampaignRepository {
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

  static async findByName(projectId: string, name: string): Promise<Campaign | null> {
    const result = await db
      .select()
      .from(campaignsTable)
      .where(and(eq(campaignsTable.projectId, projectId), eq(campaignsTable.name, name)))
      .limit(1);

    return result[0] ?? null;
  }
}

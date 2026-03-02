import { db } from "@infrastructure/database";
import {
  campaignsTable,
  analyticsTable,
  integrationsTable,
  projectsTable,
} from "@infrastructure/database/schemas/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export class AdsSimulatorService {
  /**
   * Simulates Meta and Google Ads data for a given project.
   */
  static async simulateProjectAds(projectId: string) {
    console.log(` Simulating Ads data for project: ${projectId}`);

    // 0. Check if analytics already exist to avoid duplication
    const existingAnalytics = await db.query.analyticsTable.findFirst({
      where: (table, { eq }) => eq(table.projectId, projectId),
    });

    if (existingAnalytics) {
      console.log(
        `[Simulator] Project ${projectId} already has analytics data. Skipping simulation.`
      );
      return false;
    }

    // 1. Ensure integrations exist
    const platforms = [
      { name: "Meta Ads Simulator", platform: "meta", type: "ads" },
      { name: "Google Ads Simulator", platform: "google", type: "ads" },
    ];

    const integrationIds: Record<string, string> = {};

    for (const p of platforms) {
      let integration = await db.query.integrationsTable.findFirst({
        where: (table, { and, eq }) =>
          and(eq(table.projectId, projectId), eq(table.platform, p.platform)),
      });

      if (!integration) {
        const [newIntegration] = await db
          .insert(integrationsTable)
          .values({
            id: crypto.randomUUID(),
            projectId,
            name: p.name,
            platform: p.platform,
            type: "ads" as any,
            status: "connected",
            connectedAt: new Date(),
          })
          .returning();
        integrationIds[p.platform] = newIntegration.id;
      } else {
        integrationIds[p.platform] = integration.id;
      }
    }

    // 2. Create Campaigns
    const campaignTemplates = [
      { name: "black_friday", platform: "meta", budget: 2500, status: "active", externalId: "cmp_meta_bf_001" },
      { name: "meta_retargeting_v1", platform: "meta", budget: 1500, status: "active", externalId: "cmp_meta_ret_2026" },
      { name: "summer_sale", platform: "google", budget: 3000, status: "active", externalId: "cmp_goog_sum_001" },
    ];

    for (const temp of campaignTemplates) { 
      // Check if exists
      let campaign = await db.query.campaignsTable.findFirst({
        where: (table, { and, eq }) =>
          and(eq(table.projectId, projectId), eq(table.name, temp.name)),
      });

      let campaignId: string;

      if (!campaign) {
        const [newCampaign] = await db
          .insert(campaignsTable)
          .values({
            id: crypto.randomUUID(),
            projectId,
            adsIntegrationId: integrationIds[temp.platform],
            name: temp.name,
            budget: temp.budget,
            spent: Math.floor(Math.random() * temp.budget),
            status: temp.status as any,
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            externalId: temp.externalId,
          })
          .returning();
        campaignId = newCampaign.id;
      } else {
        campaignId = campaign.id;
      }

      // 3. Create Daily Analytics for the last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const periodEnd = new Date(date);
        periodEnd.setHours(23, 59, 59, 999);

        // Random metrics
        const impressions = 5000 + Math.floor(Math.random() * 5000);
        const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.05)); // 2% to 7% CTR
        const conversions = Math.floor(clicks * (0.01 + Math.random() * 0.03)); // 1% to 4% CVR
        const adSpend = 50 + Math.floor(Math.random() * 100);
        const revenue = conversions * (20 + Math.floor(Math.random() * 50));
        const roi = adSpend > 0 ? (revenue - adSpend) / adSpend : 0;

        await db.insert(analyticsTable).values({
          id: crypto.randomUUID(),
          projectId,
          campaignId,
          periodStart: date,
          periodEnd: periodEnd,
          impressions,
          clicks,
          conversions,
          adSpend,
          revenue,
          roi,
        });
      }
    }

    console.log(`✅ Simulation completed for project ${projectId}`);
    return true;
  }

  /**
   * Cleans simulation data for a project
   */
  static async cleanSimulation(projectId: string) {
    // This would delete simulation records if needed
    // For now, it's safer to just let the user know they can use db:clean
  }
}

import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  analyticsTable,
  projectsTable,
  usersTable,
  campaignsTable,
  type InsertAnalytics,
} from "./schemas/schema";

/**
 * Helper to get a date in the past
 */
function getPastDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

async function seed() {
  console.log("🌱 Seeding database...");

  await db.transaction(async (tx) => {
    // =========================
    // 1️⃣ USER
    // =========================

    const email = "demo@example.com";

    let user = await tx
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    let userId: string;

    if (user.length === 0) {
      const inserted = await tx
        .insert(usersTable)
        .values({
          id: crypto.randomUUID(),
          email,
          name: "Demo User",
        })
        .returning({ id: usersTable.id });

      userId = inserted[0].id;
    } else {
      userId = user[0].id;
    }

    // =========================
    // 2️⃣ PROJECT
    // =========================

    const projectName = "E-commerce Demo Project";

    let project = await tx
      .select({ id: projectsTable.id })
      .from(projectsTable)
      .where(eq(projectsTable.name, projectName))
      .limit(1);

    let projectId: string;

    if (project.length === 0) {
      const inserted = await tx
        .insert(projectsTable)
        .values({
          id: crypto.randomUUID(),
          ownerId: userId,
          name: projectName,
          status: "active",
        })
        .returning({ id: projectsTable.id });

      projectId = inserted[0].id;
    } else {
      projectId = project[0].id;
    }

    // =========================
    // 3️⃣ CAMPAIGN
    // =========================

    const campaignName = "Summer Sale 2026";

    let campaign = await tx
      .select({ id: campaignsTable.id })
      .from(campaignsTable)
      .where(eq(campaignsTable.name, campaignName))
      .limit(1);

    let campaignId: string;

    if (campaign.length === 0) {
      const inserted = await tx
        .insert(campaignsTable)
        .values({
          id: crypto.randomUUID(),
          projectId,
          name: campaignName,
          status: "active",
          budget: 5000,
          spent: 1200,
        })
        .returning({ id: campaignsTable.id });

      campaignId = inserted[0].id;
    } else {
      campaignId = campaign[0].id;
    }

    // =========================
    // 4️⃣ ANALYTICS (últimos 5 días)
    // =========================

    const analyticsRecords: InsertAnalytics[] = [
      {
        id: crypto.randomUUID(),
        projectId,
        campaignId,
        periodStart: getPastDate(5),
        periodEnd: getPastDate(4),
        impressions: 10000,
        clicks: 450,
        conversions: 22,
        revenue: 2200,
        adSpend: 300,
        roi: 6.33,
      },
      {
        id: crypto.randomUUID(),
        projectId,
        campaignId,
        periodStart: getPastDate(4),
        periodEnd: getPastDate(3),
        impressions: 12000,
        clicks: 520,
        conversions: 28,
        revenue: 2800,
        adSpend: 350,
        roi: 7.0,
      },
      {
        id: crypto.randomUUID(),
        projectId,
        campaignId,
        periodStart: getPastDate(3),
        periodEnd: getPastDate(2),
        impressions: 15000,
        clicks: 610,
        conversions: 35,
        revenue: 3500,
        adSpend: 400,
        roi: 7.75,
      },
      {
        id: crypto.randomUUID(),
        projectId,
        campaignId,
        periodStart: getPastDate(2),
        periodEnd: getPastDate(1),
        impressions: 11000,
        clicks: 480,
        conversions: 25,
        revenue: 2500,
        adSpend: 320,
        roi: 6.81,
      },
      {
        id: crypto.randomUUID(),
        projectId,
        campaignId,
        periodStart: getPastDate(1),
        periodEnd: new Date(),
        impressions: 14000,
        clicks: 580,
        conversions: 32,
        revenue: 3200,
        adSpend: 380,
        roi: 7.42,
      },
    ];

    await tx.insert(analyticsTable).values(analyticsRecords);
  });

  console.log("✅ Seeding completed!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

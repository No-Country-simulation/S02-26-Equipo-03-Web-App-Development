import { db } from './index';
import {
  analyticsTable,
  projectsTable,
  usersTable,
  campaignsTable,
} from './schemas/schema_total';

/**
 * Helper to get a date in the past
 * @param days Number of days ago
 * @returns Date object
 */
function getPastDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  // Reset time to start of day for cleaner data
  date.setHours(0, 0, 0, 0);
  return date;
}

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Create a demo user
  const [user] = await db
    .insert(usersTable)
    .values({
      email: 'demo@example.com',
      name: 'Demo User',
      passwordHash: 'dummy_hash',
    })
    .onConflictDoNothing()
    .returning({ id: usersTable.id });

  const userId = user?.id || 1;

  // 2. Create a demo project
  const [project] = await db.insert(projectsTable).values({
    ownerId: userId,
    name: 'E-commerce Demo Project',
    status: 'active',
  }).returning({ id: projectsTable.id });

  const projectId = project?.id || 1;

  // 3. Create a demo campaign
  const [campaign] = await db.insert(campaignsTable).values({
    projectId: projectId,
    name: 'Summer Sale 2026',
    status: 'active',
    budget: 5000,
    spent: 1200,
  }).returning({ id: campaignsTable.id });

  const campaignId = campaign?.id || 1;

  // 4. Insert 5 analytics records (last 5 days)
  const records = [
    {
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

  await db.insert(analyticsTable).values(records);

  console.log('✅ Seeding completed!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

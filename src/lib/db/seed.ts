import { db } from './index';
import {
  analyticsTable,
  projectsTable,
  usersTable,
  campaignsTable,
} from './schema';
import { createId } from '@paralleldrive/cuid2';

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Create a demo user if it doesn't exist
  const userId = createId();
  await db
    .insert(usersTable)
    .values({
      id: userId,
      email: 'demo@example.com',
      name: 'Demo User',
      passwordHash: 'dummy_hash',
    })
    .onConflictDoNothing();

  // 2. Create a demo project
  const projectId = createId();
  await db.insert(projectsTable).values({
    id: projectId,
    ownerId: userId,
    name: 'E-commerce Demo Project',
    status: 'active',
  });

  // 3. Create a demo campaign
  const campaignId = createId();
  await db.insert(campaignsTable).values({
    id: campaignId,
    projectId: projectId,
    name: 'Summer Sale 2026',
    status: 'active',
    budget: 5000,
    spent: 1200,
  });

  // 4. Insert 5 analytics records
  const now = new Date();
  const records = [
    {
      id: createId(),
      projectId,
      campaignId,
      periodStart: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      impressions: 10000,
      clicks: 450,
      conversions: 22,
      revenue: 2200,
      adSpend: 300,
      roi: 6.33,
    },
    {
      id: createId(),
      projectId,
      campaignId,
      periodStart: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      impressions: 12000,
      clicks: 520,
      conversions: 28,
      revenue: 2800,
      adSpend: 350,
      roi: 7.0,
    },
    {
      id: createId(),
      projectId,
      campaignId,
      periodStart: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      impressions: 15000,
      clicks: 610,
      conversions: 35,
      revenue: 3500,
      adSpend: 400,
      roi: 7.75,
    },
    {
      id: createId(),
      projectId,
      campaignId,
      periodStart: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      impressions: 11000,
      clicks: 480,
      conversions: 25,
      revenue: 2500,
      adSpend: 320,
      roi: 6.81,
    },
    {
      id: createId(),
      projectId,
      campaignId,
      periodStart: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      periodEnd: now,
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

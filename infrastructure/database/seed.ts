import { readFile } from "node:fs/promises";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import {
  accountsTable,
  alertsTable,
  analyticsSnapshotsTable,
  analyticsTable,
  attributionsTable,
  campaignsTable,
  consentRecordsTable,
  eventValidationsTable,
  eventsTable,
  healthHistoryTable,
  integrationsTable,
  ordersTable,
  permissionsTable,
  privacySettingsTable,
  projectApiKeysTable,
  projectMembersTable,
  projectsTable,
  rolePermissionsTable,
  rolesTable,
  sessionsTable,
  trackingHealthTable,
  transactionsTable,
  usageCostsTable,
  usersTable,
  verificationsTable,
} from "./schemas/schema";
import * as schema from "./schemas/schema";

const SNAPSHOT_PATH = "infrastructure/database/seed-data.json";
const LOCAL_DATABASE_URL = "file:./local.db";

type SeedPayload = Record<string, Record<string, unknown>[]>;
type SeedTableDef = { key: string; table: any };

const TABLES: SeedTableDef[] = [
  { key: "users", table: usersTable },
  { key: "verifications", table: verificationsTable },
  { key: "projects", table: projectsTable },
  { key: "permissions", table: permissionsTable },
  { key: "integrations", table: integrationsTable },
  { key: "roles", table: rolesTable },
  { key: "accounts", table: accountsTable },
  { key: "sessions", table: sessionsTable },
  { key: "campaigns", table: campaignsTable },
  { key: "events", table: eventsTable },
  { key: "eventValidations", table: eventValidationsTable },
  { key: "rolePermissions", table: rolePermissionsTable },
  { key: "projectApiKeys", table: projectApiKeysTable },
  { key: "projectMembers", table: projectMembersTable },
  { key: "transactions", table: transactionsTable },
  { key: "orders", table: ordersTable },
  { key: "analytics", table: analyticsTable },
  { key: "analyticsSnapshots", table: analyticsSnapshotsTable },
  { key: "attributions", table: attributionsTable },
  { key: "trackingHealth", table: trackingHealthTable },
  { key: "alerts", table: alertsTable },
  { key: "healthHistory", table: healthHistoryTable },
  { key: "usageCosts", table: usageCostsTable },
  { key: "privacySettings", table: privacySettingsTable },
  { key: "consentRecords", table: consentRecordsTable },
];

const TIMESTAMP_FIELD_PATTERN =
  /(createdAt|updatedAt|expiresAt|connectedAt|startDate|endDate|timestamp|receivedAt|validatedAt|attributedAt|transactionDate|orderDate|periodStart|periodEnd|snapshotDate|checkedAt|triggeredAt|resolvedAt|recordedAt|givenAt|revokedAt|joinedAt)$/i;

function chunkRows<T>(rows: T[], chunkSize = 100): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < rows.length; i += chunkSize) chunks.push(rows.slice(i, i + chunkSize));
  return chunks;
}

function normalizeSeedRow(row: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    normalized[key] = typeof value === "number" && TIMESTAMP_FIELD_PATTERN.test(key) ? new Date(value) : value;
  }
  return normalized;
}

async function seed() {
  const raw = await readFile(SNAPSHOT_PATH, "utf8");
  const payload = JSON.parse(raw) as SeedPayload;

  const localClient = createClient({ url: LOCAL_DATABASE_URL });
  const localDb = drizzle(localClient, { schema });

  console.log(`Aplicando seed fijo desde ${SNAPSHOT_PATH} en ${LOCAL_DATABASE_URL}...`);

  await localDb.transaction(async (tx) => {
    await tx.run(sql`PRAGMA foreign_keys = OFF`);
    for (const { table } of [...TABLES].reverse()) {
      await tx.delete(table);
    }
    await tx.run(sql`PRAGMA foreign_keys = ON`);

    for (const { key, table } of TABLES) {
      const rows = (payload[key] ?? []).map((row) => normalizeSeedRow(row));
      if (rows.length === 0) {
        console.log(`- ${key}: 0 filas (omitida)`);
        continue;
      }
      for (const rowsChunk of chunkRows(rows)) {
        await tx.insert(table).values(rowsChunk as any);
      }
      console.log(`- ${key}: ${rows.length} filas`);
    }
  });

  console.log("Seed completado.");
}

seed().catch((err) => {
  console.error("Seed falló:", err);
  process.exit(1);
});

import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@infrastructure/database/schemas/schema";

const databaseUrl = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set");
}

const isLocal = databaseUrl.startsWith("file:");

if (!isLocal && !authToken) {
  throw new Error("DATABASE_AUTH_TOKEN must be set for remote databases");
}

const client = createClient({
  url: databaseUrl,
  authToken: isLocal ? undefined : authToken,
});

export const db = drizzle(client, { schema });

export const dbType = isLocal ? "SQLite (Local)" : "Turso (Cloud)";

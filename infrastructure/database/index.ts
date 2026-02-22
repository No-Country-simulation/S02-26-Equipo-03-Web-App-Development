import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@infrastructure/database/schemas/schema";
import { LibSQLDatabase, LibSQLTransaction } from "drizzle-orm/libsql";
import { ExtractTablesWithRelations } from "drizzle-orm";

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

// Define the complete schema
type TSchema = typeof schema;

// Extract relationships
type TRelations = ExtractTablesWithRelations<TSchema>;

// Clean types for DB and Transaction
export type Database = LibSQLDatabase<TSchema>;

export type Transaction = LibSQLTransaction<TSchema, TRelations>;

// The unified type for repositories (this is necessary for transactions with drizzle due to type errors)
export type DBConnection = Database | Transaction;

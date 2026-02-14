import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

/**
 * Database Client Configuration
 *
 * Supports both local SQLite and Turso cloud database:
 * - Local: DATABASE_URL=file:./local.db (no authToken needed)
 * - Turso: DATABASE_URL=libsql://your-db.turso.io + DATABASE_AUTH_TOKEN
 */

const databaseUrl = process.env.TURSO_DB_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!databaseUrl || !authToken) {
  throw new Error('TURSO_DB_URL and DATABASE_AUTH_TOKEN environment variables must be set');
}

// Create Turso client
const client = createClient({
  url: databaseUrl,
  authToken: authToken,
});

// Create Drizzle instance
export const db = drizzle(client);

// Export database type for logging
export const dbType = 'Turso (Cloud)';

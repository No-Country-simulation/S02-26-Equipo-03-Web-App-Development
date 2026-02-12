import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

/**
 * Database Client Configuration
 *
 * Supports both local SQLite and Turso cloud database:
 * - Local: DATABASE_URL=file:./local.db (no authToken needed)
 * - Turso: DATABASE_URL=libsql://your-db.turso.io + DATABASE_AUTH_TOKEN
 */

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Determine if using Turso (remote) or local SQLite
const isLocalSQLite = databaseUrl.startsWith('file:');
const isTurso = databaseUrl.startsWith('libsql://');

// Create client based on database type
const client = createClient({
  url: databaseUrl,
  // Only include authToken for Turso connections
  ...(isTurso && process.env.DATABASE_AUTH_TOKEN
    ? { authToken: process.env.DATABASE_AUTH_TOKEN }
    : {}),
});

// Create Drizzle instance
export const db = drizzle(client);

// Export database type for logging
export const dbType = isLocalSQLite
  ? 'SQLite (Local)'
  : isTurso
    ? 'Turso (Cloud)'
    : 'Unknown';

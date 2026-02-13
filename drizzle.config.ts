import type { Config } from 'drizzle-kit';

const databaseUrl = process.env.TURSO_DB_URL || process.env.DATABASE_URL || 'file:./local.db';
const isTurso = !!process.env.TURSO_DB_URL || databaseUrl.startsWith('libsql://');

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: databaseUrl,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
} satisfies Config;

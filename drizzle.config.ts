import type { Config } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL || 'file:./local.db';
const isTurso = databaseUrl.startsWith('libsql://');

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'sqlite',
  dbCredentials: isTurso
    ? {
        // Turso configuration
        url: databaseUrl,
        authToken: process.env.DATABASE_AUTH_TOKEN!,
      }
    : {
        // Local SQLite configuration
        url: databaseUrl,
      },
} satisfies Config;

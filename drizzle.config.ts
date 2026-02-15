import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";
import "dotenv/config";

// Combinamos la lógica de fallback de tu rama con la estructura moderna
const databaseUrl = process.env.TURSO_DB_URL || process.env.DATABASE_URL || "file:./local.db";

export default defineConfig({
  // Mantenemos tus rutas locales ya que son las que están operativas
  schema: "./infrastructure/database/schemas/schema.ts",
  out: "./infrastructure/database/migrations",
  dialect: "turso",
  dbCredentials: {
    url: databaseUrl,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
}) satisfies Config;

import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  // Mantenemos tus rutas locales ya que son las que están operativas
  schema: "./infrastructure/database/schemas/schema.ts",
  out: "./infrastructure/database/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
}) satisfies Config;

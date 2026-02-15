import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/infrastructure/database/schemas/schema";
import { db } from "@/infrastructure/database/db";
import "dotenv/config";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.usersTable,
      session: schema.sessionsTable,
      account: schema.accountsTable,
      verification: schema.verificationsTable,
    },
  }),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_BASE_URL,

  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : [],
});

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@infrastructure/database/schemas/schema";
import { db } from "@infrastructure/database";
import { ProjectService } from "@/modules/projects/project.service";
import "dotenv/config";
import crypto from "crypto";

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

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_BASE_URL,

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : [],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const { project, apiKey } = await ProjectService.createProject(
              user.id,
              "Mi Primer Proyecto",
              "Proyecto inicial creado automáticamente"
            );

            console.log(`✅ Proyecto inicial creado para el usuario: ${user.email}`);
            console.log(`🔑 API Key inicial: ${apiKey}`);
          } catch (error) {
            console.error(`❌ Error creando proyecto inicial para ${user.email}:`, error);
          }
        },
      },
    },
  },
});

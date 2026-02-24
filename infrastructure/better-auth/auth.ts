import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@infrastructure/database/schemas/schema";
import { db } from "@infrastructure/database";
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
          const projectId = crypto.randomUUID();
          const roleId = crypto.randomUUID();

          // 1. Crear el proyecto genérico
          await db.insert(schema.projectsTable).values({
            id: projectId,
            name: "Mi Primer Proyecto",
            status: "active",
          });

          // 2. Crear el rol de Admin para este proyecto
          await db.insert(schema.rolesTable).values({
            id: roleId,
            projectId: projectId,
            name: "Admin",
            description: "Administrador total del proyecto",
          });

          // 3. Vincular al usuario con el proyecto y el rol
          await db.insert(schema.projectMembersTable).values({
            id: crypto.randomUUID(),
            projectId: projectId,
            userId: user.id,
            roleId: roleId,
          });

          // 4. Crear su primera API Key automáticamente (Hasheada)
          const rawApiKey = `pk_live_${crypto.randomUUID().replace(/-/g, "")}`;
          const keyHash = crypto.createHash("sha256").update(rawApiKey).digest("hex");

          await db.insert(schema.projectApiKeysTable).values({
            id: crypto.randomUUID(),
            projectId: projectId,
            keyHash: keyHash,
          });

          console.log(`Proyecto inicial creado para el usuario: ${user.email}`);
          console.log(`API Key inicial (guárdala): ${rawApiKey}`);
        },
      },
    },
  },
});

import { db } from "../../../infrastructure/database/index";
import {
  integrationsTable,
  projectApiKeysTable,
} from "../../../infrastructure/database/schemas/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

async function forceIntegration() {
  const rawKey = process.argv[2] || "pk_live_1f802e20a38946ccb876ab76c473ce83";
  console.log(`Buscando proyecto para la key: ${rawKey}...`);

  const hash = crypto.createHash("sha256").update(rawKey).digest("hex");
  const keyRecord = await db
    .select()
    .from(projectApiKeysTable)
    .where(eq(projectApiKeysTable.keyHash, hash))
    .limit(1);

  if (keyRecord.length === 0) {
    console.error("❌ No se encontró el registro de esa API Key en la base de datos.");
    process.exit(1);
  }

  const projectId = keyRecord[0].projectId;
  console.log(`✅ Proyecto encontrado: ${projectId}`);

  // Verificar si ya existe
  const existing = await db
    .select()
    .from(integrationsTable)
    .where(
      and(eq(integrationsTable.projectId, projectId), eq(integrationsTable.platform, "stripe"))
    )
    .limit(1);

  if (existing.length > 0) {
    console.log("ℹ️ La integración de Stripe ya existe para este proyecto.");
  } else {
    console.log("Creando integración de Stripe...");
    await db.insert(integrationsTable).values({
      id: crypto.randomUUID(),
      projectId: projectId,
      name: "Stripe Connection (Auto)",
      type: "payment",
      platform: "stripe",
      status: "connected",
      connectedAt: new Date(),
    });
    console.log("✅ Integración de Stripe creada exitosamente.");
  }
}

forceIntegration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error fatal:", err);
    process.exit(1);
  });

import { db } from "../../../infrastructure/database/index";
import { integrationsTable } from "../../../infrastructure/database/schemas/schema";

async function listIntegrations() {
  console.log("Listando Integraciones...");
  const integrations = await db.select().from(integrationsTable);
  console.log(JSON.stringify(integrations, null, 2));
}

listIntegrations().catch(console.error);

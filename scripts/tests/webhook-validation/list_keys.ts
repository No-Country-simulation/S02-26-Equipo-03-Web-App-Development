import { db } from "../../../infrastructure/database/index";
import { projectApiKeysTable } from "../../../infrastructure/database/schemas/schema";

async function listKeys() {
  console.log("Listando API Keys...");
  const keys = await db.select().from(projectApiKeysTable);
  console.log(JSON.stringify(keys, null, 2));
}

listKeys().catch(console.error);

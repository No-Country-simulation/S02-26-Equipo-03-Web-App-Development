import { db } from "../infrastructure/database/index";
import { rolesTable } from "../infrastructure/database/schemas/schema";

async function listRoles() {
  const allRoles = await db.select().from(rolesTable);
  console.log("Roles encontrados en la DB:");
  allRoles.forEach((r) => {
    console.log(`- ID: ${r.id}, Nombre: ${r.name}, Proyecto: ${r.projectId}`);
  });
}

listRoles().catch(console.error);

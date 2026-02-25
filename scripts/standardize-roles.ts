import { db } from "../infrastructure/database/index";
import { rolesTable } from "../infrastructure/database/schemas/schema";
import { eq, or } from "drizzle-orm";

async function standardizeRoleNames() {
  console.log("Iniciando estandarización de nombres de roles...");

  // Actualizamos todos los roles que se llamen 'Admin' (con cualquier capitalización) a 'owner'
  const result = await db
    .update(rolesTable)
    .set({ name: "owner" })
    .where(or(eq(rolesTable.name, "Admin"), eq(rolesTable.name, "admin")))
    .returning({
      updatedId: rolesTable.id,
      projectId: rolesTable.projectId,
      newName: rolesTable.name,
    });

  console.log(`✅ Roles estandarizados a 'owner': ${result.length}`);

  result.forEach((r) => {
    console.log(`   - Proyecto [${r.projectId}]: Role ID ${r.updatedId} -> ${r.newName}`);
  });

  console.log("Estandarización completada.");
}

standardizeRoleNames().catch(console.error);

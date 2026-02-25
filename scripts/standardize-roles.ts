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
    .returning();

  console.log(`✅ Se han actualizado ${result.length} roles de 'Admin' a 'owner'.`);

  if (result.length > 0) {
    result.forEach((r) => {
      console.log(`   - Proyecto: ${r.projectId} ahora tiene rol 'owner'`);
    });
  }

  console.log("Estandarización completada.");
}

standardizeRoleNames().catch(console.error);

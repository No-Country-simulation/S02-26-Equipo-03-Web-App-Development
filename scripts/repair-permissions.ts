import { db } from "../infrastructure/database/index";
import {
  rolesTable,
  rolePermissionsTable,
  permissionsTable,
} from "../infrastructure/database/schemas/schema";
import crypto from "crypto";

async function repairPermissions() {
  console.log("Iniciando reparación de permisos para roles de dueño...");

  const allPermissions = await db.select().from(permissionsTable);
  const allRoles = await db.select().from(rolesTable);

  // 1. Obtener todas las vinculaciones existentes para evitar consultas individuales en el loop
  const existingRelations = await db.select().from(rolePermissionsTable);

  // 2. Usar un Set para búsquedas O(1)
  const existingSet = new Set(existingRelations.map((rel) => `${rel.roleId}:${rel.permissionId}`));

  // Filtramos roles que deberían tener permisos totales (owner o admin)
  const targetRoles = allRoles.filter(
    (r) => r.name.toLowerCase() === "owner" || r.name.toLowerCase() === "admin"
  );

  const newRelations: (typeof rolePermissionsTable.$inferInsert)[] = [];

  for (const role of targetRoles) {
    for (const perm of allPermissions) {
      const key = `${role.id}:${perm.id}`;

      if (!existingSet.has(key)) {
        newRelations.push({
          id: crypto.randomUUID(),
          roleId: role.id,
          permissionId: perm.id,
        });
      }
    }
  }

  // 3. Insertar todo de una sola vez (Batch Insert)
  if (newRelations.length > 0) {
    console.log(`Insertando ${newRelations.length} nuevas vinculaciones de permisos...`);
    await db.insert(rolePermissionsTable).values(newRelations);
    console.log("✅ Vinculaciones creadas con éxito.");
  } else {
    console.log("ℹ️ No se encontraron permisos faltantes.");
  }

  console.log("Reparación completada.");
}

repairPermissions().catch(console.error);

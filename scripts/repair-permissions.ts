import { db } from "../infrastructure/database/index";
import {
  rolesTable,
  rolePermissionsTable,
  permissionsTable,
} from "../infrastructure/database/schemas/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

async function repairPermissions() {
  console.log("Iniciando reparación de permisos para roles de dueño...");

  const allPermissions = await db.select().from(permissionsTable);
  const allRoles = await db.select().from(rolesTable);

  // Filtramos roles que deberían tener permisos totales (owner o Admin)
  const targetRoles = allRoles.filter(
    (r) => r.name.toLowerCase() === "owner" || r.name.toLowerCase() === "admin"
  );

  for (const role of targetRoles) {
    console.log(`Revisando rol ${role.name} del proyecto ${role.projectId}...`);

    for (const perm of allPermissions) {
      const existing = await db.query.rolePermissionsTable.findFirst({
        where: (table, { and, eq }) =>
          and(eq(table.roleId, role.id), eq(table.permissionId, perm.id)),
      });

      if (!existing) {
        await db.insert(rolePermissionsTable).values({
          id: crypto.randomUUID(),
          roleId: role.id,
          permissionId: perm.id,
        });
        console.log(`  ✅ Vinculado: ${perm.resource}:${perm.action}`);
      }
    }
  }

  console.log("Reparación completada.");
}

repairPermissions().catch(console.error);

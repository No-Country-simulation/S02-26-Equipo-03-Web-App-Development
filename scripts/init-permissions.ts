import { db } from "../infrastructure/database/index";
import { permissionsTable } from "../infrastructure/database/schemas/schema";
import { standardPermissions } from "../modules/projects/roles/projectRole.constants";
import crypto from "crypto";

async function initPermissions() {
  console.log("Iniciando población de tabla de permisos...");

  for (const perm of standardPermissions) {
    const existing = await db.query.permissionsTable.findFirst({
      where: (table, { and, eq }) =>
        and(eq(table.resource, perm.resource), eq(table.action, perm.action)),
    });

    if (!existing) {
      await db.insert(permissionsTable).values({
        id: crypto.randomUUID(),
        ...perm,
      });
      console.log(`✅ Permiso creado: ${perm.resource}:${perm.action}`);
    } else {
      console.log(`ℹ️ Permiso ya existe: ${perm.resource}:${perm.action}`);
    }
  }

  console.log("Población completada.");
}

initPermissions().catch(console.error);

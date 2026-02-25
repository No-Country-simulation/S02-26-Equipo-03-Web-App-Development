import { db } from "../infrastructure/database/index";
import { permissionsTable } from "../infrastructure/database/schemas/schema";
import crypto from "crypto";

const standardPermissions = [
  { name: "Ver Proyecto", resource: "project", action: "read" },
  { name: "Editar Proyecto", resource: "project", action: "update" },
  { name: "Eliminar Proyecto", resource: "project", action: "delete" },
  { name: "Gestionar Roles", resource: "project_role", action: "manage" },
  { name: "Gestionar API Keys", resource: "api_key", action: "manage" },
  { name: "Invitar Miembros", resource: "project_member", action: "create" },
  { name: "Eliminar Miembros", resource: "project_member", action: "delete" },
];

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

import {
  permissionsTable,
  rolePermissionsTable,
  rolesTable,
} from "@/infrastructure/database/schemas/schema";
import { randomUUID } from "crypto";
import { DBConnection } from "@/infrastructure/database";
import { and, eq, inArray } from "drizzle-orm";

export class ProjectRoleRepository {
  static async createRole(
    projectId: string,
    name: string,
    description: string | null,
    database: DBConnection
  ) {
    const id = randomUUID();

    await database.insert(rolesTable).values({
      id,
      projectId,
      name,
      description,
    });

    return { id };
  }

  static async assignAllPermissions(roleId: string, database: DBConnection) {
    const permissions = await database.select({ id: permissionsTable.id }).from(permissionsTable);

    if (permissions.length === 0) return;

    await database.insert(rolePermissionsTable).values(
      permissions.map((permission) => ({
        id: randomUUID(),
        roleId,
        permissionId: permission.id,
      }))
    );
  }

  static async findById(roleId: string, database: DBConnection) {
    const result = await database
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, roleId))
      .limit(1);

    return result[0] ?? null;
  }

  static async assignPermissions(roleId: string, permissionIds: string[], database: DBConnection) {
    if (permissionIds.length === 0) return;

    await database.insert(rolePermissionsTable).values(
      permissionIds.map((permissionId) => ({
        id: randomUUID(),
        roleId,
        permissionId,
      }))
    );
  }

  static async delete(roleId: string, database: DBConnection) {
    await database.delete(rolesTable).where(eq(rolesTable.id, roleId));
  }

  static async removePermissions(roleId: string, permissionIds: string[], database: DBConnection) {
    if (permissionIds.length === 0) return;

    await database
      .delete(rolePermissionsTable)
      .where(
        and(
          eq(rolePermissionsTable.roleId, roleId),
          inArray(rolePermissionsTable.permissionId, permissionIds)
        )
      );
  }

  static async filterExistingPermissions(permissionIds: string[], database: DBConnection) {
    if (permissionIds.length === 0) return [];

    const result = await database
      .select({ id: permissionsTable.id })
      .from(permissionsTable)
      .where(inArray(permissionsTable.id, permissionIds));

    return result.map((p) => p.id);
  }
}

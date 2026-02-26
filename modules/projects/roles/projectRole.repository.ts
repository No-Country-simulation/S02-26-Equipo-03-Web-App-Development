import {
  permissionsTable,
  projectMembersTable,
  rolePermissionsTable,
  rolesTable,
} from "@/infrastructure/database/schemas/schema";
import { randomUUID } from "crypto";
import { DBConnection } from "@/infrastructure/database";
import { and, eq, inArray } from "drizzle-orm";
import { standardPermissions } from "./projectRole.constants";

export class ProjectRoleRepository {
  static async getUserPermissions(projectId: string, userId: string, database: DBConnection) {
    const result = await database
      .select({
        permissionId: permissionsTable.id,
        resource: permissionsTable.resource,
        action: permissionsTable.action,
      })
      .from(projectMembersTable)
      .innerJoin(
        rolesTable,
        and(eq(projectMembersTable.roleId, rolesTable.id), eq(rolesTable.projectId, projectId))
      )
      .innerJoin(rolePermissionsTable, eq(rolePermissionsTable.roleId, rolesTable.id))
      .innerJoin(permissionsTable, eq(permissionsTable.id, rolePermissionsTable.permissionId))
      .where(
        and(eq(projectMembersTable.projectId, projectId), eq(projectMembersTable.userId, userId))
      );

    return result;
  }

  static async listRoles(projectId: string, database: DBConnection) {
    return database
      .select({
        roleId: rolesTable.id,
        name: rolesTable.name,
        description: rolesTable.description,
      })
      .from(rolesTable)
      .where(eq(rolesTable.projectId, projectId));
  }

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

  static async ensureStandardPermissions(database: DBConnection) {
    for (const p of standardPermissions) {
      await database
        .insert(permissionsTable)
        .values({
          id: randomUUID(),
          ...p,
        })
        .onConflictDoNothing();
    }

    const permissions = await database.select({ id: permissionsTable.id }).from(permissionsTable);

    return permissions;
  }

  static async assignAllPermissions(roleId: string, database: DBConnection) {
    let permissions = await database.select({ id: permissionsTable.id }).from(permissionsTable);

    if (permissions.length === 0) {
      permissions = await this.ensureStandardPermissions(database);
    }

    if (permissions.length === 0) return;

    await database
      .insert(rolePermissionsTable)
      .values(
        permissions.map((permission) => ({
          id: randomUUID(),
          roleId,
          permissionId: permission.id,
        }))
      )
      .onConflictDoNothing();
  }

  static async findByIdAndProject(roleId: string, projectId: string, database: DBConnection) {
    const result = await database
      .select()
      .from(rolesTable)
      .where(and(eq(rolesTable.id, roleId), eq(rolesTable.projectId, projectId)))
      .limit(1);

    return result[0] ?? null;
  }

  static async assignPermissions(
    roleId: string,
    projectId: string,
    permissionIds: string[],
    database: DBConnection
  ) {
    if (permissionIds.length === 0) return;

    // 1️. Verify that the role belongs to the project
    const role = await this.findByIdAndProject(roleId, projectId, database);
    if (!role) throw new Error("InvalidRole");

    // 2️. Filter existing permissions
    const validPermissions = await this.filterExistingPermissions(permissionIds, database);

    if (validPermissions.length === 0) {
      throw new Error("NoValidPermissions");
    }

    // 3️. Insert without duplication
    await database
      .insert(rolePermissionsTable)
      .values(
        validPermissions.map((permissionId) => ({
          id: randomUUID(),
          roleId,
          permissionId,
        }))
      )
      .onConflictDoNothing();
  }

  static async delete(roleId: string, projectId: string, database: DBConnection) {
    const role = await this.findByIdAndProject(roleId, projectId, database);
    if (!role) throw new Error("InvalidRole");

    // Check if it is in use
    const membersUsingRole = await database
      .select({ id: projectMembersTable.id })
      .from(projectMembersTable)
      .where(eq(projectMembersTable.roleId, roleId))
      .limit(1);

    if (membersUsingRole.length > 0) {
      throw new Error("RoleInUse");
    }

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
    const result = await database
      .select({ id: permissionsTable.id })
      .from(permissionsTable)
      .where(inArray(permissionsTable.id, permissionIds));

    return result.map((p) => p.id);
  }
}

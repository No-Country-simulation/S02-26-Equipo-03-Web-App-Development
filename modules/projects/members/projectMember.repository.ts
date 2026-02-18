import {
  permissionsTable,
  projectMembersTable,
  rolePermissionsTable,
  rolesTable,
} from "@/infrastructure/database/schemas/schema";
import { eq, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { DBConnection } from "@/infrastructure/database";

export class ProjectMemberRepository {
  static async insert(projectId: string, userId: string, roleId: string, database: DBConnection) {
    await database.insert(projectMembersTable).values({
      id: randomUUID(),
      projectId,
      userId,
      roleId,
    });
  }

  static async findByUser(projectId: string, userId: string, database: DBConnection) {
    const result = await database
      .select()
      .from(projectMembersTable)
      .where(
        and(eq(projectMembersTable.projectId, projectId), eq(projectMembersTable.userId, userId))
      )
      .limit(1);

    return result[0] ?? null;
  }

  static async getUserPermissions(projectId: string, userId: string, database: DBConnection) {
    return database
      .select({
        resource: permissionsTable.resource,
        action: permissionsTable.action,
      })
      .from(projectMembersTable)
      .innerJoin(rolesTable, eq(projectMembersTable.roleId, rolesTable.id))
      .innerJoin(rolePermissionsTable, eq(rolesTable.id, rolePermissionsTable.roleId))
      .innerJoin(permissionsTable, eq(rolePermissionsTable.permissionId, permissionsTable.id))
      .where(
        and(eq(projectMembersTable.projectId, projectId), eq(projectMembersTable.userId, userId))
      );
  }

  static async countByRole(roleId: string, database: DBConnection) {
    const result = await database
      .select({ count: sql<number>`count(*)` })
      .from(projectMembersTable)
      .where(eq(projectMembersTable.roleId, roleId));

    return result[0]?.count ?? 0;
  }
}

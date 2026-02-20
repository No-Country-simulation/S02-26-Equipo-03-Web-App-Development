import {
  permissionsTable,
  projectMembersTable,
  rolePermissionsTable,
  rolesTable,
  usersTable,
} from "@/infrastructure/database/schemas/schema";
import { eq, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { DBConnection } from "@/infrastructure/database";

export class ProjectMemberRepository {
  static async addMember(
    projectId: string,
    userId: string,
    roleId: string,
    database: DBConnection
  ) {
    const id = randomUUID();

    await database.insert(projectMembersTable).values({
      id,
      projectId,
      userId,
      roleId,
      joinedAt: new Date(),
    });

    return {
      id,
      projectId,
      userId,
      roleId,
    };
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

  static async isMember(
    projectId: string,
    userId: string,
    database: DBConnection
  ): Promise<boolean> {
    const result = await database
      .select({ id: projectMembersTable.id })
      .from(projectMembersTable)
      .where(
        and(eq(projectMembersTable.projectId, projectId), eq(projectMembersTable.userId, userId))
      )
      .limit(1);

    return result.length > 0;
  }

  static async listMembers(projectId: string, database: DBConnection) {
    return database
      .select({
        userId: usersTable.id,
        email: usersTable.email,
        roleId: projectMembersTable.roleId,
        joinedAt: projectMembersTable.joinedAt,
      })
      .from(projectMembersTable)
      .innerJoin(usersTable, eq(usersTable.id, projectMembersTable.userId))
      .where(eq(projectMembersTable.projectId, projectId));
  }

  static async removeMember(projectId: string, userId: string, database: DBConnection) {
    await database
      .delete(projectMembersTable)
      .where(
        and(eq(projectMembersTable.projectId, projectId), eq(projectMembersTable.userId, userId))
      );
  }
}

import { rolePermissionsTable } from "@/infrastructure/database/schemas/schema";
import { ProjectMemberRepository } from "../members/projectMember.repository";
import { ProjectRoleRepository } from "./projectRole.repository";
import { db, DBConnection } from "@/infrastructure/database";
import { and, eq, inArray } from "drizzle-orm";

export class ProjectRoleService {
  static async createRole(
    actorId: string,
    projectId: string,
    name: string,
    description: string | null
  ) {
    return db.transaction(async (tx) => {
      await this.assertCanManageRoles(actorId, projectId, tx);

      const role = await ProjectRoleRepository.createRole(projectId, name, description, tx);

      return role;
    });
  }

  static async assignPermissions(
    actorId: string,
    projectId: string,
    roleId: string,
    permissionIds: string[]
  ) {
    return db.transaction(async (tx) => {
      await this.assertCanManageRoles(actorId, projectId, tx);

      const role = await ProjectRoleRepository.findById(roleId, tx);

      if (!role || role.projectId !== projectId) {
        throw new Error("Role not found in project");
      }

      await ProjectRoleRepository.assignPermissions(roleId, permissionIds, tx);
    });
  }

  static async deleteRole(actorId: string, projectId: string, roleId: string) {
    return db.transaction(async (tx) => {
      await this.assertCanManageRoles(actorId, projectId, tx);

      const role = await ProjectRoleRepository.findById(roleId, tx);

      if (!role) {
        throw new Error("Role not found");
      }

      if (role.name === "owner") {
        throw new Error("Cannot delete owner role");
      }

      const membersUsingRole = await ProjectMemberRepository.countByRole(roleId, tx);

      if (membersUsingRole > 0) {
        throw new Error("Role is assigned to members");
      }

      await ProjectRoleRepository.delete(roleId, tx);
    });
  }

  private static async assertCanManageRoles(actorId: string, projectId: string, tx: DBConnection) {
    const permissions = await ProjectMemberRepository.getUserPermissions(projectId, actorId, tx);

    const canManage = permissions.some((p) => p.resource === "roles" && p.action === "manage");

    if (!canManage) {
      throw new Error("Not allowed to manage roles");
    }
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
}

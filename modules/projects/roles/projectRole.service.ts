import { ProjectMemberRepository } from "../members/projectMember.repository";
import { ProjectRoleRepository } from "./projectRole.repository";
import { db, DBConnection } from "@/infrastructure/database";

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

      const role = await this.getRoleOrThrow(roleId, projectId, tx);

      if (role.name === "owner") {
        throw new Error("Cannot modify owner role permissions");
      }

      // validate permissions exist
      const validPermissions = await ProjectRoleRepository.filterExistingPermissions(
        permissionIds,
        tx
      );

      if (validPermissions.length !== permissionIds.length) {
        throw new Error("Invalid permission ids");
      }

      await ProjectRoleRepository.assignPermissions(roleId, validPermissions, tx);
    });
  }

  static async removePermissions(
    actorId: string,
    projectId: string,
    roleId: string,
    permissionIds: string[]
  ) {
    return db.transaction(async (tx) => {
      await this.assertCanManageRoles(actorId, projectId, tx);

      const role = await this.getRoleOrThrow(roleId, projectId, tx);

      if (role.name === "owner") {
        throw new Error("Cannot modify owner role permissions");
      }

      await ProjectRoleRepository.removePermissions(roleId, permissionIds, tx);
    });
  }

  static async deleteRole(actorId: string, projectId: string, roleId: string) {
    return db.transaction(async (tx) => {
      await this.assertCanManageRoles(actorId, projectId, tx);

      const role = await this.getRoleOrThrow(roleId, projectId, tx);

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

  private static async getRoleOrThrow(roleId: string, projectId: string, tx: DBConnection) {
    const role = await ProjectRoleRepository.findById(roleId, tx);

    if (!role || role.projectId !== projectId) {
      throw new Error("Role not found in project");
    }

    return role;
  }

  private static async assertCanManageRoles(actorId: string, projectId: string, tx: DBConnection) {
    const permissions = await ProjectMemberRepository.getUserPermissions(projectId, actorId, tx);

    const canManage = permissions.some(
      (p) => p.resource === "project_role" && p.action === "manage"
    );

    if (!canManage) {
      throw new Error("Not allowed to manage roles");
    }
  }
}

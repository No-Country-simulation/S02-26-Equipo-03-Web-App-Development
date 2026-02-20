import { ProjectRoleRepository } from "../roles/projectRole.repository";
import { ProjectMemberRepository } from "./projectMember.repository";
import { UserRepository } from "@/modules/users/user.repository";
import { db, DBConnection } from "@/infrastructure/database";

export class ProjectMemberService {
  static async addMember(actorId: string, projectId: string, targetUserId: string, roleId: string) {
    return db.transaction(async (tx) => {
      // 1️. Validate actor permissions
      await this.assertCanManageMembers(actorId, projectId, tx);

      // 2️. Verify that the target user exists
      // UserRepository doesn't exist yet
      const targetUser = await UserRepository.findById(targetUserId, tx);
      if (!targetUser) {
        throw new Error("User not found");
      }

      // 3️. Verify that it is not already in the project
      const existingMember = await ProjectMemberRepository.findByUser(projectId, targetUserId, tx);

      if (existingMember) {
        throw new Error("User already a member of this project");
      }

      // 4️. Verify that the role belongs to the project
      const role = await ProjectRoleRepository.findById(roleId, tx);

      if (!role || role.projectId !== projectId) {
        throw new Error("Invalid role for this project");
      }

      // 5️. Insert member
      await ProjectMemberRepository.insert(projectId, targetUserId, roleId, tx);
    });
  }

  // Helper function
  private static async assertCanManageMembers(
    actorId: string,
    projectId: string,
    tx: DBConnection
  ) {
    const permissions = await ProjectMemberRepository.getUserPermissions(projectId, actorId, tx);

    const canManage = permissions.some(
      (p) => p.resource === "project_members" && p.action === "manage"
    );

    if (!canManage) {
      throw new Error("Not allowed to manage members");
    }
  }
}

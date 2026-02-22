import { ProjectMemberRepository } from "./projectMember.repository";
import { db } from "@/infrastructure/database";

export class ProjectMemberService {
  static async addMember(actorId: string, projectId: string, targetUserId: string, roleId: string) {
    return db.transaction(async (tx) => {
      const permissions = await ProjectMemberRepository.getUserPermissions(projectId, actorId, tx);

      const canManage = permissions.some(
        (p) => p.resource === "project_member" && p.action === "create"
      );

      if (!canManage) {
        throw new Error("Forbidden");
      }

      const exists = await ProjectMemberRepository.isMember(projectId, targetUserId, tx);

      if (exists) {
        throw new Error("User already member");
      }

      return ProjectMemberRepository.addMember(projectId, targetUserId, roleId, tx);
    });
  }

  static async listMembers(actorId: string, projectId: string) {
    return db.transaction(async (tx) => {
      const isMember = await ProjectMemberRepository.isMember(projectId, actorId, tx);

      if (!isMember) {
        throw new Error("Forbidden");
      }

      return ProjectMemberRepository.listMembers(projectId, tx);
    });
  }

  static async removeMember(actorId: string, projectId: string, targetUserId: string) {
    return db.transaction(async (tx) => {
      const permissions = await ProjectMemberRepository.getUserPermissions(projectId, actorId, tx);

      const canDelete = permissions.some(
        (p) => p.resource === "project_member" && p.action === "delete"
      );

      if (!canDelete) {
        throw new Error("Forbidden");
      }

      const exists = await ProjectMemberRepository.isMember(projectId, targetUserId, tx);

      if (!exists) {
        throw new Error("User is not a member");
      }

      await ProjectMemberRepository.removeMember(projectId, targetUserId, tx);
    });
  }

}

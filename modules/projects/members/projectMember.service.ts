import { UserRepository } from "@/modules/users/user.repository";
import { ProjectRepository } from "../project.repository";
import { ProjectMemberRepository } from "./projectMember.repository";
import { ProjectRoleRepository } from "../roles/projectRole.repository";
import { db } from "@/infrastructure/database";
import { ProjectService } from "../project.service";

export class ProjectMemberService {
  static async addMember(actorId: string, projectId: string, targetUserId: string, roleId: string) {
    return db.transaction(async (tx) => {
      // 1️. Authorization
      await ProjectService.assertPermission(actorId, projectId, "project_member", "create", tx);

      // 2️. Project validation
      const project = await ProjectRepository.findById(projectId, tx);
      if (!project) throw new Error("ProjectNotFound");
      if (project.status === "archived") throw new Error("ProjectArchived");

      // 3️. Target user validation
      const user = await UserRepository.findById(targetUserId, tx);
      if (!user) throw new Error("TargetUserNotFound");

      // 4️. Role validation
      const role = await ProjectRoleRepository.findByIdAndProject(roleId, projectId, tx);
      if (!role) throw new Error("InvalidRole");

      // 5️. Membership validation
      const exists = await ProjectMemberRepository.isMember(projectId, targetUserId, tx);
      if (exists) throw new Error("AlreadyMember");

      // 6️. Persist
      return ProjectMemberRepository.addMember(projectId, targetUserId, roleId, tx);
    });
  }

  static async listMembers(actorId: string, projectId: string) {
    return db.transaction(async (tx) => {
      // 1. Authorization
      await ProjectService.assertPermission(actorId, projectId, "project", "read", tx);

      return ProjectMemberRepository.listMembers(projectId, tx);
    });
  }

  static async removeMember(actorId: string, projectId: string, targetUserId: string) {
    return db.transaction(async (tx) => {
      await ProjectService.assertPermission(actorId, projectId, "project_member", "delete", tx);

      const exists = await ProjectMemberRepository.isMember(projectId, targetUserId, tx);

      if (!exists) throw new Error("MemberNotFound");

      await ProjectMemberRepository.removeMember(projectId, targetUserId, tx);

      return { success: true };
    });
  }
}

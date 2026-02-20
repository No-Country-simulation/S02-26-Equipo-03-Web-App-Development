import { db } from "@/infrastructure/database";
import { ProjectRepository } from "./project.repository";
import { ProjectMemberRepository } from "@/modules/projects/members/projectMember.repository";
import { ProjectRoleRepository } from "@/modules/projects/roles/projectRole.repository";
import { ProjectApiKeyRepository } from "@/modules/projects/apiKeys/projectApiKey.repository";
import crypto from "crypto";

export class ProjectService {
  static async getUserProjects(userId: string) {
    return ProjectRepository.findByUser(userId, db);
  }

  static async getProject(userId: string, projectId: string) {
    return db.transaction(async (tx) => {
      const isMember = await ProjectMemberRepository.isMember(projectId, userId, tx);

      if (!isMember) {
        throw new Error("Forbidden");
      }

      return ProjectRepository.findById(projectId, tx);
    });
  }

  static async createProject(userId: string, name: string, description?: string) {
    return db.transaction(async (tx) => {
      // Create project
      const project = await ProjectRepository.create({ name, description }, tx);

      // Create owner role for the project
      const ownerRole = await ProjectRoleRepository.createRole(
        project.id,
        "owner",
        "Project owner",
        tx
      );

      // Assign all permissions to owner role
      await ProjectRoleRepository.assignAllPermissions(ownerRole.id, tx);

      // Create relation between project, owner role and user
      await ProjectMemberRepository.addMember(project.id, userId, ownerRole.id, tx);

      // Create API key
      const apiKey = crypto.randomBytes(32).toString("hex");
      const hash = crypto.createHash("sha256").update(apiKey).digest("hex");

      await ProjectApiKeyRepository.create(project.id, hash, tx);

      return {
        project,
        apiKey,
      };
    });
  }

  static async updateProject(
    userId: string,
    projectId: string,
    data: { name?: string; description?: string }
  ) {
    return db.transaction(async (tx) => {
      const permissions = await ProjectMemberRepository.getUserPermissions(projectId, userId, tx);

      const canUpdate = permissions.some((p) => p.resource === "project" && p.action === "update");

      if (!canUpdate) {
        throw new Error("Forbidden");
      }

      const updated = await ProjectRepository.update(projectId, data, tx);

      if (!updated) {
        throw new Error("Project not found");
      }

      return updated;
    });
  }

  static async archiveProject(userId: string, projectId: string) {
    return db.transaction(async (tx) => {
      const permissions = await ProjectMemberRepository.getUserPermissions(projectId, userId, tx);

      const canDelete = permissions.some((p) => p.resource === "project" && p.action === "delete");

      if (!canDelete) {
        throw new Error("Forbidden");
      }

      await ProjectRepository.archive(projectId, tx);
    });
  }
}

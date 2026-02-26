import { DBConnection, db } from "@/infrastructure/database";
import { ProjectRepository } from "./project.repository";
import { ProjectMemberRepository } from "@/modules/projects/members/projectMember.repository";
import { ProjectRoleRepository } from "@/modules/projects/roles/projectRole.repository";
import { ProjectApiKeyRepository } from "@/modules/projects/apiKeys/projectApiKey.repository";
import { AdsSimulatorService } from "@/infrastructure/services/AdsSimulatorService";
import crypto from "crypto";

export class ProjectService {
  static async assertPermission(
    userId: string,
    projectId: string,
    resource: string,
    action: string,
    db: DBConnection
  ) {
    const permissions = await ProjectRoleRepository.getUserPermissions(projectId, userId, db);

    const allowed = permissions.some((p) => p.resource === resource && p.action === action);

    if (!allowed) {
      throw new Error("Forbidden");
    }
  }

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
    const result = await db.transaction(async (tx) => {
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

    // Auto-Simulate Ads data for development (Outside transaction)
    try {
      await AdsSimulatorService.simulateProjectAds(result.project.id);
      console.log(`[Auto-Simulate] Mock data generated for project: ${result.project.id}`);
    } catch (e) {
      console.error(`[Auto-Simulate] Failed for project ${result.project.id}:`, e);
    }

    return result;
  }

  static async updateProject(
    userId: string,
    projectId: string,
    data: { name?: string; description?: string }
  ) {
    return db.transaction(async (tx) => {
      // 1. Authorization
      await ProjectService.assertPermission(userId, projectId, "project", "update", tx);

      const updated = await ProjectRepository.update(projectId, data, tx);

      if (!updated) {
        throw new Error("Project not found");
      }

      return updated;
    });
  }

  static async archiveProject(userId: string, projectId: string) {
    return db.transaction(async (tx) => {
      // 1. Authorization
      await ProjectService.assertPermission(userId, projectId, "project", "delete", tx);
      const permissions = await ProjectRoleRepository.getUserPermissions(projectId, userId, tx);

      const canDelete = permissions.some((p) => p.resource === "project" && p.action === "delete");

      if (!canDelete) {
        throw new Error("Forbidden");
      }

      const archivedProject = await ProjectRepository.archive(projectId, tx);

      if (!archivedProject) {
        throw new Error("AlreadyArchivedOrNotFound");
      }

      return archivedProject;
    });
  }
}

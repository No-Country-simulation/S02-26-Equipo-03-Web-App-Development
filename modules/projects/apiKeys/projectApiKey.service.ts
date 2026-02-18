import { db, DBConnection } from "@/infrastructure/database";
import { ProjectMemberRepository } from "../members/projectMember.repository";
import { ProjectApiKeyRepository } from "./projectApiKey.repository";

export class ProjectApiKeyService {
  static async rotateApiKey(userId: string, projectId: string) {
    return db.transaction(async (tx) => {
      const permissions = await ProjectMemberRepository.getUserPermissions(projectId, userId, tx);

      const canManage = permissions.some((p) => p.resource === "api_key" && p.action === "manage");

      if (!canManage) {
        throw new Error("Not allowed to rotate API key");
      }

      return ProjectApiKeyRepository.rotate(projectId, tx);
    });
  }

  static async revokeApiKey(userId: string, projectId: string, keyId: string) {
    return db.transaction(async (tx) => {
      await this.assertCanManage(userId, projectId, tx);

      const revoked = await ProjectApiKeyRepository.revoke(keyId, tx);

      if (!revoked) {
        throw new Error("API key not found");
      }
    });
  }

  static async listApiKeys(userId: string, projectId: string) {
    return db.transaction(async (tx) => {
      await this.assertCanManage(userId, projectId, tx);

      return ProjectApiKeyRepository.findByProject(projectId, tx);
    });
  }

  private static async assertCanManage(userId: string, projectId: string, tx: DBConnection) {
    const permissions = await ProjectMemberRepository.getUserPermissions(projectId, userId, tx);

    const canManage = permissions.some((p) => p.resource === "api_key" && p.action === "manage");

    if (!canManage) {
      throw new Error("Not allowed to manage API keys");
    }
  }
}

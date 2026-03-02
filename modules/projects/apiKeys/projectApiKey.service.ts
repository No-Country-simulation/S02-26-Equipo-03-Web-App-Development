import { db, DBConnection } from "@/infrastructure/database";
import { ProjectApiKeyRepository } from "./projectApiKey.repository";
import { ProjectRoleRepository } from "../roles/projectRole.repository";
import crypto from "crypto";

export class ProjectApiKeyService {
  static async rotateApiKey(userId: string, projectId: string) {
    return db.transaction(async (tx) => {
      await this.assertCanManage(userId, projectId, tx);

      // revoke previous
      await ProjectApiKeyRepository.revokeAllForProject(projectId, tx);

      // generate key
      const apiKey = crypto.randomBytes(32).toString("hex");
      const hash = crypto.createHash("sha256").update(apiKey).digest("hex");

      // store hash
      await ProjectApiKeyRepository.create(projectId, hash, tx);

      // return plain key
      return apiKey;
    });
  }

  static async listApiKeys(userId: string, projectId: string) {
    return db.transaction(async (tx) => {
      await this.assertCanManage(userId, projectId, tx);

      return ProjectApiKeyRepository.findByProject(projectId, tx);
    });
  }

  static async revokeApiKey(userId: string, projectId: string, keyId: string) {
    return db.transaction(async (tx) => {
      await this.assertCanManage(userId, projectId, tx);

      const revoked = await ProjectApiKeyRepository.revoke(projectId, keyId, tx);

      if (!revoked) {
        throw new Error("API key not found");
      }
    });
  }

  private static async assertCanManage(userId: string, projectId: string, tx: DBConnection) {
    const permissions = await ProjectRoleRepository.getUserPermissions(projectId, userId, tx);

    const canManage = permissions.some((p) => p.resource === "api_key" && p.action === "manage");

    if (!canManage) {
      throw new Error("Not allowed to manage API keys");
    }
  }
}

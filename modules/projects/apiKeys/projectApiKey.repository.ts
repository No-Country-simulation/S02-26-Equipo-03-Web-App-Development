import { projectApiKeysTable } from "@/infrastructure/database/schemas/schema";
import { eq, isNull, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { DBConnection } from "@/infrastructure/database";
import crypto from "crypto";

export class ProjectApiKeyRepository {
  static async create(projectId: string, keyHash: string, database: DBConnection) {
    const id = randomUUID();

    await database.insert(projectApiKeysTable).values({
      id,
      projectId: projectId,
      keyHash: keyHash,
    });

    return { id };
  }

  static async findActiveByHash(hash: string, database: DBConnection) {
    const result = await database
      .select({
        id: projectApiKeysTable.id,
        projectId: projectApiKeysTable.projectId,
        createdAt: projectApiKeysTable.createdAt,
      })
      .from(projectApiKeysTable)
      .where(and(eq(projectApiKeysTable.keyHash, hash), isNull(projectApiKeysTable.revokedAt)))
      .limit(1);

    return result[0] ?? null;
  }

  static async findByProject(projectId: string, database: DBConnection) {
    return database
      .select({
        id: projectApiKeysTable.id,
        createdAt: projectApiKeysTable.createdAt,
        revokedAt: projectApiKeysTable.revokedAt,
      })
      .from(projectApiKeysTable)
      .where(eq(projectApiKeysTable.projectId, projectId));
  }

  static async revoke(keyId: string, database: DBConnection): Promise<boolean> {
    const result = await database
      .update(projectApiKeysTable)
      .set({ revokedAt: new Date() })
      .where(eq(projectApiKeysTable.id, keyId))
      .returning({ id: projectApiKeysTable.id });

    return result.length > 0;
  }

  static async revokeAllForProject(projectId: string, database: DBConnection) {
    await database
      .update(projectApiKeysTable)
      .set({ revokedAt: new Date() })
      .where(
        and(eq(projectApiKeysTable.projectId, projectId), isNull(projectApiKeysTable.revokedAt))
      );
  }

  static async rotate(projectId: string, database: DBConnection) {
    return database.transaction(async (tx) => {
      await tx
        .update(projectApiKeysTable)
        .set({ revokedAt: new Date() })
        .where(
          and(eq(projectApiKeysTable.projectId, projectId), isNull(projectApiKeysTable.revokedAt))
        );

      const apiKey = crypto.randomBytes(32).toString("hex");
      const hash = crypto.createHash("sha256").update(apiKey).digest("hex");

      const id = randomUUID();

      await tx.insert(projectApiKeysTable).values({
        id,
        projectId,
        keyHash: hash,
      });

      return apiKey;
    });
  }
}

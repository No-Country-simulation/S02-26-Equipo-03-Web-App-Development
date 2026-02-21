import { projectsTable, Project } from "@/infrastructure/database/schemas/schema";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { projectMembersTable } from "@/infrastructure/database/schemas/schema";
import { DBConnection } from "@/infrastructure/database";

export class ProjectRepository {
  static async findById(projectId: string, database: DBConnection): Promise<Project | null> {
    const result = await database
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .limit(1);

    return result[0] ?? null;
  }

  static async findByUser(userId: string, database: DBConnection): Promise<Project[]> {
    const result = await database
      .select({
        id: projectsTable.id,
        name: projectsTable.name,
        description: projectsTable.description,
        status: projectsTable.status,
        createdAt: projectsTable.createdAt,
        updatedAt: projectsTable.updatedAt,
      })
      .from(projectsTable)
      .innerJoin(projectMembersTable, eq(projectMembersTable.projectId, projectsTable.id))
      .where(eq(projectMembersTable.userId, userId));

    return result;
  }

  static async create(
    data: {
      name: string;
      description?: string;
    },
    database: DBConnection
  ): Promise<Project> {
    const id = randomUUID();

    await database.insert(projectsTable).values({
      id,
      name: data.name,
      description: data.description ?? null,
      status: "active",
    });

    const project = await this.findById(id, database);

    if (!project) {
      throw new Error("Project creation failed");
    }

    return project;
  }

  static async update(
    projectId: string,
    data: Partial<Pick<Project, "name" | "description" | "status">>,
    database: DBConnection
  ): Promise<Project | null> {
    if (Object.keys(data).length === 0) {
      return this.findById(projectId, database);
    }

    const result = await database
      .update(projectsTable)
      .set(data)
      .where(eq(projectsTable.id, projectId))
      .returning();

    // If nothing was updated → it doesn't exist
    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  static async archive(projectId: string, database: DBConnection) {
    await database
      .update(projectsTable)
      .set({
        status: "archived",
        updatedAt: new Date(),
      })
      .where(eq(projectsTable.id, projectId));
  }

  static async assertCanManageMembers(
    projectId: string,
    userAssertId: string,
    database: DBConnection
  ): Promise<boolean> {
    const result = await database
      .select({ id: projectMembersTable })
      .from(projectMembersTable)
      .where(
        and(
          eq(projectMembersTable.projectId, projectId),
          eq(projectMembersTable.userId, userAssertId)
        )
      )
      .limit(1);

      return result.length > 0;
  }

}

import { DBConnection } from "@/infrastructure/database";

export class UserRepository {
  static async findById(userId: string, database: DBConnection) {
    // Temporal mock for projectMember.service.ts
    database.select();

    return {
      id: userId,
      email: "mock@email.com",
      createdAt: new Date(),
    };
  }
}

/**
 * Report Repository
 *
 * Acceso a datos para la tabla de reportes.
 */

import { reportsTable, usersTable } from "@/infrastructure/database/schemas/schema";
import { eq, and, gte, lte, like, desc, sql, count } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { DBConnection } from "@/infrastructure/database";
import type { CreateReportInput, ReportFilters } from "./report.types";

export class ReportRepository {
  /**
   * Crea un nuevo reporte.
   */
  static async create(input: CreateReportInput, database: DBConnection) {
    const id = randomUUID();

    await database.insert(reportsTable).values({
      id,
      projectId: input.projectId,
      userId: input.userId,
      name: input.name,
      format: input.format,
      fileUrl: input.fileUrl,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
    });

    const [report] = await database
      .select({
        id: reportsTable.id,
        projectId: reportsTable.projectId,
        userId: reportsTable.userId,
        userName: usersTable.name,
        name: reportsTable.name,
        format: reportsTable.format,
        fileUrl: reportsTable.fileUrl,
        periodStart: reportsTable.periodStart,
        periodEnd: reportsTable.periodEnd,
        createdAt: reportsTable.createdAt,
      })
      .from(reportsTable)
      .leftJoin(usersTable, eq(reportsTable.userId, usersTable.id))
      .where(eq(reportsTable.id, id))
      .limit(1);

    if (!report) return null;

    return {
      ...report,
      userName: undefined,
      user: {
        name: report.userName,
      },
    };
  }

  /**
   * Lista reportes con filtros opcionales.
   */
  static async findAll(filters: ReportFilters, database: DBConnection) {
    const conditions = [eq(reportsTable.projectId, filters.projectId)];

    if (filters.name) {
      conditions.push(like(reportsTable.name, `%${filters.name}%`));
    }

    if (filters.format) {
      conditions.push(eq(reportsTable.format, filters.format));
    }

    if (filters.createdFrom) {
      conditions.push(gte(reportsTable.createdAt, filters.createdFrom));
    }

    if (filters.createdTo) {
      conditions.push(lte(reportsTable.createdAt, filters.createdTo));
    }

    if (filters.periodStart) {
      conditions.push(gte(reportsTable.periodStart, filters.periodStart));
    }

    if (filters.periodEnd) {
      conditions.push(lte(reportsTable.periodEnd, filters.periodEnd));
    }

    const reports = await database
      .select({
        id: reportsTable.id,
        projectId: reportsTable.projectId,
        userId: reportsTable.userId,
        userName: usersTable.name,
        name: reportsTable.name,
        format: reportsTable.format,
        fileUrl: reportsTable.fileUrl,
        periodStart: reportsTable.periodStart,
        periodEnd: reportsTable.periodEnd,
        createdAt: reportsTable.createdAt,
      })
      .from(reportsTable)
      .leftJoin(usersTable, eq(reportsTable.userId, usersTable.id))
      .where(and(...conditions))
      .orderBy(desc(reportsTable.createdAt));

    return reports.map((r) => ({
      ...r,
      userName: undefined,
      user: {
        name: r.userName,
      },
    }));
  }

  /**
   * Busca un reporte por ID.
   */
  static async findById(id: string, database: DBConnection) {
    const [report] = await database
      .select({
        id: reportsTable.id,
        projectId: reportsTable.projectId,
        userId: reportsTable.userId,
        userName: usersTable.name,
        name: reportsTable.name,
        format: reportsTable.format,
        fileUrl: reportsTable.fileUrl,
        periodStart: reportsTable.periodStart,
        periodEnd: reportsTable.periodEnd,
        createdAt: reportsTable.createdAt,
      })
      .from(reportsTable)
      .leftJoin(usersTable, eq(reportsTable.userId, usersTable.id))
      .where(eq(reportsTable.id, id))
      .limit(1);

    if (!report) return null;

    return {
      ...report,
      userName: undefined,
      user: {
        name: report.userName,
      },
    };
  }

  /**
   * Stats para las cards del header: exportaciones del mes, último reporte, conteo por formato.
   */
  static async getStats(projectId: string, database: DBConnection) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Exportaciones este mes
    const [monthCount] = await database
      .select({ value: count() })
      .from(reportsTable)
      .where(and(eq(reportsTable.projectId, projectId), gte(reportsTable.createdAt, startOfMonth)));

    // Último reporte
    const [lastReport] = await database
      .select({ createdAt: reportsTable.createdAt })
      .from(reportsTable)
      .where(eq(reportsTable.projectId, projectId))
      .orderBy(desc(reportsTable.createdAt))
      .limit(1);

    // Conteo por formato
    const formatCounts = await database
      .select({
        format: reportsTable.format,
        value: count(),
      })
      .from(reportsTable)
      .where(eq(reportsTable.projectId, projectId))
      .groupBy(reportsTable.format);

    const pdfCount = formatCounts.find((f) => f.format === "pdf")?.value ?? 0;
    const csvCount = formatCounts.find((f) => f.format === "csv")?.value ?? 0;

    return {
      exportsThisMonth: monthCount?.value ?? 0,
      lastReportDate: lastReport?.createdAt ?? null,
      pdfCount,
      csvCount,
    };
  }

  /**
   * Elimina un reporte por ID.
   */
  static async delete(id: string, database: DBConnection) {
    const result = await database.delete(reportsTable).where(eq(reportsTable.id, id));

    return result;
  }
}

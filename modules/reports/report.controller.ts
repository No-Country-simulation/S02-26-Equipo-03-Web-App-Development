/**
 * Report Controller
 *
 * Orquesta la lógica de negocio para el CRUD de reportes.
 */

import { NextResponse } from "next/server";
import { db } from "@/infrastructure/database";
import { ReportRepository } from "./report.repository";
import { createReportSchema, reportFiltersSchema } from "./report.validators";
import type { ReportFilters } from "./report.types";

function internalError(message: string, error: unknown) {
  console.error(message, error);
  return NextResponse.json(
    { status: "error", message: "Internal Server Error" },
    { status: 500 }
  );
}

/**
 * Crea un nuevo reporte (POST).
 * @param body  - cuerpo del request (sin userId)
 * @param userId - ID del usuario autenticado 
 */
export async function createReport(body: unknown, userId: string) {
  try {
    const parsed = createReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Validation failed",
          errors: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const report = await ReportRepository.create(
      { ...parsed.data, userId },
      db
    );

    return NextResponse.json(
      { status: "success", data: report },
      { status: 201 }
    );
  } catch (error: unknown) {
    return internalError("Failed to create report:", error);
  }
}

/**
 * Lista reportes con filtros (GET).
 */
export async function listReports(searchParams: URLSearchParams) {
  try {
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { status: "error", message: "Query parameter 'projectId' is required" },
        { status: 400 }
      );
    }

    const rawFilters = {
      name: searchParams.get("name") ?? undefined,
      format: searchParams.get("format") ?? undefined,
      createdFrom: searchParams.get("createdFrom") ?? undefined,
      createdTo: searchParams.get("createdTo") ?? undefined,
      periodStart: searchParams.get("periodStart") ?? undefined,
      periodEnd: searchParams.get("periodEnd") ?? undefined,
    };

    // Limpia undefined para que Zod no los procese
    const cleanFilters = Object.fromEntries(
      Object.entries(rawFilters).filter(([, v]) => v !== undefined)
    );

    const parsed = reportFiltersSchema.safeParse(cleanFilters);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid filter parameters",
          errors: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const filters: ReportFilters = { projectId, ...parsed.data };
    const reports = await ReportRepository.findAll(filters, db);

    return NextResponse.json({
      status: "success",
      data: reports,
      count: reports.length,
    });
  } catch (error: unknown) {
    return internalError("Failed to list reports:", error);
  }
}

/**
 * Obtiene un reporte por ID (GET /:id).
 */
export async function getReportById(reportId: string) {
  try {
    const report = await ReportRepository.findById(reportId, db);

    if (!report) {
      return NextResponse.json(
        { status: "error", message: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", data: report });
  } catch (error: unknown) {
    return internalError("Failed to get report:", error);
  }
}

/**
 * Stats para las cards del header (GET /stats).
 */
export async function getReportStats(projectId: string) {
  try {
    const stats = await ReportRepository.getStats(projectId, db);

    return NextResponse.json({ status: "success", data: stats });
  } catch (error: unknown) {
    return internalError("Failed to get report stats:", error);
  }
}

/**
 * Elimina un reporte (DELETE /:id).
 */
export async function deleteReport(reportId: string) {
  try {
    const report = await ReportRepository.findById(reportId, db);

    if (!report) {
      return NextResponse.json(
        { status: "error", message: "Report not found" },
        { status: 404 }
      );
    }

    await ReportRepository.delete(reportId, db);

    return NextResponse.json(
      { status: "success", message: "Report deleted" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return internalError("Failed to delete report:", error);
  }
}

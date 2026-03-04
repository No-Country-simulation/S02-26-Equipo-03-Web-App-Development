/**
 * Report Types
 *
 * Define los tipos TypeScript para el módulo de reportes.
 */

export type { Report, InsertReport } from "@/infrastructure/database/schemas/schema";

/** Formatos de exportación soportados */
export type ReportFormat = "pdf" | "csv" | "xlsx";

/** Input para crear un reporte */
export interface CreateReportInput {
  projectId: string;
  userId: string; // viene de la sesión, no del body del cliente
  name: string;
  format: ReportFormat;
  fileUrl: string;
  periodStart: Date;
  periodEnd: Date;
}

/** Filtros para listar reportes */
export interface ReportFilters {
  projectId: string;
  name?: string;
  format?: ReportFormat;
  createdFrom?: Date;
  createdTo?: Date;
  periodStart?: Date;
  periodEnd?: Date;
}

/** Stats del header de la página de reportes */
export interface ReportStats {
  exportsThisMonth: number;
  lastReportDate: Date | null;
  pdfCount: number;
  csvCount: number;
}

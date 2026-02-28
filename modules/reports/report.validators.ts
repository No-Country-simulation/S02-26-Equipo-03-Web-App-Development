/**
 * Report Validators (Zod Schemas)
 *
 * Validación de datos para crear y filtrar reportes.
 */

import { z } from "zod";

/** Schema para crear un reporte (POST body) */
export const createReportSchema = z.object({
  projectId: z
    .string()
    .min(1, "projectId is required"),
  name: z
    .string()
    .min(1, "name is required")
    .max(255, "name is too long"),
  format: z.enum(["pdf", "csv"], {
    message: "format must be 'pdf' or 'csv'",
  }),
  fileUrl: z
    .string()
    .url("fileUrl must be a valid URL")
    .max(2048, "fileUrl is too long"),
  periodStart: z
    .string()
    .datetime({ message: "periodStart must be a valid ISO 8601 date" })
    .transform((val) => new Date(val)),
  periodEnd: z
    .string()
    .datetime({ message: "periodEnd must be a valid ISO 8601 date" })
    .transform((val) => new Date(val)),
}).refine(
  (data) => data.periodStart < data.periodEnd,
  { message: "periodStart must be before periodEnd", path: ["periodEnd"] }
);

/** Schema para filtros del GET (query params) */
export const reportFiltersSchema = z.object({
  projectId: z.string().min(1, "projectId is required"),
  name: z.string().max(255).optional(),
  format: z.enum(["pdf", "csv"]).optional(),
  createdFrom: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  createdTo: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  periodStart: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  periodEnd: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
});

export type CreateReportDTO = z.input<typeof createReportSchema>;
export type ReportFiltersDTO = z.input<typeof reportFiltersSchema>;

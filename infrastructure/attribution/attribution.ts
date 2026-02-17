import { z } from "zod";

/**
 * CONTRATO DE METADATOS:
 * Define los datos de marketing que se pueden inyectar en cada transacción.
*/
export const AttributionSchema = z.object({
  fbclid: z.string().trim().optional().nullable(), 
  gclid: z.string().trim().optional().nullable(), 
  utm_source: z.string().trim().optional(),
  utm_campaign: z.string().trim().optional(),
  utm_medium: z.string().trim().optional().nullable(),
  /**
   * Identificador de sesión interna.
   * Solo presente si decidimos trackear la sesión
   * para CRM, analíticas o motores de atribución.
   */
  external_session_id: z.string().optional(),
});

export type AttributionData = z.infer<typeof AttributionSchema>;
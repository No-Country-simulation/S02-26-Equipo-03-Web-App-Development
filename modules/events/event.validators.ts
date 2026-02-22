/**
 * Event Validators (Zod Schemas)
 *
 *
 * Zod es como Hibernate Validator: define reglas y valida en runtime.
 * Si falla, tira un error con los detalles (como MethodArgumentNotValidException).
 */

import { z } from "zod";

/**
 * Schema de validación para el payload que envía el Pixel.
 */
export const pixelPayloadSchema = z.object({
  // Requerido: qué tipo de evento es
  eventType: z
    .string()
    .min(1, "eventType is required")
    .max(100, "eventType too long")
    .regex(/^[a-z0-9_]+$/, "eventType must be lowercase alphanumeric with underscores"),

  // Datos adicionales (opcional, como un Map<String, Object> en Java)
  data: z.record(z.string(), z.unknown()).optional().default({}),

  // IDs del visitante (generados por el Pixel en el navegador)
  visitorId: z.string().max(128).optional(),
  sessionId: z.string().max(128).optional(),

  // URL donde ocurrió el evento
  url: z.string().url().max(2048).optional(),

  // Referrer
  referrer: z.string().max(2048).optional(),

  // Timestamp del cliente (milisegundos desde epoch)
  timestamp: z.number().int().positive().optional(),

  // Parámetros UTM
  utm: z
    .object({
      source: z.string().max(200).optional(),
      medium: z.string().max(200).optional(),
      campaign: z.string().max(200).optional(),
      term: z.string().max(200).optional(),
      content: z.string().max(200).optional(),
    })
    .optional(),
});

/**
 * Schema para el query parameter del GET (cuando el Pixel usa <img> tag).
 * El GET envía todo como query string codificado en base64.
 */
export const pixelGetSchema = z.object({
  // El payload viene como JSON codificado en base64
  d: z.string().min(1, "data parameter is required"),
  // API Key del proyecto
  k: z.string().min(1, "API key is required"),
});

/**
 * Tipo inferido del payload validado
 */
export type ValidatedPixelPayload = z.infer<typeof pixelPayloadSchema>;

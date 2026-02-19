/**
 * Event Types
 *
 *
 * Define los tipos TypeScript para el módulo de eventos.
 */

// Re-export the DB types from schema (equivale a la Entity JPA)
export type { Event, InsertEvent } from "@/infrastructure/database/schemas/schema";

/**
 * Payload que envía el Pixel desde el navegador del visitante.
 */
export interface PixelPayload {
  /** Tipo de evento: 'page_view', 'click', 'purchase', etc. */
  eventType: string;
  /** Datos adicionales del evento (precio, producto, etc.) */
  data?: Record<string, unknown>;
  /** ID único del visitante (generado por el Pixel en el navegador) */
  visitorId?: string;
  /** ID de sesión del visitante */
  sessionId?: string;
  /** URL de la página donde ocurrió el evento */
  url?: string;
  /** Referrer de la página */
  referrer?: string;
  /** Timestamp del evento en el cliente (milisegundos) */
  timestamp?: number;
  /** Parámetros UTM capturados automáticamente */
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

/**
 * Metadatos extraídos del request HTTP (no los envía el Pixel, los capturamos del server).
 */
export interface RequestMetadata {
  /** IP del visitante (anonimizada: último octeto removido) */
  ipAnonymized: string;
  /** User-Agent del navegador */
  userAgent: string;
  /** Referrer HTTP header */
  referrer: string;
  /** Fuente del evento: 'pixel', 'stripe', 'manual' */
  source?: string;
}

/**
 * El evento completo listo para insertar en la DB.
 * Combina el payload del Pixel + metadatos del server.
 */
export interface TrackEventInput {
  projectId: string;
  eventType: string;
  source: string;
  payload: Record<string, unknown>;
  visitorId?: string;
  sessionId?: string;
  timestamp: Date;
  deduplicationKey?: string;
}

/**
 * Respuesta del endpoint /api/v1/track
 */
export interface TrackResponse {
  success: boolean;
  eventId?: string;
  deduplicated?: boolean;
  error?: string;
  details?: unknown;
}

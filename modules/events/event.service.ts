/**
 * Event Service
 *
 *
 * Orquesta la lógica de negocio para la ingesta de eventos.
 *
 * Flujo:
 *   1. Validar API Key y obtener projectId (equivale a autenticación con API Key)
 *   2. Parsear y validar payload
 *   3. Verificar deduplicación
 *   4. Persistir evento 
 */

import { db } from "@/infrastructure/database";
import { EventRepository } from "./event.repository";
import { ProjectApiKeyRepository } from "@/modules/projects/apiKeys/projectApiKey.repository";
import {
  pixelPayloadSchema,
  type ValidatedPixelPayload,
} from "./event.validators";
import type { RequestMetadata, TrackResponse } from "./event.types";
import crypto from "crypto";

export class EventService {
  /**
   * Procesa un evento recibido desde el pixel o API.
   *
   */
  static async trackEvent(
    apiKey: string,
    rawPayload: unknown,
    metadata: RequestMetadata
  ): Promise<TrackResponse> {
    // 1. Hash de la API key y verificación
    //    Equivale a: SecurityContext + ApiKeyAuthenticationFilter
    const keyHash = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex");

    const apiKeyRecord = await ProjectApiKeyRepository.findActiveByHash(
      keyHash,
      db
    );

    if (!apiKeyRecord) {
      return {
        success: false,
        error: "Invalid or revoked API key",
      };
    }

    // 2. Validar payload con Zod
    const parseResult = pixelPayloadSchema.safeParse(rawPayload);

    if (!parseResult.success) {
      return {
        success: false,
        error: "Invalid payload",
        details: parseResult.error.issues,
      };
    }

    const payload: ValidatedPixelPayload = parseResult.data;

    // 3. Generar deduplication key y verificar idempotencia
    const deduplicationKey = EventService.generateDeduplicationKey(
      apiKeyRecord.projectId,
      payload
    );

    const existing = await EventRepository.findByDeduplicationKey(
      deduplicationKey,
      db
    );

    if (existing) {
      return {
        success: true,
        eventId: existing.id,
        deduplicated: true,
      };
    }

    // 4. Persistir evento en la DB
    const result = await db.transaction(async (tx) => {
      return EventRepository.create(
        {
          projectId: apiKeyRecord.projectId,
          eventType: payload.eventType,
          source: metadata.source ?? "pixel",
          payload: {
            data: payload.data ?? {},
            url: payload.url,
            referrer: payload.referrer,
            utm: payload.utm,
          },
          visitorId: payload.visitorId,
          sessionId: payload.sessionId,
          timestamp: payload.timestamp
            ? new Date(payload.timestamp)
            : new Date(),
          deduplicationKey,
        },
        tx
      );
    });

    return {
      success: true,
      eventId: result.id,
    };
  }

  /**
   * Genera una clave de deduplicación determinista.
   * Si el mismo evento llega dos veces (retry del navegador), no se duplica.
   *
   * Equivale a: IdempotencyService.generateKey()
   */
  private static generateDeduplicationKey(
    projectId: string,
    payload: ValidatedPixelPayload
  ): string {
    const raw = [
      projectId,
      payload.eventType,
      payload.visitorId ?? "",
      payload.sessionId ?? "",
      payload.url ?? "",
      payload.timestamp ?? "",
    ].join("|");

    return crypto.createHash("sha256").update(raw).digest("hex");
  }
}

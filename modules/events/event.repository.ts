/**
 * Event Repository
 *
 *
 * DBConnection puede ser la DB directa o una transacción (como @Transactional).
 */

import { eventsTable } from "@/infrastructure/database/schemas/schema";
import { eq, and, gte } from "drizzle-orm";
import { randomUUID } from "crypto";
import { DBConnection } from "@/infrastructure/database";
import type { TrackEventInput } from "./event.types";

export class EventRepository {
  /**
   * Inserta un evento nuevo en la tabla events.
   * Equivale a: eventRepository.save(event)
   */
  static async create(input: TrackEventInput, database: DBConnection) {
    const id = randomUUID();

    await database.insert(eventsTable).values({
      id,
      projectId: input.projectId,
      eventType: input.eventType,
      source: input.source,
      payload: input.payload,
      visitorId: input.visitorId ?? null,
      sessionId: input.sessionId ?? null,
      timestamp: input.timestamp,
      status: "received",
      deduplicationKey: input.deduplicationKey ?? null,
    });

    return { id };
  }

  /**
   * Busca un evento por su deduplication key para verificar duplicados.
   * Equivale a: eventRepository.findByDeduplicationKey(key)
   */
  static async findByDeduplicationKey(
    deduplicationKey: string,
    database: DBConnection
  ) {
    const result = await database
      .select({ id: eventsTable.id })
      .from(eventsTable)
      .where(eq(eventsTable.deduplicationKey, deduplicationKey))
      .limit(1);

    return result[0] ?? null;
  }

  /**
   * Cuenta eventos de un proyecto en un rango de tiempo.
   * Útil para control de cuotas (Paso 4).
   * Equivale a: eventRepository.countByProjectIdAndTimestampAfter(projectId, since)
   */
  static async countByProjectSince(
    projectId: string,
    since: Date,
    database: DBConnection
  ): Promise<number> {
    const result = await database
      .select({ id: eventsTable.id })
      .from(eventsTable)
      .where(
        and(
          eq(eventsTable.projectId, projectId),
          gte(eventsTable.timestamp, since)
        )
      );

    return result.length;
  }

  /**
   * Busca un evento por ID.
   * Equivale a: eventRepository.findById(id)
   */
  static async findById(eventId: string, database: DBConnection) {
    const result = await database
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId))
      .limit(1);

    return result[0] ?? null;
  }
}

import { NextResponse } from "next/server";
import { WebhookResponse } from "@shared/types/integration.types";
import { integrationsTable, transactionsTable } from "@infrastructure/database/schemas/schema";
import { DBConnection } from "@infrastructure/database/index";
import { eq } from "drizzle-orm";

export abstract class IntegrationConnector {
  protected db: DBConnection;

  constructor(db: DBConnection) {
    this.db = db;
  }

  // 1. Validar que el webhook sea legítimo
  abstract validateSignature(
    payload: string, 
    signature: string, 
    webhookSecret: string
  ): Promise<boolean>;

  // 2. Traducir el JSON externo a nuestro sistema
  abstract processWebhook(
    payload: string, 
    signature: string, 
    webhookSecret: string, 
  ): Promise<WebhookResponse>;

  // ----- MÉTODOS CONCRETOS
  //Actualizar el estado de la tabla
  protected async updateIntegrationStatus(id: string, status: "connected" | "error") {
    await this.db
    .update(integrationsTable)
    .set({ 
        status: status,
        connectedAt: status === "connected" ? new Date() : null
    })
    .where(eq(integrationsTable.id, id));
 
    console.log(`Actualizando integración ${id} a estado: ${status}`);
  }

  protected async createTransactionRecord(data: typeof transactionsTable.$inferInsert) {
    return await this.db.insert(transactionsTable).values(data).returning();
  }

  // Utilidad para responder a Next.js de forma consistente
  protected sendResponse(result: WebhookResponse): NextResponse {
    const status = result.success ? 200 : 400;
    return NextResponse.json(result, { status });
  }

  // Utilidad para logging básico (ayuda con la observabilidad)
  protected logEvent(provider: string, type: string, projectId: string): void {
    console.log(`[LOG][${provider}] Evento: ${type} | Proyecto: ${projectId} | Hora: ${new Date().toISOString()}`);
  }

}











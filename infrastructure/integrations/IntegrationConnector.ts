import { NextResponse } from "next/server";
import { integrationsTable, transactionsTable } from "@infrastructure/database/schemas/schema";
// import { DBConnection } from "@infrastructure/database/index";
import { eq } from "drizzle-orm";



export interface WebhookResponse {
  success: boolean; 
  message: string;
  projectId: string; 
  externalId?: string; 
  plataform: 'stripe' | 'meta' | 'shopify';

  normalizedData?: {
    // status: OrderStatus;
    amount: number; // Opcional: Monto recibido
    currency: string; // Opcional: Moneda (USD, EUR)
    // paymentType: PaymentType;
  };
}

export abstract class IntegrationConnector {
  abstract validateSignature(
    payload: string, 
    signature: string, 
    secret: string
  ): Promise<boolean>;

  // 2. Traducir el JSON externo a nuestro sistema (Lógica)
  abstract processWebhook(
    payload: any, 
    projectId: string
  ): Promise<WebhookResponse>;

  // ----- MÉTODOS CONCRETOS
  protected async updateIntegrationStatus(db: any, id: string, status: "connected" | "error") {
    await db
    .update(integrationsTable)
    .set({ 
        status: status,
        connectedAt: status === "connected" ? new Date() : null
    })
    .where(eq(integrationsTable.id, id));
 
    console.log(`Actualizando integración ${id} a estado: ${status}`);
  }

  protected async createTransactionRecord(db: any, data: typeof transactionsTable.$inferInsert) {
    return await db.insert(transactionsTable).values(data).returning();
  }

  //falta la lógica para guardar en la tabla trackingHealt

  protected sendResponse(result: WebhookResponse): NextResponse {
    const status = result.success ? 200 : 400;
    return NextResponse.json(result, { status });
  }

  // Utilidad para logging básico (ayuda a B4 con la observabilidad)
  protected logEvent(provider: string, type: string, projectId: string): void {
    console.log(`[LOG][${provider}] Evento: ${type} | Proyecto: ${projectId} | Hora: ${new Date().toISOString()}`);
  }

}











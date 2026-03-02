import Stripe from "stripe";
import { OrderStatus } from "@shared/types/orders.types";
import { IntegrationConnector } from "@infrastructure/integrations/IntegrationConnector";
import { WebhookResponse } from "@shared/types/integration.types";
import { DBConnection } from "@infrastructure/database";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export class StripeConnector extends IntegrationConnector {
  private stripe: Stripe;

  constructor(db: DBConnection, apiKey: string) {
    super(db);

    if (!apiKey) {
      throw new Error("StripeConnector: The API Key is required to initialize the SDK.");
    }

    this.stripe = new Stripe(apiKey, {
      apiVersion: "2026-01-28.clover" as any,
    });
  }

  // Traducir los estados de Stripe
  private mapStatus(stripeStatus: string): OrderStatus {
    switch (stripeStatus) {
      case "succeeded":
        return "PAGADO";
      case "processing":
        return "PENDIENTE";
      case "requires_payment_method":
        return "FALLIDO";
      default:
        return "PENDIENTE";
    }
  }

  /**
   * Valida la firma del webhook de Stripe.
   */
  async validateSignature(
    payload: string,
    signature: string,
    secretwebhookSecret: string
  ): Promise<boolean> {
    try {
      // constructEvent para asegurar la autenticidad.
      this.stripe.webhooks.constructEvent(payload, signature, secretwebhookSecret);
      return true;
    } catch (error) {
      console.error("Signature error:", error);
      return false;
    }
  }

  /**
   * Procesa el webhook de Stripe y normaliza los datos.
   */
  async processWebhook(
    payload: string,
    signature: string,
    secretwebhookSecret: string
  ): Promise<WebhookResponse> {
    try {
      // 1. Validar firma
      const event = this.stripe.webhooks.constructEvent(payload, signature, secretwebhookSecret);

      // 2. Extraer el objeto
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // 3. Extraer el id del proyecto o API Key
      const apiKeyOrId = paymentIntent.metadata?.project_id || "";

      if (!apiKeyOrId) {
        throw new Error("The webhook does not contain a project_id in the metadata.");
      }

      // --- INTELIGENCIA DE RESOLUCIÓN ---
      // Intentamos buscar si lo que recibimos es una API Key
      // Importación dinámica para evitar ciclos o dependencias pesadas si fuera necesario
      const { ProjectApiKeyRepository } =
        await import("@/modules/projects/apiKeys/projectApiKey.repository");
      const apiKeyRecord = await ProjectApiKeyRepository.findProjectByRawKey(apiKeyOrId, this.db);

      // Si encontramos un registro, usamos su projectId real.
      // Si no, asumimos que ya era un ID de proyecto válido.
      const projectId = apiKeyRecord ? apiKeyRecord.projectId : apiKeyOrId;
      // ----------------------------------

      /**
       * Logging: Integrado con el método logEvent de la clase base para
       * monitorear eventos en tiempo real."
       */
      this.logEvent("STRIPE", event.type, projectId);

      if (
        event.type === "payment_intent.succeeded" ||
        event.type === "checkout.session.completed"
      ) {
        const isSession = event.type === "checkout.session.completed";
        const session = event.data.object as any;

        // Atribución: Recuperar el ID de sesión de marketing
        const metadata = session.metadata || {};
        console.log("DEBUG [Stripe Metadata]:", JSON.stringify(metadata, null, 2));
        const amount = isSession ? session.amount_total / 100 : session.amount / 100;
        const currency = (session.currency || "USD").toUpperCase();
        const externalId = isSession ? session.payment_intent : session.id;

        // Datos del Cliente y Producto (Enriquecimiento)
        // Datos del Cliente y Producto (Enriquecimiento)
        const customerName =
          session.customer_details?.name ||
          metadata.customer_name ||
          metadata.name ||
          metadata.full_name ||
          "Cliente Desconocido";

        const customerEmail =
          session.customer_details?.email || metadata.customer_email || metadata.email || "S/E";

        const productName = metadata.product_name || metadata.product || "Producto General";

        console.log(`[Stripe Webhook] Datos extraídos:`, {
          customerName,
          customerEmail,
          productName,
          type: event.type,
        });

        // 4. BUSCAR LA INTEGRACIÓN (O CREARLA AUTOMÁTICAMENTE)
        let integration = await this.db.query.integrationsTable.findFirst({
          where: (table, { and, eq }) =>
            and(eq(table.projectId, projectId), eq(table.platform, "STRIPE")),
        });

        if (!integration) {
          console.log(
            `[Stripe Webhook] Integración no encontrada para el proyecto ${projectId}. Creándola de forma automática...`
          );
          const schema = await import("@infrastructure/database/schemas/schema");

          const newIntegration = await this.db
            .insert(schema.integrationsTable)
            .values({
              id: crypto.randomUUID(),
              projectId: projectId,
              name: "Conexión Automática Stripe",
              type: "payment",
              platform: "STRIPE",
              status: "connected",
              connectedAt: new Date(),
            })
            .returning();

          integration = newIntegration[0];
          console.log("✅ Integración creada automáticamente.");
        }

        // --- PROCESAMIENTO ATÓMICO CON TRANSACCIÓN ---
        await (this.db as any).transaction(async (tx: any) => {
          const schema = await import("@infrastructure/database/schemas/schema");
          // A. Verificar idempotencia (¿Ya existe la transacción?)
          const existingTx = await tx.query.transactionsTable.findFirst({
            where: (table: any, { eq }: any) => eq(table.externalId, externalId),
          });

          let transactionId = existingTx?.id;

          if (!existingTx) {
            const newTx = await tx
              .insert(schema.transactionsTable)
              .values({
                id: crypto.randomUUID(),
                projectId: projectId,
                paymentIntegrationId: integration.id,
                externalId: externalId,
                amount: amount,
                currency: currency,
                status: "completed",
                transactionDate: new Date(),
                metadata: JSON.stringify(metadata),
              })
              .returning();
            transactionId = newTx[0].id;
            console.log("✅ Transacción creada:", transactionId);
          } else {
            console.log("ℹ️ Transacción ya existía (omitido):", transactionId);
          }

          // C. Registrar Evento de Compra para Atribución
          const purchaseEventId = crypto.randomUUID();
          await tx.insert(schema.eventsTable).values({
            id: purchaseEventId,
            projectId: projectId,
            eventType: "purchase",
            source: "stripe",
            payload: JSON.stringify(session),
            timestamp: new Date(),
            status: "processed",
          });

          // D. Atribución Automática (Detección de Campaña y Fuente)
          let utmCampaign = metadata.utm_campaign || metadata.campaign || "";
          let utmSource = metadata.utm_source || "";

          // Si no está en el top level, buscamos en el objeto 'attribution' que viene de tienda-cliente
          if (metadata.attribution) {
            try {
              const attrData =
                typeof metadata.attribution === "string"
                  ? JSON.parse(metadata.attribution)
                  : metadata.attribution;

              if (!utmCampaign) utmCampaign = attrData.params?.utm_campaign || "";
              if (!utmSource) utmSource = attrData.params?.utm_source || "";
            } catch (e) {
              console.log("No se pudo parsear el metadato de atribución:", e);
            }
          }

          // Prioridad: utm_source (ej: google) > metadata.source (ej: tienda-cliente-test) > fallbacks
          const finalSource = utmSource || metadata.source || (utmCampaign ? "ADS" : "ORGANIC");

          let campaign = null;
          if (utmCampaign) {
            campaign = await tx.query.campaignsTable.findFirst({
              where: (table: any, { and, eq }: any) =>
                and(eq(table.projectId, projectId), eq(table.name, utmCampaign)),
            });

            if (campaign) {
              await tx.insert(schema.attributionsTable).values({
                id: crypto.randomUUID(),
                eventId: purchaseEventId,
                campaignId: campaign.id,
                model: "last_click",
                weight: 1.0,
              });
              console.log(` Atribución lograda: Venta vinculada a campaña "${utmCampaign}"`);
            } else {
              console.log(` No se encontró campaña en DB con nombre: "${utmCampaign}"`);
            }
          }

          // B. Verificar/Crear o Actualizar la Orden (Ahora con datos de campaña y fuente detectados con precisión)
          const existingOrder = await tx.query.ordersTable.findFirst({
            where: (table: any, { eq }: any) => eq(table.transactionId, transactionId),
          });

          if (!existingOrder) {
            await tx.insert(schema.ordersTable).values({
              id: crypto.randomUUID(),
              projectId: projectId,
              transactionId: transactionId,
              totalAmount: amount,
              currency: currency,
              status: "confirmed",
              orderDate: new Date(),
              externalOrderId: isSession ? session.id : externalId,
              customerName: customerName,
              customerEmail: customerEmail,
              productName: productName,
              stripeId: externalId,
              campaignId: campaign?.id || null,
              sourcePlatform: finalSource,
              paymentType: "PAGO ÚNICO",
            });
            console.log("✅ Orden enriquecida creada para:", customerName);
          } else if (isSession || customerName !== "Cliente Desconocido") {
            await tx
              .update(schema.ordersTable)
              .set({
                customerName: customerName,
                customerEmail: customerEmail,
                productName: productName,
                externalOrderId: isSession ? session.id : externalId,
                stripeId: externalId,
                campaignId: campaign?.id || null,
                sourcePlatform: finalSource,
                paymentType: "PAGO ÚNICO",
              })
              .where(eq(schema.ordersTable.id, existingOrder.id));
            console.log("🔄 Orden actualizada con datos de cliente:", customerName);
          }

          // E. Actualizar estado de integración
          await tx
            .update(schema.integrationsTable)
            .set({
              status: "connected",
              connectedAt: new Date(),
            })
            .where(eq(schema.integrationsTable.id, integration.id));
        });
        // ----------------------------------------------

        return {
          success: true,
          message: "Pago procesado exitosamente",
          projectId: projectId,
          externalId: externalId,
          plataform: "STRIPE",
          normalizedData: {
            status: "PAGADO",
            amount: amount,
            currency: currency,
            paymentType: "PAGO ÚNICO",
          },
        };
      }

      return {
        success: true, // el evento se recibió bien, solo no lo procesamos
        message: `Evento recibido pero ignorado: ${event.type}`,
        projectId,
        plataform: "STRIPE",
      };
    } catch (error: any) {
      console.error("Error al procesar el webhook:", error.message);
      return {
        success: false,
        message: error.message,
        projectId: (error as any).projectId || "unknown",
        plataform: "STRIPE",
      };
    }
  }
}

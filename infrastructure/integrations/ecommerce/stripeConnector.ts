import Stripe from "stripe";
import { OrderStatus } from "@shared/types/orders.types";
import { IntegrationConnector } from "@infrastructure/integrations/IntegrationConnector";
import { WebhookResponse } from "@shared/types/integration.types";
import { DBConnection } from "@infrastructure/database";

export class StripeConnector extends IntegrationConnector {
    private stripe: Stripe;

    constructor(db:DBConnection, apiKey: string) {
        super(db);

        if (!apiKey) {
            throw new Error("StripeConnector: The API Key is required to initialize the SDK.");
        }
        
        this.stripe = new Stripe(apiKey, {
            apiVersion: "2026-01-28.clover" as any
        });
    }

    // Traducir los estados de Stripe
    private mapStatus(stripeStatus: string): OrderStatus {
        switch (stripeStatus) {
            case 'succeeded': return "PAGADO";
            case 'processing': return "PENDIENTE";
            case 'requires_payment_method': return "FALLIDO";
            default: return "PENDIENTE";
        }
    }

    /**
     * Valida la firma del webhook de Stripe.
     */
    async validateSignature(payload: string, signature: string, secretwebhookSecret: string): Promise<boolean> {
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
    async processWebhook(payload: string, signature: string, secretwebhookSecret: string): Promise<WebhookResponse> {
        try {
            // 1. Validar firma
            const event = this.stripe.webhooks.constructEvent(payload, signature, secretwebhookSecret);

            // 2. Extraer el objeto
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            
            // 3. Extraer el id del proyecto
            const projectId = paymentIntent.metadata?.project_id || ""; 

            if (!projectId) {
                throw new Error("The webhook does not contain a project_id in the metadata.");
            }

            /**
             * Logging: Integrado con el método logEvent de la clase base para 
             * monitorear eventos en tiempo real."
            */
            this.logEvent("STRIPE", event.type, projectId);
            
            if (event.type === "payment_intent.succeeded") {
                // Atribución: Recuperar el ID de sesión de marketing
                const sessionId = paymentIntent.metadata?.external_session_id; 

                // 4. BUSCAR LA INTEGRACIÓN (Para evitar el error de NULL)
                const integration = await this.db.query.integrationsTable.findFirst({
                    where: (table, { and, eq }) => and(
                        eq(table.projectId, projectId),
                        eq(table.platform, "STRIPE")
                    ),
                });

                if (!integration) {
                    throw new Error(`No active Stripe integration was found for the project: ${projectId}`);
                }

                // 5. PERSISTIR LA TRANSACCIÓN
                const transaction = await this.createTransactionRecord({
                    id: crypto.randomUUID(),
                    projectId: projectId,
                    paymentIntegrationId: integration.id,
                    externalId: paymentIntent.id,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency.toUpperCase(),
                    status: "completed",
                    transactionDate: new Date()
                });

                if (transaction) {
                    console.log("Transacción guardada exitosamente:", transaction);
                } else {
                    console.error("Error al guardar la transacción.");
                }

                // Si llegamos aquí, la firma fue válida y la transacción se guardó.
                await this.updateIntegrationStatus(integration.id, "connected");

                return {
                    success: true,
                    message: "Pago procesado exitosamente",
                    projectId: projectId,
                    externalId: paymentIntent.id,
                    plataform: "STRIPE",
                    normalizedData: {
                        status: this.mapStatus(paymentIntent.status),
                        amount: paymentIntent.amount / 100,
                        currency: paymentIntent.currency,
                        paymentType: "PAGO ÚNICO"
                    }
                };
            }
            
            return { 
                success: true,// el evento se recibió bien, solo no lo procesamos
                message: `Evento recibido pero ignorado: ${event.type}`, 
                projectId, 
                plataform: "STRIPE" 
            };
    
        } catch (error: any) {
            console.error("Error al procesar el webhook:", error.message);
            return { 
                success: false, 
                message: error.message, 
                projectId: (error as any).projectId || "unknown", 
                plataform: "STRIPE" 
            };
        }
    }
}
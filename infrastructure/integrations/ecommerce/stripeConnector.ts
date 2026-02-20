import Stripe from "stripe";
import { OrderStatus } from "@shared/types/orders.types";
import { IntegrationConnector } from "@infrastructure/integrations/IntegrationConnector";
import { WebhookResponse } from "@shared/types/integration.types";

export class StripeConnector extends IntegrationConnector {
    private stripe: Stripe;

    constructor(apiKey: string) {
        super();
        this.stripe = new Stripe(apiKey, {
            apiVersion: "2026-01-28.clover" as any
        });
    }

    // Método privado para traducir los estados de Stripe a los nuestros
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
    async validateSignature(payload: string, signature: string, secret: string): Promise<boolean> {
        try {
            // Validación Criptográfica: Usando constructEvent para asegurar la autenticidad.
            this.stripe.webhooks.constructEvent(payload, signature, secret);
            return true;
        } catch (error) {
            console.error("Error de firma:", error);
            return false;
        }
    }

    /**
     * Procesa el webhook de Stripe y normaliza los datos.
     */
    async processWebhook(payload: string, signature: string, secret: string, projectId: string): Promise<WebhookResponse> {
        try {
            //Validación Criptográfica: Usando constructEvent para asegurar la autenticidad.
            const event = this.stripe.webhooks.constructEvent(payload, signature, secret);

            /**
             * Logging: Integrado con el método logEvent de la clase base para 
             * monitorear eventos en tiempo real."
            */
            this.logEvent("STRIPE", event.type, projectId);
            
            if (event.type === "payment_intent.succeeded") {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;

                // Atribución: Recuperar el ID de sesión de marketing
                const sessionId = paymentIntent.metadata?.external_session_id; 

                return {
                    success: true,
                    message: "Pago procesado exitosamente",
                    projectId: projectId,
                    externalId: paymentIntent.id,
                    plataform: "STRIPE",
                    normalizedData: {
                        status: this.mapStatus(paymentIntent.status),
                        //Normalización: Los montos se pasan de centavos a unidades y los estados se mapean a nuestro enum OrderStatus.
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
                projectId, 
                plataform: "STRIPE" 
            };
        }
    }
}
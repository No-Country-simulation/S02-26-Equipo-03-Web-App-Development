import { OrderStatus, PaymentType } from "@shared/types/orders.types";

export type IntegrationStatus = "CONECTADO" | "DESCONECTADO" | "ERROR" | "PENDIENTE";

export interface WebhookResponse {
  success: boolean; // ¿La firma fue válida y el proceso terminó bien?
  message: string;
  projectId: string; // El ID de nuestro sistema al que pertenece este pago
  externalId?: string; // El ID que nos da Stripe (ej. ch_3N...)
  plataform: "STRIPE" | "META ADS";

  normalizedData?: {
    status: OrderStatus;
    amount: number; // Monto recibido
    currency: string; // Moneda (USD, EUR)
    paymentType: PaymentType;
  };
}

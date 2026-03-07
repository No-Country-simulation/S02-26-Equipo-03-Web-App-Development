export type PaymentType = "PAGO ÚNICO" | "SUSCRIPCIÓN";
export type OrderStatus = "PAGADO" | "PENDIENTE" | "FALLIDO";
export type OrderSource = "META ADS" | "GOOGLE ADS" | "STRIPE" | "ORGÁNICO";

export interface Order {
  id: string;
  clientName: string;
  clientEmail: string;
  service: string;
  paymentType: PaymentType;
  source: OrderSource;
  amount: number;
  status: OrderStatus;
  date: string;
  stripeId?: string;
  campaignId?: string;
  sourcePlatform?: string;
}

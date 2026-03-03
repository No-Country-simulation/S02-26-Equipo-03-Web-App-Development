export interface SalesOrder {
  id: string;
  projectId: string;
  ecommerceIntegrationId: string | null;
  transactionId: string;
  externalOrderId: string;
  totalAmount: number;
  currency: string;
  status: string;
  orderDate: string; 
  customerName: string;
  customerEmail: string;
  productName: string;
  paymentType: string;
  stripeId: string;
  campaignId: string;
  sourcePlatform: string;
}

/* export interface iOrder{
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  paymentType: string;
  sourcePlatform: string;
  totalAmount: number;
  currency: string;
  status: string;
  orderDate: string;
}

export interface iOrdersResponse {
  data: iOrder[];
} */

export interface OrdersResponse {
  success: boolean;
  count: number;
  data: SalesOrder[];
}
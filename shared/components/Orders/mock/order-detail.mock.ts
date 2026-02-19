import { OrderDetail } from "../../../types/order-detail.types";

export const ORDER_DETAIL_MOCK: OrderDetail = {
  id: "ord_7721",
  clientName: "Julie Smith",
  clientEmail: "julie.smith@gmail.com",
  service: "LLC Formation - Standard",
  paymentType: "PAGO ÚNICO",
  source: "META ADS",
  amount: 499.0,
  status: "PAGADO",
  date: "16 Feb 2026",
  time: "14:32",
  stripeId: "ch_3P2z...Xk9z",
  attribution: {
    source: "Meta Ads",
    initial: "M",
    campaign: "US - Retargeting LAL 1%",
    roas: 4.2,
  },
  timeline: [
    {
      label: "Checkout iniciado",
      timestamp: "HACE 4H",
    },
    {
      label: "Pago procesado",
      timestamp: "HACE 4H",
    },
    {
      label: "Confirmado por Stripe",
      timestamp: "16 FEB 14:32",
      isHighlighted: true,
    },
  ],
};
import { Integration } from "@/shared/types/status-integrations.types";

export const integrationsMock: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Procesador de pagos — fuente de verdad del revenue confirmado.",
    status: "conectado",
    lastSync: "hace 4 horas",
    integrationUrl: "https://dashboard.stripe.com/settings/apps",
    trackingId: "stripe",
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    description: "Atribución pixel + Conversions API integrados.",
    status: "alerta",
    alertField: {
      label: "Pixel ID",
      value: "129032103921",
    },
    integrationUrl: "https://business.facebook.com/events_manager2/list/pixel/",
    trackingId: "meta-ads",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Conversion tracking con confirmación Stripe.",
    status: "conectado",
    lastSync: "hace 1 hora",
    integrationUrl: "https://ads.google.com/aw/linkedaccounts",
    trackingId: "google-ads",
  },
];

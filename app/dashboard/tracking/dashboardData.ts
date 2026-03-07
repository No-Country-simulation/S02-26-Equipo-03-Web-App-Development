import { Issue } from "@/shared/interfaces/issue-tracking.interface";

export const issues: Issue[] = [
  {
    id: "IwHu7ix0B4KFP3g",
    title: "Evento Faltante",
    impact: 4200,
    platform: "META PIXEL",
    severity: "ALERTA",
    retargeting: "US - Retargeting - LAL 1%",
    createdAt: "2026-03-02T12:00:00Z",
    description: "El evento de compra no se dispara para usuarios de Safari móvil.",
    diagnostics: {
      description: {
        text: "La actualización de iOS 17.4 bloquea ciertos parámetros de tracking en Safari sin una implementación Server-Side adecuada.",
        blockedParams: ["external_id", "event_source_url", "fbp cookie", "fbc cookie"],
        footer:
          "Apple ITP (Intelligent Tracking Prevention) está bloqueando cookies de terceros y limitando acceso a datos del navegador.",
      },
      error: "error: missing_param 'external_id' at MetaPixel.sendEvent (v1.2.1)",
    },
    timeline: [
      {
        timestamp: "2026-03-02T09:00:00Z",
        description: "Detección automática por GardenAds Webhook Monitor.",
      },
      {
        timestamp: "2026-03-02T11:00:00Z",
        description: "Validación de impacto financiero contra Stripe API.",
      },
      {
        timestamp: new Date().toISOString(),
        description: "Esperando acción correctiva del administrador.",
      },
    ],
    recommendedAction: "Implementar Conversions API (CAPI) para redundancia de eventos.",
  },
  {
    id: "ch_3MtwBwLkd",
    title: "Evento Duplicado",
    impact: 1100,
    platform: "GOOGLE ADS",
    severity: "ALERTA",
    retargeting: "US - Retargeting - LAL 3%",
    createdAt: "2026-02-20T12:00:00Z",
    description:
      "El evento de compra se está registrando múltiples veces por sesión en Google Ads.",
    diagnostics: {
      description: {
        text: "El tag de Google Ads está disparando el evento de conversión más de una vez por sesión debido a una configuración incorrecta del trigger en GTM.",
        blockedParams: [
          "transaction_id deduplication",
          "gtag send_to conflict",
          "GTM trigger firing rule",
          "conversion linker cookie",
        ],
        footer:
          "Sin deduplicación por transaction_id, Google Ads contabiliza múltiples conversiones por una sola compra, inflando el ROAS reportado.",
      },
      error:
        "error: duplicate_event 'purchase' transaction_id=null at GTag.conversion (gtm-container-v4.1.0)",
    },
    timeline: [
      {
        timestamp: "2026-02-20T09:00:00Z",
        description: "Detección automática por GardenAds Webhook Monitor.",
      },
      {
        timestamp: "2026-02-20T11:00:00Z",
        description: "Validación de impacto financiero contra Stripe API.",
      },
      {
        timestamp: "2026-02-20T11:55:00Z",
        description: "Esperando acción correctiva del administrador.",
      },
    ],
    recommendedAction:
      "Configurar deduplicación por transaction_id en el tag de conversión de Google Ads dentro de GTM.",
  },
];

export type IssueSeverity = "CRÍTICO" | "ALERTA" | "INFO";

export interface Issue {
  id: string;
  title: string;
  impact: number;
  platform: "STRIPE" | "META ADS" | "GOOGLE ADS" | "DATA";
  severity: IssueSeverity;
  createdAt: string;
  description: string;
  diagnostics: {
    description: string;
    error: string;
  };
  timeline: {
    timestamp: string;
    description: string;
  }[];
  recommendedAction: string;
}

export const issues: Issue[] = [
  {
    id: "1",
    title: "Evento Faltante",
    impact: 4200,
    platform: "META ADS",
    severity: "CRÍTICO",
    createdAt: "2026-02-20T12:00:00Z",
    description: "El evento de compra no se dispara para usuarios de Safari móvil.",
    diagnostics: {
      description:
        "La actualización de iOS 17.4 bloquea ciertos parámetros de tracking en Safari sin una implementación Server-Side adecuada.",
      error: "error: missing_param 'external_id' at MetaPixel.sendEvent (v1.2.1)",
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
        timestamp: new Date().toISOString(),
        description: "Esperando acción correctiva del administrador.",
      },
    ],
    recommendedAction: "Implementar Conversions API (CAPI) para redundancia de eventos.",
  },
  {
    id: "2",
    title: "Fuente No Mapeada",
    impact: 2400,
    platform: "DATA",
    severity: "ALERTA",
    createdAt: "2026-02-20T12:00:00Z",
    description: "El evento de compra no se dispara para usuarios de Safari móvil.",
    diagnostics: {
      description:
        "La actualización de iOS 17.4 bloquea ciertos parámetros de tracking en Safari sin una implementación Server-Side adecuada.",
      error: "error: missing_param 'external_id' at MetaPixel.sendEvent (v1.2.1)",
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
    recommendedAction: "Implementar Conversions API (CAPI) para redundancia de eventos.",
  },
  {
    id: "3",
    title: "Evento Duplicado",
    impact: 1100,
    platform: "GOOGLE ADS",
    severity: "ALERTA",
    createdAt: "2026-02-20T12:00:00Z",
    description: "El evento de compra no se dispara para usuarios de Safari móvil.",
    diagnostics: {
      description:
        "La actualización de iOS 17.4 bloquea ciertos parámetros de tracking en Safari sin una implementación Server-Side adecuada.",
      error: "error: missing_param 'external_id' at MetaPixel.sendEvent (v1.2.1)",
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
    recommendedAction: "Implementar Conversions API (CAPI) para redundancia de eventos.",
  },
];

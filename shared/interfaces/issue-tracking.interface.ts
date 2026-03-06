export type IssueSeverity = "CRÍTICO" | "ALERTA" | "INFO";

export interface Issue {
  id: string;
  title: string;
  impact: number;
  platform: "STRIPE" | "META ADS" | "GOOGLE ADS" | "DATA" | "META PIXEL";
  severity: IssueSeverity;
  retargeting: string;
  createdAt: string;
  description: string;
  diagnostics: {
    description: {
      text: string;
      blockedParams: string[];
      footer: string;
    };
    error: string;
  };
  timeline: {
    timestamp: string;
    description: string;
  }[];
  recommendedAction: string;
}

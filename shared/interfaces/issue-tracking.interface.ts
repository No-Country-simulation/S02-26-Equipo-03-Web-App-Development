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
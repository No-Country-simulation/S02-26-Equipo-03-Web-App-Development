export type IntegrationStatus = "ok" | "warning" | "error";

export interface Integration {
  name: string;
  status: IntegrationStatus;
}

export type CardVariant = "ok" | "warning" | "critical";

export interface SystemHealthCardProps {
  variant: CardVariant;
  score: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  integrations: Integration[];
}
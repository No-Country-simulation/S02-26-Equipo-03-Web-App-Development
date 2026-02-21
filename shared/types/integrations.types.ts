export type IntegrationStatus = "conectado" | "alerta" | "critico";

export interface AlertField {
  label: string;
  value: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  lastSync?: string;
  alertField?: AlertField;
  trackingId?: string;
}
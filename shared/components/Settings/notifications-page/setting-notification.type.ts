export type NotificationKey =
  | "trackingHealth"
  | "syncCompleta"
  | "resumenSemanal"
  | "nuevosUsuarios"
  | "alertasTiempoReal"
  | "recordatoriosExportacion";

export type NotificationSettings = Record<NotificationKey, boolean>;

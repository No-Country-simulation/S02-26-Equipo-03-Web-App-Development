"use client";

import { useState } from "react";
import { NotificationKey, NotificationSettings } from "./setting-notification.type";
import { NotificationSection } from "./NotificationSection";
import { Button } from "../../ui/button";
import { showToast } from "@/shared/lib/Toast";

const EMAIL_NOTIFICATIONS: { key: NotificationKey; title: string; description: string }[] = [
  {
    key: "trackingHealth",
    title: "Tracking Health crítico",
    description: "Recibí una alerta inmediata cuando se detecten problemas en tus pixels.",
  },
  {
    key: "syncCompleta",
    title: "Sincronización completa",
    description: "Te avisamos cuando tus datos de Stripe y Ads estén listos.",
  },
  {
    key: "resumenSemanal",
    title: "Resumen semanal de performance",
    description: "Un reporte ejecutivo todos los lunes por la mañana.",
  },
  {
    key: "nuevosUsuarios",
    title: "Nuevos usuarios agregados",
    description: "Notificación cuando un miembro acepta una invitación.",
  },
];

const INAPP_NOTIFICATIONS: { key: NotificationKey; title: string; description: string }[] = [
  {
    key: "alertasTiempoReal",
    title: "Alertas en tiempo real",
    description: "Notificaciones dentro de la plataforma mientras navegás.",
  },
  {
    key: "recordatoriosExportacion",
    title: "Recordatorios de exportación",
    description: "Aviso cuando tus reportes programados estén listos.",
  },
];

export default function NotificationsSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    trackingHealth: false,
    syncCompleta: false,
    resumenSemanal: false,
    nuevosUsuarios: false,
    alertasTiempoReal: false,
    recordatoriosExportacion: false,
  });

  const handleChange = (key: NotificationKey, val: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    showToast.success("Guardado correctamente", "Los cambios se aplicaron exitosamente.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-6">
        <NotificationSection
          title="Email Notifications"
          items={EMAIL_NOTIFICATIONS}
          settings={settings}
          onChange={handleChange}
        />
        <NotificationSection
          title="In-App Notifications"
          items={INAPP_NOTIFICATIONS}
          settings={settings}
          onChange={handleChange}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="rounded-sm bg-[#059669] px-4 py-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#047857] focus-visible:ring-2 focus-visible:ring-[#05966966]/40 focus-visible:ring-offset-2 focus-visible:outline-none active:bg-[#065F46]"
          >
            Guardar Preferencias
          </Button>
        </div>
      </div>
    </div>
  );
}

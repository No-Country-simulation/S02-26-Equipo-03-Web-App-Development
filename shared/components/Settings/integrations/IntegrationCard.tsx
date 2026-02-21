"use client";

import { useRouter } from "next/navigation";
import { Clock, Info, AlertTriangle } from "lucide-react";
import { SiStripe, SiMeta, SiGoogleads } from "react-icons/si";
import StatusBadge from "@/shared/components/ui/StatusBadges/StatusBadge";
import { cn } from "@/shared/lib/utils";
import type { Integration } from "@/shared/types/integrations.types";

const integrationIcons: Record<string, React.ReactNode> = {
  stripe: (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6772E5]">
      <SiStripe className="text-white text-lg" />
    </div>
  ),
  "meta-ads": (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2]">
      <SiMeta className="text-white text-lg" />
    </div>
  ),
  "google-ads": (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200">
      <SiGoogleads className="text-[#4285F4] text-lg" />
    </div>
  ),
};

interface IntegrationCardProps {
  integration: Integration;
}

export default function IntegrationCard({ integration }: IntegrationCardProps) {
  const router = useRouter();
  const { id, name, description, status, lastSync, alertField, trackingId } = integration;
  const hasAlert = status === "alerta" || status === "critico";

  return (
    <div
      className={cn("flex flex-col rounded-2xl border border-gray-200 bg-white p-6")}
    >
      {/* Sección superior */}
      <div className="flex flex-col gap-5 py-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <StatusBadge status={status} />
          <Info className="h-4 w-4 text-[#90A1B9]" />
        </div>

        {/* Logo + Nombre */}
        <div className="flex items-center gap-3">
          {integrationIcons[id]}
          <span className="text-xl font-semibold text-gray-900">{name}</span>
        </div>

        {/* Descripción */}
        <p className="text-sm text-[#62748E]">{description}</p>
      </div>

      {/* Sección inferior — siempre al fondo */}
      <div className="flex flex-col gap-3 mt-4">
        {!hasAlert && lastSync && (
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[#90A1B9] border-t border-[#F1F5F9] pt-3">
            <Clock className="h-3.5 w-3.5" />
            <span>Última sync: {lastSync}</span>
            <Info className="h-3.5 w-3.5" />
          </div>
        )}

        {hasAlert && (
          <>
            {/* Campo afectado */}
            {alertField && (
              <div className="flex items-center justify-between text-xs border-t border-b border-[#F8FAFC] py-3">
                <div className="flex items-center gap-1 font-medium uppercase tracking-wide text-[#90A1B9]">
                  <span>{alertField.label}</span>
                  <Info className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold text-gray-900">{alertField.value}</span>
              </div>
            )}

            {/* Banner acción requerida */}
            <div className="flex items-center gap-2 border-l-4 border-[#FE9A00] bg-[#FFFBEB] p-3 text-xs font-semibold uppercase tracking-wide text-[#BB4D00]">
              <AlertTriangle className="h-3.5 w-3.5 text-[#E17100]" />
              <span>Acción requerida</span>
            </div>

            {/* Gestionar */}
            <div className="border-t border-[#F1F5F9] pt-3 flex justify-end">
              <button
                onClick={() => router.push(`/dashboard/tracking/${trackingId}`)}
                className="text-xs font-semibold uppercase tracking-wide text-gray-900 hover:text-gray-600 transition-colors"
              >
                Gestionar ›
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
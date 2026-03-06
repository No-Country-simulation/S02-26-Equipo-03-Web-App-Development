"use client";

import Link from "next/link";
import { ArrowRight, BadgeInfo } from "lucide-react";
import StatusBadge from "@/shared/components/ui/StatusBadges/StatusBadge";
import { cn } from "@/shared/lib/utils";
import type { Integration } from "@/shared/types/status-integrations.types";
import Image from "next/image";
import { Button } from "../../ui/button";

const integrationLogos: Record<string, { src: string; alt: string }> = {
  stripe: { src: "/images/stripe.svg", alt: "Stripe" },
  meta: { src: "/images/meta.svg", alt: "Meta" },
  google: { src: "/images/google-ads.svg", alt: "Google Ads" },
};

function getIntegrationLogo(name: string) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("stripe")) return integrationLogos.stripe;
  if (normalizedName.includes("meta")) return integrationLogos.meta;
  if (normalizedName.includes("google")) return integrationLogos.google;

  return null;
}

interface IntegrationCardProps {
  integration: Integration;
}

export default function IntegrationCard({ integration }: IntegrationCardProps) {
  const { description, status, lastSync, alertField, trackingId, integrationUrl } = integration;
  const hasAlert = status === "alerta" || status === "critico";
  const logo = getIntegrationLogo(integration.name);
  const manageHref = integrationUrl ?? `/dashboard/tracking/${trackingId ?? ""}`;
  const isExternalLink = manageHref.startsWith("http://") || manageHref.startsWith("https://");
  const ctaLabel = !hasAlert ? "Abrir integración" : "Gestionar";
  return (
    <div className={cn("flex w-60 flex-col rounded-lg border border-[#E2E8F0]/50 bg-white p-6")}>
      {/* Sección superior */}
      <div className="flex flex-col gap-4 py-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <StatusBadge status={status} />
        </div>

        {/* Logo + Nombre */}
        <div className="flex items-center gap-3">
          {logo && (
            <Image
              src={logo.src}
              alt={logo.alt}
              width={0}
              height={36}
              sizes="100vw"
              className={`h-9 w-auto ${integration.id === "meta-ads" ? "max-w-32" : ""}`}
            />
          )}
        </div>

        {/* Descripción */}
        <p className="pb-4 text-sm text-[#020617]">{description}</p>
      </div>

      {/* Sección inferior — siempre al fondo */}
      <div className="mt-auto flex flex-col gap-3">
        {!hasAlert && lastSync && (
          <div className="flex items-center gap-1.5 pt-3 text-xs font-medium text-[#475569]">
            <BadgeInfo className="h-4 w-4" strokeWidth={3} />
            <span>Última sync: {lastSync}</span>
          </div>
        )}

        {hasAlert && (
          <>
            {/* Campo afectado */}
            {alertField && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-medium text-[#475569]">
                  <BadgeInfo className="h-4 w-4" strokeWidth={3} />
                  <span>{alertField.label}</span>
                </div>
                <span className="font-medium text-[#475569]">{alertField.value}</span>
              </div>
            )}
          </>
        )}
        {/* Gestionar */}
        <div className="flex justify-end border-t border-[#F1F5F9] pt-1">
          <Button asChild variant={"link"} className="text-xs font-medium text-[#475569]">
            <Link
              href={hasAlert ? "/dashboard/tracking" : manageHref}
              target={isExternalLink ? "_blank" : undefined}
              rel={isExternalLink ? "noopener noreferrer" : undefined}
            >
              {ctaLabel}
              <ArrowRight strokeWidth={3} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

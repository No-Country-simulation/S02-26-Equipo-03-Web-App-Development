"use client";

import { AlertTriangle, CircleCheckBig } from "lucide-react";
import { ScoreRing } from "./ScoreRing";
import { CardVariant, IntegrationStatus, SystemHealthCardProps } from "./healt-card.interface";



// ─── Config per variant ───────────────────────────────────────────────────────

const variantConfig: Record<
  CardVariant,
  {
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    subtitleColor: string;
    icon: React.ReactNode;
  }
> = {
  ok: {
    borderColor: "border-[#BBF7D1]",
    badgeBg: "bg-[#EEFFF4]",
    badgeText: "text-[#049140]",
    subtitleColor: "text-[#049140]",
    icon: <CircleCheckBig className="w-5 h-5 text-green-500" />,
  },
  warning: {
    borderColor: "border-[#FFFD86]",
    badgeBg: "bg-[#FFFFE7]",
    badgeText: "text-[#A67102]",
    subtitleColor: "text-[#A67102]",
    icon: <AlertTriangle className="w-5 h-5 text-yellow-300" />,
  },
  critical: {
    borderColor: "border-[#FFC0C0]",
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
    subtitleColor: "text-red-600",
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
  },
};

const integrationDotColor: Record<IntegrationStatus, string> = {
  ok: "bg-green-500",
  warning: "bg-yellow-300",
  error: "bg-red-500",
};

// ─── Circular Score ───────────────────────────────────────────────────────────



// ─── Main Component ───────────────────────────────────────────────────────────

export function SystemHealthCard({
  variant,
  score,
  badge,
  title,
  subtitle,
  description,
  integrations,
}: SystemHealthCardProps) {
  const cfg = variantConfig[variant];

  return (
    <div
      className={`w-full rounded-md border-2 ${cfg.borderColor} bg-white px-6 py-5 flex items-center justify-between gap-6`}
    >
      {/* Left content */}
      <div className="flex flex-col gap-2 min-w-0">
        {/* Badge */}
        <span
          className={`self-start text-xs font-medium uppercase px-2.5 py-1 rounded-sm border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.borderColor}`}
        >
          {badge}
        </span>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 leading-snug">{title}</h2>

        {/* Subtitle */}
        <p className={`flex items-center gap-1.5 text-sm font-medium ${cfg.badgeText}`}>
          {cfg.icon}
          {subtitle}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

        {/* Integrations */}
        <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
          <span className="font-medium">Integraciones:</span>
          {integrations.map((integration) => (
            <span key={integration.name} className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${integrationDotColor[integration.status]}`}
              />
              {integration.name}
            </span>
          ))}
        </div>
      </div>

      {/* Score Ring */}
      <ScoreRing score={score} variant={variant} />
    </div>
  );
}

// ─── Demo / Usage ─────────────────────────────────────────────────────────────

export default function SystemHealthCardDemo() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 p-8">
      {/* OK state */}
      <SystemHealthCard
        variant="ok"
        score={92}
        badge="Todo funcionando correctamente"
        title="Sistema operando con normalidad"
        subtitle="Todas las integraciones funcionan correctamente"
        description="No se detectaron anomalías en la sincronización de datos. Todos los sistemas operan dentro de los parámetros esperados."
        integrations={[
          { name: "Stripe", status: "ok" },
          { name: "Meta", status: "ok" },
          { name: "Google", status: "ok" },
        ]}
      />

      {/* Warning state */}
      <SystemHealthCard
        variant="warning"
        score={72}
        badge="Requiere revisión"
        title="Detección de anomalías menores"
        subtitle="Se detectaron pequeños retrasos"
        description="Se detectaron retrasos menores en la sincronización. Impacto estimado: < 5% del revenue atribuido."
        integrations={[
          { name: "Stripe", status: "ok" },
          { name: "Meta", status: "ok" },
          { name: "Google", status: "warning" },
        ]}
      />

      {/* Critical state */}
      <SystemHealthCard
        variant="critical"
        score={50}
        badge="Atención inmediata requerida"
        title="Problemas críticos detectados"
        subtitle="Se detectaron fallas graves en el tracking"
        description="Se detectaron múltiples eventos perdidos que están afectando significativamente la atribución. Impacto estimado: ~$2,500/día en revenue no atribuido."
        integrations={[
          { name: "Stripe", status: "ok" },
          { name: "Meta", status: "error" },
          { name: "Google", status: "warning" },
        ]}
      />
    </div>
  );
}
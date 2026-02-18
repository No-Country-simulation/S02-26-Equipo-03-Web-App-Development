"use client";

import { Plan } from "@/shared/types/pricing.types";
import { PricingCard } from "@/shared/components/Cards/PricingCard";

const plans: Plan[] = [
  {
    name: "Starter",
    subtitle: "Para equipos pequeños",
    features: [
      "Stripe connection",
      "Dashboard básico",
      "Tracking Health básico",
    ],
    cta: "Solicitar acceso",
    ctaVariant: "outline" as const,
    recommended: false,
  },
  {
    name: "Growth",
    subtitle: "Para marketing teams activos",
    features: [
      "Campaign ROAS real",
      "Discrepancy alerts",
      "Export reporting",
      "Setup support",
      "Priority tracking",
    ],
    cta: "Agendar demo",
    ctaVariant: "primary" as const,
    recommended: true,
  },
  {
    name: "Enterprise",
    subtitle: "Para compañías con volumen alto",
    features: [
      "Multi-account support",
      "Dedicated support manager",
      "Custom integrations",
      "SLA + Compliance",
      "White-label reports",
    ],
    cta: "Hablar con ventas",
    ctaVariant: "outline" as const,
    recommended: false,
  },
];

export default function PricingSection() {
  return (
    <section className="relative bg-[#F7F9FA] py-24 px-4 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.06),transparent)]" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Planes para equipos que invierten en{" "}
            <span className="text-primary-blue">growth</span>
          </h2>
          <p className="text-cool-gray text-base">
            Precios transparentes que escalan con tu volumen.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-8 flex items-center justify-center gap-1">
          <span>⚡</span>
          Los precios dependen del volumen mensual procesado.
        </p>
      </div>
    </section>
  );
}


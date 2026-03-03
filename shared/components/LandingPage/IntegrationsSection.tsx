"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/shared/components/LandingPage";

type IntegrationCardProps = {
  name: string;
  description: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
};

function IntegrationCard({
  name,
  description,
  features,
  imageSrc,
  imageAlt,
}: IntegrationCardProps) {
  return (
    <Card className="max-w-75 border-none p-0 shadow-none">
      <CardContent className="space-y-6 p-0">
        <Image src={imageSrc} alt={imageAlt} width={120} height={48} className="h-12 w-auto" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-950">{name}</h3>
          <p className="text-base text-slate-600">{description}</p>
        </div>
        <ul className="space-y-2 text-base/6 font-medium">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-slate-950">
              <CheckCircle className="size-6 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function IntegrationsSection() {
  return (
    <Section>
      <SectionContent className="space-y-12">
        <SectionHeader>
          <SectionTitle>Integraciones simples</SectionTitle>
          <SectionDescription className="text-2xl/8">
            Se conecta con herramientas en las que ya confiás. OAuth seguro • Solo lectura •
            Auto-sincronización
          </SectionDescription>
        </SectionHeader>
        <div className="grid gap-12 bg-white p-8 md:grid-cols-2 md:p-12 lg:grid-cols-3 lg:justify-between lg:p-16">
          <IntegrationCard
            name="Stripe"
            description="Conecta tu procesador de pagos para rastrear revenue real."
            imageSrc="/images/stripe.svg"
            imageAlt="Stripe logo"
            features={[
              "OAuth 1-click",
              "Read-only access",
              "Webhook automático",
              "Sync en tiempo real",
            ]}
          />

          <IntegrationCard
            name="Meta"
            description="Sincroniza eventos de conversión y gasto publicitario automáticamente."
            imageSrc="/images/meta.svg"
            imageAlt="Meta logo"
            features={[
              "Pixel + Conversions API",
              "Event Manager link",
              "Campaign performance",
              "Attribution window 7d",
            ]}
          />
          <IntegrationCard
            name="Google Ads"
            description="Importa campañas, conversiones y costos directamente desde Google."
            imageSrc="/images/google-ads.svg"
            imageAlt="Google Ads logo"
            features={["Google Ads API", "Conversion tracking", "Campaign data"]}
          />
        </div>
      </SectionContent>
    </Section>
  );
}

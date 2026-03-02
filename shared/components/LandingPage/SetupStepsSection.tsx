"use client";

import React from "react";
import Image from "next/image";
import { Activity, Bell, Download, LucideIcon, RefreshCw, ShieldCheck, Target } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/shared/components/LandingPage";

// types
interface FeatureItem {
  icon: LucideIcon;
  text: string;
}

interface StepCardProps {
  step: string;
  title: string;
  features: FeatureItem[];
  duration: string;
}

// Static Data
const steps = [
  {
    step: "01",
    title: "Conectá Stripe",
    duration: "Setup: < 1 min",
    features: [
      {
        icon: ShieldCheck,
        text: "OAuth seguro en 2 clicks. Sin contraseña.",
      },
      {
        icon: ShieldCheck,
        text: "Solo permisos de lectura. Tu data está protegida.",
      },
    ],
  },
  {
    step: "02",
    title: "Conectá tus Ads",
    duration: "Setup: < 1 min",
    features: [
      {
        icon: Target,
        text: "Meta + Google en 1 click cada uno.",
      },
      {
        icon: RefreshCw,
        text: "Auto-sincronización cada 5 minutos.",
      },
      {
        icon: ShieldCheck,
        text: "Sin tocar tu configuración actual.",
      },
    ],
  },
  {
    step: "03",
    title: "Monitorea tu Revenue",
    duration: "Setup: < 1 min",
    features: [
      {
        icon: Activity,
        text: "ROAS confirmado por Stripe + Health Scrore 24/7.",
      },
      {
        icon: Bell,
        text: "Alertas automáticas cuando algo se rompe.",
      },
      {
        icon: Download,
        text: "Exportá todo a CSV o PDF..",
      },
    ],
  },
];

// Components
function StepCard({ step, title, features, duration }: StepCardProps) {
  return (
    <Card className="h-full max-w-77 min-w-70 rounded-lg border-slate-200 p-6 shadow-sm">
      <CardContent className="space-y-4 p-0">
        <div className="text-5xl font-bold text-slate-600">{step}</div>
        <h3 className="text-xl/7 font-semibold text-slate-950">{title}</h3>
        <div className="space-y-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-3 text-slate-950">
                <Icon className="size-6 shrink-0 text-slate-600" />
                <p className="font-medium">{feature.text}</p>
              </div>
            );
          })}
        </div>
        <p className="text-center text-[#049140]">{duration}</p>
      </CardContent>
    </Card>
  );
}
// jjjjj
// jjj
function StepArrow() {
  return (
    <Image
      src="/images/arrow.svg"
      alt="arrow"
      width={97}
      height={60}
      className="h-15 w-auto rotate-90 lg:rotate-0"
    />
  );
}

// Section Component
export function SetupStepsSection() {
  return (
    <Section>
      <SectionContent className="flex flex-col items-center space-y-12">
        {/* Heading */}
        <SectionHeader>
          <SectionTitle>Como funciona — Setup en 5 minutos</SectionTitle>
          <SectionDescription className="text-24/8">
            Tres pasos simples para empezar a monitorear tu renueve real.
          </SectionDescription>
        </SectionHeader>
        {/* Cards */}
        <div className="flex h-96 flex-col items-center gap-10 xl:flex-row">
          {steps.map((step, index) => (
            <React.Fragment key={step.step}>
              <StepCard {...step} />
              {/* Arrow between cards */}
              {index < steps.length - 1 && <StepArrow />}
            </React.Fragment>
          ))}
        </div>
      </SectionContent>
    </Section>
  );
}

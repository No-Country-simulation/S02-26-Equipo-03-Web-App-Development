"use client";

import Image from "next/image";
import { TrendingUp, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/shared/components/LandingPage";

export function AttributionIssuesSection() {
  return (
    <Section>
      <SectionContent className="flex flex-col items-center space-y-12">
        {/* Heading */}
        <SectionHeader>
          <SectionTitle>¿Por qué tu atribución está rota?</SectionTitle>
          <SectionDescription>
            Tus plataformas publicitarias reportan conversiones que nunca ocurrieron. Estás
            optimizando campañas con datos que no representan ingresos reales.
          </SectionDescription>
        </SectionHeader>
        {/* Cards */}
        <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="max-w-100 min-w-85 rounded-lg border-slate-200 p-6 text-center shadow-sm">
            <CardContent className="space-y-4 p-0">
              <div className="text-5xl font-bold text-[#D70000]">30-40%</div>
              <h3 className="text-2xl/8 font-semibold text-slate-950">Eventos perdidos</h3>
              <p className="text-base font-normal text-slate-600">
                Los bloqueadores de anuncios y restricciones del navegador descartan silenciosamente
                eventos de compras antes de que lleguen al Pixel de Meta.
              </p>
              <div className="font-base flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 py-2 font-medium text-yellow-700">
                <TriangleAlert className="size-6 text-yellow-400" />
                Optimización a ciegas
              </div>
            </CardContent>
          </Card>

          <Card className="max-w-100 min-w-85 rounded-lg border-slate-200 p-6 text-center shadow-sm">
            <CardContent className="space-y-4 p-0">
              <div className="text-5xl font-bold text-[#D70000]">2.5x</div>
              <h3 className="text-2xl/8 font-semibold text-slate-950">Métricas infladas</h3>
              <p className="text-base font-normal text-slate-600">
                Eventos duplicados contados dos veces hacen que tu ROAS se vea mejor de lo ques es
                en realidad.
              </p>
              <div className="font-base flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 py-2 font-medium text-yellow-700">
                <TrendingUp className="size-6 text-yellow-400" />
                Señales falsas de éxito
              </div>
            </CardContent>
          </Card>

          <Card className="max-w-100 min-w-85 rounded-lg border-slate-200 p-6 text-center shadow-sm">
            <CardContent className="space-y-4 p-0">
              <div className="flex h-15 flex-row items-center justify-center gap-2 rounded-lg bg-slate-50 text-xl font-semibold text-black">
                <Image
                  src="/images/stripe.svg"
                  alt="Stripe logo"
                  width={120}
                  height={24}
                  className="h-6 w-auto"
                />
                <span>≠</span>
                <Image
                  src="/images/meta.svg"
                  alt="Meta logo"
                  width={120}
                  height={24}
                  className="h-6 w-auto"
                />
                <span>≠</span>
                <Image
                  src="/images/google-ads.svg"
                  alt="Google Ads logo"
                  width={120}
                  height={24}
                  className="h-6 w-auto"
                />
              </div>
              <h3 className="text-2xl/8 font-semibold text-slate-950">Revenue inconsistente</h3>
              <p className="text-base font-normal text-slate-600">
                Cada plataforma reporta ingresos distintos para la misma campaña.
              </p>
              <div className="font-base flex w-full items-start justify-between gap-2 rounded-lg bg-slate-50 p-2 font-medium text-slate-600">
                <TrendingUp className="size-6 text-slate-700" />
                <div className="w-74 text-start">
                  <p className="text-slate-950">No podés confiar en ningún reporte.</p>
                  <p>Spoiler: el único ingreso real es el confirmado por Stripe.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionContent>
    </Section>
  );
}

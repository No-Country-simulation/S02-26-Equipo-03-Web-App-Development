import { Play, ShieldCheck } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { DashboardCard } from "./DashboardCard";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-between gap-10 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-10 lg:pt-25 lg:pb-30">
      <div className="flex w-full max-w-xl flex-col items-start gap-8 text-left">
        <h1 className="text-3xl font-bold tracking-[-1.6px] text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl">
          Dejá de confiar en conversiones infladas.
          <br />
          <span className="text-blue-600"> Stripe es la verdad. </span>
          <br /> Nosotros la hacemos visible.
        </h1>
        <p className="max-w-md text-xl/8 text-gray-500">
          Unificamos Ads + pagos reales para que founders y marketing trabajen con revenue
          confirmado, no con estimaciones.
        </p>
        <div className="flex gap-2">
          <Button className="bg-blue-600 px-10 py-5 font-bold shadow-lg shadow-blue-600">
            Agendar demo
          </Button>
          <Button variant="ghost" className="px-10 font-bold text-gray-800 hover:opacity-80">
            <Play className="h-4 w-4 fill-gray-800 stroke-0" />
            Ver cómo funciona
          </Button>
        </div>
        <div className="flex h-9 items-end gap-6">
          {["Stripe Verified Payments", "Meta CAPI Ready", "GDPR Compliant"].map((text, index) => (
            <Badge
              key={index}
              className="flex items-center gap-2 bg-white p-0 text-sm font-semibold text-gray-800"
            >
              <ShieldCheck className="h-4! w-4! stroke-2 text-emerald-500" />
              {text}
            </Badge>
          ))}
        </div>
      </div>
      <DashboardCard />
    </section>
  );
}

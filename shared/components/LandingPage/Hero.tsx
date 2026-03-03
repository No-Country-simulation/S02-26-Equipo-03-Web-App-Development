import Image from "next/image";
import { CheckCircle, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-linear-to-b from-emerald-950 to-emerald-600">
      <div className="pt-16">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-215">
            {/* Headline */}
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl/12 md:text-5xl/15">
              ROAS Real. Sin Mentiras.
              <br className="hidden sm:block" />
              Sin perder $3.000/mes en optimización ciega
            </h1>

            {/* Subtext */}
            <p className="text-lg font-semibold text-white md:text-xl lg:text-2xl">
              La única plataforma que muestra ROAS confirmado por pagos de Stripe — no los números
              de fantasía de Meta. Más monitoreo 24/7 de tracking health.
            </p>

            {/* CTA */}
            <Button size="primary" variant="primary" className="my-6">
              Agendar Demo — Ver mi ROAS Real
            </Button>
            <div className="h-px w-full bg-white"></div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-emerald-200">
              <div className="flex items-center gap-2 text-base font-normal text-white">
                <CheckCircle className="size-6 text-green-500" />
                <span>Sin tarjeta</span>
              </div>
              <div className="flex items-center gap-2 text-base font-normal text-white">
                <ShieldCheck className="size-6 text-green-500" />
                <span>SOC 2 Certificado</span>
              </div>
              <div className="flex items-center gap-2 text-base font-normal text-white">
                <Clock className="size-6 text-green-500" />
                <span>Setup en 2 min</span>
              </div>
            </div>
          </div>
          <div className="relative my-6 w-8/10 max-w-6xl overflow-hidden rounded-xl shadow-2xl sm:my-8 md:my-10 lg:my-12">
            <Image
              src="/images/dashboard-preview.png"
              alt="Dashboard preview"
              width={1400}
              height={800}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="h-18 w-full bg-linear-to-b from-transparent to-slate-50 sm:h-22 md:h-26" />
    </section>
  );
}

"use client";

import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import Image from "next/image";

const TESTIMONIALS = [
  {
    quote:
      "Descubrimos que estábamos optimizando campañas con datos inflados. Cuando cruzamos Ads con Stripe, el ROAS real era muy distinto. GardenAds nos dio claridad inmediata y decisiones más inteligentes.",
    author: "Martín Alvarez",
    role: "Founder & CEO · NovaLegal",
    avatar: "/placeholder-avatar.svg", // Reemplazar con tus imágenes
  },
  {
    quote:
      "Antes mirábamos tres dashboards distintos y ninguno coincidía. Hoy tenemos una sola fuente de verdad. Si el ROAS aparece en GardenAds, sabemos que está confirmado por pagos reales.",
    author: "Camila Torres",
    role: "Head of Growth · ScaleRocket",
    avatar: "/placeholder-avatar.svg",
  },
  {
    quote:
      "La implementación fue sorprendentemente rápida. En menos de un día ya teníamos visibilidad total sobre qué canales estaban trayendo clientes de alto valor.",
    author: "Lucas Rossi",
    role: "E-commerce Manager · TechStore",
    avatar: "/placeholder-avatar.svg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full px-6 py-24">
      <div className="mx-auto">
        <h2 className="mb-16 text-center text-3xl font-bold text-[#0f172a] md:text-4xl">
          Confianza de Equipos E-commerce Inteligentes
        </h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {TESTIMONIALS.map((t, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2">
                <Card className="h-full rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                  <CardContent className="flex h-full flex-col items-center justify-between p-10 text-center">
                    {/* Comillas e Icono */}
                    <div className="relative mb-6">
                      <span className="absolute -top-4 -left-6 font-serif text-4xl text-black">
                        “
                      </span>
                      <p className="text-lg leading-relaxed font-medium text-slate-700">
                        {t.quote}
                      </p>
                      <span className="absolute -right-4 -bottom-8 font-serif text-4xl text-black">
                        ”
                      </span>
                    </div>

                    {/* Autor Info */}
                    <div className="mt-8 flex flex-col items-center">
                      <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-slate-50 shadow-sm">
                        <Image
                          src={t.avatar}
                          alt={t.author}
                          width={320}
                          height={320}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">{t.author}</h4>
                      <p className="text-sm font-medium text-slate-500">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Botones de Navegación posicionados abajo a la derecha como en la imagen */}
          <div className="mt-12 flex justify-end gap-4 pr-4">
            <CarouselPrevious className="static h-12 w-12 translate-y-0 border-none bg-slate-100 text-slate-600 hover:bg-slate-200" />
            <CarouselNext className="static h-12 w-12 translate-y-0 border-none bg-slate-100 text-slate-600 hover:bg-slate-200" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

"use client"

import React from 'react'
import { Card, CardContent } from "@/shared/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel"
import Image from 'next/image'

const TESTIMONIALS = [
  {
    quote: "Descubrimos que estábamos optimizando campañas con datos inflados. Cuando cruzamos Ads con Stripe, el ROAS real era muy distinto. GardenAds nos dio claridad inmediata y decisiones más inteligentes.",
    author: "Martín Alvarez",
    role: "Founder & CEO · NovaLegal",
    avatar: "/api/placeholder/80/80" // Reemplazar con tus imágenes
  },
  {
    quote: "Antes mirábamos tres dashboards distintos y ninguno coincidía. Hoy tenemos una sola fuente de verdad. Si el ROAS aparece en GardenAds, sabemos que está confirmado por pagos reales.",
    author: "Camila Torres",
    role: "Head of Growth · ScaleRocket",
    avatar: "/api/placeholder/80/80"
  },
  {
    quote: "La implementación fue sorprendentemente rápida. En menos de un día ya teníamos visibilidad total sobre qué canales estaban trayendo clientes de alto valor.",
    author: "Lucas Rossi",
    role: "E-commerce Manager · TechStore",
    avatar: "/api/placeholder/80/80"
  }
]

export default function TestimonialsSection() {
  return (
    <section className="w-full  py-24 px-6">
      <div className=" mx-auto">
        
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0f172a] mb-16">
          Confianza de Equipos E-commerce Inteligentes
        </h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full  "
        >
          <CarouselContent className="-ml-4">
            {TESTIMONIALS.map((t, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2">
                <Card className="border border-slate-100 shadow-sm rounded-[2rem] h-full transition-all hover:shadow-md">
                  <CardContent className="p-10 flex flex-col items-center text-center h-full justify-between">
                    
                    {/* Comillas e Icono */}
                    <div className="relative mb-6">
                      <span className="text-4xl text-black font-serif absolute -top-4 -left-6">“</span>
                      <p className="text-slate-700 text-lg leading-relaxed font-medium">
                        {t.quote}
                      </p>
                      <span className="text-4xl text-black font-serif absolute -bottom-8 -right-4">”</span>
                    </div>

                    {/* Autor Info */}
                    <div className="flex flex-col items-center mt-8">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-slate-50 shadow-sm">
                        <Image 
                          src={t.avatar} 
                          alt={t.author}
                          width={320}
                            height={320}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">{t.author}</h4>
                      <p className="text-slate-500 text-sm font-medium">{t.role}</p>
                    </div>

                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Botones de Navegación posicionados abajo a la derecha como en la imagen */}
          <div className="flex justify-end gap-4 mt-12 pr-4">
            <CarouselPrevious className="static translate-y-0 h-12 w-12 border-none bg-slate-100 hover:bg-slate-200 text-slate-600" />
            <CarouselNext className="static translate-y-0 h-12 w-12 border-none bg-slate-100 hover:bg-slate-200 text-slate-600" />
          </div>
        </Carousel>

      </div>
    </section>
  )
}
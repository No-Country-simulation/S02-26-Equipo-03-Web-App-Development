"use client"


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion"

const FAQ_ITEMS = [
  {
    question: "¿Cómo se conecta Stripe?",
    answer: "La conexión se realiza a través de OAuth seguro en menos de 2 minutos. Solo necesitas permisos de lectura para que GardenAds pueda cruzar los datos de ventas reales con tus campañas de marketing."
  },
  {
    question: "¿Qué pasa si el tracking falla?",
    answer: "Nuestro sistema de 'Tracking Health' monitorea tus eventos 24/7. Si detectamos una caída en la recepción de datos de Meta o Google, recibirás una alerta inmediata vía email o Slack."
  },
  {
    question: "¿Cuánto tarda el setup completo?",
    answer: "El setup base toma menos de 10 minutos. Una vez conectado Stripe y tus cuentas de Ads, el sistema comienza a procesar datos históricos para darte visibilidad inmediata."
  },
  {
    question: "¿Necesito ingenieros para implementar?",
    answer: "No. GardenAds está diseñado para ser 'no-code'. Si ya tienes instalados los píxeles básicos de Meta o Google, nuestro sistema se encarga del resto mediante integraciones directas por API."
  },
  {
    question: "¿Puedo exportar todos los datos?",
    answer: "Absolutamente. Puedes descargar reportes en PDF para presentaciones o CSV con toda la data cruda para realizar tus propios análisis internos en Excel o BI."
  },
  {
    question: "¿Hay límite de usuarios o revenue?",
    answer: "El plan profesional incluye hasta 5 usuarios. No limitamos la cantidad de revenue trackeado, ya que nuestro objetivo es ayudarte a escalar sin penalizar tu crecimiento."
  }
]

export default function FAQSection() {
  return (
    <section className="w-full bg-white py-24 px-6">
      <div className="p-10 mx-auto">
        
        {/* Título Principal */}
        <h2 className="text-3xl  font-bold text-center text-[#0f172a] mb-16">
          Preguntas Frecuentes
        </h2>

        {/* Acordeón de Preguntas */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border w-full border-slate-100 rounded-2xl px-6 bg-white shadow-sm overflow-hidden data-[state=open]:shadow-md transition-all"
            >
              <AccordionTrigger className="hover:no-underline py-6 text-left text-slate-800 font-semibold text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base pb-6 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>
    </section>
  )
}
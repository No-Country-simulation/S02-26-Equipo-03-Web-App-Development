import { Card, CardContent } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

const testimonials = {
  meta: {
    quote:
      "Ahora sabemos exactamente qué campañas generan compras reales, no solo clics. Dejamos de operar a ciegas.",
    author: "Andrés R.",
    role: "CEO, Hyper Growth Ecommerce",
  },
  google: {
    quote:
      "Pudimos alinear inversión con revenue real y tomar decisiones más claras en cada canal.",
    author: "Mariana P.",
    role: "Growth Lead, Blink Commerce",
  },
  stripe: {
    quote:
      "Ver pagos confirmados junto al rendimiento de campañas nos cambió por completo la lectura del negocio.",
    author: "Tomás V.",
    role: "Founder, Nexo Store",
  },
  amazon: {
    quote:
      "El equipo dejó de depender de métricas de vanidad y se enfocó en resultados que impactan ventas.",
    author: "Daniela C.",
    role: "Performance Manager, Argo Retail",
  },
  shopify: {
    quote:
      "La integración fue simple y desde la primera semana vimos oportunidades claras para escalar mejor.",
    author: "Lucas M.",
    role: "CMO, Northside Brands",
  },
};

export default function SocialProof() {
  return (
    <section className="bg-white px-6 py-24 md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="mb-10 text-center text-4xl font-semibold tracking-tight text-black">
          Equipos que escalan ads con revenue real
        </h2>

        <Tabs defaultValue="meta" className="w-full items-center gap-8">
          <TabsList
            variant="line"
            className="h-auto w-full justify-center gap-8  md:gap-10 overflow-x-auto overflow-y-hidden"
          >
            <TabsTrigger
              value="meta"
              className="px-0 text-2xl font-semibold  text-[#1A1F36] data-[state=active]:text-[#1A1F36] hover:text-gray-500"
            >
              Meta
            </TabsTrigger>
            <TabsTrigger
              value="google"
              className="px-0 text-2xl font-semibold  text-[#1A1F36] data-[state=active]:text-[#1A1F36] hover:text-gray-500"
            >
              Google
            </TabsTrigger>
            <TabsTrigger
              value="stripe"
              className="px-0 text-2xl font-semibold  text-[#1A1F36] data-[state=active]:text-[#1A1F36] hover:text-gray-500"
            >
              Stripe
            </TabsTrigger>
            <TabsTrigger
              value="amazon"
              className="px-0 text-2xl font-semibold  text-[#1A1F36] data-[state=active]:text-[#1A1F36] hover:text-gray-500 "
            >
              Amazon
            </TabsTrigger>
            <TabsTrigger
              value="shopify"
              className="px-0 text-2xl font-semibold  text-[#1A1F36] data-[state=active]:text-[#1A1F36] hover:text-gray-500"
            >
              Shopify
            </TabsTrigger>
          </TabsList>

          {Object.entries(testimonials).map(([platform, testimonial]) => (
            <TabsContent key={platform} value={platform} className="w-full">
              <Card className="mx-auto w-full max-w-3xl rounded-3xl border-[#E3E8EE] bg-[#F7F9FA] py-8 shadow-none">
                <CardContent className="flex flex-col items-center gap-4 px-10 text-center">
                  <p className="text-lg tracking-[0.2em] text-[#FFA726]">★★★★★</p>
                  <blockquote className="max-w-2xl text-2xl leading-relaxed text-black italic">
                    “{testimonial.quote}”
                  </blockquote>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-black">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

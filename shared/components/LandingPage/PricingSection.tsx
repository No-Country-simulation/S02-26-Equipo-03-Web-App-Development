
import { Card, CardContent, CardHeader, CardFooter } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Separator } from "../ui/separator";

const FEATURES = [
  "Hasta 5 usuarios",
  "Integraciones ilimitadas (Stripe, Meta, Google)",
  "Tracking Health 24/7",
  "Reportes y exportación ilimitados",
  "Soporte prioritario",
  "Onboarding personalizado 1-on-1",
];

export default function PricingSection() {
  return (
    <section className="w-full py-24 px-10 ">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
      
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">
            Precios Simples. Sin Sorpresas.
          </h2>
        </div>

   
        <div className="relative w-full max-w-md">
  
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-6 py-1.5 rounded-full shadow-sm">
              Plan Profesional
            </span>
          </div>

          <Card className="border rounded-2xl border-slate-100 shadow-xl  bg-white overflow-hidden pt-8">
            <CardHeader className="text-center pb-2">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-slate-900">$499</span>
                <span className="text-slate-400 text-sm mt-2 font-medium">
                  /mes - facturación mensual
                </span>
                <p className="text-slate-400 text-xs mt-6 uppercase tracking-widest font-semibold">
                  Todo lo que necesitas para escalar
                </p>
              </div>
            </CardHeader>

            <CardContent className=" py-8">
              <div className="space-y-4">
                {FEATURES.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-slate-600 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <Separator/>
            <CardFooter className="w-full pb-10 flex flex-col items-center gap-4">
              <Button className="w-full py-7 bg-[#059669] hover:bg-[#047857] text-white text-lg font-bold rounded-lg shadow-lg shadow-emerald-200 transition-all active:scale-95">
                Agendar Demo
              </Button>
              <p className="text-slate-400 text-xs text-center font-medium">
                Sin tarjeta. Sin compromiso. Cancelá cuando quieras.
              </p>
            </CardFooter>
          </Card>
        </div>

      </div>
    </section>
  );
}

import { Button } from "@/shared/components/ui/button";
import { Calendar, MessageCircle, CheckCircle2 } from "lucide-react";

export default function CTASection() {
  return (
    <section className="w-full bg-white py-10 px-6">
      <div className="p-10 mx-auto">

        <div className="bg-[#059669] rounded-[2.5rem] p-8  text-center text-white shadow-2xl shadow-emerald-100">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            ¿Listo para ver GardenAds en Acción?
          </h2>
          
          <p className="text-emerald-50 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Agenda tu demo personalizada hoy mismo. Analizaremos tu estructura actual y te mostraremos cómo recuperar la confianza en tus datos.
          </p>

  
          <div className="flex flex-wrap justify-center md:gap-12 ">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-200" strokeWidth={2.5} />
              <span className="font-medium">No code necesario</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-200" strokeWidth={2.5} />
              <span className="font-medium">Setup en 5 min</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-200" strokeWidth={2.5} />
              <span className="font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>

   
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
          <Button className="bg-[#059669] hover:bg-[#047857] text-white px-8 py-7 rounded-2xl text-lg font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-100">
            <Calendar className="w-5 h-5" />
            Agendar Demo Ahora
            <span className="ml-1 text-xl">→</span>
          </Button>

          <button className="flex items-center gap-3 text-slate-500 hover:text-slate-800 font-bold text-lg transition-colors group">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            Hablar con Ventas
          </button>
        </div>

      </div>
    </section>
  );
}
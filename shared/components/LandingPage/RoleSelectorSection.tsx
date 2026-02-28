"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { CheckCircle2, LineChart } from "lucide-react"

const ROLES_DATA = [
  {
    id: "founder",
    label: "Founder/CEO",
    title: "Confirmá ROI real en 30seg",
    features: [
      "Dashboard ejecutivo",
      "ROAS confirmado por pagos",
      "Comparación de períodos",
      "Exportar PDF para inversores"
    ]
  },
  {
    id: "marketing",
    label: "Marketing Manager",
    title: "Optimizá tus campañas con data real",
    features: [
      "Atribución multi-canal",
      "LTV por fuente de tráfico",
      "Alertas de bajo rendimiento",
      "Integración directa con Ads"
    ]
  },
  {
    id: "analyst",
    label: "Analyst",
    title: "Deep dive en tus métricas",
    features: [
      "Query builder personalizado",
      "Exportación cruda de datos",
      "Modelos de atribución",
      "Reportes programados"
    ]
  },
  {
    id: "developer",
    label: "Developer",
    title: "Implementación simple y robusta",
    features: [
      "API de eventos",
      "Webhooks en tiempo real",
      "SDK para Next.js / React",
      "Logs de debugging"
    ]
  },
  {
    id: "admin",
    label: "Admin",
    title: "Control total de la organización",
    features: [
      "Gestión de permisos",
      "Auditoría de cambios",
      "Configuración de facturación",
      "Soporte prioritario"
    ]
  }
]

export default function RoleSelectorSection() {
  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-6xl mx-auto">
      
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">
            Construido para cada rol en tu equipo
          </h2>
          <p className="text-slate-500 text-xl font-bold">
            Cada persona ve lo que necesita. Sin ruido.
          </p>
        </div>

        <Tabs defaultValue="founder" className="w-full">
        
          <div className="flex justify-start mb-16">
            <TabsList className="bg-transparent gap-2 h-auto p-0 flex-wrap justify-center ">
              {ROLES_DATA.map((role) => (
                <TabsTrigger
                  key={role.id}
                  value={role.id}
                  className="px-2 cursor-pointer py-2 rounded-lg text-slate-500 data-[state=active]:bg-[#e2e8f0] data-[state=active]:text-[#0f172a] transition-all hover:bg-slate-100 hover:text-black font-medium"
                >
                  {role.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

       
          {ROLES_DATA.map((role) => (
            <TabsContent key={role.id} value={role.id} className="mt-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
               
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm tracking-wider uppercase">
                    <LineChart size={18} />
                    {role.label}
                  </div>
                  
                  <h3 className="text-3xl font-bold text-slate-900 leading-tight">
                    {role.title}
                  </h3>

                  <ul className="space-y-4">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium text-lg">
                        <CheckCircle2 className="text-emerald-500 w-6 h-6" strokeWidth={2.5} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

            
                <div className="bg-[#e5e7eb] rounded-xl aspect-[4/3] flex items-center justify-center border-2 border-dashed border-slate-300 group hover:border-slate-400 transition-colors">
                  <div className="text-center">
                    <p className="text-slate-500 font-medium italic">
                      Visualización para {role.label}
                    </p>
                    <span className="text-xs text-slate-400 uppercase tracking-widest">
                      Slot (Próximamente)
                    </span>
                  </div>
                </div>

              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
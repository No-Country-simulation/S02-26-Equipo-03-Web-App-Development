import { issues } from "@/app/dashboard/tracking/dashboardData"
import { notFound } from "next/navigation"
import { Badge } from "@/shared/components/ui/badge"
import Link from "next/link"
import { getSeverityStyles } from "../dashboardLogic"
import { formatDate, timeAgo } from "@/shared/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { MyIcons } from "@/shared/components/MyIcons/MyIcons"


interface Props {
  params: { id: string }
}


export default async function IssueDetailPage({ params }: Props) {
  const { id } = await params
    const issue = issues.find((i) => i.id === id)
  if (!issue) return notFound() // Si el issue no existe, muestra una página explicando que no se encontro
    const { text  } = timeAgo(issue.createdAt)
  return (
    <div className="min-h-screen p-6">
   
      <div className="max-w-4xl mx-auto space-y-8 gap-2">

        {/* Back */}
        <Link
          href="/dashboard/tracking"
          className="text-sm text-muted-foreground "
        >
          ← Volver a Tracking Health
        </Link>

        {/* Header */}
        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-3">
            <Badge className={`${getSeverityStyles(issue.severity)} border`}>
              {issue.severity}
            </Badge>

            <Badge className="bg-gray-100 text-black border-gray-300">
              {issue.platform}
            </Badge>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-black">
              Detalle de Incidencia
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
          {formatDate(issue.createdAt)} &middot; {text}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              Diagnóstico de atribución
            </p>
            <h2 className="text-xl font-semibold text-black mt-2">
              {issue.title}
            </h2>
            <p className="text-muted-foreground mt-1">
              {issue.description}
            </p>
          </div>
        </div>

       
        <div className="rounded-2xl bg-slate-900 text-slate-200 p-6 space-y-4">
          <div className="text-sm font-semibold text-emerald-400">
            ● Diagnóstico Técnico
          </div>

          <p className="text-sm text-slate-300">
           {issue.diagnostics.description}
          </p>

          <div className="bg-black/50 rounded-lg p-4 text-xs text-red-400 font-mono">
            {issue.diagnostics.error}
          </div>
        </div>

        {/* Impacto */}
        <div className="border rounded-2xl p-6 ">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Impacto estimado
          </p>

          <div className="text-4xl font-bold text-red-500 mt-2">
            ${issue.impact.toLocaleString()}
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            Pérdida semanal estimada
          </p>
        </div>

        {/* Timeline */}
         <div className="space-y-3 text-sm text-muted-foreground">
    {issue.timeline.map(({ timestamp, description }) => {
      const { text, isNow } = timeAgo(timestamp)
      return (
        <p key={timestamp + description} className={isNow ? "text-emerald-600" : ""}>
          • {text} — {description}
        </p>
      )
    })}
  </div>

        {/* Acción recomendada */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <p className="font-semibold text-emerald-700">
            Acción Recomendada
          </p>
          <p className="text-sm text-emerald-700 mt-1">
            {issue.recommendedAction}
          </p>
        </div>

 <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-full cursor-pointer border border-gray-600 rounded-xl py-3 text-black font-medium hover:bg-muted transition-colors">
          SIMULAR EVENTO 
          <MyIcons name="play" className="w-4 h-4 ml-2" size={32}/>
        </Button>
         <Button variant="ghost" className="w-full cursor-pointer border border-gray-600 rounded-xl py-3 text-black font-medium hover:bg-muted transition-colors">
        REPARAR INTEGRACIÓN
          <MyIcons name="repair" className="w-4 h-4 ml-2" size={32}/>
        </Button> <Button variant="default" className="w-full cursor-pointer border border-gray-600 rounded-xl py-3 text-white font-medium hover:bg-muted hover:text-black transition-colors">
         MARCAR COMO SOLUCIONADO
          
        </Button>
        </div>
      </div>
      
    </div>
  )
}
import { issues } from "@/app/dashboard/tracking/dashboardData";
import { notFound } from "next/navigation";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import { formatDate, timeAgo } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { MyIcons } from "@/shared/components/MyIcons/MyIcons";
import StatusBadge from "@/shared/components/ui/StatusBadges/StatusBadge";
import { AlertBadge } from "@/shared/components/ui/alert-badge";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: { id: string };
}

export default async function IssueDetailPage({ params }: Props) {
  const { id } = await params;
  const issue = issues.find((i) => i.id === id);
  if (!issue) return notFound(); // Si el issue no existe, muestra una página explicando que no se encontro
  const { text } = timeAgo(issue.createdAt);
  return (
    <div className="min-h-screen px-20 py-6">
      <div className="max-w-6xl gap-2 space-y-8">
        {/* Back */}
        <Link
          href="/dashboard/tracking"
          className="flex items-center text-sm font-medium text-black hover:text-[#0F172B]"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Tracking Health
        </Link>

        {/* Header */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertBadge status={issue.severity as "INFO" | "ALERTA" | "CRÍTICO"} uppercase />

            <Badge className="rounded-sm border-[#E2E8F0] bg-white text-[#475569]">
              {issue.platform}
            </Badge>
            <p className="text-sm font-medium text-[#020617]">{issue.retrargeting}</p>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold text-[#0F172B]">Detalle de Incidencia</h1>
            <p className="mt-2 text-sm font-medium text-[#62748E]">
              {formatDate(issue.createdAt)} &middot; {text}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium text-[#90A1B9] uppercase">
              Diagnóstico de atribución
            </p>
            <h2 className="my-2 text-2xl font-bold text-[#0F172B]">{issue.title}</h2>
            <p className="text-sm font-medium text-[#45556C]">{issue.description}</p>
          </div>
        </div>

        <div className="space-y-4 rounded-lg bg-[#1E293B] p-6 text-white">
          <StatusBadge status={"conectado"} title="Diagnóstico Técnico" />

          <div className="space-y-3 text-sm">
            <p>{issue.diagnostics.description.text}</p>

            <div>
              <p className="pb-1">Parámetros bloqueados:</p>
              <ul className="space-y-0.5">
                {issue.diagnostics.description.blockedParams.map((param) => (
                  <li key={param} className="flex items-center gap-2">
                    <span className="text-slate-500">•</span>
                    <span>{param}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p>{issue.diagnostics.description.footer}</p>
          </div>

          <div>
            <p className="pt-2 pb-4 text-xs font-medium text-[#64748B] uppercase">log de error</p>
            <div className="rounded-xl bg-[#020618] p-4 font-mono text-xs text-[#D70000]">
              {issue.diagnostics.error}
            </div>
          </div>
        </div>

        {/* Impacto */}
        <div className="mx-auto rounded-lg border bg-white p-6 text-center">
          <p className="text-xs font-medium text-[#475569] uppercase">Impacto estimado</p>

          <div className="mt-4 text-3xl font-bold text-[#D70000]">
            ${issue.impact.toLocaleString()}
          </div>

          <p className="mt-4 text-xs font-medium text-[#D70000]">Pérdida semanal estimada</p>
        </div>

        {/* Timeline */}
        <div className="mx-auto rounded-lg border bg-white p-6">
          <p className="pb-6 text-xs font-medium text-[#475569] uppercase">Línea de tiempo</p>
          <div className="text-muted-foreground space-y-3 border-l-2 border-[#E2E8F0]/40 pl-4 text-sm">
            {issue.timeline.map(({ timestamp, description }) => {
              const { text, isNow } = timeAgo(timestamp);
              return (
                <div key={timestamp + description} className="space-y-1">
                  <p className="text-xs font-medium text-[#90A1B9] uppercase">
                    <span className={isNow ? "text-emerald-300" : ""}> • </span> {text}
                  </p>
                  <p className="pl-2 font-medium text-[#0F172B]">{description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acción recomendada */}
        <div className="rounded-lg border border-[#BBF7D1] bg-[#EEFFF4] p-6">
          <p className="font-semibold text-[#049140]">Acción Recomendada</p>
          <p className="mt-1 text-sm text-[#049140]">{issue.recommendedAction}</p>
        </div>

        <div className="flex flex-col gap-4">
          <Button variant="ghost" className="w-full cursor-pointer rounded-lg py-5">
            SIMULAR EVENTO
            <MyIcons name="play" className="ml-2 h-4 w-4" size={32} />
          </Button>
          <Button variant="ghost" className="w-full cursor-pointer rounded-lg py-5">
            REPARAR INTEGRACIÓN
            <MyIcons name="repair" className="ml-2 h-4 w-4" size={32} />
          </Button>{" "}
          <Button className="w-full cursor-pointer rounded-lg bg-[#059669] py-5 font-medium text-white transition-colors hover:bg-[#047857] hover:text-white">
            MARCAR COMO SOLUCIONADO
          </Button>
        </div>
      </div>
    </div>
  );
}

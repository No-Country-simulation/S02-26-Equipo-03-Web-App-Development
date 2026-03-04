import { IssuesTable } from "@/app/dashboard/tracking/IssueTable"
import { issues } from "@/app/dashboard/tracking/dashboardData"
import {
  sortIssuesByImpact
} from "@/app/dashboard/tracking/dashboardLogic"
import { TrackingSkeleton } from "@/app/dashboard/tracking/TrackingSkeleton"
import { SystemHealthCard } from "@/shared/components/Dashboard/Tracking/HealtCard/SystemHealtCard"
import { Integration } from "@/shared/components/Dashboard/Tracking/HealtCard/healt-card.interface"
import { IntegrationStatus } from "@/shared/components/Dashboard/Tracking/IntegrationStatus"

const integrationes: Integration[] = [
  { name: "Stripe", status: "ok" as const },
  { name: "Meta", status: "ok" as const },
  { name: "Google", status: "warning" as const },
]

export default function DashboardPage() {
  const sortedIssues = sortIssuesByImpact(issues)
  // cambiar el .lenght por un estado de carga para mostrar el skeleton mientras se cargan los datos reales
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      {issues.length > 0 ? (
        <div className="max-w-7xl mx-auto space-y-6">
          <SystemHealthCard
            variant="warning"
            score={72}
            badge="Requiere revisión"
            title="Detección de anomalías menores"
            subtitle="Se detectaron pequeños retrasos"
            description="Se detectaron retrasos menores en la sincronización. Impacto estimado: < 5% del revenue atribuido."
            integrations={integrationes}
          />
          <IntegrationStatus integrations={integrationes} />
          <IssuesTable issues={sortedIssues} />
        </div>
      ) : (
        <TrackingSkeleton />
      )}
    </div>
  )
}
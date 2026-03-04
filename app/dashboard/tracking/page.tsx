import { IssuesTable } from "@/app/dashboard/tracking/IssueTable"
import { issues } from "@/app/dashboard/tracking/dashboardData"
import {
  sortIssuesByImpact,
  getIntegrationStatus,
} from "@/app/dashboard/tracking/dashboardLogic"
import { IntegrationsStatus } from "@/app/dashboard/tracking/IntegrationsStatus"
import { TrackingSkeleton } from "@/app/dashboard/tracking/TrackingSkeleton"
import { SystemHealthCard } from "@/shared/components/Dashboard/Tracking/HealtCard/SystemHealtCard"

export default function DashboardPage() {
  const sortedIssues = sortIssuesByImpact(issues)
  const integrations = getIntegrationStatus(sortedIssues)
  // cambiar el .lenght por un estado de carga para mostrar el skeleton mientras se cargan los datos reales
  return (
    <div className="min-h-screen bg-muted/40 p-6">
      {issues.length > 0 ? (
        <div className="max-w-7xl mx-auto space-y-6">
          <SystemHealthCard
            variant="critical"
            score={72}
            badge="Requiere revisión"
            title="Detección de anomalías menores"
            subtitle="Se detectaron pequeños retrasos"
            description="Se detectaron retrasos menores en la sincronización. Impacto estimado: < 5% del revenue atribuido."
            integrations={[
              { name: "Stripe", status: "ok" },
              { name: "Meta", status: "ok" },
              { name: "Google", status: "warning" },
            ]}
          />
          <IntegrationsStatus integrations={integrations} />
          <IssuesTable issues={sortedIssues} />
        </div>
      ) : (
        <TrackingSkeleton />
      )}
    </div>
  )
}
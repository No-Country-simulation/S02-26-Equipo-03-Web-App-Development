import { RevenueCard } from "@/app/dashboard/tracking/RenueveCard"
import { IssuesTable } from "@/app/dashboard/tracking/IssueTable"
import { issues } from "@/app/dashboard/tracking/dashboardData"
import {
  sortIssuesByImpact,
  calculateTotalRisk,
  getIntegrationStatus,
} from "@/app/dashboard/tracking/dashboardLogic"
import { IntegrationsStatus } from "@/app/dashboard/tracking/IntegrationsStatus"

export default function DashboardPage() {
  const sortedIssues = sortIssuesByImpact(issues)
  const totalRisk = calculateTotalRisk(sortedIssues)
  const integrations = getIntegrationStatus(sortedIssues)

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <RevenueCard totalRisk={totalRisk} />
        <IntegrationsStatus integrations={integrations} />
        <IssuesTable issues={sortedIssues} />
      </div>
    </div>
  )
}
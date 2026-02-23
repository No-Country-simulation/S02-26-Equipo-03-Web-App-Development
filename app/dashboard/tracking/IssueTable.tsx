import { Issue } from "@/app/dashboard/tracking/dashboardData"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import Link from "next/link"
import { getSeverityStyles } from "./dashboardLogic"

interface Props {
  issues: Issue[]
}

export function IssuesTable({ issues }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Problemas Detectados por Impacto ($)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Priorizados por pérdida económica estimada
        </p>
      </CardHeader>

      <CardContent className="p-0">
        {/* Header */}
        <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-muted-foreground border-b bg-muted/40">
          <div>TIPO DE PROBLEMA</div>
          <div>IMPACTO EST.</div>
          <div>PLATAFORMA</div>
          <div>SEVERIDAD</div>
          <div className="text-right"></div>
        </div>

        {/* Rows */}
        {issues.map((issue) => (
          <Link
            key={issue.id}
            href={`/dashboard/tracking/${issue.id}`}
            className="grid grid-cols-5 items-center px-6 py-4 text-sm border-b last:border-none hover:bg-muted/30 transition-colors"
          >
            {/* Tipo */}
            <div className="font-medium">{issue.title}</div>

            {/* Impacto */}
            <div className="text-red-500 font-semibold">
              ${issue.impact.toLocaleString()}
            </div>

            {/* Plataforma */}
            <div>
              <Badge className="bg-gray-100 text-black border-gray-300">{issue.platform}</Badge>
            </div>

            {/* Severidad */}
            <div>
              <Badge
              className={getSeverityStyles(issue.severity)}
              >
                {issue.severity}
              </Badge>
            </div>

            {/* Link */}
            <div className="text-right text-emerald-600 font-medium hover:underline">
              ANALIZAR →
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
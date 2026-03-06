import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import { getSeverityStyles } from "./dashboardLogic";
import { Issue } from "@/shared/interfaces/issue-tracking.interface";

interface Props {
  issues: Issue[];
}

export function IssuesTable({ issues }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Problemas Detectados por Impacto ($)</CardTitle>
        <p className="text-muted-foreground text-sm">Priorizados por pérdida económica estimada</p>
      </CardHeader>

      <CardContent className="p-0">
        {/* Header */}
        <div className="text-muted-foreground bg-muted/40 grid grid-cols-5 border-b px-6 py-3 text-xs font-semibold">
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
            className="hover:bg-muted/30 grid grid-cols-5 items-center border-b px-6 py-4 text-sm transition-colors last:border-none"
          >
            {/* Tipo */}
            <div className="font-medium">{issue.title}</div>

            {/* Impacto */}
            <div className="font-semibold text-red-500">${issue.impact.toLocaleString()}</div>

            {/* Plataforma */}
            <div>
              <Badge className="border-gray-300 bg-gray-100 text-black">{issue.platform}</Badge>
            </div>

            {/* Severidad */}
            <div>
              <Badge className={getSeverityStyles(issue.severity)}>{issue.severity}</Badge>
            </div>

            {/* Link */}
            <div className="text-right font-medium text-emerald-600 hover:underline">
              ANALIZAR →
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

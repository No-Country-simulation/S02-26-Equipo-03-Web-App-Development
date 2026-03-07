import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";

const problems = [
  {
    source: "Meta Ads",
    time: "Hace 12m",
    description: "Eventos de compra faltantes (3h)",
    severity: "red" as const,
  },
  {
    source: "Google Ads",
    time: "Hace 1h",
    description: "Detección de eventos duplicados",
    severity: "yellow" as const,
  },
  {
    source: "Data UTM",
    time: "Hace 4h",
    description: "Pérdida de parámetros en iOS 17",
    severity: "yellow" as const,
  },
];

const severityDot: Record<"red" | "yellow", string> = {
  red: "bg-red-500",
  yellow: "bg-yellow-400",
};

export function ProblemsPanel() {
  return (
    <Card className="flex w-80 flex-col rounded-sm border border-[#E2E8F0] bg-white p-6">
      <CardHeader className="space-y-2 p-0">
        <div className="flex items-center justify-between">
          <Badge className="rounded-sm border-[#FFFD86] bg-[#FFFFE7] text-[#A67102]">
            Acción Crítica
          </Badge>
          <p className="font-mono text-sm font-medium tracking-wide uppercase">Salud de Tracking</p>
        </div>
        <div>
          {/* Title */}
          <h3 className="text-lg leading-tight font-semibold">3 Problemas Detectados</h3>
          <p className="mt-2 text-xs font-medium">
            La falta de datos afecta aproximadamente al 12% de tu revenue atribuido.
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col p-0">
        {/* CTA button */}
        <Button
          variant="link"
          className="w-full justify-between bg-[#F1F5F9] px-4 py-6 text-sm font-medium text-[#334155]"
        >
          Ver Problemas (3)
          <ArrowRight className="h-5 w-5" />
        </Button>

        {/* Problem list */}
        <div className="mt-3 flex flex-1 flex-col">
          {problems.map((p) => (
            <div key={p.source} className="flex flex-col gap-1 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-1 w-1 shrink-0 rounded-full ${severityDot[p.severity]}`} />
                  <span className="text-sm font-medium text-[#020617]">{p.source}</span>
                </div>
                <span className="text-xs text-[#64748B]">{p.time}</span>
              </div>
              <p className="text-xs font-medium text-[#475569]">{p.description}</p>
            </div>
          ))}
        </div>
        <Separator className="my-4 bg-gray-100" />
        {/* Footer */}
        <div className="mt-auto flex items-center justify-between">
          <p className="text-sm font-medium">Ingresos estimados en riesgo</p>
          <span className="text-sm font-medium text-[#D70000]">$7,700</span>
        </div>
      </CardContent>
    </Card>
  );
}

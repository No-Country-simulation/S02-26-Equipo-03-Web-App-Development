"use client";

import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ChevronRight, Info } from "lucide-react";

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

type Tab = "critica" | "tracking";

export function ProblemsPanel() {
  const [tab, setTab] = useState<Tab>("critica");

  return (
    <Card className="border border-gray-200 shadow-sm h-full flex flex-col bg-[#F3F3F3] rounded-none">
      {/* Tabs */}
      <div className="grid grid-cols-2 border-gray-100 justify-evenly px-3 gap-2">
        <Button
          variant={tab === "critica" ? "outline" : "ghost"}
          onClick={() => setTab("critica")}
          className={`bg-white ${
            tab === "critica"
              ? "text-gray-900  border-gray-900"
              : ""
          }`}
        >
          Acción Crítica
        </Button>
        <Button
          variant={tab === "tracking" ? "outline" : "ghost"}
          onClick={() => setTab("tracking")}
          className={`bg-white ${
            tab === "tracking"
              ? "text-gray-900  border-gray-900"
              : ""
          }`}
        >
          Salud de Tracking
        </Button>
      </div>

      <CardContent className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 leading-tight">
          3 Problemas Detectados
        </h3>
        <p className="mt-2 text-sm text-gray-500 leading-snug">
          La falta de datos afecta aproximadamente al{" "}
          <span className="font-semibold text-gray-700">12%</span> de tu revenue atribuido.
        </p>

        {/* CTA button */}
        <Button
          variant="outline"
          className='bg-white w-full justify-between'
        >
          Ver Problemas (3)
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Button>

        {/* Problem list */}
        <div className="mt-4 flex flex-col divide-y divide-gray-100 flex-1">
          {problems.map((p) => (
            <div key={p.source} className="py-3 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${severityDot[p.severity]}`}
                  />
                  <span className="text-sm font-semibold text-gray-900">{p.source}</span>
                </div>
                <span className="text-xs text-gray-400">{p.time}</span>
              </div>
              <p className="text-xs text-gray-500 pl-[18px]">{p.description}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Estimated Revenue at Risk
            </span>
            <Info className="h-3 w-3 text-gray-300" />
          </div>
          <span className="text-base font-bold text-gray-900">$7,700</span>
        </div>
      </CardContent>
    </Card>
  );
}

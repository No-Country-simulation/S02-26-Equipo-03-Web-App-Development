"use client";

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "../../ui/separator";

const data = [
  { fecha: "Feb 1", actual: 4000, anterior: 4200 },
  { fecha: "Feb 5", actual: 4300, anterior: 5400 },
  { fecha: "Feb 10", actual: 4800, anterior: 4600 },
  { fecha: "Feb 15", actual: 7400, anterior: 4800 },
  { fecha: "Feb 20", actual: 6100, anterior: 5000 },
  { fecha: "Feb 25", actual: 6800, anterior: 7100 },
  { fecha: "Hoy", actual: 10500, anterior: 6200 },
];

const chartConfig: ChartConfig = {
  actual: {
    label: "Período Actual",
    color: "#10b981",
  },
  anterior: {
    label: "Período Anterior",
    color: "#9ca3af",
  },
};

export function RevenueChart() {
  return (
    <Card className="gap-0 rounded-sm border border-[#E2E8F0]">
      <CardHeader className="px-6 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-gray-900">
              Atribución de Revenue
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs text-gray-400">
              Confirmación financiera vs. período anterior
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="cursor-pointer">
            Comparación Período
          </Button>
        </div>
      </CardHeader>
      <Separator className="bg-gray-100 p-0" />
      <CardContent className="px-4 pt-5">
        <ChartContainer config={chartConfig} className="h-65 w-full">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="fecha"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1).replace(".0", "")}k`}
              domain={[0, 10000]}
              ticks={[0, 2500, 5000, 7500, 10000]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="bg-white text-black"
                  formatter={(value) => `$${Number(value).toLocaleString("en-US")}`}
                />
              }
            />
            {/* Actual - solid green */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
            {/* Anterior - dashed gray */}
            <Line
              type="monotone"
              dataKey="anterior"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-0.5 w-6 rounded bg-emerald-500" />
            <span className="text-xs font-medium text-gray-500">Período Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-0.5 w-6 border-t-2 border-dashed border-gray-400" />
            <span className="text-xs font-medium text-gray-500">Período Anterior</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

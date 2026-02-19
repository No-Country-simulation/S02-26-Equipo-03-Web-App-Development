"use client";

import { PieChart, Pie, Cell } from "recharts";
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

const data = [
  { name: "Meta Ads", value: 48, color: "#3b82f6" },
  { name: "Google Ads", value: 31, color: "#ef4444" },
  { name: "Orgánico", value: 12, color: "#10b981" },
  { name: "Directo", value: 9, color: "#f59e0b" },
];

const chartConfig: ChartConfig = {
  metaAds: { label: "Meta Ads", color: "#3b82f6" },
  googleAds: { label: "Google Ads", color: "#ef4444" },
  organico: { label: "Orgánico", color: "#10b981" },
  directo: { label: "Directo", color: "#f59e0b" },
};

export function TrafficSourcesChart() {
  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900">Fuentes de Tráfico</CardTitle>
        <CardDescription className="text-xs text-gray-400">
          Distribución por canal · últimos 30 días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600">{item.name}</span>
              <span className="ml-auto text-xs font-semibold text-gray-800">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

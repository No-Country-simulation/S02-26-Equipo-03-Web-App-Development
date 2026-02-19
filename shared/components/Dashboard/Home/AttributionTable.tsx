"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";

const attributionData = [
  {
    canal: "Meta Ads",
    gasto: 4200,
    ingresos: 18400,
    roas: 4.38,
    cpa: 32.5,
    conversiones: 129,
    color: "#3b82f6",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    canal: "Google Ads",
    gasto: 3100,
    ingresos: 13200,
    roas: 4.26,
    cpa: 38.2,
    conversiones: 81,
    color: "#ef4444",
    badge: "bg-red-100 text-red-700",
  },
  {
    canal: "Orgánico",
    gasto: 0,
    ingresos: 4600,
    roas: null,
    cpa: 0,
    conversiones: 24,
    color: "#10b981",
    badge: "bg-emerald-100 text-emerald-700",
  },
];

const roasChartData = [
  { canal: "Meta Ads", roas: 4.38 },
  { canal: "Google Ads", roas: 4.26 },
  { canal: "Orgánico", roas: 0 },
];

const chartConfig: ChartConfig = {
  roas: {
    label: "ROAS",
    color: "#6366f1",
  },
};

export function AttributionTable() {
  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900">
          Atribución por Canal
        </CardTitle>
        <CardDescription className="text-xs text-gray-400">
          Rendimiento publicitario · últimos 30 días
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs tracking-wide text-gray-400 uppercase">
                <th className="pb-2 text-left font-medium">Canal</th>
                <th className="pb-2 text-right font-medium">Gasto</th>
                <th className="pb-2 text-right font-medium">Ingresos</th>
                <th className="pb-2 text-right font-medium">ROAS</th>
                <th className="pb-2 text-right font-medium">CPA</th>
                <th className="pb-2 text-right font-medium">Conv.</th>
              </tr>
            </thead>
            <tbody>
              {attributionData.map((row) => (
                <tr key={row.canal} className="border-b border-gray-50 last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="font-medium text-gray-800">{row.canal}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right text-gray-600">${row.gasto.toLocaleString()}</td>
                  <td className="py-3 text-right font-semibold text-gray-900">
                    ${row.ingresos.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    {row.roas !== null ? (
                      <Badge
                        variant="outline"
                        className={`rounded-full text-xs font-semibold ${row.badge}`}
                      >
                        {row.roas}x
                      </Badge>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3 text-right text-gray-600">
                    {row.cpa > 0 ? `$${row.cpa}` : "—"}
                  </td>
                  <td className="py-3 text-right font-semibold text-gray-900">
                    {row.conversiones}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bar chart ROAS */}
        <div className="w-full lg:w-52">
          <p className="mb-2 text-xs font-medium text-gray-500">ROAS por canal</p>
          <ChartContainer config={chartConfig} className="h-[130px] w-full">
            <BarChart
              data={roasChartData}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis
                dataKey="canal"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                width={58}
              />
              <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${v}x`} />} />
              <Bar dataKey="roas" fill="#6366f1" radius={[0, 4, 4, 0]}>
                <LabelList
                  dataKey="roas"
                  position="right"
                  formatter={(v: unknown) => (typeof v === "number" && v > 0 ? `${v}x` : "")}
                  style={{ fontSize: 11, fill: "#6b7280" }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

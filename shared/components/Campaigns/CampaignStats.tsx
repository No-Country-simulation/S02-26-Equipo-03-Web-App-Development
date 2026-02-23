import { Info } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

const stats = [
  {
    label: "GASTO TOTAL",
    value: "$46,900",
    change: "+3%",
    isPositive: true,
  },
  {
    label: "REVENUE STRIPE",
    value: "$180,000",
    change: "+15%",
    isPositive: true,
  },
  {
    label: "ROAS PROMEDIO",
    value: "3.83x",
    change: "+0.4x",
    isPositive: true,
  },
  {
    label: "CPA PROMEDIO",
    value: "$37.80",
    change: "-$2.10",
    isPositive: false,
  },
];

export function CampaignStats() {
  return (
    <Card className="w-full border-slate-200 p-0 shadow-sm">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y divide-gray-300 px-6 py-4 md:grid-cols-2 md:gap-12 md:divide-x md:divide-y-0 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-1 py-4 md:p-0">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold tracking-[1px] text-slate-400 uppercase">
                  {stat.label}
                </span>
                <Info className="h-3.5 w-3.5 cursor-help text-slate-400" />
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900">{stat.value}</span>
                <span
                  className={`text-xs font-bold ${
                    stat.isPositive ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

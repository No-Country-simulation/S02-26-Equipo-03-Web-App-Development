import { KpiCards } from "@/shared/components/Dashboard/KpiCards";
import { RevenueChart } from "@/shared/components/Dashboard/RevenueChart";
import { ProblemsPanel } from "@/shared/components/Dashboard/ProblemsPanel";

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-5 overflow-y-auto px-6 py-6 bg-gray-50/40 min-h-full">
      {/* KPIs */}
      <KpiCards />

      {/* Chart + Problems */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <ProblemsPanel />
      </div>
    </div>
  );
}

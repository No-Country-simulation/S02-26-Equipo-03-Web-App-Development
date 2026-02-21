import { KpiCards } from "@/shared/components/Dashboard/Home/KpiCards";
import { RevenueChart } from "@/shared/components/Dashboard/Home/RevenueChart";
import { ProblemsPanel } from "@/shared/components/Dashboard/Home/ProblemsPanel";

export default function DashboardHome() {
  return (
    <div className="flex min-h-full flex-col gap-5 overflow-y-auto bg-gray-50/40 px-6 py-6">
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

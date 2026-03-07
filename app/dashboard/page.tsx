import { KpiCards } from "@/shared/components/Dashboard/Home/KpiCards";
import { RevenueChart } from "@/shared/components/Dashboard/Home/RevenueChart";
import { ProblemsPanel } from "@/shared/components/Dashboard/Home/ProblemsPanel";

export default function DashboardHome() {
  return (
    <div className="flex min-h-full flex-col gap-5 overflow-y-auto bg-[#F8FAFC] px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-[#020617]">Panel Ejecutivo</h1>
        <p className="text-sm font-medium text-[#475569]">
          Control operativo basado en datos reales de Stripe.
        </p>
      </div>
      {/* KPIs */}
      <KpiCards />

      {/* Chart + Problems */}
      <div className="flex gap-6">
        <div className="w-full flex-1">
          <RevenueChart />
        </div>
        <ProblemsPanel />
      </div>
    </div>
  );
}

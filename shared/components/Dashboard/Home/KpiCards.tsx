import { Card, CardContent } from "@/shared/components/ui/card";
// BadgeKpi component

import { BadgeKpi } from "@/shared/components/ui/StatusBadges/BadgeKpi";

// --- Revenue Total ---
function RevenueCard() {
  return (
    <Card className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
      <CardContent>
        <div className="mb-1 flex items-center">
          <span className="text-base font-semibold text-[#475569] uppercase">
            Revenue Total <span className="font-normal">(Stripe)</span>
          </span>
          <BadgeKpi type="up" value={"+12%"} />
        </div>
        <p className="text-3xl font-bold text-[#020617]">$128.4k</p>
        <p className="mt-3 text-sm text-[#64748B] uppercase">vs período anterior</p>
      </CardContent>
    </Card>
  );
}

// --- Pagos Confirmados ---
function PagosCard() {
  return (
    <Card className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
      <CardContent>
        <div className="mb-3 flex items-center gap-1.5">
          <span className="text-base font-semibold text-[#475569] uppercase">
            Pagos Confirmados
          </span>
          <BadgeKpi type="up" value={"+4%"} />
        </div>
        <p className="text-3xl font-bold tracking-tight text-[#020617]">1,240</p>
        <p className="mt-3 text-sm text-[#64748B] uppercase">ÓRDENES STRIPE CONFIRMADAS</p>
      </CardContent>
    </Card>
  );
}

// --- ROAS Global ---
function RoasCard() {
  return (
    <Card className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
      <CardContent>
        <div className="mb-3 flex items-center gap-1.5">
          <span className="text-base font-semibold text-[#475569] uppercase">ROAS Global</span>
          <BadgeKpi type="down" value={"-0.2x"} />
        </div>
        <p className="text-3xl font-bold text-[#020617]">4.2x</p>
        <p className="mt-3 text-sm text-[#64748B] uppercase">Revenue atribuido / Ad Spend</p>
      </CardContent>
    </Card>
  );
}

// --- Health Score ---
function HealthScoreCard() {
  return (
    <Card className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
      <CardContent>
        <div className="mb-3 flex items-center gap-1.5">
          <span className="text-base font-semibold text-[#475569] uppercase">Health Score</span>
          <BadgeKpi type="warning" value={"72"} />
        </div>
        <p className="text-3xl font-bold text-[#020617]">$1,250.00</p>
        <p className="mt-3 text-sm text-[#64748B] uppercase">Acción requerida en Meta Ads</p>
      </CardContent>
    </Card>
  );
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <RevenueCard />
      <PagosCard />
      <RoasCard />
      <HealthScoreCard />
    </div>
  );
}

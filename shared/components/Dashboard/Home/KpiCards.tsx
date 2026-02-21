"use client";

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  TrendingUp as RoasIcon,
  Zap,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

// --- Revenue Total ---
function RevenueCard() {
  return (
    <Card className="rounded-none border border-gray-200 bg-[#F3F3F3] shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[11px] font-bold tracking-wide text-gray-600 uppercase">
            Revenue Total <span className="font-normal">(Stripe)</span>
          </span>
          <Info className="ml-0.5 h-3 w-3 text-gray-600" />
          <span className="ml-auto flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="h-3 w-3" /> +12%
          </span>
        </div>
        <p className="text-3xl font-bold tracking-tight text-gray-900">$128.4k</p>
        <p className="mt-1 text-[11px] tracking-wide text-gray-400 uppercase">
          vs período anterior
        </p>
      </CardContent>
    </Card>
  );
}

// --- Pagos Confirmados ---
function PagosCard() {
  return (
    <Card className="rounded-none border border-gray-200 bg-[#F3F3F3] shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[11px] font-bold tracking-wide text-gray-600 uppercase">
            Pagos Confirmados
          </span>
          <span className="ml-auto flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="h-3 w-3" /> +4%
          </span>
        </div>
        <p className="text-3xl font-bold tracking-tight text-gray-900">1,240</p>
      </CardContent>
    </Card>
  );
}

// --- ROAS Global ---
function RoasCard() {
  return (
    <Card className="rounded-none border border-gray-200 bg-[#F3F3F3] shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-1.5">
          <RoasIcon className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[11px] font-bold tracking-wide text-gray-600 uppercase">
            ROAS Global
          </span>
          <Info className="ml-0.5 h-3 w-3 text-gray-600" />
          <span className="ml-auto flex items-center gap-0.5 text-[11px] font-bold text-red-500">
            <TrendingDown className="h-3 w-3" /> -0.2x
          </span>
        </div>
        <p className="text-3xl font-bold tracking-tight text-gray-900">4.2x</p>
        <p className="mt-1 text-[11px] tracking-wide text-gray-400 uppercase">
          Revenue atribuido / Ad Spend
        </p>
      </CardContent>
    </Card>
  );
}

// --- Health Score ---
function HealthScoreCard() {
  return (
    <Card className="rounded-none border border-gray-200 bg-[#F3F3F3] shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-[11px] font-bold tracking-wide text-gray-600 uppercase">
            Health Score
          </span>
          <Info className="ml-0.5 h-3 w-3 text-gray-600" />
        </div>
        <p className="text-5xl font-bold tracking-tight text-orange-500">72</p>
        <p className="mt-2 text-[11px] font-bold tracking-wide text-orange-500 uppercase">
          Acción requerida en Meta Ads
        </p>
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

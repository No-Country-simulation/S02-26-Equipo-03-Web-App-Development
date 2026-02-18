import { Check, Siren } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function DashboardCard() {
  return (
    <div className="relative w-full max-w-2xl">
      <div className="border-<0.8> absolute -top-7 -right-6 flex w-46 items-center gap-2 rounded-[14px] border border-[##E3E8EE] bg-white p-4 shadow-xl">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 p-1">
          <Check className="h-3 w-3 font-bold text-emerald-500" />
        </div>
        <span className="text-xs font-bold text-gray-800">Purchase Verified</span>
      </div>
      <Card className="max-w-126 rounded-4xl border border-gray-100 bg-white p-0 shadow-2xl">
        <CardContent className="space-y-6 p-6">
          <CardHeader className="flex h-8 w-full items-center justify-between px-0">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <CardTitle className="text-xs font-semibold tracking-widest text-gray-500">
              LIVE DASHBOARD
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full rounded-[14px] bg-blue-600/10 p-4">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Stripe Revenue</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">$124,592.00</p>
            </div>
            <div className="w-full rounded-[14px] bg-emerald-500/10 p-4">
              <p className="text-[10px] font-bold text-emerald-500 uppercase">ROAS Real</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">4.2x</p>
            </div>
          </div>
          {/* Alert */}
          <div className="flex items-center gap-4 rounded-2xl border-l-4 border-red-500 bg-red-100 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white opacity-90 shadow-sm">
              <Siren className="h-7 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Tracking Health Alert</p>
              <p className="text-[11px] text-gray-500">34% event loss detected in Meta Pixel.</p>
            </div>
          </div>

          {/* Attribution */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-800">Atribución por Campaña</p>
              <button className="text-xs font-bold text-blue-600 hover:underline">
                View Details
              </button>
            </div>

            {/* Progress Bars */}
            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[70%] rounded-full bg-blue-600" />
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[45%] rounded-full bg-indigo-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

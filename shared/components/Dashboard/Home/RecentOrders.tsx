"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ORDERS_MOCK } from "@/shared/components/Orders/mock/order.mock";
import type { OrderStatus, OrderSource } from "@/shared/types/orders.types";

const RECENT = ORDERS_MOCK.slice(0, 5);

function SourceDot({ source }: { source: OrderSource }) {
  const colors: Record<OrderSource, string> = {
    "META ADS": "bg-blue-500",
    "GOOGLE ADS": "bg-red-500",
    STRIPE: "bg-[#635BFF]",
    ORGÁNICO: "bg-gray-400",
  };
  const initials: Record<OrderSource, string> = {
    "META ADS": "M",
    "GOOGLE ADS": "G",
    STRIPE: "S",
    ORGÁNICO: "O",
  };
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${colors[source]}`}
    >
      {initials[source]}
    </span>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    PAGADO: "border-emerald-300 bg-emerald-50 text-emerald-700",
    PENDIENTE: "border-yellow-300 bg-yellow-50 text-yellow-700",
    FALLIDO: "border-red-300 bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export function RecentOrders() {
  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-gray-900">Órdenes Recientes</CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Últimas 5 transacciones confirmadas
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs text-gray-500">
          <Link href="/dashboard/order">
            Ver todas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-50">
          {RECENT.map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-gray-50/60"
            >
              {/* Source dot */}
              <SourceDot source={order.source} />

              {/* Client */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{order.clientName}</p>
                <p className="truncate text-xs text-gray-400">{order.service}</p>
              </div>

              {/* Amount */}
              <span className="text-sm font-bold text-gray-900">${order.amount.toFixed(2)}</span>

              {/* Status */}
              <StatusPill status={order.status} />

              {/* Date */}
              <span className="hidden text-xs text-gray-400 sm:block">{order.date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

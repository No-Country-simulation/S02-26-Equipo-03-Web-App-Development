import { OrderDetail } from "../../../types/order-detail.types";
import { OrderPaymentCard } from "./OrderPaymentCard";
import { OrderAttributionCard } from "./OrderAttributionCard";
import { OrderTimelineCard } from "./OrderTimelineCard";
import { OrderActionsCard } from "./OrderActionsCard";

interface OrderDetailSectionProps {
  order: OrderDetail;
}

const statusStyles: Record<string, string> = {
  PAGADO: "border-emerald-400 bg-emerald-50 text-emerald-700",
  PENDIENTE: "border-yellow-400 bg-yellow-50 text-yellow-700",
  FALLIDO: "border-red-400 bg-red-50 text-red-700",
};

export function OrderDetailSection({ order }: OrderDetailSectionProps) {
  return (
    <div className="px-6 pb-6 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${statusStyles[order.status]}`}
        >
          {order.status}
        </span>
        <span className="text-sm text-gray-500">{order.id}</span>
      </div>

      {/* Layout: left (2 cols) + right (1 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <OrderPaymentCard order={order} />
          <OrderAttributionCard attribution={order.attribution} />
          <OrderTimelineCard timeline={order.timeline} />
        </div>

        {/* Right column */}
        <OrderActionsCard
          status={order.status}
          stripeId={order.stripeId}
        />
      </div>
    </div>
  );
}
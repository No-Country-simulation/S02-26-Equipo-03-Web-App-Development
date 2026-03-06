import { OrderDetail } from "../../../types/order-detail.types";
import { OrderPaymentCard } from "./OrderPaymentCard";
import { OrderAttributionCard } from "./OrderAttributionCard";
import { OrderTimelineCard } from "./OrderTimelineCard";
import { OrderActionsCard } from "./OrderActionsCard";

interface OrderDetailSectionProps {
  order: OrderDetail;
}

const statusStyles: Record<string, string> = {
  PAGADO: "border-[#BBF7D1] bg-[#EEFFF4] text-[#049140]",
  PENDIENTE: "border-[#FCD34D] bg-[#FFFAEB] text-[#92400E]",
  FALLIDO: "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]",
};

export function OrderDetailSection({ order }: OrderDetailSectionProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-6 font-sans">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <span
          className={`inline-flex items-center rounded-sm border px-3 py-0.5 text-xs font-semibold ${statusStyles[order.status]}`}
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
        <OrderActionsCard status={order.status} stripeId={order.stripeId} />
      </div>
    </div>
  );
}

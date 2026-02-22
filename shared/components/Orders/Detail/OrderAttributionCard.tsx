import { OrderAttribution } from "../../../types/order-detail.types";

interface OrderAttributionCardProps {
  attribution: OrderAttribution;
}

export function OrderAttributionCard({ attribution }: OrderAttributionCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Atribución
      </p>

      <div className="flex items-start gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shrink-0">
          {attribution.initial}
        </span>
        <div>
          <p className="font-semibold text-gray-900">{attribution.source}</p>
          <p className="text-sm text-gray-500">Campaña: {attribution.campaign}</p>
        </div>
      </div>

      <p className="mt-4 text-sm font-bold text-emerald-600">
        ROAS de esta conversión: {attribution.roas}x
      </p>
    </div>
  );
}
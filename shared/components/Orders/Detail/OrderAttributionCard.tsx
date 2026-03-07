import Image from "next/image";
import { OrderAttribution } from "../../../types/order-detail.types";

interface OrderAttributionCardProps {
  attribution: OrderAttribution;
}

export function OrderAttributionCard({ attribution }: OrderAttributionCardProps) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-6">
      <p className="mb-4 text-xs font-semibold tracking-widest text-gray-400 uppercase">
        Atribución
      </p>

      <div className="flex flex-col items-start gap-2">
        <Image
          src={"/images/meta.svg"}
          alt="Meta"
          width={0}
          height={36}
          sizes="100vw"
          className={`h-9 w-auto max-w-32`}
        />
        <p className="text-sm text-gray-500">Campaña: {attribution.campaign}</p>
      </div>

      <p className="mt-4 text-sm font-bold text-emerald-600">
        ROAS de esta conversión: {attribution.roas}x
      </p>
    </div>
  );
}

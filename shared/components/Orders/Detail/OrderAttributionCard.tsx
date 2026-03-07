import Image from "next/image";
import { OrderAttribution } from "../../../types/order-detail.types";

interface OrderAttributionCardProps {
  attribution: OrderAttribution;
}

export function OrderAttributionCard({ attribution }: OrderAttributionCardProps) {
  let imgSrc = "";
  let imgAlt = attribution.source || "ORGÁNICO";

  if (attribution.source === "META ADS") {
    imgSrc = "/images/meta.svg";
  } else if (attribution.source === "GOOGLE ADS") {
    imgSrc = "/images/google-ads.svg";
  } else if (attribution.source === "STRIPE") {
    imgSrc = "/images/stripe.svg";
  }

  const isOrganic = !imgSrc || imgAlt === "ORGÁNICO";

  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-6">
      <p className="mb-4 text-xs font-semibold tracking-widest text-gray-400 uppercase">
        Atribución
      </p>

      <div className="flex flex-col items-start gap-2">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={0}
            height={36}
            sizes="100vw"
            className="h-9 w-auto max-w-32"
          />
        ) : (
          <div className="inline-flex items-center rounded-sm border border-gray-200 bg-gray-50 px-2 py-1 text-sm font-semibold text-gray-700">
            {imgAlt}
          </div>
        )}
        <p className="text-sm text-gray-500">
          {!isOrganic ? `Campaña: ${attribution.campaign || "N/A"}` : "Tráfico directo / externo"}
        </p>
      </div>

      {!isOrganic && (
        <p className="mt-4 text-sm font-bold text-emerald-600">
          ROAS de esta conversión: {attribution.roas}x
        </p>
      )}
    </div>
  );
}

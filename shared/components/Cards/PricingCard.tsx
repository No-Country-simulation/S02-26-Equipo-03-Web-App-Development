import { Check } from "lucide-react";
import { Plan } from "@/shared/types/pricing.types";

export function PricingCard({ plan }: { plan: Plan }) {
  const isRecommended = plan.recommended;

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl p-7 transition-all duration-200
        ${
          isRecommended
            ? "border-3 border-primary-blue shadow-2xl bg-white scale-[1.02]"
            : "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
        }
      `}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-primary-blue text-white text-[10px] font-semibold uppercase tracking-widest px-4 py-1 rounded-full">
            Recommended
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
        <p className="text-sm text-cool-gray">{plan.subtitle}</p>
      </div>

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
            <Check
              size={15}
              className={`mt-0.5 shrink-0 ${isRecommended ? "text-primary-blue" : "text-emerald-500"}`}
              strokeWidth={2.5}
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className={`
          w-full py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer
          ${
            plan.ctaVariant === "primary"
              ? "bg-primary-blue text-white hover:bg-blue-600 active:scale-[0.98] shadow-sm"
              : "border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-[0.98]"
          }
        `}
      >
        {plan.cta}
      </button>
    </div>
  );
}
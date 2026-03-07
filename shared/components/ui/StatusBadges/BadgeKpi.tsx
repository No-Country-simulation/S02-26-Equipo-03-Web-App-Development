import { TrendingUp, TrendingDown, Minus, TriangleAlert } from "lucide-react";

type BadgeKpiType = "up" | "down" | "neutral" | "warning";

interface BadgeKpiProps {
  type: BadgeKpiType;
  value: string | number;
}

const BADGE_STYLES: { [_K in BadgeKpiType]: string } = {
  up: "border-[#BBF7D1] bg-[#EEFFF4] text-[#049140] dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
  down: "border-[#FFC0C0] bg-[#FFF0F0] text-[#D70000] dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  neutral:
    "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
  warning:
    "border-[#FFFD86] bg-[#FFFFE7] text-[#A67102] dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400",
};

const BADGE_ICONS: { [_K in BadgeKpiType]: React.ElementType } = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
  warning: TriangleAlert,
};

export function BadgeKpi({ type, value }: BadgeKpiProps) {
  const Icon = BADGE_ICONS[type];
  const className = BADGE_STYLES[type];

  return (
    <span
      className={`ml-auto inline-flex items-center gap-0.5 rounded-sm border px-1.5 py-0.5 text-xs font-semibold tabular-nums transition-colors ${className}`}
    >
      <Icon className="h-3 w-3" />
      {value}
    </span>
  );
}

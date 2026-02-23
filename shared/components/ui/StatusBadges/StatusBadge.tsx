import { cn } from "@/shared/lib/utils";

export type BadgeStatus = "conectado" | "alerta" | "critico";

const statusConfig: Record<
  BadgeStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  conectado: {
    label: "Conectado",
    bg: "bg-[#ECFDF5]",
    text: "text-[#007A55]",
    border: "border-[#A4F4CF]",
    dot: "bg-[#007A55]",
  },
  alerta: {
    label: "Alerta",
    bg: "bg-[#FFFBEB]",
    text: "text-[#BB4D00]",
    border: "border-[#FEE685]",
    dot: "bg-[#BB4D00]",
  },
  critico: {
    label: "Crítico",
    bg: "bg-[#FFF1F2]",
    text: "text-[#C70036]",
    border: "border-[#FFCCD3]",
    dot: "bg-[#C70036]",
  },
};

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
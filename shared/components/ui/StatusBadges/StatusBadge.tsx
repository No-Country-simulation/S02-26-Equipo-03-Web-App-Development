import { cn } from "@/shared/lib/utils";

export type BadgeStatus = "conectado" | "alerta" | "critico";

const statusConfig: Record<
  BadgeStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  conectado: {
    label: "Conectado",
    bg: "bg-[#EEFFF4]",
    text: "text-[#049140]",
    border: "border-[#BBF7D1]",
    dot: "bg-[#33F583]",
  },
  alerta: {
    label: "Alerta",
    bg: "bg-[#FFFFE7]",
    text: "text-[#A67102]",
    border: "border-[#FFFD86]",
    dot: "bg-[#FFF441]",
  },
  critico: {
    label: "Crítico",
    bg: "bg-[#FFF0F0]",
    text: "text-[#D70000]",
    border: "border-[#FFC0C0]",
    dot: "bg-[#FF2323]",
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
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-xs font-medium uppercase",
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

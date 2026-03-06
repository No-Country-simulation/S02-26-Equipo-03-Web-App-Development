import { Badge } from "@shared/components/ui/badge";

interface AlertBadgeProps {
  status: "INFO" | "ALERTA" | "CRÍTICO";
  uppercase?: boolean;
}

const statusStyles: Record<AlertBadgeProps["status"], string> = {
  INFO: "border-[#BBF7D1] bg-[#EEFFF4] text-[#049140]",
  ALERTA: "border-[#FFFD86] bg-[#FFFFE7] text-[#A67102]",
  CRÍTICO: "border-[#FFC0C0] bg-[#FFF0F0] text-[#D70000]",
};

export function AlertBadge({ status, uppercase }: AlertBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold ${uppercase ? "uppercase" : ""} ${statusStyles[status]}`}
    >
      {status === "CRÍTICO" ? "Crítico" : status === "ALERTA" ? "Alerta" : "Info"}
    </Badge>
  );
}

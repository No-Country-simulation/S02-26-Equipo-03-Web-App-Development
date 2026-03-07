"use client";

import { Button } from "@shared/components/ui/button";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { OrderStatus } from "../../../types/orders.types";
import { showToast } from "@/shared/lib/Toast";

interface OrderActionsCardProps {
  status: OrderStatus;
  stripeId: string;
  onCopy?: () => void;
  stripeUrl?: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PAGADO: {
    label: "Pago verificado exitosamente",
    color: "text-emerald-600",
    icon: <CheckCircle2 className="h-12 w-12 text-emerald-500" strokeWidth={1.5} />,
  },
  PENDIENTE: {
    label: "Pago pendiente de confirmación",
    color: "text-yellow-600",
    icon: <CheckCircle2 className="h-12 w-12 text-yellow-400" strokeWidth={1.5} />,
  },
  FALLIDO: {
    label: "El pago no pudo procesarse",
    color: "text-red-600",
    icon: <CheckCircle2 className="h-12 w-12 text-red-400" strokeWidth={1.5} />,
  },
};

export function OrderActionsCard({
  status,
  stripeId,
  onCopy,
  stripeUrl = "https://dashboard.stripe.com",
}: OrderActionsCardProps) {
  const config = statusConfig[status];

  const handleCopy = () => {
    navigator.clipboard.writeText(stripeId);
    onCopy?.();
    showToast.success("ID del pedido copiado al portapapeles");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Status card */}
      <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-6 text-center">
        {config.icon}
        <p className={`text-sm font-semibold ${config.color}`}>{config.label}</p>
      </div>

      {/* Actions */}
      <Button
        variant="ghost"
        className="w-full cursor-pointer gap-2 bg-[#F1F5F9] text-sm font-medium hover:bg-white"
        onClick={handleCopy}
      >
        <Copy className="h-4 w-4" strokeWidth={2} />
        Copiar info del pedido
      </Button>

      <Button
        variant="link"
        className="w-full cursor-pointer gap-2 text-sm font-medium text-[#475569]"
        onClick={() => window.open(stripeUrl, "_blank")}
      >
        Ver en Stripe Dashboard
        <ExternalLink className="h-4 w-4" strokeWidth={2} />
      </Button>
    </div>
  );
}

import { ShieldCheck, Info } from "lucide-react";
import { OrderDetail } from "../../../types/order-detail.types";
import { CopyButton } from "./CopyButton";

interface OrderPaymentCardProps {
  order: OrderDetail;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{children}</span>
    </div>
  );
}

export function OrderPaymentCard({ order }: OrderPaymentCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center mb-4">
        Detalle de Pago
      </p>

      <p className="text-4xl font-bold text-gray-900 text-center mb-2">
        ${order.amount.toFixed(2)}
      </p>

      <div className="flex items-center justify-center gap-1 mb-6">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span className="text-xs text-emerald-600 font-medium">Verificado por Stripe</span>
        <Info className="h-3.5 w-3.5 text-gray-400 ml-1" />
      </div>

      <div className="divide-y divide-gray-100">
        <Row label="Cliente">{order.clientName}</Row>
        <Row label="Email">
          <span className="font-mono text-xs">{order.clientEmail}</span>
          <CopyButton value={order.clientEmail} />
        </Row>
        <Row label="Servicio">{order.service}</Row>
        <Row label="Tipo pago">{order.paymentType === "PAGO ÚNICO" ? "Pago Único" : "Suscripción"}</Row>
        <Row label="Fecha">
          {order.date}, {order.time} hs
        </Row>
        <Row label="Stripe ID">
          <span className="font-mono text-xs">{order.stripeId}</span>
          <CopyButton value={order.stripeId} />
        </Row>
      </div>
    </div>
  );
}
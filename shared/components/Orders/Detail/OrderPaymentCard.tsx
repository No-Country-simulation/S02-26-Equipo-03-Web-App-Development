import { ShieldCheck, Info } from "lucide-react";
import { OrderDetail } from "../../../types/order-detail.types";
import { CopyButton } from "./CopyButton";

interface OrderPaymentCardProps {
  order: OrderDetail;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2.5 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{children}</span>
    </div>
  );
}

export function OrderPaymentCard({ order }: OrderPaymentCardProps) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-6">
      <p className="mb-4 text-center text-xs font-semibold tracking-widest text-gray-400 uppercase">
        Detalle de Pago
      </p>

      <p className="mb-2 text-center text-4xl font-bold text-gray-900">
        ${order.amount.toFixed(2)}
      </p>

      <div className="mb-6 flex items-center justify-center gap-1">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span className="text-xs font-medium text-emerald-600">Verificado por Stripe</span>
        <Info className="ml-1 h-3.5 w-3.5 text-gray-400" />
      </div>

      <div className="divide-y divide-gray-100">
        <Row label="Cliente">{order.clientName}</Row>
        <Row label="Email">
          <span className="font-mono text-xs">{order.clientEmail}</span>
          <CopyButton value={order.clientEmail} />
        </Row>
        <Row label="Servicio">{order.service}</Row>
        <Row label="Tipo pago">
          {order.paymentType === "PAGO ÚNICO" ? "Pago Único" : "Suscripción"}
        </Row>
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

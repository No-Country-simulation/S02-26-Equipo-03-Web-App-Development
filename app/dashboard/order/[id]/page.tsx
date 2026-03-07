import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrderDetailSection } from "@shared/components/Orders/Detail/OrderDetailSection";
import { ORDER_DETAIL_MOCK } from "@shared/components/Orders/mock/order-detail.mock";
import { OrderStatus, PaymentType, OrderSource } from "@/shared/types/orders.types";
import { OrderDetail } from "@/shared/types/order-detail.types";

interface OrderDetailPageProps {
  params: { id: string };
}

import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { getOrderDetailAnalytics } from "@/modules/orders_detail.controller";
import { redirect } from "next/navigation";

// Cuando tengas API real, reemplazá esto por un fetch real usando params.id
async function getOrder(_id: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in/email");
  }

  const response = await getOrderDetailAnalytics(_id, user.id);

  if (response.status !== 200) {
    return ORDER_DETAIL_MOCK;
  }

  const json = await response.json();
  const dto = json.data?.[0];

  if (!dto) {
    return ORDER_DETAIL_MOCK;
  }

  const dateObj = new Date(dto.order_date_iso || Date.now());
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
  const dateFormatted = dateObj.toLocaleDateString("es-ES", options);
  const timeFormatted = dateObj.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  const stMap: Record<string, OrderStatus> = {
    confirmed: "PAGADO",
    pending: "PENDIENTE",
    failed: "FALLIDO",
  };

  const getSource = (src: string | null): OrderSource => {
    if (!src) return "ORGÁNICO";
    const lowerSrc = src.toLowerCase();
    if (lowerSrc.includes("meta") || lowerSrc.includes("facebook") || lowerSrc.includes("fb"))
      return "META ADS";
    if (lowerSrc.includes("google")) return "GOOGLE ADS";
    if (lowerSrc.includes("stripe")) return "STRIPE";
    return "ORGÁNICO";
  };

  const getPaymentType = (pt: string | null): PaymentType => {
    if (!pt) return "PAGO ÚNICO";
    if (pt.toLowerCase().includes("sub")) return "SUSCRIPCIÓN";
    return "PAGO ÚNICO";
  };

  const orderDetail: OrderDetail = {
    id: dto.id,
    clientName: dto.client_name ?? "Desconocido",
    clientEmail: dto.client_email ?? "Sin email",
    service: dto.service_name ?? "Servicio",
    paymentType: getPaymentType(dto.payment_type),
    source: getSource(dto.source_name),
    amount: dto.total_amount,
    status: stMap[dto.status] ?? "PAGADO",
    date: dateFormatted,
    time: timeFormatted,
    stripeId: dto.stripe_id ?? "N/A",
    attribution: {
      source: getSource(dto.source_name),
      initial: dto.source_name ? dto.source_name[0].toUpperCase() : "O",
      campaign: dto.campaign_id ?? "N/A",
      roas: dto.spent > 0 ? Number((dto.total_amount / dto.spent).toFixed(1)) : 0,
    },
    timeline: [
      {
        label: "Checkout iniciado",
        timestamp: "HACE X H",
      },
      {
        label: "Pago procesado",
        timestamp: "HACE X H",
      },
      {
        label: "Confirmado por Stripe",
        timestamp: `${dateFormatted.toUpperCase()} ${timeFormatted}`,
        isHighlighted: dto.verified_stripe || false,
      },
    ],
  };

  return orderDetail;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  return (
    <div>
      <div className="max-w-5xl px-20 py-6">
        <Link
          href="/dashboard/order"
          className="flex items-center text-sm font-medium text-black hover:text-[#0F172B]"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Órdenes
        </Link>
      </div>

      <OrderDetailSection order={order} />
    </div>
  );
}

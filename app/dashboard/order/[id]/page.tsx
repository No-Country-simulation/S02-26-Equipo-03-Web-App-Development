import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrderDetailSection } from "@shared/components/Orders/Detail/OrderDetailSection";
import { ORDER_DETAIL_MOCK } from "@shared/components/Orders/mock/order-detail.mock";
// import { OrderDetailSkeleton } from "./OrderDetailSkeleton";

interface OrderDetailPageProps {
  params: { id: string };
}

// Cuando tengas API real, reemplazá esto por un fetch real usando params.id
async function getOrder(_id: string) {
  // const order = await fetch(`/api/orders/${_id}`).then(r => r.json());
  return ORDER_DETAIL_MOCK;
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

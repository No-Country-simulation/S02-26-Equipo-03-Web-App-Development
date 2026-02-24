import { OrdersSection } from "@/shared/components/Orders/OrdersSection";
// import { OrdersSkeleton } from "./OrderSkeleton";


export default function OrderPage() {
  return <div className="min-h-screen bg-muted/40 p-6">
      <OrdersSection />
      {/* <OrdersSkeleton /> */}
   </div>;
}

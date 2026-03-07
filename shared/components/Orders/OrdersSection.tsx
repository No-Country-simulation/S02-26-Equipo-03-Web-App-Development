"use client";

import { useState, useMemo, useEffect } from "react";
import { OrdersTable } from "./OrdersTable";
import { SalesOrder } from "@/shared/interfaces/orders.interface";
import { SearchToolbar } from "../ui/search-toolbar";
import { useSelectedProjectStore } from "@/shared/hooks/use-selected-project-store";

const PAGE_SIZE = 4;

export function OrdersSection() {
  const { selectedProjectId } = useSelectedProjectStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [allOrders, setAllOrders] = useState<SalesOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      if (!selectedProjectId) {
        setAllOrders([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/analytics/orders?projectId=${selectedProjectId}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const json = await res.json();

        const mappedOrders: SalesOrder[] = (json.data || []).map((dto: any) => ({
          id: dto.id,
          projectId: dto.project_id,
          ecommerceIntegrationId: null,
          transactionId: dto.stripe_id || "",
          externalOrderId: "",
          totalAmount: dto.total_amount,
          currency: "USD",
          status: dto.status,
          orderDate: dto.order_date_iso || new Date().toISOString(),
          customerName: dto.client_name || "",
          customerEmail: dto.client_email || "",
          productName: dto.service_name || "",
          paymentType: dto.payment_type || "",
          stripeId: dto.stripe_id || "",
          campaignId: dto.campaign_id || "",
          sourcePlatform: dto.source_name || "",
        }));

        setAllOrders(mappedOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [selectedProjectId]);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return allOrders;
    return allOrders.filter(
      (o) =>
        o.customerName.toLowerCase().includes(query) ||
        o.customerEmail.toLowerCase().includes(query) ||
        o.id.toLowerCase().includes(query)
    );
  }, [search, allOrders]);

  // Resetear página al buscar
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const paginatedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const total = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  const visibleOrderIds = paginatedOrders.map((order) => order.id);
  const allVisibleSelected =
    visibleOrderIds.length > 0 &&
    visibleOrderIds.every((orderId) => selectedOrderIds.includes(orderId));

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleAllVisibleSelection = () => {
    setSelectedOrderIds((prev) => {
      if (allVisibleSelected) {
        return prev.filter((id) => !visibleOrderIds.includes(id));
      }

      const next = new Set(prev);
      visibleOrderIds.forEach((id) => next.add(id));
      return Array.from(next);
    });
  };

  return (
    <div className="px-6 py-6 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Órdenes</h1>
        <p className="text-sm text-gray-500">Pagos confirmados por Stripe en tiempo real.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <SearchToolbar search={search} onSearchChange={handleSearch} />
        <OrdersTable
          orders={paginatedOrders}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          selectedOrderIds={selectedOrderIds}
          allVisibleSelected={allVisibleSelected}
          onToggleOrderSelection={toggleOrderSelection}
          onToggleAllVisibleSelection={toggleAllVisibleSelection}
        />
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { OrdersToolbar } from "./OrdersToolbar";
import { OrdersTable } from "./OrdersTable";
import { SalesOrder } from "@/shared/interfaces/orders.interface";
import { RESPONSE_MOCK } from "./mock/order-server.mock";

const PAGE_SIZE = 4;

// En el futuro reemplazá ORDERS_MOCK por datos reales (fetch, props, etc.)
const allOrders: SalesOrder[] = RESPONSE_MOCK.data;

export function OrdersSection() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return allOrders;
    return allOrders.filter(
      (o) =>
        o.customerName.toLowerCase().includes(query) ||
        o.customerEmail.toLowerCase().includes(query) ||
        o.id.toLowerCase().includes(query)
    );
  }, [search]);

  // Resetear página al buscar
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

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
        <OrdersToolbar
          search={search}
          onSearchChange={handleSearch}
          onFilter={() => console.log("abrir filtros")}
          onExport={() => console.log("exportar CSV")}
        />
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
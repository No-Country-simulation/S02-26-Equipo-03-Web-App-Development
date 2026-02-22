"use client";

import { useState, useMemo } from "react";
import { OrdersToolbar } from "./OrdersToolbar";
import { OrdersTable } from "./OrdersTable";
import { ORDERS_MOCK, ORDERS_TOTAL } from "./mock/order.mock"
import { Order } from "../../types/orders.types";

const PAGE_SIZE = 7;

// En el futuro reemplazá ORDERS_MOCK por datos reales (fetch, props, etc.)
const allOrders: Order[] = ORDERS_MOCK;

export function OrdersSection() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return allOrders;
    return allOrders.filter(
      (o) =>
        o.clientName.toLowerCase().includes(query) ||
        o.clientEmail.toLowerCase().includes(query) ||
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

  // Cuando haya API real: total vendrá del backend
  const total = search ? filteredOrders.length : ORDERS_TOTAL;

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
        />
      </div>
    </div>
  );
}
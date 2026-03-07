import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Checkbox } from "@shared/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { SalesOrder } from "@/shared/interfaces/orders.interface";
import { HeaderColumn } from "@/shared/types/header-col.types";

// --- Sub-components ---

function ColHeader({ label }: { label: string }) {
  return <span>{label}</span>;
}

function formatAmount(amount: number, currency?: string) {
  const normalizedCurrency = currency?.toUpperCase();

  if (normalizedCurrency === "USD") {
    return `USD ${amount.toFixed(2)}`;
  }

  return `$${amount.toFixed(2)}`;
}

function formatOrderDate(orderDate: string) {
  const parsedDate = new Date(orderDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return orderDate;
  }

  const day = String(parsedDate.getUTCDate()).padStart(2, "0");
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
  const year = String(parsedDate.getUTCFullYear());

  return `${day}-${month}-${year}`;
}

function formatOrderId(id: string) {
  return id.split("-")[0] ?? id;
}

function SourceBadge({ source }: { source: string }) {
  let label = "Orgánico";
  const srcLower = source?.toLowerCase() || "";

  if (srcLower.includes("google")) {
    label = "Google Ads";
  } else if (
    srcLower.includes("meta") ||
    srcLower.includes("facebook") ||
    srcLower.includes("fb")
  ) {
    label = "Meta Ads";
  } else if (srcLower.includes("stripe")) {
    label = "Stripe";
  }

  return (
    <Badge
      variant="outline"
      className="rounded-sm border-[#E2E8F0] bg-white px-2 text-xs font-semibold text-[#475569]"
    >
      {label}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "border-[#BBF7D1] bg-[#EEFFF4] text-[#049140]",
    pending: "border-[#FFFD86] bg-[#FFFFE7] text-[#A67102]",
    failed: "border-[#FFC0C0] bg-[#FFF0F0] text-[#D70000]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {status === "confirmed" ? "Pagado" : status === "pending" ? "Pendiente" : "Fallido"}
    </span>
  );
}

// --- Props ---

interface OrdersTableProps {
  orders: SalesOrder[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (_page: number) => void;
  selectedOrderIds: string[];
  allVisibleSelected: boolean;
  onToggleOrderSelection: (_orderId: string) => void;
  onToggleAllVisibleSelection: () => void;
}

const HEADER_COLUMNS: HeaderColumn[] = [
  { key: "id", label: "ID de Orden", className: "w-28" },
  { key: "client", label: "Cliente" },
  { key: "service", label: "Servicio" },
  { key: "paymentType", label: "Tipo Pago" },
  { key: "source", label: "Fuente" },
  { key: "amount", label: "Monto" },
  { key: "status", label: "Estado" },
  { key: "date", label: "Fecha" },
];

// --- Main Component ---

export function OrdersTable({
  orders,
  total,
  page,
  pageSize,
  onPageChange,
  selectedOrderIds,
  allVisibleSelected,
  onToggleOrderSelection,
  onToggleAllVisibleSelection,
}: OrdersTableProps) {
  const safeTotalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPreviousPage = page > 1;
  const hasNextPage = page < safeTotalPages;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(page * pageSize, total);
  const router = useRouter();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-[#E2E8F0] text-xs tracking-wide uppercase [&_th]:text-[#475569]">
            <TableHead className="w-10">
              <Checkbox
                checked={allVisibleSelected}
                aria-label="Seleccionar órdenes visibles"
                onClick={(event) => event.stopPropagation()}
                onCheckedChange={onToggleAllVisibleSelection}
                className="border-[#E2E8F0]"
              />
            </TableHead>
            {HEADER_COLUMNS.map((column) => (
              <TableHead key={column.key} className={column.className}>
                <ColHeader label={column.label} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, i) => (
            <TableRow
              key={`${order.id}-${i}`}
              onClick={() => router.push(`/dashboard/order/${order.id}`)}
              className="cursor-pointer border-[#E2E8F0] transition-colors"
            >
              <TableCell>
                <Checkbox
                  checked={selectedOrderIds.includes(order.id)}
                  aria-label={`Seleccionar orden ${order.id}`}
                  onClick={(event) => event.stopPropagation()}
                  onCheckedChange={() => onToggleOrderSelection(order.id)}
                  className="border-[#E2E8F0]"
                />
              </TableCell>
              <TableCell className="py-5 text-sm font-medium text-[#020617]">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{formatOrderId(order.id)}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{order.id}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-[#020617]">{order.customerName}</span>
                  <span className="text-xs text-[#475569]">{order.customerEmail}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm font-medium text-[#020617]">
                {order.productName}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="rounded-sm border-[#E2E8F0] bg-white px-2 text-xs font-semibold text-[#475569]"
                >
                  {order.paymentType}
                </Badge>
              </TableCell>
              <TableCell>
                <SourceBadge source={order.sourcePlatform} />
              </TableCell>
              <TableCell className="font-medium text-[#020617]">
                {formatAmount(order.totalAmount, order.currency)}
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-sm font-medium text-[#020617]">
                {formatOrderDate(order.orderDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-[#E2E8F0] px-4 py-6">
        <span className="text-sm font-medium text-[#020617]">
          Mostrando {start}–{end} de {total.toLocaleString()} resultados
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="border-[#E2E8F0]"
            disabled={!hasPreviousPage}
            onClick={() => {
              if (!hasPreviousPage) return;
              onPageChange(page - 1);
            }}
          >
            Anterior
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="border-[#E2E8F0]"
            disabled={!hasNextPage}
            onClick={() => {
              if (!hasNextPage) return;
              onPageChange(page + 1);
            }}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";
import { Badge } from "@shared/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import { Button } from "@shared/components/ui/button";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Order, OrderSource, OrderStatus } from "../../types/orders.types";

// --- Sub-components ---

function ColHeader({ label, tooltip }: { label: string; tooltip?: string }) {
  return (
    <div className="flex items-center gap-1">
      <span>{label}</span>
      {tooltip && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 cursor-pointer text-gray-400 hover:text-gray-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

function SourceBadge({ source }: { source: OrderSource }) {
  const colors: Record<OrderSource, string> = {
    "META ADS": "bg-blue-600",
    "GOOGLE ADS": "bg-red-500",
    "STRIPE": "bg-[#635BFF]",
  };
  const initials: Record<OrderSource, string> = {
    "META ADS": "M",
    "GOOGLE ADS": "G",
    "STRIPE": "S",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${colors[source]}`}
      >
        {initials[source]}
      </span>
      <span className="text-sm text-gray-700">{source}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    PAGADO: "border-emerald-400 bg-emerald-50 text-emerald-700",
    PENDIENTE: "border-yellow-400 bg-yellow-50 text-yellow-700",
    FALLIDO: "border-red-400 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

// --- Props ---

interface OrdersTableProps {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (_page: number) => void;
}

// --- Main Component ---

export function OrdersTable({
  orders,
  total,
  page,
  pageSize,
  onPageChange,
}: OrdersTableProps) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80 text-xs uppercase tracking-wide [&_th]:text-[#90A1B9]">
            <TableHead className="w-28">ID de Orden</TableHead>
            <TableHead>
              <ColHeader label="Cliente" />
            </TableHead>
            <TableHead>
              <ColHeader label="Servicio" tooltip="Producto o servicio adquirido" />
            </TableHead>
            <TableHead>
              <ColHeader label="Tipo Pago" tooltip="Pago único o suscripción recurrente" />
            </TableHead>
            <TableHead>
              <ColHeader label="Fuente" tooltip="Canal de adquisición del cliente" />
            </TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>
              <ColHeader label="Estado" tooltip="Estado del pago en Stripe" />
            </TableHead>
            <TableHead>
              <ColHeader label="Fecha" tooltip="Fecha de confirmación del pago" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, i) => (
            <TableRow
              key={`${order.id}-${i}`}
              className="cursor-pointer transition-colors hover:bg-gray-50/60"
            >
              <TableCell className="text-sm text-gray-400">{order.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">{order.clientName}</span>
                  <span className="text-xs text-gray-400">{order.clientEmail}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-700">{order.service}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="rounded-full border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700"
                >
                  {order.paymentType}
                </Badge>
              </TableCell>
              <TableCell>
                <SourceBadge source={order.source} />
              </TableCell>
              <TableCell className="font-semibold text-gray-900">
                ${order.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-sm text-gray-600">{order.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <span className="text-sm font-medium text-gray-600">
          MOSTRANDO {start}–{end} DE {total.toLocaleString()}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
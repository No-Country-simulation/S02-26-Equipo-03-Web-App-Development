import { NextResponse } from "next/server";
import { db } from "@infrastructure/database";

/**
 * DTO que representa el detalle analítico de una orden.
 *
 * Incluye información comercial, financiera y de contexto
 * para la vista de detalle en dashboard/reportes.
 *
 * Campos derivados:
 * - `verified_stripe`: se calcula con `stripe_id` efectivo + estado `confirmed`.
 * - `stripe_id`: usa `orders.stripe_id` y cae en `transactions.external_id` si falta.
 *
 * Origen principal de campos:
 * - `orders`: id, status, total_amount, client_name, client_email, payment_type,
 *   order_date_iso, campaign_id, project_id, source_name.
 * - `campaigns`: service_name, spent.
 * - `projects`: project_name.
 * - `session`: expires_at_iso.
 */
export interface OrderDetailDTO {
  /** Identificador único de la orden (`orders.id`). */
  id: string;
  /** Estado de la orden/pago (`orders.status`). */
  status: string;
  /** Monto total confirmado de la orden (`orders.total_amount`). */
  total_amount: number;
  /** Indica si la orden está verificada por Stripe (derivado). */
  verified_stripe: boolean;
  /** Nombre del cliente (`orders.customer_name`). */
  client_name: string | null;
  /** Email del cliente (`orders.customer_email`). */
  client_email: string | null;
  /** Nombre de la campaña/servicio (`campaigns.name`). */
  service_name: string | null;
  /** Tipo de pago (`orders.payment_type`). */
  payment_type: string | null;
  /** Fecha ISO de la orden (`orders.order_date`). */
  order_date_iso: string;
  /** Stripe ID efectivo (`orders.stripe_id` o `transactions.external_id`). */
  stripe_id: string | null;
  /** Fuente de ads/plataforma (`orders.source_platform`). */
  source_name: string | null;
  /** Gasto acumulado de la campaña (`campaigns.spent`). */
  spent: number;
  /** Nombre del proyecto (`projects.name`). */
  project_name: string | null;
  /** Identificador de campaña (`orders.campaign_id`). */
  campaign_id: string | null;
  /** Identificador de proyecto (`orders.project_id`). */
  project_id: string;
  /** Fecha ISO de expiración de sesión activa (`session.expires_at`). */
  expires_at_iso: string;
}

type OrderDetailRecord = {
  id: string;
  status: string;
  totalAmount: number;
  customerName: string | null;
  customerEmail: string | null;
  productName: string | null;
  paymentType: string | null;
  orderDate: Date;
  stripeId: string | null;
  sourcePlatform: string | null;
  campaignId: string | null;
  projectId: string;
  campaign: { name: string; spent: number | null } | null;
  project: { name: string } | null;
  transaction: { externalId: string | null } | null;
};

/**
 * Construye una respuesta HTTP 500 estándar y registra el error original.
 * @param message Contexto del error para logging.
 * @param error Error capturado.
 * @returns `NextResponse` con status 500.
 */
function internalError(message: string, error: unknown) {
  console.error(message, error);
  return NextResponse.json(
    {
      status: "error",
      message: "Internal Server Error",
    },
    { status: 500 }
  );
}

/**
 * Mapea una orden con relaciones al DTO del contrato de `orders_detail`.
 * @param order Registro de orden con relaciones (`campaign`, `project`, `transaction`).
 * @param sessionExpiresAt Fecha de expiración de la sesión activa del usuario.
 * @returns DTO final de detalle de orden.
 */
function mapToOrderDetailDTO(order: OrderDetailRecord, sessionExpiresAt: Date): OrderDetailDTO {
  const stripeId = order.stripeId ?? order.transaction?.externalId ?? null;
  const verifiedStripe = Boolean(stripeId) && order.status === "confirmed";

  return {
    id: order.id,
    status: order.status,
    total_amount: order.totalAmount,
    verified_stripe: verifiedStripe,
    client_name: order.customerName,
    client_email: order.customerEmail,
    service_name: order.productName ?? null,
    payment_type: order.paymentType,
    order_date_iso: order.orderDate.toISOString(),
    stripe_id: stripeId,
    source_name: order.sourcePlatform,
    spent: order.campaign?.spent ?? 0,
    project_name: order.project?.name ?? null,
    campaign_id: order.campaignId,
    project_id: order.projectId,
    expires_at_iso: sessionExpiresAt.toISOString(),
  };
}

/**
 * Obtiene el detalle analítico de una orden específica.
 *
 * Flujo:
 * 1. Verifica sesión activa del usuario.
 * 2. Busca la orden por `orderId`.
 * 3. Valida membresía del usuario al proyecto de la orden.
 * 4. Retorna el DTO del contrato.
 *
 * @param orderId UUID de la orden.
 * @param userId Usuario autenticado.
 * @returns `NextResponse` con `{ data: [OrderDetailDTO] }`.
 *
 * @throws 401 si no existe sesión activa.
 * @throws 404 si la orden no existe o no pertenece al usuario.
 * @throws 500 ante errores internos de consulta/mapeo.
 */
export async function getOrderDetailAnalytics(orderId: string, userId: string) {
  try {
    const activeSession = await db.query.sessionsTable.findFirst({
      where: (table, { and, eq, gt }) =>
        and(eq(table.userId, userId), gt(table.expiresAt, new Date())),
      orderBy: (table, { desc }) => [desc(table.expiresAt)],
    });

    if (!activeSession) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized: Se requiere una sesión activa para acceder a este recurso.",
        },
        { status: 401 }
      );
    }

    const order = await db.query.ordersTable.findFirst({
      where: (table, { eq }) => eq(table.id, orderId),
      with: {
        campaign: {
          columns: {
            name: true,
            spent: true,
          },
        },
        project: {
          columns: {
            name: true,
          },
        },
        transaction: {
          columns: {
            externalId: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          status: "error",
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    const membership = await db.query.projectMembersTable.findFirst({
      where: (table, { and, eq }) =>
        and(eq(table.projectId, order.projectId), eq(table.userId, userId)),
    });

    if (!membership) {
      return NextResponse.json(
        {
          status: "error",
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    const dto = mapToOrderDetailDTO(order as OrderDetailRecord, activeSession.expiresAt);

    return NextResponse.json({
      data: [dto],
    });
  } catch (error: unknown) {
    return internalError("Failed to fetch order detail analytics:", error);
  }
}

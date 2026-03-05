import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { getOrderDetailAnalytics } from "@/modules/orders_detail.controller";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/analytics/orders_detail
 *
 * Flujo de validación:
 * 1. Valida `orderId` en query params.
 * 2. Obtiene usuario autenticado con Better Auth (`getCurrentUser`).
 * 3. Delega la resolución al controller.
 *
 * @param req Request entrante de Next.js.
 * @returns JSON con detalle de orden o error HTTP (400/401/404/500).
 */
export async function getOrderDetail(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId")?.trim() ?? "";

    if (!orderId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Query parameter 'orderId' is required",
        },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    return getOrderDetailAnalytics(orderId, user.id);
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unauthorized",
      },
      { status: 401 }
    );
  }
}

export { getOrderDetail as GET };

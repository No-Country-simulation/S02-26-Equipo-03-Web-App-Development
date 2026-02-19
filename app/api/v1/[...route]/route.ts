import { NextRequest, NextResponse } from "next/server";
import { analyticsController } from "@/modules/analytics.controller";
import { auth } from "@/infrastructure/better-auth/auth";

export const dynamic = "force-dynamic";

/**
 * Root API Dispatcher
 *
 * This file handles all API routes that do not have a specific folder match.
 * It uses a "Catch-all" segment [...route] at the /api/ level.
 *
 * @route GET /api/[...route]
 */

// Define a type for our route handlers
// eslint-disable-next-line no-unused-vars
type RouteHandler = (_req: NextRequest) => Promise<NextResponse> | NextResponse;

// Map HTTP Methods -> Paths -> Handlers
const router: Record<string, Record<string, RouteHandler>> = {
  GET: {
    generalanalytics: analyticsController.getAnalytics,
    generalanalytics1: analyticsController.getAnalytics, // Reuse for another endpoint
    generalanalytics2: analyticsController.getAnalyticsByConversions,
  },
  POST: {
    // Add POST endpoints here
  },
};

async function dynamicDispatcherGET(
  req: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  // Await params in Next.js 15+ (and 16)
  const resolvedParams = await params;
  const path = resolvedParams.route.join("/"); // e.g. "analytics" or "v1/analytics"

  console.log(`[Root Dispatch] Routing GET request for: ${path}`);

  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session || !session.session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  } catch (e: any) {
    console.error("Auth Error:", e);
    return new NextResponse(`Auth Error: ${e.message}`, { status: 500 });
  }

  const handler = router["GET"]?.[path];

  if (handler) {
    return handler(req);
  }

  return NextResponse.json({ error: `Route '/api/${path}' not found` }, { status: 404 });
}

// We can export other methods (POST, PUT, etc.) similarly
async function dynamicDispatcherPOST(
  req: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.route.join("/");

  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session || !session.session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const handler = router["POST"]?.[path];

  if (handler) {
    return handler(req);
  }

  return NextResponse.json({ error: `Route '/api/${path}' not found` }, { status: 404 });
}

export { dynamicDispatcherGET as GET, dynamicDispatcherPOST as POST };

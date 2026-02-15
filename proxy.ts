import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/infrastructure/better-auth/auth";

/**
 * Next.js 16 Proxy
 *
 * Es la barrera ante peticiones a la API.
 * Centraliza la autenticación para rutas protegidas.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Definimos las rutas que requieren sesión obligatoria
  const isProtectedRoute =
    pathname.startsWith("/api/analytics") || pathname.startsWith("/api/protected");

  if (isProtectedRoute) {
    // 2. Vemos la sesión mediante Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // 3. Si no hay sesión, devolvemos 401 Unauthorized sin llegar al route handler
    if (!session) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized: Se requiere una sesión activa para acceder a este recurso.",
        },
        { status: 401 }
      );
    }
  }

  // Si la ruta no es protegida o el usuario está logueado, continuamos
  return NextResponse.next();
}

/**
 * Indicamos a Next.js
 * en qué rutas específicas debe ejecutarse este proxy.
 */
export const config = {
  matcher: ["/api/analytics/:path*", "/api/protected/:path*"],
};

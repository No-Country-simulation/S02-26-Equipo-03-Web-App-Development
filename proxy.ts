import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@infrastructure/better-auth/auth";
import { parseAttributionFromUrl } from "@infrastructure/attribution/parser";

/**
 * Next.js 16 Proxy
 *
 * Es la barrera ante peticiones a la API y páginas.
 * Centraliza lógica de marketing y autenticación.
 * 
 * Reglas de la cookie:
 * - Nombre: "saas_attribution"
 * - Path: "/" (disponible en todo el dominio)
 * - Duración: 30 días
 * - SameSite: lax
 * - Secure: solo en producción
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // --- CAPA 1: ATRIBUCIÓN ---
  // Se ejecuta solo en páginas de navegación
  const isPage = !pathname.startsWith('/api') && !pathname.startsWith('/_next');
  
  if (isPage) {
    const attribution = parseAttributionFromUrl(request.url);

    if (attribution) {
      response.cookies.set("saas_attribution", JSON.stringify(attribution), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 días
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true, // Seguridad: No accesible desde JS del cliente
      });
    }
  }

  // --- CAPA 2: AUTENTICACIÓN ---
  // 1. Se ejecuta solo en rutas protegidas
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

  return response;
}

/**
 * Indicamos a Next.js
 * en qué rutas específicas debe ejecutarse este proxy.
 * 
 * * Matchers:
 * - APIs de analytics y rutas protegidas
 * - Todas las páginas excepto rutas internas y recursos estáticos
 */
export const config = {
  matcher: ["/api/analytics/:path*", "/api/protected/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

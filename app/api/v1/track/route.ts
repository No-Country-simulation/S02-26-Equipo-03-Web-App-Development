/**
 * Track Endpoint — POST /api/v1/track  &  GET /api/v1/track
 *
 *
 * Dos rutas:
 *   POST → El Pixel envía JSON con fetch()  (moderno, preferido)
 *   GET  → El Pixel envía datos via <img src=""> query param (fallback, sin JS)
 *
 * No requiere autenticación de usuario (no hay sesión).
 * Se autentica con API Key en el header "x-api-key" o query param "k".
 */

import { NextRequest, NextResponse } from "next/server";
import { EventService } from "@/modules/events/event.service";
import { pixelGetSchema } from "@/modules/events/event.validators";
import type { RequestMetadata } from "@/modules/events/event.types";

// 1x1 transparent GIF (para el GET con <img> tag)
const PIXEL_GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

/**
 * Extrae metadatos del request HTTP.
 * Equivale a datos de HttpServletRequest en Spring Boot.
 */
function extractMetadata(req: NextRequest): RequestMetadata {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";

  // Anonimizar IP: quitar último octeto (GDPR-friendly)
  const parts = ip.split(".");
  const ipAnonymized = parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : ip;

  return {
    ipAnonymized,
    userAgent: req.headers.get("user-agent") ?? "",
    referrer: req.headers.get("referer") ?? "",
    source: "pixel",
  };
}

/**
 * POST /api/v1/track
 *
 * El Pixel envía un JSON con fetch(). Es el método preferido.
 */
export async function POST(req: NextRequest) {
  try {
    // Extraer API Key del header
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Missing x-api-key header" },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const body = await req.json();
    const metadata = extractMetadata(req);

    const result = await EventService.trackEvent(apiKey, body, metadata);

    if (!result.success) {
      return NextResponse.json(result, { status: 400, headers: CORS_HEADERS });
    }

    return NextResponse.json(result, { status: 202, headers: CORS_HEADERS }); // 202 Accepted
  } catch (error) {
    console.error("POST /api/v1/track error:", error);

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * GET /api/v1/track?d=base64payload&k=apikey
 *
 * Responde un pixel 1x1 transparente (para tracking con <img> tag).
 * Útil cuando JavaScript está bloqueado.
 * El payload viene como un query param "d" codificado en base64.
 *
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parseResult = pixelGetSchema.safeParse({
      d: url.searchParams.get("d"),
      k: url.searchParams.get("k"),
    });

    if (!parseResult.success) {
      // Retornar el GIF de todas formas (no romper la página del cliente)
      return new Response(PIXEL_GIF, {
        status: 200,
        headers: {
          "Content-Type": "image/gif",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          ...CORS_HEADERS,
        },
      });
    }

    const { d, k: apiKey } = parseResult.data;

    // Decodificar el payload base64
    let payload: unknown;
    try {
      payload = JSON.parse(Buffer.from(d, "base64").toString("utf-8"));
    } catch {
      return new Response(PIXEL_GIF, {
        status: 200,
        headers: { "Content-Type": "image/gif", ...CORS_HEADERS },
      });
    }

    const metadata = extractMetadata(req);
    await EventService.trackEvent(apiKey, payload, metadata);

    // Siempre retornar el GIF (no importa si falló, no queremos romper el cliente)
    return new Response(PIXEL_GIF, {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Content-Length": PIXEL_GIF.length.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error("GET /api/v1/track error:", error);

    return new Response(PIXEL_GIF, {
      status: 200,
      headers: { "Content-Type": "image/gif", ...CORS_HEADERS },
    });
  }
}

/**
 * OPTIONS — Preflight CORS
 * El navegador envía un OPTIONS antes del POST si es cross-origin.
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...CORS_HEADERS,
      "Access-Control-Max-Age": "86400",
    },
  });
}

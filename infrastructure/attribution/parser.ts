import { AttributionSchema, AttributionData } from "@infrastructure/attribution/attribution";

/**
 * Extrae los parámetros de atribución desde la URL de la request:
 * Esta función detecta si la URL contiene parámetros de marketing.
 * En caso afirmativo, valida los datos y genera un `external_session_id` únicamente para visitas de marketing.
*/
export function parseAttributionFromUrl(url: string): AttributionData | null {
  try {
    const { searchParams } = new URL(url);

    const hasTracking = searchParams.has('utm_source') || 
                        searchParams.has('gclid') || 
                        searchParams.has('fbclid');
    
    if (!hasTracking) return null;

    const data = Object.fromEntries(searchParams.entries());
    
    // Valida los datos según el esquema y genera un ID de sesión único
    return {
      ...AttributionSchema.parse(data),
      external_session_id: crypto.randomUUID(), 
    };
  } catch (e) {
    return null;
  }
}
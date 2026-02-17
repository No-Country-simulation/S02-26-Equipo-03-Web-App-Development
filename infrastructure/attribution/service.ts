import { AttributionSchema } from "@infrastructure/attribution/attribution";
import * as schema from "@infrastructure/database/schemas/schema";
import { db } from "@infrastructure/database";
import { and, eq } from "drizzle-orm";

export async function createAttribution(rawData: any, projectId: string, eventId: string) {
  // 1. Validación interna
  const result = AttributionSchema.safeParse(rawData);

  if (!result.success) {
    console.error("Attribution validation error:", result.error);
    return null; 
  }
  const validatedData = result.data

  // 2. Búsqueda de campaña por nombre si existe utm_campaign
  let campaignId: string | null = null;
  if (validatedData.utm_campaign) {
    const campaign = await db.query.campaignsTable.findFirst({
      where: (c) => and(
        eq(c.projectId, projectId),
        eq(c.name, validatedData.utm_campaign!)
      )
    });
    campaignId = campaign?.id ?? null;
  }

  // 3. Persistencia de la atribución en la base de datos
  return await db.insert(schema.attributionsTable).values({
    id: crypto.randomUUID(),
    eventId: eventId,
    campaignId: campaignId,
    utmSource: validatedData.utm_source,
    utmCampaign: validatedData.utm_campaign,
    externalSessionId: validatedData.external_session_id ?? `fallback_${crypto.randomUUID()}`,
    model: "last_click",
    weight: 1.0,
  });
}
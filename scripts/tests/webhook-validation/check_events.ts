import { db } from "../../../infrastructure/database/index";
import { eventsTable } from "../../../infrastructure/database/schemas/schema";
import { desc } from "drizzle-orm";

async function checkEvents() {
  console.log("Buscando los últimos eventos...");
  const events = await db.select().from(eventsTable).orderBy(desc(eventsTable.receivedAt)).limit(5);
  console.log(JSON.stringify(events, null, 2));
}

checkEvents().catch(console.error);

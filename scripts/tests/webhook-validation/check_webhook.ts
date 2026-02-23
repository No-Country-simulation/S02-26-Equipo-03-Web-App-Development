import { db } from "../../../infrastructure/database/index";
import { transactionsTable } from "../../../infrastructure/database/schemas/schema";

async function check() {
  const all = await db.select().from(transactionsTable);
  console.log("Total transacciones:", all.length);
  console.log(JSON.stringify(all, null, 2));
}

check().catch(console.error);

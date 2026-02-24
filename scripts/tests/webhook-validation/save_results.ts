import { db } from "../../../infrastructure/database/index";
import { transactionsTable, ordersTable } from "../../../infrastructure/database/schemas/schema";
import * as fs from "fs";

async function saveResults() {
  const txs = await db.select().from(transactionsTable);
  const orders = await db.select().from(ordersTable);

  const data = {
    transactions: txs,
    orders: orders,
  };

  fs.writeFileSync("scripts/tests/webhook-validation/results.json", JSON.stringify(data, null, 2));
}

saveResults().catch(console.error);

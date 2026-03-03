import { db } from "../../../infrastructure/database/index";
import { transactionsTable, ordersTable } from "../../../infrastructure/database/schemas/schema";

async function dump() {
  console.log("--- TRANSACCIONES ---");
  const txs = await db.select().from(transactionsTable);
  txs.forEach((tx) =>
    console.log(`ID: ${tx.id} | Amt: ${tx.amount} | Date: ${tx.transactionDate}`)
  );

  console.log("\n--- ÓRDENES ---");
  const orders = await db.select().from(ordersTable);
  orders.forEach((o) =>
    console.log(
      `ID: ${o.id} | TxID: ${o.transactionId} | Amt: ${o.totalAmount} | ExtID: ${o.externalOrderId}`
    )
  );
}

dump().catch(console.error);

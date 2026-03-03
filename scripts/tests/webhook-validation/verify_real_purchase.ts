import { db } from "../../../infrastructure/database/index";
import { transactionsTable, ordersTable } from "../../../infrastructure/database/schemas/schema";
import { desc } from "drizzle-orm";

async function verify() {
  console.log("=== ÚLTIMAS 5 TRANSACCIONES ===");
  const txs = await db
    .select()
    .from(transactionsTable)
    .orderBy(desc(transactionsTable.transactionDate))
    .limit(5);
  txs.forEach((tx) => {
    console.log(
      `ID: ${tx.id} | Amount: ${tx.amount} ${tx.currency} | Project: ${tx.projectId} | Date: ${tx.transactionDate}`
    );
  });

  console.log("\n=== ÚLTIMAS 5 ÓRDENES ===");
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.orderDate)).limit(5);
  orders.forEach((o) => {
    console.log(
      `ID: ${o.id} | TxID: ${o.transactionId} | Amount: ${o.totalAmount} | ExtID (Visitor): ${o.externalOrderId}`
    );
  });
}

verify().catch(console.error);

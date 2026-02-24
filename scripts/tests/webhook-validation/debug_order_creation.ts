import { db } from "../../../infrastructure/database/index";
import { ordersTable, transactionsTable } from "../../../infrastructure/database/schemas/schema";
import crypto from "crypto";

async function test() {
  const txs = await db.select().from(transactionsTable);
  const targetTx = txs.find((t) => t.amount === 5.99);

  if (!targetTx) {
    console.log("No se encontró la transacción de 5.99");
    return;
  }

  console.log("Intentando crear orden para TX:", targetTx.id);

  try {
    const order = await db
      .insert(ordersTable)
      .values({
        id: "manual-test-" + crypto.randomUUID(),
        projectId: targetTx.projectId,
        transactionId: targetTx.id,
        totalAmount: targetTx.amount,
        currency: targetTx.currency,
        status: "confirmed",
        orderDate: new Date(),
        externalOrderId: "manual-test",
      })
      .returning();

    console.log("Orden creada:", order);
  } catch (e) {
    console.error("Error al crear orden:", e);
  }
}

test().catch(console.error);

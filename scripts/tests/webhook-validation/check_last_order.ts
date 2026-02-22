import { db } from "../../../infrastructure/database/index";
import { ordersTable } from "../../../infrastructure/database/schemas/schema";
import { desc } from "drizzle-orm";

async function lastOrder() {
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.orderDate)).limit(1);
  if (orders.length > 0) {
    console.log("=== ÚLTIMA ORDEN REGISTRADA ===");
    console.log("ID:", orders[0].id);
    console.log("Monto:", orders[0].totalAmount);
    console.log("Visitor ID/ExtID:", orders[0].externalOrderId);
    console.log("Fecha:", orders[0].orderDate);
  } else {
    console.log("No se encontraron órdenes.");
  }
}

lastOrder().catch(console.error);

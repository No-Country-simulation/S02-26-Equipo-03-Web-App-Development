import { db } from "../../../infrastructure/database/index";
import { ordersTable } from "../../../infrastructure/database/schemas/schema";

async function checkOrders() {
  console.log("Buscando órdenes...");
  const orders = await db.select().from(ordersTable);
  console.log(JSON.stringify(orders, null, 2));
}

checkOrders().catch(console.error);

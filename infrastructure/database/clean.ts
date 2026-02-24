import { db } from "./index";
import { sql, is } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import * as schema from "./schemas/schema";

async function clean() {
  console.log("Iniciando limpieza de la base de datos...");

  // Identificar tablas reales usando 'is' de drizzle-orm
  const tables = (Object.values(schema) as any[]).filter((item): item is SQLiteTable<any> => {
    return is(item, SQLiteTable);
  });

  const tableNames = tables.map((t) => (t as any)._?.name || "unknown");

  if (tableNames.length === 0) {
    console.error("No se detectaron tablas en el schema. Revisando exportaciones...");
    console.log("Keys detectadas en schema:", Object.keys(schema));
    process.exit(1);
  }

  console.log(`Tablas a limpiar: ${tableNames.join(", ")}`);

  try {
    await db.run(sql`PRAGMA foreign_keys = OFF`);

    for (const table of tables) {
      const name = (table as any)._?.name || "table";
      process.stdout.write(`🗑️  Borrando ${name}... `);
      await db.delete(table);
      console.log("OK");
    }

    await db.run(sql`PRAGMA foreign_keys = ON`);

    console.log("\n ¡Limpieza completada!");
  } catch (err) {
    console.error("\n Error durante la limpieza:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

clean();

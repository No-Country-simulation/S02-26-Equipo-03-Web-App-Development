import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { db } from "@/infrastructure/database/db";

// Mockeamos el módulo de base de datos
vi.mock("@/src/lib/db", () => ({
  db: {
    select: vi.fn(),
  },
}));

// Mockeamos la tabla y operadores para evitar errores de importación en el test
vi.mock("@/src/lib/db/schema", () => ({
  analyticsTable: {},
}));

describe("Analytics API Endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a list of analytics records", async () => {
    // Simulamos una respuesta exitosa de la DB
    const mockRecords = [
      { id: 1, impressions: 100 },
      { id: 2, impressions: 200 },
    ];

    (db.select as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue(mockRecords),
      }),
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("success");
    expect(body.data).toEqual(mockRecords);
    expect(body.count).toBe(2);
  });

  it("should return 500 on database error", async () => {
    // Simulamos un fallo catastrófico en la base de datos
    (db.select as any).mockImplementation(() => {
      throw new Error("Database connection lost");
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.status).toBe("error");
    expect(body.message).toBe("Internal Server Error");
  });
});

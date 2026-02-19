/**
 * Comando de ejecución: npx ts-node tests/security-test.ts
 * verifica que el servidor esté corriendo antes de ejecutar las pruebas: pnpm run dev
 * asume que se registro cuenta con endpoint POST /api/auth/sign-in/email con email: test@example.com verificar la ejecucion antes de ejecutar las pruebas
 */

const BASE_URL = "http://localhost:3000";

interface TestCase {
  name: string;
  method: "GET" | "POST";
  endpoint: string;
  body?: any;
  expectedStatus: number;
  requiresAuth: boolean;
  description: string;
}

const testCases: TestCase[] = [
  {
    name: "1 Health Check",
    method: "GET",
    endpoint: "/api/health",
    expectedStatus: 200,
    requiresAuth: false,
    description: "Verificar que el servidor está activo",
  },
  {
    name: "2 Login FAIL - Credenciales inválidas",
    method: "POST",
    endpoint: "/api/auth/sign-in/email",
    body: {
      email: "wrong@example.com",
      password: "wrongpassword",
    },
    expectedStatus: 401,
    requiresAuth: false,
    description: "Login con credenciales incorrectas",
  },

  {
    name: "3 Analytics - Sin sesión",
    method: "GET",
    endpoint: "/api/v1/generalanalytics",
    expectedStatus: 401,
    requiresAuth: false,
    description: "Acceso sin sesión debe retornar 401",
  },
  {
    name: "4 Analytics 1 - Sin sesión",
    method: "GET",
    endpoint: "/api/v1/generalanalytics1",
    expectedStatus: 401,
    requiresAuth: false,
    description: "Acceso sin sesión debe retornar 401",
  },
  {
    name: "5 Analytics 2 - Sin sesión",
    method: "GET",
    endpoint: "/api/v1/generalanalytics2?conversions=22",
    expectedStatus: 401,
    requiresAuth: false,
    description: "Acceso sin sesión debe retornar 401",
  },

  {
    name: "6 Login SUCCESS",
    method: "POST",
    endpoint: "/api/auth/sign-in/email",

    body: {
      email: "test@example.com",
      password: "password123",
    },
    expectedStatus: 200,
    requiresAuth: false,
    description: "Login con credenciales válidas",
  },
  {
    name: "7 Analytics - CON sesión",
    method: "GET",
    endpoint: "/api/v1/generalanalytics",
    expectedStatus: 200,
    requiresAuth: true,
    description: "Acceso con sesión válida debe retornar 200",
  },
  {
    name: "8 Analytics 1  General- CON sesión",
    method: "GET",
    endpoint: "/api/v1/generalanalytics1",
    expectedStatus: 200,
    requiresAuth: true,
    description: "Acceso con sesión válida debe retornar 200",
  },
  {
    name: "9  Analytics 2 General- CON sesión",
    method: "GET",
    endpoint: "/api/v1/generalanalytics2?conversions=22",
    expectedStatus: 200,
    requiresAuth: true,
    description: "Filtro correcto debe retornar 200",
  },
  {
    name: "10 Analytics 2 General- Sin conversions",
    method: "GET",
    endpoint: "/api/v1/generalanalytics2",
    expectedStatus: 400,
    requiresAuth: true,
    description: "Sin parámetro conversions debe retornar 400",
  },
  {
    name: "11 Alerts - CON sesión",
    method: "GET",
    endpoint: "/api/v1/alerts/alert",
    expectedStatus: 200,
    requiresAuth: true,
    description: "Alertas con sesión válida",
  },
  {
    name: "12 Alerts 1 - CON sesión",
    method: "GET",
    endpoint: "/api/v1/alerts/alert1",
    expectedStatus: 200,
    requiresAuth: true,
    description: "Alertas 1 con sesión válida",
  },
  {
    name: "13 Reports ROI - CON sesión",
    method: "GET",
    endpoint: "/api/v1/reports/roi",
    expectedStatus: 200,
    requiresAuth: true,
    description: "ROI con sesión válida",
  },
  {
    name: "14 Reports PAC - CON sesión",
    method: "GET",
    endpoint: "/api/v1/reports/pac",
    expectedStatus: 200,
    requiresAuth: true,
    description: "PAC con sesión válida",
  },
  {
    name: "15 Analitics - CON sesión",
    method: "GET",
    endpoint: "/api/v1/analytics/analytics",
    expectedStatus: 200,
    requiresAuth: true,
    description: "Analytics con sesión válida",
  },
  {
    name: "16 Get Session - SIN sesión",
    method: "GET",
    endpoint: "/api/auth/get-session",
    expectedStatus: 200,
    requiresAuth: false,
    description: "Get session sin autenticación",
  },
  {
    name: "17 Get Session - CON sesión",
    method: "GET",
    endpoint: "/api/auth/get-session",
    expectedStatus: 200,
    requiresAuth: true,
    description: "Get session con autenticación",
  },
  {
    name: "18 Sign Out - CON sesión",
    method: "POST",
    endpoint: "/api/auth/sign-out",
    body: {},
    expectedStatus: 200,
    requiresAuth: true,
    description: "Logout debe cerrar sesión",
  },
  {
    name: "19 Analytics - DESPUÉS de logout",
    method: "GET",
    endpoint: "/api/v1/generalanalytics",
    expectedStatus: 401,
    requiresAuth: false,
    description: "Después logout debe requerir sesión nuevamente",
  },
];

async function runTests() {
  console.log(" INICIANDO PRUEBAS DE SEGURIDAD Y AUTENTICACIÓN\n");
  console.log("".repeat(80));

  let passed = 0;
  let failed = 0;
  let cookies = "";

  for (const test of testCases) {
    if (test.requiresAuth && !cookies) {
      console.log(`\n  SALTANDO: "${test.name}" (sin sesión disponible)\n`);
      continue;
    }

    const url = `${BASE_URL}${test.endpoint}`;
    const options: RequestInit = {
      method: test.method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    if (test.body) {
      options.body = JSON.stringify(test.body);
    }

    if (cookies) {
      options.headers = {
        ...options.headers,
        Cookie: cookies,
      };
    }

    try {
      // Agregar headers de Origin y Referer para endpoints de auth
      if (test.endpoint.includes("/auth/")) {
        options.headers = {
          ...options.headers,
          Origin: "http://localhost:3000",
          Referer: "http://localhost:3000/",
        };
      }

      const response = await fetch(url, options);

      const setCookie = response.headers.get("set-cookie");
      if (setCookie) {
        cookies = setCookie;
      }

      const success = response.status === test.expectedStatus;
      const status = success ? "" : "";

      if (success) {
        passed++;
      } else {
        failed++;
      }

      console.log(`${status} ${test.name}`);
      console.log(`   Endpoint: ${test.method} ${test.endpoint}`);
      console.log(`   Status: ${response.status} (esperado: ${test.expectedStatus})`);
      console.log(`   Descripción: ${test.description}`);

      if (!success) {
        const data = await response.json();
        console.log(`   Respuesta: ${JSON.stringify(data)}`);
        console.log(`   Resultado: ❌ PRUEBA FALLIDA\n`);
      } else {
        console.log(`   Resultado: ✅ PRUEBA EXITOSA\n`);
      }

      console.log();
    } catch (error: any) {
      failed++;
      console.log(` ${test.name}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  console.log("".repeat(80));
  console.log("\n RESUMEN DE PRUEBAS\n");
  console.log(`  Pruebas exitosas: ${passed}`);
  console.log(`  Pruebas fallidas: ${failed}`);
  console.log(` Total: ${testCases.length}\n`);

  if (failed === 0) {
    console.log(" ¡TODAS LAS PRUEBAS PASARON! Tu API está segura.\n");
  } else {
    console.log(` ❌ ${failed} prueba(s) fallaron. Revisa el código.\n`);
  }
}

async function verifyServer(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

async function main() {
  console.clear();
  console.log("🔍 Verificando conexión con el servidor...\n");

  const serverRunning = await verifyServer();

  if (!serverRunning) {
    console.log("".repeat(80));
    console.log("\n❌ ERROR: El servidor NO está corriendo\n");
    console.log("Por favor, inicia el servidor con: pnpm run dev\n");
    console.log("".repeat(80));
    process.exit(1);
  }

  console.log("✅ Servidor conectado correctamente.\n");
  console.log("".repeat(80));
  await runTests();
}

main().catch(console.error);

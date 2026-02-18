# Contexto del Proyecto - Equipo S02-26-E03

Este archivo contiene reglas y contexto específico del proyecto para ayudar a los asistentes de IA a mantener la consistencia.

## Tecnologías Principales

- **Framework**: Next.js 16 (App Router).
- **Package Manager**: `pnpm` (Uso obligatorio).
- **ORM**: Drizzle ORM con SQLite (Turso).
- **Auth**: Better Auth.
- **Documentación API**: Scalar (disponible en `/docs`).

## Convenciones Específicas

- **Middleware/Proxy**: En Next.js 16, el middleware se ha renombrado/estandarizado en este proyecto como `proxy.ts` en la raíz. **No buscar ni crear `middleware.ts`**.
- **Documentación**: La especificación OpenAPI se encuentra en `public/openapi.json`.
- **Estilos**: Vanilla CSS / Tailwind CSS dependiendo del componente.

## Endpoints de API Documentados

- `/api/health`: Salud del sistema.
- `/api/analytics`: Analíticas (Protegido por `proxy.ts`).
- `/api/auth/*`: Endpoints de Better Auth (Sign-up, Sign-in, Sign-out, Get-session).

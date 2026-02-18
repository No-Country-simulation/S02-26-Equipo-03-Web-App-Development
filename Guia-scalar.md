# Guía de Documentación API con Scalar (Next.js 16)

Esta guía detalla cómo se configuró la documentación de la API y cómo evolucionar hacia una solución automatizada en el futuro.

## Implementación Actual

Se ha integrado **Scalar** utilizando la especificación OpenAPI manual para asegurar rapidez y control inicial.

### 1. Instalación

Se instaló la dependencia oficial para Next.js:

```bash
pnpm add @scalar/nextjs-api-reference
```

### 2. Configuración de la Ruta

La documentación es accesible en `/docs`. El archivo encargado de renderizarla es:
`app/docs/route.ts`

```typescript
import { ApiReference } from "@scalar/nextjs-api-reference";

const config = {
  url: "/openapi.json", // Apunta al archivo estático
};

export const GET = ApiReference(config);
```

### 3. Gestión de la Especificación (openapi.json)

Actualmente, el archivo `public/openapi.json` es la **"Fuente de Verdad"**.

- **Estrategia**: API-First Design (Manual con IA).
- **Ventaja**: El equipo usa la documentación como guía para construir los validadores y endpoints.
- **Mantenimiento**: Se delega a la IA la edición del JSON para evitar errores de sintaxis.

---

## Cómo usar a la IA para mantener la Doc

Para que la IA actualice el archivo sin errores, copia y usa el siguiente prompt cada vez que agregues o cambies un endpoint.

### Prompt de Ejemplo para IA:

> \*\*"Actúa como un experto en OpenAPI. Necesito actualizar el archivo `public/openapi.json` con un nuevo endpoint. Aquí tienes los detalles:
>
> - Ruta: /api/pedidos
> - Método: POST
> - Descripción: Crea un nuevo pedido para el cliente.
> - Parámetros requeridos: clientId (string), items (array de objetos con id y cantidad).
> - Respuestas: 201 (Pedido creado), 400 (Bad request).
> - Tag: Pedidos
>
> Por favor, mantén la estructura actual y asegúrate de añadir los 'examples' para que se vean bien en Scalar."\*\*

---

## Preparación para Automatización (Zod & Validators)

Se han sentado las bases para que la documentación sea automática en el futuro.

- **Dependencias**: `drizzle-zod` instalado.
- **Carpeta de Validadores**: `shared/validators/`.
  - Aquí deben residir los **"Contratos de Datos"** (ej: `auth.validator.ts`).
  - **Misión del equipo**: Al crear un endpoint, deben crear su validador Zod aquí basándose en lo que dice la documentación de Scalar.

### Roadmap Sugerido

1. **Fase 1 (Actual)**: Diseño en Scalar (Manual + IA) → Desarrollo de Validadores.
2. **Fase 2**: Integrar `zod-to-openapi` para que el JSON se genere solo desde `shared/validators/`.
3. **Fase 3**: Documentación dinámica total.

---

## Notas para el Equipo (Contexto Next 16)

- **Middleware**: El middleware se llama `proxy.ts` (raíz). Si la ruta de la API es nueva, verifica si debe añadirse al `matcher` para ser protegida.
- **Estandarización**: Usar siempre `tags` para agrupar endpoints (Auth, Analytics, Shop, etc.).

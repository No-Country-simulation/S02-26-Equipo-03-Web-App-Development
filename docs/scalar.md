# Guía de Documentación de API - Swagger UI

## Instalación

### Instalación de Swagger UI para Next.js

```bash
# Usando pnpm (recomendado - tu proyecto usa pnpm)
pnpm add swagger-ui-react

# También necesitas la hoja de estilos de Swagger UI
# (Se importa en el componente, ver configuración)
```

## Configuración

La documentación de API se compone de dos archivos clave:

### 1. Archivo de especificación OpenAPI

Ubicación: [`app/api/swagger-ui/route.ts`](../app/api/swagger-ui/route.ts)

Este archivo contiene:

- El documento OpenAPI 3.0.0 con la especificación completa de tus endpoints
- Definición de parámetros, request bodies y respuestas
- Información de servidor (URL base de la API)

**Función:** Se encarga de devolver el JSON de la especificación OpenAPI que Swagger UI consume

```typescript
export async function GET() {
  return Response.json(openApiDocument);
}
```

### 2. Página de interfaz

Ubicación: [`app/swagger-ui/page.tsx`](../app/swagger-ui/page.tsx)

Este archivo renderiza la interfaz de Swagger UI:

```typescript
"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerUiPage() {
  return (
    <SwaggerUI
      url="/api/swagger-ui"           // URL donde se obtiene el spec OpenAPI
      defaultModelsExpandDepth={1}
      docExpansion="list"
    />
  );
}
```

### Endpoints configurados

| Método | Endpoint                  | Descripción                 |
| ------ | ------------------------- | --------------------------- |
| GET    | `/api/health`             | Health check                |
| GET    | `/api/api/analytics`      | Obtener todos los analytics |
| POST   | `/api/auth/sign-in/email` | Iniciar sesión con email    |
| GET    | `/api/auth/get-session`   | Obtener sesión actual       |
| POST   | `/api/auth/sign-out`      | Cerrar sesión               |

## Comandos para ejecutar el proyecto

### Desarrollo

```bash
# Iniciar el servidor de desarrollo
pnpm dev
```

### Producción

```bash
# Construir el proyecto
pnpm build

# Iniciar el servidor de producción
pnpm start
```

## Probar endpoints con Swagger UI

1. **Iniciar el servidor de desarrollo:**

   ```bash
   pnpm dev
   ```

2. **Abrir la documentación de Swagger UI:**

   ```
   http://localhost:3000/swagger-ui
   ```

3. **Probar un endpoint:**
   - Navega al endpoint que deseas probar en la interfaz
   - Si tiene parámetros, ingresa los valores (ej: `conversions=22`)
   - Haz clic en el botón **"Try it out"**
   - Haz clic en **"Execute"** para enviar la solicitud
   - Observa la respuesta en la sección de respuesta

4. **Para endpoints que requieren autenticación:**
   - Primero realiza un login en `/api/auth/sign-in/email`
   - Las cookies de sesión se guardarán automáticamente
   - Luego puedes probar los endpoints protegidos

## Agregar más endpoints

Para agregar más endpoints a la documentación, edita el objeto `openApiDocument` en [`app/api/swagger-ui/route.ts`](../app/api/swagger-ui/route.ts):

### Ejemplo de endpoint GET

```typescript
"/api/tu-nuevo-endpoint": {
  get: {
    summary: "Descripción corta",
    description: "Descripción detallada del endpoint",
    operationId: "operationId",
    parameters: [
      {
        name: "parametro",
        in: "query",
        description: "Descripción del parámetro",
        required: false,
        schema: {
          type: "string",
          example: "valor-ejemplo",
        },
      },
    ],
    responses: {
      "200": { description: "Éxito" },
      "400": { description: "Solicitud inválida" },
      "500": { description: "Error del servidor" },
    },
  },
}
```

### Ejemplo de endpoint POST

```typescript
"/api/tu-nuevo-endpoint": {
  post: {
    summary: "Crear recurso",
    description: "Descripción detallada",
    operationId: "createResource",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["campo1"],
            properties: {
              campo1: {
                type: "string",
                example: "valor",
                description: "Descripción del campo",
              },
              campo2: {
                type: "integer",
                example: 10,
                description: "Descripción del campo",
              },
            },
          },
        },
      },
    },
    responses: {
      "200": { description: "Recurso creado exitosamente" },
      "400": { description: "Solicitud inválida" },
      "500": { description: "Error del servidor" },
    },
  },
}
```

## Notas importantes

- **Swagger UI :** Swagger UI es más estable y compatible con Next.js 16. Se probaron , pero Swagger UI ofrece mejor funcionamiento.
- **Especificación en `/api/swagger-ui`:** Esta ruta devuelve solo el JSON de OpenAPI. No es para acceso directo del usuario.
- **Interfaz en `/swagger-ui`:** Esta es la ruta que debes compartir con tu equipo para que vean la documentación interactiva.
- **Autenticación:** Algunos endpoints requieren autenticación (Better Auth). Al probarlos desde Swagger UI sin credenciales, recibirás un error 401 Unauthorized.
- **Puerto:** El servidor debe estar corriendo en el puerto 3000 (configurado en el documento OpenAPI).
- **Parámetros con valores por defecto:** Usa el campo `example` en el schema para proporcionar valores iniciales en Swagger UI.

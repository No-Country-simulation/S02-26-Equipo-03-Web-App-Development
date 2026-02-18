# Guía de Implementación: Swagger en Next.js 16

https://next-swagger-doc.productsway.com/

Esta guía detalla los pasos realizados para implementar la documentación de API utilizando `next-swagger-doc` y `swagger-ui-react`.

## Pasos de Instalación

1. **Instalar dependencias:**

   ```bash
   pnpm add next-swagger-doc swagger-ui-react
   pnpm add -D @types/swagger-ui-react
   ```

2. **Configurar el generador de Swagger:**
   Se creó el archivo `shared/lib/swagger.ts` que escanea la carpeta `app/api` en busca de anotaciones JSDoc.

3. **Crear el componente de visualización:**
   Se creó `shared/components/swagger-ui.tsx` como un _Client Component_ para renderizar la interfaz.

4. **Crear la página de documentación:**
   Se habilitó la ruta `app/api-docs/page.tsx` para visualizar la documentación en el navegador.

---

## ¿Es Automático o Manual?

La implementación es **Híbrida**:

### Lo que es Automático

- **Generación del Especificación (OpenAPI):** Al entrar a la página `/api-docs`, el servidor escanea automáticamente tus archivos en `app/api` buscando el tag `@swagger`.
- **Actualización de la UI:** Si agregas una nueva anotación en el código, el cambio se refleja en la UI de Swagger sin tener que editar archivos JSON externos.
- **Detección de Rutas:** No necesitas registrar cada ruta en un archivo central; Swagger las encuentra por su ubicación.

### Lo que es Manual

- **Escritura de Anotaciones:** Debes escribir manualmente el bloque `@swagger` encima de cada endpoint en sus respectivos archivos `route.ts`.
- **Definición de Esquemas:** Debes definir manualmente los tipos de respuesta (200, 400, 500) y los parámetros de entrada dentro de los comentarios.

---

## Ejemplo de Uso

Para documentar una nueva ruta, agrega este bloque antes de la función exportada en tu `route.ts`:

```typescript
/**
 * @swagger
 * /api/ejemplo:
 *   get:
 *     description: Retorna un mensaje de ejemplo
 *     responses:
 *       200:
 *         description: Éxito total
 */
export async function GET() {
  // ... tu lógica
}
```

---

## ⚠️ Advertencia para el Despliegue (Vercel)

Es muy probable que al desplegar en Vercel te encuentres con un problema: **la documentación aparece vacía**.

### ¿Por qué ocurre?

Vercel optimiza el código durante el build y, por defecto, **elimina los comentarios JSDoc** para reducir el tamaño del paquete. Como `next-swagger-doc` depende de leer esos comentarios en tiempo de ejecución, al no encontrarlos, la interfaz de Swagger no mostrará ninguna ruta.

### Solución Recomendada: Pre-build Script 🛡️

La forma más robusta de evitar esto es generar un archivo JSON estático **antes** de que el código sea optimizado.

1.  **Crear un script de generación:** Se recomienda crear un archivo (por ejemplo `scripts/generate-swagger.js`) que use `next-swagger-doc` para generar un `public/swagger.json`.
2.  **Modificar el `package.json`:**
    ```json
    "scripts": {
      "prebuild": "node scripts/generate-swagger.js",
      "build": "next build"
    }
    ```
3.  **Referenciar el JSON:** Cambiar la configuración para que `api-docs` lea directamente del archivo `public/swagger.json` en lugar de escanear carpetas en caliente.

Esto asegura que la documentación sea "congelada" en un archivo físico justo antes del despliegue, garantizando que Vercel no pueda borrarla.

---

## Conclusión

Esta forma de trabajar mantiene la documentación **cerca del código**, facilitando que no se quede desactualizada (siempre que el desarrollador recuerde actualizar el comentario al cambiar la lógica).

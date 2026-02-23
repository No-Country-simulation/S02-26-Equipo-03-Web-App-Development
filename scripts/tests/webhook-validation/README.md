# Scripts de Validación de Webhooks (Stripe & GardenAds)

Este directorio contiene herramientas útiles para verificar la correcta integración de los webhooks de Stripe con el backend de GardenAds y la base de datos de Turso.

## Lista de Scripts

- **`check_webhook.ts`**: Verifica el total de transacciones registradas en la tabla `transactions`.
- **`check_orders.ts`**: Consulta la tabla `orders` para validar que el `external_session_id` se haya guardado correctamente para la atribución.
- **`check_events.ts`**: Muestra los últimos eventos capturados por el Pixel para asegurar el flujo completo.
- **`list_keys.ts`**: Muestra las API Keys activas y sus hashes para depuración de autenticación.
- **`list_integrations.ts`**: Verifica el estado de las integraciones (Stripe, etc.) vinculadas a los proyectos.
- **`check_hash.ts`**: Utilidad rápida para generar el hash SHA-256 de una API Key y compararlo con la DB.
- **`dump_all.ts`**: Muestra todas las transacciones y órdenes en formato de lista simplificada.
- **`verify_real_purchase.ts`**: Muestra las últimas 5 transacciones y órdenes con detalles de moneda y proyecto.
- **`check_last_order.ts`**: Muestra el detalle completo de la última orden registrada en el sistema.
- **`save_results.ts`**: Exporta todas las transacciones y órdenes a un archivo `results.json` en esta misma carpeta.
- **`debug_order_creation.ts`**: Script técnico para depurar y forzar la creación de órdenes si falla el proceso automático.

## Cómo usarlos

Para ejecutar cualquiera de estos scripts, usa `tsx` desde la raíz del proyecto:

```bash
npx tsx scripts/tests/webhook-validation/check_webhook.ts
```

## Flujo de Prueba Recomendado

1. Iniciar la escucha de Stripe:
   `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Disparar un evento de prueba con metadata:
   `stripe trigger payment_intent.succeeded --override payment_intent:metadata.project_id="TU_API_KEY"`
3. Ejecutar `check_webhook.ts` para confirmar la inserción.

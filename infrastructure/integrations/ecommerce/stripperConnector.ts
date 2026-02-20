/**Desarrollo del EcommerceConnector:
 * 
 * "Extenderé la clase base para crear el conector de Stripe.
 * Validación: Usaré validateSignature para comparar el header de Stripe con el 
 *              apiKey almacenado en la tabla integrations.
 * Persistencia: Si la venta es real, insertaré una fila en transactionsTable. 
 *               Usaré el external_id de Stripe para evitar duplicados (gracias 
 * al uniqueIndex)."
 */
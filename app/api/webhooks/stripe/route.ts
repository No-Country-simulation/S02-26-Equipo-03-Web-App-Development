/** 
 * Recibir la petición POST, 
 * extraer los headers y el body crudo
 * e instanciar el StripeConnector.
*/

import { NextRequest, NextResponse } from "next/server";
import { StripeConnector } from "@infrastructure/integrations/ecommerce/stripeConnector";
import { db } from "@infrastructure/database";

function requireHeader(value: string | null, name: string): string {
  if (!value) throw new Error(`Missing header: ${name}`);
  return value;
}

export async function POST(req: NextRequest) {

  // 1. Extraer el body como texto y la firma de los headers
  const payload = await req.text();
  const signature = requireHeader(req.headers.get("stripe-signature"), "stripe-signature");

  // 2. Obtener el secret del proyecto
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const apiKey = process.env.STRIPE_SECRET_KEY;

  if(!apiKey){
    console.log("STRIPE_SECRET_KEY no está definida en el .env");
    return NextResponse.json({ error: "Incomplete configuration" }, { status: 500 });
  }

  const connector = new StripeConnector(db, apiKey);

  try { 
    // 3. Llamar al proceso centralizado del conector
    const result = await connector.processWebhook(
      payload, 
      signature, 
      webhookSecret
    );
    return NextResponse.json(result, { status: 200 });    
  }
  catch (error) {
    console.error("Error processing stripe webhook:", error);
    return NextResponse.json({ received: false }, { status: 400 });
  }
}

/**
 * Pasos para probar la integración de Stripe con webhooks localmente:
 *
 * 1️⃣ Instalar Stripe:
 *    pnpm install stripe
 *
 * 2️⃣ Configurar variables de entorno (archivo .env):
 *    STRIPE_SECRET_KEY=sk_test_...
 *    STRIPE_PUBLISHABLE_KEY=pk_test_...
 *
 * 3️⃣ Levantar el servidor local:
 *    npm run dev
 *
 * 4️⃣ Iniciar Stripe CLI para escuchar webhooks:
 *    stripe listen --forward-to localhost:3000/api/webhooks/stripe
 *    - La terminal mostrará un webhook secret que empieza con whsec_...
 *    - Colócalo en STRIPE_WEBHOOK_SECRET
 *
 * 5️⃣ Disparar eventos de prueba:
 *    stripe trigger checkout.session.completed
 *    stripe trigger payment_intent.succeeded
 *
 * 6️⃣ Verificar resultados:
 *    - Revisar los logs en consola para confirmar que el webhook fue procesado correctamente
 *    - Revisar la base de datos que se hayan insertado la transacción y la orden
 * 
 */

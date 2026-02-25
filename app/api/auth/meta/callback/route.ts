import { MetaConnector } from "@infrastructure/integrations/ads/metaAdsConnector"
import { db } from "@infrastructure/database";

export async function GET(req: Request) {
    try {
        // console.log("Callback URL:", req.url);
        const url = new URL(req.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        if (!code || !state) {
            return new Response("Missing code or state", { status: 400 });
        }

        const connector =  new MetaConnector(db);

        //Procesar el callback (intecambair tokens y guardar en la base de datos)
        await connector.handleCallback(code as string, state as string);
        
        // Redirigir al usuario a la página de éxito
        return new Response(null, { status: 302, headers: { Location: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` } });

    } catch (error) {
        console.error("Error al procesar el callback de Meta:");
        return new Response("Internal server error", { status: 500 });
    }
    
}
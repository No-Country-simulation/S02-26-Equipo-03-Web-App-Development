import { MetaConnector } from "@infrastructure/integrations/ads/metaAdsConnector";
import { db } from "@infrastructure/database";
import { NextResponse } from "next/server";

export  async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const projectId = url.searchParams.get("projectId");
        const email = url.searchParams.get("customer_email"); 
        const name = url.searchParams.get("customer_name");

        if (!projectId || !email || !name) {
            return new NextResponse("Missing query parameters", { status: 400 });
        }

        const connector =  new MetaConnector(db);

        // Generar la URL de autorización
        const authorizationUrl = await connector.getAuthorizationUrl(
            projectId,
            email,
            name
        );
        
        // Redirigir al usuario hacia Facebook/Meta
        return NextResponse.redirect(authorizationUrl);

    } catch (error) {
        console.error("Error al procesar la autorización de Meta:");
        return new Response("Internal server error", { status: 500 });
    }
        
}


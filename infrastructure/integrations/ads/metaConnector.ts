/**
 * Responsabilidad: Construir la URL de autorización de Meta.
 * - Realizar el fetch al Graph API de Meta para obtener el access_token.
 * - Implementar el guardado en integrationsTable usando el servicio de cifrado.
 * 
 */

import { AdsConnector } from "@infrastructure/integrations/ads/AdsConnector";
import { DBConnection } from "@infrastructure/database";
import { integrationsTable } from "@infrastructure/database/schemas/schema";
import { eq } from "drizzle-orm";
import { WebhookResponse } from "../IntegrationConnector";

export class MetaConnector extends AdsConnector {
    private clientId = process.env.META_APP_ID || "";
    private clientSecret = process.env.META_APP_SECRET || "";

    //cada conector implemente su propia forma de generar la URL de OAuth
    constructor(db:DBConnection){
        super(db);
        this.redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/meta/callback`;
    }
    
    // 1. Generar la URL de autorización
    getAuthorizationUrl(projectId: string, customer_email: string, customer_name: string): string {
        const scope = ["ads_management", "ads_read"].join(",");
        //scope → permisos solicitados por la app: 
        //        - ads_management → administrar campañas
        //        - ads_read → leer métricas

        //Creamos el objeto con la información del cliente
        const stateData = {
            projectId,
            customer_email,
            customer_name,
            createdAt: Date.now(),
        };
        const encodedState = Buffer.from(JSON.stringify(stateData)).toString("base64url");

        const params = new URLSearchParams({
            client_id: this.clientId, 
            redirect_uri: this.redirectUri,// URL a la que Meta enviará el código temporal después de que el usuario autorice
            state: encodedState, // <--- Saber qué projectId, usuario y email autorizó
            scope: scope, //permisos que solicita tu app
            response_type: "code" //indica que esperas un código de autorización code para intercambiarlo por un token
        });
        
        console.log(`URL de autorización: https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`);
        return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
    }

    // 2. Intercambiar código por tokens
    async exchangeCodeForTokens(code: string): Promise<any> {
        const tokenParams = new URLSearchParams({
            client_id: this.clientId!,
            client_secret: this.clientSecret, // App Secret de Meta (usado después para intercambiar el code por un access_token)
            redirect_uri: this.redirectUri,
            code: code,
        });
        
        const url = `https://graph.facebook.com/v18.0/oauth/access_token?${tokenParams.toString()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(`Error de Meta: ${data.error.message}`);
        }
        console.log(`accessToken: ${data.access_token}`);

        return {
            "accessToken": data.access_token,
            "expiresAt": new Date(Date.now() + data.expires_in * 1000),
            "scope": data.scope,
        };
    }

    // 3. Obtener el ID de la cuenta publicitaria
    async getUserAdAccounts(accessToken: string): Promise<any> {
        const response = await fetch(`https://graph.facebook.com/v18.0/me/adaccounts?access_token=${accessToken}`);
        const data = await response.json();

        if(data.error) {
            throw new Error(`Error de ad account: ${data.error.message}`);
        }

        //retornamos el primer ad account
        return data.data[0]?.id || "";
    }

    async handleCallback(code: string, encodedState: string): Promise<void> {
        
        // 1. Decodificar la data que inyectamos
        const decodedState = JSON.parse(Buffer.from(encodedState, "base64url").toString("utf-8"));
        const { projectId, customer_email, customer_name } = decodedState;

        console.log(`Conectando Meta para: ${customer_name} (${customer_email}) en el proyecto ${projectId}`);
        
        // 2. Intercambiar el 'code' por el 'accessToken' (Llamada a Meta)
        const tokens = await this.exchangeCodeForTokens(code);

        // 3. Obtener el ID de la cuenta publicitaria
        const adAccountId = await this.getUserAdAccounts(tokens.accessToken);

        // 4. Guardar en integrationsTable usando el servicio de cifrado
        await this.createIntegrationRecord({
            id: crypto.randomUUID(),
            projectId: projectId,
            // se agrega email y nombre del usuario. Aquí va la info del cliente "inyectada"
            customerName: customer_name,
            customerEmail: customer_email,
            name: "Meta Ads",
            type: "ads",
            status: "connected",
            platform: "meta",
            accountId: adAccountId,
            credentials: { 
                //Campos para OAuth
                "accessToken": tokens.accessToken, 
                "expiresAt": tokens.expiresAt.getTime(), 
                "scope": tokens.scope,
                "adAccountId": adAccountId,
            },
            connectedAt: new Date()
        });
        
    }


    // 3. Refrescar token
    // Meta Ads no hay refresh token tradicional, se puede regenerar un token long-lived de 60 días
    async refreshAccessToken(projectId: string): Promise<void> {
        // 1. Obtener el token actual de la BD
        const [integration] = await this.db
        .select()
        .from(integrationsTable)
        .where(eq(integrationsTable.projectId, projectId))
        .limit(1);

        if (!integration) {
            throw new Error("Integration not found");
        }
        
        const credentials = integration.credentials as {
            accessToken: string;
            expiresAt: number;
            scope?: string;
            adAccountId: string;
        };

        // 2. Verificar si el token ha expirado
        const FIVE_MINUTES = 5 * 60 * 1000; //5 minutos antes de que expire se renueva evitando fallos en llamadas concurrentes
        if (Date.now() < credentials.expiresAt - FIVE_MINUTES) {
            return;
        }

        // 3. Si ha expirado, pedir un nuevo token a Meta
        const tokenParams = new URLSearchParams({
            grant_type: "fb_exchange_token",
            client_id: this.clientId,
            client_secret: this.clientSecret,
            fb_exchange_token: credentials.accessToken,
        });

        const response = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${tokenParams.toString()}`);
        const data = await response.json();

        if(data.error) {
            throw new Error(`Error de Meta: ${data.error.message}`);
        }

        // 4. Guardar el nuevo token en la BD sin perder datos anteriores
        await this.db.update(integrationsTable)
        .set({
            credentials: {
                accessToken: data.access_token,
                expiresAt: new Date(Date.now() + data.expires_in * 1000),
                scope: data.scope,
            },
        })
        .where(eq(integrationsTable.projectId, projectId));
    }

    validateSignature(payload: string, signature: string, webhookSecret: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    processWebhook(payload: string, signature: string, webhookSecret: string): Promise<WebhookResponse> {
        throw new Error("Method not implemented.");
    }

}

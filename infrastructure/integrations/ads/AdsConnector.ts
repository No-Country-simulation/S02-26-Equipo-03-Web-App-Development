/* 
programar el flujo de OAuth 2.0 para que el usuario pueda hacer clic en "Conectar Meta Ads" 
se guarden sus credenciales (tokens) en la tabla.
*/


import { integrationsTable } from "@infrastructure/database/schemas/schema";
import { IntegrationConnector } from "@infrastructure/integrations/IntegrationConnector";

export abstract class AdsConnector extends IntegrationConnector {
  
  protected redirectUri: string = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;

  /**
   * Generar la URL a la que el usuario irá para dar permiso.
  */
  abstract getAuthorizationUrl(projectId: string, customer_email: string, customer_name: string): string;

  abstract getUserAdAccounts(accessToken: string): Promise<any>;

  abstract exchangeCodeForTokens(code: string): Promise<any>;

  /**
  * Intercambiar el código temporal por tokens definitivos.
  */
  abstract handleCallback(code: string, encodedState: string): Promise<void>;


    /**
   * Refrescar el token si ya expiró.
   */
  abstract refreshAccessToken(projectId: string): Promise<void>;

  //Método concreto
  protected async createIntegrationRecord(data: typeof integrationsTable.$inferInsert) {
    return await this.db.insert(integrationsTable).values(data).returning();
  }   

}


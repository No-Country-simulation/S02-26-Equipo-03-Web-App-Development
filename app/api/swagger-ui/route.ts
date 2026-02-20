export const dynamic = "force-dynamic";

const DEFAULT_LOCAL_SERVER = "http://localhost:3000";

const openApiDocument = {
  openapi: "3.0.0",
  info: {
    title: "Project Text API",
    description: "API para el proyecto de análisis y reportes",
    version: "1.0.0",
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Health check",
        description: "Verifica el estado de la API",
        operationId: "healthCheck",
        responses: {
          "200": {
            description: "Servidor saludable",
          },
        },
      },
    },
    "/api/analytics": {
      get: {
        summary: "Obtener  los analytics",
        description: "Retorna todos los registros de analytics",
        operationId: "getAnalytics",
        responses: {
          "200": {
            description: "Respuesta exitosa",
          },
        },
      },
    },
    "/api/auth/sign-in/email": {
      post: {
        summary: "Iniciar sesión con email",
        description: "Autentica un usuario usando correo y contraseña",
        operationId: "signInEmail",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "test@example.com",
                    description: "Correo electrónico del usuario",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "password123",
                    description: "Contraseña del usuario",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Sesión iniciada exitosamente",
          },
          "400": {
            description: "Solicitud inválida - credenciales faltantes o formato incorrecto",
          },
          "401": {
            description: "Credenciales inválidas",
          },
          "500": {
            description: "Error del servidor",
          },
        },
      },
    },
    "/api/auth/get-session": {
      get: {
        summary: "Obtener sesión actual",
        description: "Retorna la información de la sesión del usuario autenticado",
        operationId: "getSession",
        responses: {
          "200": {
            description: "Sesión obtenida exitosamente",
          },
          "401": {
            description: "No autenticado",
          },
          "500": {
            description: "Error del servidor",
          },
        },
      },
    },
    "/api/auth/sign-out": {
      post: {
        summary: "Cerrar sesión",
        description: "Cierra la sesión del usuario autenticado",
        operationId: "signOut",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {},
                example: {},
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Sesión cerrada exitosamente",
          },
          "401": {
            description: "No autenticado",
          },
          "500": {
            description: "Error del servidor",
          },
        },
      },
    },
  },
};

function getServerOrigin(request: Request) {
  const url = new URL(request.url);
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedHost) {
    const protocol = forwardedProto ?? url.protocol.replace(":", "");
    return `${protocol}://${forwardedHost}`;
  }

  return url.origin;
}

export async function GET(request: Request) {
  const currentOrigin = getServerOrigin(request);

  return Response.json({
    ...openApiDocument,
    servers: [
      {
        url: currentOrigin,
        description: "Servidor actual",
      },
      ...(currentOrigin === DEFAULT_LOCAL_SERVER
        ? []
        : [
            {
              url: DEFAULT_LOCAL_SERVER,
              description: "Servidor local",
            },
          ]),
    ],
  });
}

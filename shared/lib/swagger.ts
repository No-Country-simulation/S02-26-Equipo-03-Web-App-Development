import { createSwaggerSpec } from "next-swagger-doc";
import path from "path";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", // El escáner de next-swagger-doc es inteligente, pero en Vercel a veces necesita ayuda
    definition: {
      openapi: "3.0.0",
      info: {
        title: "S02-26-Equipo-03 API Docs",
        version: "1.0",
        description: "API documentation using Next Swagger Doc",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  });
  return spec;
};

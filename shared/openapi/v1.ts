export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Project Text API",
    version: "1.0.0",
    description: "API v1 endpoints for analytics, reports, and alerts.",
  },
  servers: [{ url: "/api" }],
  paths: {
    "/v1/analytics": {
      get: {
        summary: "Get analytics records",
        tags: ["Analytics"],
        responses: {
          "200": { description: "Analytics records retrieved" },
          "401": { description: "Unauthorized" },
          "404": { description: "Route not found" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
    "/v1/analytics/by-conversions": {
      get: {
        summary: "Get analytics records filtered by conversions",
        tags: ["Analytics"],
        parameters: [
          {
            name: "conversions",
            in: "query",
            required: true,
            schema: { type: "integer" },
            description: "Exact conversions value",
          },
        ],
        responses: {
          "200": { description: "Filtered analytics records retrieved" },
          "400": { description: "Invalid query parameter" },
          "401": { description: "Unauthorized" },
          "404": { description: "Route not found" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
    "/v1/reports/roi": {
      get: {
        summary: "Get ROI report entries",
        tags: ["Reports"],
        responses: {
          "200": { description: "ROI report retrieved" },
          "401": { description: "Unauthorized" },
          "404": { description: "Route not found" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
    "/v1/reports/pac": {
      get: {
        summary: "Get PAC report entries",
        tags: ["Reports"],
        responses: {
          "200": { description: "PAC report retrieved" },
          "401": { description: "Unauthorized" },
          "404": { description: "Route not found" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
    "/v1/alerts": {
      get: {
        summary: "Get alerts",
        tags: ["Alerts"],
        responses: {
          "200": { description: "Alerts retrieved" },
          "401": { description: "Unauthorized" },
          "404": { description: "Route not found" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
  },
} as const;

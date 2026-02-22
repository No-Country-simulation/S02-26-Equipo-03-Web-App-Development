export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Project Text API",
    version: "1.0.0",
    description: "API v1 endpoints for analytics domain.",
  },
  servers: [{ url: "/api" }],
  paths: {
    "/v1/analytics": {
      get: {
        summary: "Get analytics records",
        tags: ["Analytics"],
        parameters: [
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 50 },
          },
        ],
        responses: {
          "200": { description: "Analytics records retrieved" },
          "400": { description: "Invalid query parameter" },
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
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 50 },
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
    "/v1/analytics/metrics": {
      get: {
        summary: "Get aggregated analytics metrics",
        tags: ["Analytics"],
        parameters: [
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 200 },
          },
        ],
        responses: {
          "200": { description: "Aggregated metrics retrieved" },
          "400": { description: "Invalid query parameter" },
          "401": { description: "Unauthorized" },
          "404": { description: "Route not found" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
    "/v1/analytics/alerts": {
      get: {
        summary: "Get unresolved alerts",
        tags: ["Analytics"],
        parameters: [
          {
            name: "severity",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["low", "medium", "high", "critical"] },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 50 },
          },
        ],
        responses: {
          "200": { description: "Alerts retrieved" },
          "400": { description: "Invalid query parameter" },
          "401": { description: "Unauthorized" },
          "404": { description: "Route not found" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
    "/v1/analytics/timeline": {
      get: {
        summary: "Get analytics timeline snapshots",
        tags: ["Analytics"],
        parameters: [
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 100 },
          },
        ],
        responses: {
          "200": { description: "Timeline retrieved" },
          "400": { description: "Invalid query parameter" },
          "401": { description: "Unauthorized" },
          "404": { description: "Route not found" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
    "/v1/analytics/anomalies": {
      get: {
        summary: "Get anomaly alerts",
        tags: ["Analytics"],
        parameters: [
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 50 },
          },
        ],
        responses: {
          "200": { description: "Anomalies retrieved" },
          "400": { description: "Invalid query parameter" },
          "401": { description: "Unauthorized" },
          "404": { description: "Route not found" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
  },
} as const;

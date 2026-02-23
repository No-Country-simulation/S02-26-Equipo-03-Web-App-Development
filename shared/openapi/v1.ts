export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Project Text API",
    version: "1.0.0",
    description: "API v1 endpoints for analytics domain.",
  },
  servers: [{ url: "/api" }],
  paths: {
    "/health": {
      get: {
        summary: "Health Check Endpoint",
        tags: ["Health"],
        responses: {
          "200": { description: "Health status with database connectivity and timestamp" },
          "500": { description: "Internal Server Error" },
        },
      },
    },

    "/auth/sign-up/email": {
      post: {
        summary: "Register a new user with email",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                  name: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User registered successfully",
          },
        },
      },
    },
    "/auth/sign-in/email": {
      post: {
        summary: "Login with email",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
          },
        },
      },
    },
    "/auth/get-session": {
      get: {
        summary: "Get current session details",
        tags: ["Auth"],
        responses: {
          "200": {
            description: "Session data retrieved",
          },
          "401": {
            description: "Not authenticated",
          },
        },
      },
    },
    "/auth/sign-out": {
      post: {
        summary: "Logout current user",
        tags: ["Auth"],
        responses: {
          "200": {
            description: "Logged out successfully",
          },
        },
      },
    },

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
    "/v1/projects": {
      get: {
        summary: "List projects",
        tags: ["Projects"],
        responses: {
          "200": {
            description: "Projects retrieved successfully",
          },
          "401": { description: "Unauthorized" },
          "500": { description: "Internal Server Error" },
        },
      },
      post: {
        summary: "Create a new project",
        tags: ["Projects"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "description"],
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Project created" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
        },
      },
    },
  },
  "v1/projects/{id}": {
    get: {
      summary: "Gets a project if the user is a member",
      tags: ["Projects"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["userId", "projectId"],
              properties: {
                userId: { type: "string" },
                projectId: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "Project created" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden" },
        "404": { description: "Not Found" },
        "500": { description: "Internal Server Error" },
      },
    },
  },
} as const;

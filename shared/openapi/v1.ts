export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Project Text API",
    version: "1.0.0",
    description: "API v1 endpoints for GardenAds.",
  },
  servers: [{ url: "/api" }],
  paths: {
    "/health": {
      get: {
        summary: "Health Check Endpoint",
        tags: ["Health"],
        responses: {
          "200": {
            description: "Health status with database connectivity and timestamp",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    database: { type: "string" },
                    message: { type: "string" },
                    timestamp: { type: "string", format: "date-time" },
                    enviroment: { type: "string" },
                  },
                },
                example: {
                  status: "ok",
                  database: "connected",
                  message: "Hello World Backend",
                  timestamp: "2026-02-24T17:53:55.900Z",
                  enviroment: "development",
                },
              },
            },
          },
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
                required: ["email", "password", "name"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  name: { type: "string" },
                },
                example: {
                  email: "johndoe@gmail.com",
                  password: "password",
                  name: "johndoe",
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        emailVerified: { type: "boolean" },
                        image: {
                          type: "string",
                          nullable: true,
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                        },
                      },
                    },
                  },
                },
                example: {
                  token: "nEq0xudr9XpbqiAxA5ntUcBlRrn0Ffhg",
                  user: {
                    id: "WbBomeKPVGUaE8i2cPv0pRvUJX1svhV",
                    name: "johndoe",
                    email: "johndoe@gmail.com",
                    emailVerified: false,
                    image: null,
                    createdAt: "2026-02-24T14:37:12.253Z",
                    updatedAt: "2026-02-24T14:37:12.253Z",
                  },
                },
              },
            },
          },
          "422": { description: "User already exists" },
          "500": { description: "Internal Server Error" },
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
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
                example: {
                  email: "johndoe@gmail.com",
                  password: "password",
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    redirect: { type: "boolean" },
                    token: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        emailVerified: { type: "boolean" },
                        image: { type: "boolean" },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                        },
                        id: { type: "string" },
                      },
                    },
                  },
                },
                example: {
                  redirect: false,
                  token: "nEq0xudr9XpbqiAxA5ntUcBlRrn0Ffhg",
                  user: {
                    name: "johndoe",
                    email: "johndoe@gmail.com",
                    emailVerified: false,
                    image: null,
                    createdAt: "2026-02-24T14:37:12.253Z",
                    updatedAt: "2026-02-24T14:37:12.253Z",
                    id: "WbBomeKPV6UaE8i2cPv0pBrVUJX1swhV",
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
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
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    session: {
                      expiresAt: {
                        type: "string",
                        format: "date-time",
                      },
                      token: { type: "string" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                      ipAddress: { type: "string" },
                      userAgent: { type: "string" },
                      userId: { type: "string" },
                      id: { type: "string" },
                    },
                    user: {
                      name: { type: "string" },
                      email: { type: "string", format: "email" },
                      emailVerified: { type: "boolean" },
                      image: { type: "boolean" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                      id: { type: "string" },
                    },
                  },
                },
                example: {
                  session: {
                    expiresAt: "2026-02-24T14:37:12.253Z",
                    token: "nEq0xudr9XpbqiAxA5ntUcBlRrn0Ffhg",
                    createdAt: "2026-02-24T14:37:12.253Z",
                    updatedAt: "2026-02-24T14:37:12.253Z",
                    ipAddress: "0000:0000:0000:0000:0000:0000:0000:0000",
                    userAgent:
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
                    userId: "WbBomeKPV6UaE8i2cPv0pBrVUJX1swh0",
                    id: "6TnROj0WQ5Y0bPJmfeHqjb6K66NsCOvz",
                  },
                  user: {
                    name: "johndoe",
                    email: "johndoe@gmail.com",
                    emailVerified: false,
                    image: null,
                    createdAt: "2026-02-24T14:37:12.253Z",
                    updatedAt: "2026-02-24T14:37:12.253Z",
                    id: "WbBomeKPV6UaE8i2cPv0pBrVUJX1swhV",
                  },
                },
              },
            },
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
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {},
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Logged out successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                  },
                },
                example: {
                  success: true,
                },
              },
            },
          },
        },
      },
    },
    "/v1/track": {
      post: {
        summary: "Track an event (JSON)",
        tags: ["Tracking"],
        parameters: [
          {
            name: "x-api-key",
            in: "header",
            required: true,
            schema: { type: "string" },
            description: "Project API Key",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  event: { type: "string" },
                  properties: { type: "object" },
                },
              },
            },
          },
        },
        responses: {
          "202": { description: "Event received" },
          "401": { description: "Missing x-api-key header" },
        },
      },
      get: {
        summary: "Track an event (Pixel)",
        tags: ["Tracking"],
        parameters: [
          {
            name: "k",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Project API Key",
          },
          {
            name: "d",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Base64 encoded tracking payload",
          },
        ],
        responses: {
          "200": {
            description: "Transparent GIF pixel",
            content: { "image/gif": { schema: { type: "string", format: "binary" } } },
          },
        },
      },
    },
    "/v1/orders": {
      get: {
        summary: "List all orders",
        tags: ["Orders"],
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "The ID of the project to fetch orders from",
          },
        ],
        responses: {
          "200": {
            description: "List of orders",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    count: { type: "integer" },
                    data: { type: "array" },
                  },
                },
              },
            },
          },
          "400": { description: "Missing projectId" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
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

    "/v1/projects/{id}": {
      get: {
        summary: "Get a project by id if the user is a member",
        tags: ["Projects"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Project retrieved successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Project not found" },
          "500": { description: "Internal Server Error" },
        },
      },
      put: {
        summary: "Update an existing project",
        tags: ["Projects"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Project updated successfully" },
          "401": { description: "Unauthorized" },
          "500": { description: "Internal Server Error" },
        },
      },
      delete: {
        summary: "Archive (delete) an existing project",
        tags: ["Projects"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Project archived successfully" },
          "401": { description: "Unauthorized" },
          "500": { description: "Internal Server Error" },
        },
      },
    },

    "/v1/projects/{id}/members": {
      get: {
        summary: "List members of the project",
        tags: ["Projects"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Project members retrieved successfully" },
          "401": { description: "Unauthorized" },
          "500": { description: "Internal server error" },
        },
      },
      post: {
        summary: "Add a member to the project (owner only)",
        tags: ["Projects"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["targetUserId", "roleId"],
                properties: {
                  targetUserId: { type: "string" },
                  roleId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Member added successfully" },
          "400": { description: "Invalid input" },
          "401": { description: "Unauthorized" },
          "500": { description: "Internal server error" },
        },
      },
      delete: {
        summary: "Remove a member from the project",
        tags: ["Projects"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["targetUserId"],
                properties: {
                  targetUserId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "204": { description: "Member removed successfully" },
          "400": { description: "Invalid input" },
          "401": { description: "Unauthorized" },
          "500": { description: "Internal server error" },
        },
      },
    },

    "/v1/projects/{id}/api-keys": {
      get: {
        summary: "List all API keys for a project",
        tags: ["Projects"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "API keys retrieved successfully" },
          "401": { description: "Unauthorized" },
          "500": { description: "Internal server error" },
        },
      },

      post: {
        summary: "Rotate API key (revoke active and create new one)",
        tags: ["Projects"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "201": { description: "New API key generated successfully" },
          "401": { description: "Unauthorized" },
          "500": { description: "Internal server error" },
        },
      },

      "/v1/projects/{id}/api-keys/{keyId}": {
        delete: {
          summary: "Revoke a specific API key",
          tags: ["Projects"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "keyId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "204": { description: "API key revoked successfully" },
            "401": { description: "Unauthorized" },
            "500": { description: "Internal server error" },
          },
        },
      },
    },
  },
} as const;

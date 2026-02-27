﻿export const openApiSpec = {
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
        description:
          "Author: Favian - Checks  connectivity and returns server status with timestamp",
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
              example: {
                email: "test@example.com",
                password: "password123",
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
        responses: {
          "200": { description: "Event tracked successfully" },
          "401": { description: "Unauthorized" },
          "500": { description: "Internal Server Error" },
        },
      },
    },

    "/v1/campaigns": {
      post: {
        summary: "Create a manual campaign",
        tags: ["Campaigns"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["projectId", "name"],
                properties: {
                  projectId: { type: "string" },
                  name: { type: "string" },
                  budget: { type: "number" },
                  status: { type: "string", enum: ["active", "paused", "completed", "draft"] },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Campaign created" },
          "400": { description: "Invalid input" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },

    "/v1/simulate/ads": {
      get: {
        summary: "Simulates Meta and Google Ads data for a project",
        description:
          "Generates mock campaigns and analytics for testing purposes. ⚠️ WARNING: New projects are already created with simulated campaigns automatically. Running this manually will duplicate metrics in the dashboard.",
        tags: ["Simulation"],
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "The ID of the project to simulate data for.",
          },
        ],
        responses: {
          "200": { description: "Simulation successful" },
          "404": { description: "Project not found" },
          "500": { description: "Internal server error" },
        },
      },
    },

    "/v1/orders": {
      get: {
        summary: "List all orders for a project",
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
          "200": { description: "A list of orders" },
          "400": { description: "Missing projectId" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "500": { description: "Internal Server Error" },
        },
      },
    },

    "/v1/analytics/orders": {
      get: {
        summary: "List of payments with order details.",
        /*  description: "Author: Favian",*/
        tags: ["Analytics Reports"],
        parameters: [
          {
            name: "idUser",
            in: "query",
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
    },

    "/v1/projects": {
      get: {
        summary: "List active and inactive projects",
        tags: ["Projects"],
        responses: {
          "200": {
            description: "Projects retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", format: "uuid" },
                      name: { type: "string" },
                      description: { type: "string" },
                      status: { type: "string" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                    },
                  },
                },
                example: [
                  {
                    id: "906ca1ef-2fe1-4a21-a85b-a4003ef53af1",
                    name: "ProjectTest1",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                    status: "active",
                    createdAt: "2026-02-24T21:50:16.221Z",
                    updatedAt: "2026-02-24T21:50:16.221Z",
                  },
                ],
              },
            },
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
              example: {
                name: "ProjectTest1",
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Project created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      id: { type: "string" },
                      name: { type: "string" },
                      description: { type: "string" },
                      status: { type: "string" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                    },
                    apiKey: { type: "string" },
                  },
                },
                example: {
                  project: {
                    id: "906ca1ef-2fe1-4a21-a85b-a4003ef53af0",
                    name: "ProjectTest1",
                    description:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    status: "active",
                    createdAt: "2026-02-24T21:50:16.221Z",
                    updatedAt: "2026-02-24T21:50:16.221Z",
                  },
                  apiKey: "b681cde2be03aaf9d428e77bb0b20b9dc6271ad991a6d5f5031a3a0db97029e0",
                },
              },
            },
          },
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
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Project retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    name: { type: "string" },
                    description: { type: "string" },
                    status: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
                example: {
                  id: "906ca1ef-2fe1-4a21-a85b-a4003ef53af1",
                  name: "ProjectTest1",
                  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  status: "active",
                  createdAt: "2026-02-24T21:50:16.221Z",
                  updatedAt: "2026-02-24T21:50:16.221Z",
                },
              },
            },
          },
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
            schema: { type: "string", format: "uuid" },
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
              example: {
                name: "Updated Project Name",
                description: "Updated description",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Project updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    name: { type: "string" },
                    description: { type: "string" },
                    status: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
                example: {
                  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  name: "Updated Project Name",
                  description: "Updated description",
                  status: "active",
                  createdAt: "2026-02-24T21:50:18.729Z",
                  updatedAt: "2026-02-24T21:50:18.729Z",
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Project not found" },
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
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Project archived successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    name: { type: "string" },
                    description: { type: "string" },
                    status: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
                example: {
                  id: "906ca1ef-2fe1-4a21-a85b-a4003ef53af0",
                  name: "ProjectTest1",
                  description: "DescriptionTest1",
                  status: "archived",
                  createdAt: "2026-02-24T21:50:16.221Z",
                  updatedAt: "2026-02-24T21:50:16.221Z",
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "409": { description: "Project already archived or not found" },
          "500": { description: "Internal Server Error" },
        },
      },
    },

    "/v1/projects/{id}/members": {
      get: {
        summary: "List members of the project",
        tags: ["Members"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Project members retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      userId: { type: "string", format: "uuid" },
                      email: { type: "string", format: "email" },
                      roleId: { type: "string", format: "uuid" },
                      joinedAt: { type: "string", format: "date-time" },
                    },
                  },
                },
                example: [
                  {
                    userId: "WbBomeKPV6UaE8i2cPv0pBrVUJX1swhV",
                    email: "johndoe@gmail.com",
                    roleId: "7a112499-f6ae-4df4-954e-33839833a1b2",
                    joinedAt: "2026-02-24T21:50:18.729Z",
                  },
                ],
              },
            },
          },
          "401": { description: "Unauthorized" },
          "500": { description: "Internal server error" },
        },
      },
      post: {
        summary: "Add a member to the project (owner only)",
        tags: ["Members"],
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
        tags: ["Members"],
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
        tags: ["Api-Keys"],
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
        tags: ["Api-Keys"],
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
          tags: ["Api-Keys"],
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

    "/v1/reports": {
      get: {
        summary: "List reports for a project",
        tags: ["Reports"],
        parameters: [
          { name: "projectId", in: "query", required: true, schema: { type: "string" }, description: "ID del proyecto", example: "REEMPLAZA_CON_ID_REAL" },
          { name: "name", in: "query", required: false, schema: { type: "string" }, description: "Búsqueda parcial por nombre", example: "Reporte" },
          { name: "format", in: "query", required: false, schema: { type: "string", enum: ["pdf", "csv"] }, example: "pdf" },
          { name: "createdFrom", in: "query", required: false, schema: { type: "string", format: "date-time" }, example: "2026-02-01T00:00:00.000Z", description: "Fecha mínima de creación (ISO 8601)" },
          { name: "createdTo", in: "query", required: false, schema: { type: "string", format: "date-time" }, example: "2026-02-28T23:59:59.000Z", description: "Fecha máxima de creación (ISO 8601)" },
          { name: "periodStart", in: "query", required: false, schema: { type: "string", format: "date-time" }, example: "2026-01-01T00:00:00.000Z", description: "Inicio mínimo del período del reporte" },
          { name: "periodEnd", in: "query", required: false, schema: { type: "string", format: "date-time" }, example: "2026-01-31T23:59:59.000Z", description: "Fin máximo del período del reporte" },
        ],
        responses: {
          "200": { description: "Lista de reportes" },
          "400": { description: "projectId requerido o filtros inválidos" },
          "500": { description: "Internal Server Error" },
        },
      },
      post: {
        summary: "Create a new report",
        tags: ["Reports"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["projectId", "name", "format", "fileUrl", "periodStart", "periodEnd"],
                properties: {
                  projectId: { type: "string" },
                  name: { type: "string" },
                  format: { type: "string", enum: ["pdf", "csv"] },
                  fileUrl: { type: "string", format: "uri" },
                  periodStart: { type: "string", format: "date-time" },
                  periodEnd: { type: "string", format: "date-time" },
                },
              },
              example: {
                projectId: "REEMPLAZA_CON_ID_REAL",
                name: "Reporte de prueba",
                format: "pdf",
                fileUrl: "https://storage.example.com/test.pdf",
                periodStart: "2026-01-01T00:00:00.000Z",
                periodEnd: "2026-01-31T23:59:59.000Z",
              },
            },
          },
        },
        responses: {
          "201": { description: "Reporte creado exitosamente" },
          "400": { description: "Validación fallida" },
          "401": { description: "No autenticado" },
          "500": { description: "Internal Server Error" },
        },
      },
    },

    "/v1/reports/stats": {
      get: {
        summary: "Get report stats for header cards",
        tags: ["Reports"],
        parameters: [
          { name: "projectId", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Stats del proyecto (exportaciones del mes, último reporte, conteo por formato)" },
          "400": { description: "projectId requerido" },
          "500": { description: "Internal Server Error" },
        },
      },
    },

    "/v1/reports/{id}": {
      get: {
        summary: "Get a report by ID",
        tags: ["Reports"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Reporte encontrado" },
          "404": { description: "Reporte no encontrado" },
          "500": { description: "Internal Server Error" },
        },
      },
      delete: {
        summary: "Delete a report by ID",
        tags: ["Reports"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Reporte eliminado" },
          "404": { description: "Reporte no encontrado" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
  },
} as const;

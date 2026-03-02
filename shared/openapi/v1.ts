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

    "/auth/request-password-reset": {
      post: {
        summary: "Request a password reset email",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "redirectTo"],
                properties: {
                  email: { type: "string", format: "email" },
                  redirectTo: { type: "string", format: "uri" },
                },
                example: {
                  email: "johndoe@gmail.com",
                  redirectTo: "http://localhost:3000/reset-password",
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Reset email sent successfully" },
          "400": { description: "Invalid input or user not found" },
        },
      },
    },

    "/auth/reset-password": {
      post: {
        summary: "Reset password using a token",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "newPassword"],
                properties: {
                  token: { type: "string" },
                  newPassword: { type: "string", minLength: 8 },
                },
                example: {
                  token: "eyJhbGciOiJIUzI1NiJ9...",
                  newPassword: "newSecurePassword123",
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Password reset successfully" },
          "400": { description: "Invalid or expired token" },
        },
      },
    },

    "/auth/verify-email": {
      get: {
        summary: "Verify user email address",
        tags: ["Auth"],
        parameters: [
          {
            name: "token",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Verification token sent via email",
          },
          {
            name: "callbackURL",
            in: "query",
            required: false,
            schema: { type: "string", format: "uri" },
            description: "URL to redirect to after verification",
          },
        ],
        responses: {
          "302": { description: "Redirect to callbackURL on success" },
          "400": { description: "Invalid or expired verification token" },
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
                  externalId: { type: 'string' },
                  startDate: { type: 'string', format: 'date' },
                  endDate: { type: 'string', format: 'date' }
                },
              },
              example: {
                projectId: "proj_123",
                name: "black_friday_2026",
                budget: 2500,
                status: "active",
                externalId: "mock_fb_001",
                startDate: "2026-11-20"
              }
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

      get: {
        summary: "List all campaigns in a project",
        tags: ["Campaigns"],
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "The ID of the project to fetch campaigns from",
          },
        ],
        responses: {
          "200": { description: "A list of campaigns",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          budget: { type: "number" },
                          status: { type: "string" },
                          externalId: { type: "string" },
                          startDate: { type: "string", format: "date" },
                          endDate: { type: "string", format: "date" },
                        },
                      },
                    },
                  },
                },
                example: {
                  success: true,
                  data: [
                    {
                      id: "campaign_1",
                      name: "campaign_1",
                      budget: 100,
                      status: "active",
                      externalId: "external_id_1",
                      startDate: "2022-01-01",
                      endDate: "2022-12-31",
                    },
                    {
                      id: "campaign_2",
                      name: "campaign_2",
                      budget: 200,
                      status: "paused",
                      externalId: "external_id_2",
                      startDate: "2022-01-01",
                      endDate: "2022-12-31",
                    },
                  ],
                  totalCampaigns: 2,
                  totalPages: 1,
                  currentPage: 1,
                  limit: 5,
                },
              },
            },
           },
          "400": { description: "Missing projectId" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "500": { description: "Internal Server Error" },
        },
      }
    },

    "/v1/campaigns/search?projectId={id}&name={name}": {
      get: {
        summary: "Search campaigns by name",
        tags: ["Campaigns"],
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "The ID of the project to fetch campaigns from",
          },
          {
            name: "name",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "The name of the campaign to search for",
          },
        ],
        responses: {
          "200": { description: "A list of campaigns",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          budget: { type: "number" },
                          status: { type: "string" },
                          externalId: { type: "string" },
                          startDate: { type: "string", format: "date" },
                          endDate: { type: "string", format: "date" },
                        },
                      },
                    },
                  },
                },
                example: {
                  success: true,
                  data: [
                    {
                      id: "campaign_1",
                      name: "campaign_1",
                      budget: 100,
                      status: "active",
                      externalId: "external_id_1",
                      startDate: "2022-01-01",
                      endDate: "2022-12-31",
                    },
                    {
                      id: "campaign_2",
                      name: "campaign_2",
                      budget: 200,
                      status: "paused",
                      externalId: "external_id_2",
                      startDate: "2022-01-01",
                      endDate: "2022-12-31",
                    },
                  ],
                  totalCampaigns: 2,
                  totalPages: 1,
                  currentPage: 1,
                  limit: 5,
                },
              },
            },
           },
          "400": { description: "Missing projectId" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "500": { description: "Internal Server Error" },
        },
      }
    },

    "/v1/campaigns/{id}": {
      get: {
        summary: "Get a campaign by id",
        tags: ["Campaigns"],
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "The ID of the campaign to fetch",
          },
          {
            name: "projectId",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "The ID of the project to fetch",
          },
        ],
        responses: {
          "200": { description: "A campaign" },
          "404": { description: "Campaign not found" },
          "500": { description: "Internal Server Error" },
        },
      }
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
        tags: ["Analytics Reports"],
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Target project ID for analytics",
          },
        ],
        responses: {
          "200": {
            description: "Orders analytics retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    count: { type: "integer" },
                    data: {
                      type: "array",
                      items: { type: "object" },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Missing projectId parameter" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden - user not member of project" },
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

    "/v1/projects/{id}/roles": {
      get: {
        summary: "List all roles from the project",
        tags: ["Roles"],
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
            description: "All project roles listed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      roleId: { type: "string", format: "uuid" },
                      name: { type: "string" },
                      description: { type: "string" },
                    },
                  },
                },
                example: [
                  {
                    roleId: "9a8abc34-2859-4bb3-967f-a40d5430c0c4",
                    name: "admin",
                    description: "admin default role",
                  },
                  {
                    roleId: "9a8abc34-2859-4bb3-967f-a40d5430c0c4",
                    name: "editor",
                    description: "editor default role",
                  },
                  {
                    roleId: "9a8abc34-2859-4bb3-967f-a40d5430c0c4",
                    name: "owner",
                    description: "owner default role",
                  },
                  {
                    roleId: "9a8abc34-2859-4bb3-967f-a40d5430c0c4",
                    name: "viewer",
                    description: "viewer default role",
                  },
                ],
              },
            },
          },
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
        summary: "List reports for the authenticated user",
        tags: ["Reports"],
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "ID del proyecto cuyos reportes se listan",
          },
          {
            name: "name",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Búsqueda parcial por nombre",
          },
          {
            name: "format",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["pdf", "csv"] },
          },
          {
            name: "createdFrom",
            in: "query",
            required: false,
            schema: { type: "string", format: "date-time" },
            description: "Fecha mínima de creación (ISO 8601)",
          },
          {
            name: "createdTo",
            in: "query",
            required: false,
            schema: { type: "string", format: "date-time" },
            description: "Fecha máxima de creación (ISO 8601)",
          },
          {
            name: "periodStart",
            in: "query",
            required: false,
            schema: { type: "string", format: "date-time" },
          },
          {
            name: "periodEnd",
            in: "query",
            required: false,
            schema: { type: "string", format: "date-time" },
          },
        ],
        responses: {
          "200": { description: "Reports retrieved successfully" },
          "400": { description: "Invalid filter parameters" },
          "401": { description: "Unauthorized" },
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
        summary: "Get report statistics for the authenticated user",
        tags: ["Reports"],
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Project ID",
          },
        ],
        responses: {
          "200": {
            description: "Report stats retrieved successfully",
            content: {
              "application/json": {
                example: {
                  status: "success",
                  data: {
                    exportsThisMonth: 8,
                    lastReportDate: "2026-02-24T10:30:00.000Z",
                    pdfCount: 5,
                    csvCount: 3,
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
    "/v1/reports/{id}": {
      get: {
        summary: "Get a specific report by ID",
        tags: ["Reports"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Report retrieved successfully" },
          "401": { description: "Unauthorized" },
          "404": { description: "Report not found" },
          "500": { description: "Internal Server Error" },
        },
      },
      delete: {
        summary: "Delete a report by ID",
        tags: ["Reports"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Report deleted successfully" },
          "401": { description: "Unauthorized" },
          "404": { description: "Report not found" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
  },
} as const;

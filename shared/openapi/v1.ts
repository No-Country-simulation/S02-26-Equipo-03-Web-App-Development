export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Project Text API",
    version: "1.0.0",
    description: "API v1 endpoints for analytics domain.",
  },
  servers: [{ url: "/api" }],
  paths: {
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
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: false,
              },
              example: {},
            },
          },
        },
        responses: {
          "200": {
            description: "Logged out successfully",
          },
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

    "/v1/analytics/orders": {
      get: {
        summary: "Report of orders for a specific user (protected endpoint)",
        tags: ["Report"],
        parameters: [
          {
            name: "userId",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Authenticated user id used to fetch orders analytics report",
          },
        ],
        responses: {
          "200": { description: "Orders report retrieved successfully" },
          "400": { description: "Invalid request parameters" },
          "401": { description: "Unauthorized access to orders report" },
          "500": { description: "Internal Server Error" },
        },
      },
    },
  },
} as const;

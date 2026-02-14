import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

/* ========================= 
    USERS
==========================*/
export const usersTable = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/* ========================= 
    SESSIONS
==========================*/
export const sessionsTable = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

/* ========================= 
    ACCOUNTS
==========================*/
export const accountsTable = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("account_userId_idx").on(table.userId),
    uniqueIndex("account_provider_account_idx").on(table.providerId, table.accountId),
  ]
);

/* ========================= 
    VERIFICATIONS
==========================*/
export const verificationsTable = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

/* ========================= 
    ROLES
==========================*/
export const rolesTable = sqliteTable("roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

/* ========================= 
    PERMISSIONS
==========================*/
export const permissionsTable = sqliteTable("permissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  resource: text("resource").notNull(),
  action: text("action").notNull(),
});

/* ========================= 
    ROLE PERMISSIONS
==========================*/
export const rolePermissionsTable = sqliteTable(
  "role_permissions",
  {
    id: text("id").primaryKey(),
    roleId: text("role_id")
      .notNull()
      .references(() => rolesTable.id, { onDelete: "cascade" }),
    permissionId: text("permission_id")
      .notNull()
      .references(() => permissionsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("role_permissions_role_permission_idx").on(table.roleId, table.permissionId),
  ]
);

/* ========================= 
    PROJECTS
==========================*/
export const projectsTable = sqliteTable("projects", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status", { enum: ["active", "inactive", "archived"] })
    .notNull()
    .default("active"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/* ========================= 
    PROJECT MEMBERS
==========================*/
export const projectMembersTable = sqliteTable(
  "project_members",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => rolesTable.id),
    joinedAt: integer("joined_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [uniqueIndex("project_members_project_user_idx").on(table.projectId, table.userId)]
);

/* ========================= 
    INTEGRATIONS
==========================*/
export const integrationsTable = sqliteTable("integrations", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type", { enum: ["ecommerce", "payment", "ads"] }).notNull(),
  status: text("status", {
    enum: ["connected", "disconnected", "error", "pending"],
  })
    .notNull()
    .default("pending"),
  credentials: text("credentials", { mode: "json" }), // Encrypted JSON
  connectedAt: integer("connected_at", { mode: "timestamp" }),
  // Specific fields by type
  platform: text("platform"), // e.g., 'stripe', 'meta', 'google'
  storeUrl: text("store_url"),
  apiKey: text("api_key"),
  merchantId: text("merchant_id"),
  accountId: text("account_id"),
});

/* ========================= 
    CAMPAIGNS
==========================*/
export const campaignsTable = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  adsIntegrationId: text("ads_integration_id").references(() => integrationsTable.id),
  externalId: text("external_id"), // Campaign ID in Meta/Google
  name: text("name").notNull(),
  budget: real("budget"),
  spent: real("spent").default(0),
  startDate: integer("start_date", { mode: "timestamp" }),
  endDate: integer("end_date", { mode: "timestamp" }),
  status: text("status", { enum: ["active", "paused", "completed", "draft"] })
    .notNull()
    .default("draft"),
});

/* ========================= 
    EVENTS
==========================*/
export const eventsTable = sqliteTable("events", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // 'page_view', 'click', 'purchase', etc.
  source: text("source").notNull(), // 'pixel', 'stripe', 'manual'
  payload: text("payload", { mode: "json" }).notNull(),
  visitorId: text("visitor_id"),
  sessionId: text("session_id"),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
  receivedAt: integer("received_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  status: text("status", {
    enum: ["received", "validated", "processed", "attributed", "failed", "duplicate"],
  })
    .notNull()
    .default("received"),
  deduplicationKey: text("deduplication_key").unique(),
});

/* ========================= 
    EVENT VALIDATIONS
==========================*/
export const eventValidationsTable = sqliteTable("event_validations", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .unique()
    .references(() => eventsTable.id, { onDelete: "cascade" }),
  isValid: integer("is_valid", { mode: "boolean" }).notNull(),
  isDuplicate: integer("is_duplicate", { mode: "boolean" }).notNull(),
  isAnomaly: integer("is_anomaly", { mode: "boolean" }).notNull(),
  validationErrors: text("validation_errors", { mode: "json" }),
  validatedAt: integer("validated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/* ========================= 
    ATTRIBUTIONS
==========================*/
export const attributionsTable = sqliteTable("attributions", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => eventsTable.id, { onDelete: "cascade" }),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaignsTable.id, { onDelete: "cascade" }),
  model: text("model").notNull(), // 'last_click', 'first_click', 'linear'
  weight: real("weight").notNull().default(1.0),
  attributedAt: integer("attributed_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/* ========================= 
    TRANSACTIONS
==========================*/
export const transactionsTable = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  paymentIntegrationId: text("payment_integration_id").references(() => integrationsTable.id),
  externalId: text("external_id").unique(), // Stripe ID
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status", {
    enum: ["pending", "completed", "failed", "refunded"],
  })
    .notNull()
    .default("pending"),
  transactionDate: integer("transaction_date", { mode: "timestamp" }).notNull(),
  metadata: text("metadata", { mode: "json" }),
});

/* ========================= 
    ORDERS
==========================*/
export const ordersTable = sqliteTable("orders", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  ecommerceIntegrationId: text("ecommerce_integration_id").references(() => integrationsTable.id),
  transactionId: text("transaction_id").references(() => transactionsTable.id),
  externalOrderId: text("external_order_id").unique(),
  totalAmount: real("total_amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status", {
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
  })
    .notNull()
    .default("pending"),
  orderDate: integer("order_date", { mode: "timestamp" }).notNull(),
});

/* ========================= 
    ANALYTICS
==========================*/
export const analyticsTable = sqliteTable("analytics", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  campaignId: text("campaign_id").references(() => campaignsTable.id, {
    onDelete: "cascade",
  }),
  periodStart: integer("period_start", { mode: "timestamp" }).notNull(),
  periodEnd: integer("period_end", { mode: "timestamp" }).notNull(),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  revenue: real("revenue").default(0),
  adSpend: real("ad_spend").default(0),
  roi: real("roi"),
  cpa: real("cpa"), // Cost per acquisition
  roas: real("roas"), // Return on ad spend
});

/* ========================= 
    ANALYTIC SNAPSHOTS
==========================*/
export const analyticsSnapshotsTable = sqliteTable("analytics_snapshots", {
  id: text("id").primaryKey(),
  analyticsId: text("analytics_id")
    .notNull()
    .references(() => analyticsTable.id, { onDelete: "cascade" }),
  snapshotDate: integer("snapshot_date", { mode: "timestamp" }).$defaultFn(() => new Date()),
  metrics: text("metrics", { mode: "json" }).notNull(),
});

/* ========================= 
    TRACKING HEALTH
==========================*/
export const trackingHealthTable = sqliteTable("tracking_health", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  integrationId: text("integration_id").references(() => integrationsTable.id),
  status: text("status", {
    enum: ["healthy", "degraded", "unhealthy"],
  }).notNull(),
  eventsReceived: integer("events_received").default(0),
  eventsProcessed: integer("events_processed").default(0),
  eventsFailed: integer("events_failed").default(0),
  matchRate: real("match_rate"),
  checkedAt: integer("checked_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/* ========================= 
    ALERTS
==========================*/
export const alertsTable = sqliteTable("alerts", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  type: text("type", {
    enum: [
      "tracking_failure",
      "high_duplicate_rate",
      "low_match_rate",
      "integration_error",
      "anomaly_detected",
    ],
  }).notNull(),
  severity: text("severity", {
    enum: ["low", "medium", "high", "critical"],
  }).notNull(),
  message: text("message").notNull(),
  context: text("context", { mode: "json" }),
  isResolved: integer("is_resolved", { mode: "boolean" }).notNull().default(false),
  triggeredAt: integer("triggered_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  resolvedAt: integer("resolved_at", { mode: "timestamp" }),
});

/* ========================= 
    HEALTH HISTORY
==========================*/
export const healthHistoryTable = sqliteTable("health_history", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  recordedAt: integer("recorded_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  metrics: text("metrics", { mode: "json" }).notNull(),
});

/* ========================= 
    USAGE COSTS
==========================*/
export const usageCostsTable = sqliteTable("usage_costs", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  periodStart: integer("period_start", { mode: "timestamp" }).notNull(),
  periodEnd: integer("period_end", { mode: "timestamp" }).notNull(),
  eventsProcessed: integer("events_processed").default(0),
  apiCalls: integer("api_calls").default(0),
  totalCost: real("total_cost").default(0),
});

/* ========================= 
    PRIVACY SETTINGS
==========================*/
export const privacySettingsTable = sqliteTable("privacy_settings", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .unique()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  gdprCompliant: integer("gdpr_compliant", { mode: "boolean" }).notNull().default(false),
  ccpaCompliant: integer("ccpa_compliant", { mode: "boolean" }).notNull().default(false),
  dataRetentionDays: integer("data_retention_days").notNull().default(90),
  allowedDataTypes: text("allowed_data_types", { mode: "json" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/* ========================= 
    CONSENT RECORDS
==========================*/
export const consentRecordsTable = sqliteTable("consent_records", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  visitorId: text("visitor_id").notNull(),
  consents: text("consents", { mode: "json" }).notNull(),
  givenAt: integer("given_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  revokedAt: integer("revoked_at", { mode: "timestamp" }),
});

// ==================== RELATIONS ====================
export const userRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
  accounts: many(accountsTable),
  ownedProjects: many(projectsTable),
  projectMemberships: many(projectMembersTable),
}));

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const accountRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const projectsRelations = relations(projectsTable, ({ one, many }) => ({
  owner: one(usersTable, {
    fields: [projectsTable.ownerId],
    references: [usersTable.id],
  }),
  members: many(projectMembersTable),
  integrations: many(integrationsTable),
  campaigns: many(campaignsTable),
  events: many(eventsTable),
  transactions: many(transactionsTable),
  analytics: many(analyticsTable),
}));

export const campaignsRelations = relations(campaignsTable, ({ one, many }) => ({
  project: one(projectsTable, {
    fields: [campaignsTable.projectId],
    references: [projectsTable.id],
  }),
  adsIntegration: one(integrationsTable, {
    fields: [campaignsTable.adsIntegrationId],
    references: [integrationsTable.id],
  }),
  attributions: many(attributionsTable),
  analytics: many(analyticsTable),
}));

// ==================== TYPES ====================
export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export type Project = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;

export type Campaign = typeof campaignsTable.$inferSelect;
export type InsertCampaign = typeof campaignsTable.$inferInsert;

export type Event = typeof eventsTable.$inferSelect;
export type InsertEvent = typeof eventsTable.$inferInsert;

export type Transaction = typeof transactionsTable.$inferSelect;
export type InsertTransaction = typeof transactionsTable.$inferInsert;

export type Analytics = typeof analyticsTable.$inferSelect;
export type InsertAnalytics = typeof analyticsTable.$inferInsert;

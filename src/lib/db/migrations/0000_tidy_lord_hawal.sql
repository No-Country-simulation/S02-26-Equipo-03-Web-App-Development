CREATE TABLE `alerts` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`type` text NOT NULL,
	`severity` text NOT NULL,
	`message` text NOT NULL,
	`context` text,
	`is_resolved` integer DEFAULT false NOT NULL,
	`triggered_at` integer,
	`resolved_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `analytics_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`analytics_id` text NOT NULL,
	`snapshot_date` integer,
	`metrics` text NOT NULL,
	FOREIGN KEY (`analytics_id`) REFERENCES `analytics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `analytics` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`campaign_id` text,
	`period_start` integer NOT NULL,
	`period_end` integer NOT NULL,
	`impressions` integer DEFAULT 0,
	`clicks` integer DEFAULT 0,
	`conversions` integer DEFAULT 0,
	`revenue` real DEFAULT 0,
	`ad_spend` real DEFAULT 0,
	`roi` real,
	`cpa` real,
	`roas` real,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `attributions` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`campaign_id` text NOT NULL,
	`model` text NOT NULL,
	`weight` real DEFAULT 1 NOT NULL,
	`attributed_at` integer,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`ads_integration_id` text,
	`external_id` text,
	`name` text NOT NULL,
	`budget` real,
	`spent` real DEFAULT 0,
	`start_date` integer,
	`end_date` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ads_integration_id`) REFERENCES `integrations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `consent_records` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`visitor_id` text NOT NULL,
	`consents` text NOT NULL,
	`given_at` integer,
	`revoked_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `event_validations` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`is_valid` integer NOT NULL,
	`is_duplicate` integer NOT NULL,
	`is_anomaly` integer NOT NULL,
	`validation_errors` text,
	`validated_at` integer,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`event_type` text NOT NULL,
	`source` text NOT NULL,
	`payload` text NOT NULL,
	`visitor_id` text,
	`session_id` text,
	`timestamp` integer NOT NULL,
	`received_at` integer,
	`status` text DEFAULT 'received' NOT NULL,
	`deduplication_key` text,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_deduplication_key_unique` ON `events` (`deduplication_key`);--> statement-breakpoint
CREATE TABLE `health_history` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`recorded_at` integer,
	`metrics` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `integrations` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`credentials` text,
	`connected_at` integer,
	`platform` text,
	`store_url` text,
	`api_key` text,
	`merchant_id` text,
	`account_id` text,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`ecommerce_integration_id` text,
	`external_order_id` text,
	`total_amount` real NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`order_date` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ecommerce_integration_id`) REFERENCES `integrations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_external_order_id_unique` ON `orders` (`external_order_id`);--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`resource` text NOT NULL,
	`action` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `privacy_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`gdpr_compliant` integer DEFAULT false NOT NULL,
	`ccpa_compliant` integer DEFAULT false NOT NULL,
	`data_retention_days` integer DEFAULT 90 NOT NULL,
	`allowed_data_types` text,
	`updated_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `project_members` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role_id` text NOT NULL,
	`joined_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_name_unique` ON `roles` (`name`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `tracking_health` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`integration_id` text,
	`status` text NOT NULL,
	`events_received` integer DEFAULT 0,
	`events_processed` integer DEFAULT 0,
	`events_failed` integer DEFAULT 0,
	`match_rate` real,
	`checked_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`integration_id`) REFERENCES `integrations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`payment_integration_id` text,
	`external_id` text,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`transaction_date` integer NOT NULL,
	`metadata` text,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`payment_integration_id`) REFERENCES `integrations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_external_id_unique` ON `transactions` (`external_id`);--> statement-breakpoint
CREATE TABLE `usage_costs` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`period_start` integer NOT NULL,
	`period_end` integer NOT NULL,
	`events_processed` integer DEFAULT 0,
	`api_calls` integer DEFAULT 0,
	`total_cost` real DEFAULT 0,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
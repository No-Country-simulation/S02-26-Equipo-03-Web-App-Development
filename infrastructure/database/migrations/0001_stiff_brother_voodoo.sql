ALTER TABLE `events` RENAME COLUMN "timestamp" TO "timestamp_ms";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_attributions` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`campaign_id` text,
	`utm_source` text,
	`utm_campaign` text,
	`external_session_id` text NOT NULL,
	`model` text NOT NULL,
	`weight` real DEFAULT 1 NOT NULL,
	`attributed_at` integer,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_attributions`("id", "event_id", "campaign_id", "utm_source", "utm_campaign", "external_session_id", "model", "weight", "attributed_at") SELECT "id", "event_id", "campaign_id", "utm_source", "utm_campaign", "external_session_id", "model", "weight", "attributed_at" FROM `attributions`;--> statement-breakpoint
DROP TABLE `attributions`;--> statement-breakpoint
ALTER TABLE `__new_attributions` RENAME TO `attributions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
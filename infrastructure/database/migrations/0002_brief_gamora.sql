CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`format` text NOT NULL,
	`file_url` text NOT NULL,
	`period_start` integer NOT NULL,
	`period_end` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `reports_projectId_idx` ON `reports` (`project_id`);--> statement-breakpoint
CREATE INDEX `reports_userId_idx` ON `reports` (`user_id`);--> statement-breakpoint
ALTER TABLE `orders` ADD `payment_type` text DEFAULT 'PAGO ÚNICO';--> statement-breakpoint
ALTER TABLE `orders` ADD `stripe_id` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `campaign_id` text REFERENCES campaigns(id);--> statement-breakpoint
ALTER TABLE `orders` ADD `source_platform` text;
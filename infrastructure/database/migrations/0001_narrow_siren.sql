ALTER TABLE `integrations` ADD `customer_name` text;--> statement-breakpoint
ALTER TABLE `integrations` ADD `customer_email` text;--> statement-breakpoint
ALTER TABLE `integrations` DROP COLUMN `store_url`;--> statement-breakpoint
ALTER TABLE `integrations` DROP COLUMN `merchant_id`;
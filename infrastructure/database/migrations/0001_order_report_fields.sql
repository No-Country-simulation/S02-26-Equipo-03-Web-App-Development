ALTER TABLE `orders` ADD COLUMN `payment_type` text DEFAULT 'PAGO UNICO';
--> statement-breakpoint
ALTER TABLE `orders` ADD COLUMN `client_name` text;
--> statement-breakpoint
ALTER TABLE `orders` ADD COLUMN `client_email` text;
--> statement-breakpoint
ALTER TABLE `orders` ADD COLUMN `stripe_id` text;
--> statement-breakpoint
ALTER TABLE `attributions` ADD COLUMN `order_id` text REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade;
--> statement-breakpoint
CREATE INDEX `idx_orders_project_date` ON `orders` (`project_id`,`order_date`);
--> statement-breakpoint
CREATE INDEX `idx_orders_status` ON `orders` (`status`);
--> statement-breakpoint
CREATE INDEX `idx_attributions_order` ON `attributions` (`order_id`);

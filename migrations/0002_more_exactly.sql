ALTER TABLE `access_logs` RENAME TO `access_log`;--> statement-breakpoint
ALTER TABLE `urls` RENAME TO `url`;--> statement-breakpoint
ALTER TABLE `access_log` RENAME COLUMN `access_log_id` TO `url_id`;--> statement-breakpoint
ALTER TABLE `url` DROP COLUMN `access_log_id`;
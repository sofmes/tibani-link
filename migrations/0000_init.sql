CREATE TABLE `access_logse` (
	`access_log_id` integer PRIMARY KEY NOT NULL,
	`access_user_id` text,
	`access_date` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `urls` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`url` text NOT NULL,
	`has_access_limitation` integer NOT NULL,
	`acceess_log_setting` integer NOT NULL,
	`access_log_id` integer NOT NULL
);

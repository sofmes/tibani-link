DROP TABLE `access_log`;
CREATE TABLE `access_log` (
	`url_id` text PRIMARY KEY NOT NULL,
	`access_user_id` text,
	`access_date` integer NOT NULL
);
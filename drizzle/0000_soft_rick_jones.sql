CREATE TABLE `accounts` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`twitter_id` bigint,
	`twitter_name` varchar(255),
	`address` varchar(42),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `list_members` (
	`twitter_list_id` bigint NOT NULL,
	`twitter_user_id` bigint NOT NULL,
	`token_id` varchar(100),
	`joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`left_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `list_members_twitter_list_id_twitter_user_id` PRIMARY KEY("twitter_list_id","twitter_user_id")
);
--> statement-breakpoint
CREATE INDEX `twitter_id_idx` ON `accounts` (`twitter_id`);
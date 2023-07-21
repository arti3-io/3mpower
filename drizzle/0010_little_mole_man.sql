CREATE TABLE `join_queue` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`twitter_list_id` varchar(255) NOT NULL,
	`twitter_user_id` varchar(255) NOT NULL,
	`twitter_name` varchar(255) NOT NULL,
	`token_id` varchar(100) NOT NULL,
	`is_enqueued` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `twitter_list_user_id_idx` ON `join_queue` (`twitter_list_id`,`twitter_user_id`);
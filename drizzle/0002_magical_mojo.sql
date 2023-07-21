ALTER TABLE `accounts` DROP CONSTRAINT `accounts_twitter_id_unique`;--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `twitter_id` varchar(255);--> statement-breakpoint
ALTER TABLE `list_members` MODIFY COLUMN `twitter_list_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `list_members` MODIFY COLUMN `twitter_user_id` varchar(255) NOT NULL;
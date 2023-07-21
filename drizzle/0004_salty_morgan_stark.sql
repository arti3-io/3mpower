ALTER TABLE `list_members` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `list_members` MODIFY COLUMN `twitter_user_id` varchar(255);--> statement-breakpoint
ALTER TABLE `list_members` MODIFY COLUMN `token_id` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `list_members` ADD PRIMARY KEY(`token_id`,`twitter_list_id`);
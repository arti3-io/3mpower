ALTER TABLE `list_members` RENAME COLUMN `joined_at` TO `created_at`;--> statement-breakpoint
ALTER TABLE `list_members` RENAME COLUMN `left_at` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `list_members` MODIFY COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
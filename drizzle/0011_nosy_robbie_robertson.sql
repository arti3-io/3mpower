CREATE TABLE `top_tweets` (
	`twitter_list_id` varchar(255) NOT NULL,
	`tweet_id` varchar(255) NOT NULL,
	`tweet_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `top_tweets_tweet_id_twitter_list_id` PRIMARY KEY(`tweet_id`,`twitter_list_id`)
);
--> statement-breakpoint
CREATE TABLE `user_stats` (
	`twitter_user_id` varchar(255) NOT NULL,
	`twitter_name` varchar(255) NOT NULL,
	`twitter_list_id` varchar(255) NOT NULL,
	`tweet_id` varchar(255) NOT NULL,
	`points` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_stats_tweet_id_twitter_list_id_twitter_user_id` PRIMARY KEY(`tweet_id`,`twitter_list_id`,`twitter_user_id`)
);

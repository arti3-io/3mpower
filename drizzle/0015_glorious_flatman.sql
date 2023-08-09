CREATE TABLE `list_tweets` (
	`twitter_list_id` varchar(255) NOT NULL,
	`tweet_id` varchar(255) NOT NULL,
	`author_id` varchar(255),
	`reply_to_usr_id` varchar(255),
	`text` varchar(255),
	`ref_tweet_type` varchar(255),
	`ref_tweet_id` varchar(255),
	`tweet_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `list_tweets_tweet_id_twitter_list_id` PRIMARY KEY(`tweet_id`,`twitter_list_id`)
);

import { inngest } from './index';
import { TwitterApi } from 'twitter-api-v2';
import { NewListTweet } from '@/types/DB';
import * as listTweetsModel from '@/models/ListTweets';
import moment from 'moment';
import { env } from '@/env.mjs';

// 1.scrapping 25 tweets from twitter list every 4 hours
// 2.extract data to db

//reset limit and dequeue every 15 minutes
export const scapper = inngest.createFunction(
  { name: 'Scapper Function' },
  { cron: '0 */6 * * *' },
  async ({ step }) => {
    await step.run('extract tweets', async () => {
      console.log('extract tweets');
      const listID = '1677692164376248321';
      const twitterClient = new TwitterApi(env.TWITTER_APP_OAUTH);

      const { tweets: data, meta } = await twitterClient.v2.listTweets(listID, {
        max_results: 25,
        expansions: ['referenced_tweets.id.author_id', 'referenced_tweets.id'],
        'tweet.fields': [
          'id',
          'text',
          'author_id',
          'in_reply_to_user_id',
          'public_metrics',
          'created_at',
        ],
      });

      const tweets: NewListTweet[] = data.map((tweet) => {
        return {
          twitterListId: listID,
          tweetId: tweet.id,
          authorId: tweet.author_id,
          replyToUsrId: tweet.in_reply_to_user_id,
          refTweetType: tweet.referenced_tweets
            ? tweet.referenced_tweets[0].type
            : null,
          refTweetId: tweet.referenced_tweets
            ? tweet.referenced_tweets[0].id
            : null,
          text: tweet.text,
          tweetAt: moment(tweet.created_at).toDate(),
        };
      });

      await listTweetsModel.upsertTweets(tweets);
    });
  }
);

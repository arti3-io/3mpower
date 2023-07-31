import { asc, eq, sql } from 'drizzle-orm';
import { topTweets } from '@/db/schema';
import { db } from '@/db/';

export const getTopTweetsByList = async (twitterListId: string) => {
  let result = await db
    .select()
    .from(topTweets)
    .where(eq(topTweets.twitterListId, twitterListId))
    .orderBy(asc(topTweets.createdAt))
    .limit(3);

  return result;
};

import { sql, eq, and, desc, gte } from 'drizzle-orm';
import { listTweets } from '@/db/schema';
import { NewListTweet } from '@/types/DB';
import { db } from '@/db/';

export const upsertTweets = async (acc: NewListTweet[]) => {
  await db
    .insert(listTweets)
    .values(acc)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: sql`NOW()`,
      },
    });
};

export const getTweetsByList = async (twitterListId: string) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let result = await db
    .select({
      points: sql`COUNT(*)`,
      twitterUserId: listTweets.authorId,
    })
    .from(listTweets)
    .where(
      and(
        eq(listTweets.twitterListId, twitterListId),
        eq(listTweets.refTweetType, 'replied_to'),
        gte(listTweets.tweetAt, thirtyDaysAgo)
      )
    )
    .groupBy(listTweets.authorId)
    .orderBy(desc(sql`1`));

  return result;
};

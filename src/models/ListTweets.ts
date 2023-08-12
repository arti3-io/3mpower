import { sql, eq, and, desc, gte, lt } from 'drizzle-orm';
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

  const sixHoursAgo = new Date();
  sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

  // Get points and user IDs for the last 24 hours
  let currentPoints = await db
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
    .groupBy(listTweets.authorId);

  // Get points for the previous day
  let previousPoints = await db
    .select({
      points: sql`COUNT(*)`,
      twitterUserId: listTweets.authorId,
    })
    .from(listTweets)
    .where(
      and(
        eq(listTweets.twitterListId, twitterListId),
        eq(listTweets.refTweetType, 'replied_to'),
        lt(listTweets.tweetAt, sixHoursAgo)
      )
    )
    .groupBy(listTweets.authorId);

  currentPoints.sort((a, b) => Number(b.points) - Number(a.points));
  previousPoints.sort((a, b) => Number(b.points) - Number(a.points));

  // Get the rank of each user
  const currentPointsWithRanks = currentPoints.map((currentPoint, index) => {
    return {
      ...currentPoint,
      rank: index + 1,
    };
  });

  const previousPointsWithRanks = previousPoints.map((previousPoint, index) => {
    return {
      ...previousPoint,
      previousRank: index + 1,
    };
  });

  const combinedPoints = currentPointsWithRanks.map((currentPoint) => {
    const previousPoint = previousPointsWithRanks.find(
      (previousPoint) =>
        previousPoint.twitterUserId === currentPoint.twitterUserId
    );

    return {
      ...currentPoint,
      previousRank: previousPoint?.previousRank || 0,
      previousPoints: previousPoint?.points || 0,
    };
  });

  return combinedPoints;
};

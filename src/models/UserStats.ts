import { eq, and, sql, gte } from 'drizzle-orm';
import { userStats } from '@/db/schema';
import {} from '@/types/DB';
import { db } from '@/db/';

export const getUserStatsByList = async (twitterListId: string) => {
  let result = await db
    .select({
      totalPoints: sql`SUM(points)`,
      twitterUserId: userStats.twitterUserId,
    })
    .from(userStats)
    .where(eq(userStats.twitterListId, twitterListId))
    .groupBy(userStats.twitterUserId);

  return result;
};

export const getMonthlyUserStatsByList = async (twitterListId: string) => {
  // Calculate the date for 30 days ago from the current date
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let result = await db
    .select({
      totalPoints: sql`SUM(points)`,
      twitterUserId: userStats.twitterUserId,
    })
    .from(userStats)
    .where(
      and(
        eq(userStats.twitterListId, twitterListId),
        gte(userStats.updatedAt, thirtyDaysAgo)
      )
    )
    .groupBy(userStats.twitterUserId);

  return result;
};

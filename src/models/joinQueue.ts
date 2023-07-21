import { sql, eq, and, asc, inArray } from 'drizzle-orm';
import { joinQueue } from '@/db/schema';
import { NewListJoiner } from '@/types/DB';
import { db } from '@/db/';

export const enqueued = async (data: NewListJoiner) => {
  await db.insert(joinQueue).values(data);
};

export const dequeued = async (ids: number[]) => {
  await db
    .update(joinQueue)
    .set({
      isEnqueued: true,
      updatedAt: sql`NOW()`,
    })
    .where(inArray(joinQueue.id, ids));
};

export const getQueue = async (
  twitterListId: string,
  twitterUserId: string
) => {
  const queue = await db
    .select()
    .from(joinQueue)
    .where(
      and(
        eq(joinQueue.twitterListId, twitterListId),
        eq(joinQueue.twitterUserId, twitterUserId),
        eq(joinQueue.isEnqueued, false)
      )
    );
  return queue[0];
};

export const getDequeued = async (
  twitterListId: string,
  twitterUserId: string
) => {
  const queue = await db
    .select()
    .from(joinQueue)
    .where(
      and(
        eq(joinQueue.twitterListId, twitterListId),
        eq(joinQueue.twitterUserId, twitterUserId),
        eq(joinQueue.isEnqueued, true)
      )
    );
  return queue[0];
};

export const getQueueSize = async () => {
  const queue = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(joinQueue)
    .where(eq(joinQueue.isEnqueued, false));
  return queue[0].count;
};

export const getAllQueue = async (limit: number) => {
  const queue = await db
    .select()
    .from(joinQueue)
    .where(and(eq(joinQueue.isEnqueued, false)))
    .orderBy(asc(joinQueue.createdAt))
    .limit(limit);
  return queue;
};

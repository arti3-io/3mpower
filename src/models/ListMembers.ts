import { eq, desc, and, sql, gte } from 'drizzle-orm';
import { listMembers } from '@/db/schema';
import { newMember } from '@/types/DB';
import { db } from '@/db/';

export const getMembersFromList = async (
  twitterListId: string,
  limit?: number
) => {
  let query = db
    .select()
    .from(listMembers)
    .where(eq(listMembers.twitterListId, twitterListId));

  if (limit) {
    query = query.limit(limit);
  }
  return query;
};

export const getMonthlyJoinsFromList = async (twitterListId: string) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let query = await db
    .select({
      count: sql`COUNT(*)`,
    })
    .from(listMembers)
    .where(
      and(
        eq(listMembers.twitterListId, twitterListId),
        gte(listMembers.updatedAt, thirtyDaysAgo)
      )
    );

  return query[0];
};

export const getTopLists = async (limit?: number) => {
  let query = db
    .select({
      twitterListId: listMembers.twitterListId,
      memberCount: sql<number>`COUNT(*)`,
    })
    .from(listMembers)
    .groupBy(listMembers.twitterListId)
    .orderBy(desc(sql`2`));

  if (limit) {
    query = query.limit(limit);
  }

  const lists = await query;

  return lists;
};

export const getRecentLists = async (limit?: number) => {
  let query = db
    .select({
      twitterListId: listMembers.twitterListId,
      createdAt: sql`MAX(${listMembers.createdAt})`,
    })
    .from(listMembers)
    .groupBy(listMembers.twitterListId)
    .orderBy(desc(sql`MAX(${listMembers.createdAt})`));

  if (limit) {
    query = query.limit(limit);
  }

  const lists = await query;

  return lists;
};

export const getRecentMembersFromList = async (
  twitterListId: string,
  limit?: number
) => {
  let query = db
    .select()
    .from(listMembers)
    .where(eq(listMembers.twitterListId, twitterListId))
    .orderBy(desc(listMembers.updatedAt));
  if (limit) {
    query = query.limit(limit);
  }
  return query;
};

export const getMembersCountFromList = async (twitterListId: string) => {
  const members: any[] = await db
    .select({
      count: sql<number>`count(twitter_user_id)`,
    })
    .from(listMembers)
    .where(eq(listMembers.twitterListId, twitterListId));

  return members;
};

export const getMemberInfo = async (
  twitterListId: string,
  twitterId: string
) => {
  const member = await db
    .select()
    .from(listMembers)
    .where(
      and(
        eq(listMembers.twitterUserId, twitterId),
        eq(listMembers.twitterListId, twitterListId)
      )
    );
  return member[0];
};

export const getMemberInfoByTokenId = async (
  twitterListId: string,
  tokenId: string
) => {
  const member = await db

    .select()
    .from(listMembers)
    .where(
      and(
        eq(listMembers.tokenId, tokenId),
        eq(listMembers.twitterListId, twitterListId)
      )
    );
  return member[0];
};

export const upsertMembers = async (members: newMember[]) => {
  await db
    .insert(listMembers)
    .values(members)
    .onDuplicateKeyUpdate({
      set: {
        twitterUserId: sql`VALUES(twitter_user_id)`,
        twitterName: sql`VALUES(twitter_name)`,
        updatedAt: sql`NOW()`,
      },
    });
};

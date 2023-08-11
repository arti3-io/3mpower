import { sql, eq, asc } from 'drizzle-orm';
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
  let result = await db
    .select()
    .from(listTweets)
    .where(eq(listTweets.twitterListId, twitterListId))
    .orderBy(asc(listTweets.createdAt));

  return result;
};

// export const getAccountInfo = async (twitterId: string) => {
//   const account = await db
//     .select()
//     .from(accounts)
//     .where(eq(accounts.twitterId, twitterId));
//   return account[0];
// };

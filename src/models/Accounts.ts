import { sql, eq } from 'drizzle-orm';
import { accounts } from '@/db/schema';
import { NewAccount } from '@/types/DB';
import { db } from '@/db/';

export const upsertAccount = async (acc: NewAccount) => {
  await db
    .insert(accounts)
    .values(acc)
    .onDuplicateKeyUpdate({
      set: {
        updateAt: sql`NOW()`,
        address: acc.address,
      },
    });
};

export const getAccountInfo = async (twitterId: string) => {
  const account = await db
    .select()
    .from(accounts)
    .where(eq(accounts.twitterId, twitterId));
  return account[0];
};

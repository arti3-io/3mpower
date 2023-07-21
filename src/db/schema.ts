import {
  mysqlTable,
  serial,
  varchar,
  boolean,
  index,
  timestamp,
  primaryKey,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
export const accounts = mysqlTable(
  'accounts',
  {
    id: serial('id').primaryKey(),
    twitterId: varchar('twitter_id', { length: 255 }).unique(),
    address: varchar('address', { length: 42 }),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updateAt: timestamp('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (account) => ({
    twitterIdIdx: index('twitter_id_idx').on(account.twitterId),
  })
);

export const listMembers = mysqlTable(
  'list_members',
  {
    twitterListId: varchar('twitter_list_id', { length: 255 }),
    twitterUserId: varchar('twitter_user_id', { length: 255 }),
    twitterName: varchar('twitter_name', { length: 255 }),
    tokenId: varchar('token_id', { length: 100 }),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (listMembers) => ({
    pk: primaryKey(listMembers.twitterListId, listMembers.tokenId),
  })
);

//TODO::add new schema for erc20 token and erc1155 token

export const joinQueue = mysqlTable(
  'join_queue',
  {
    id: serial('id').primaryKey(),
    twitterListId: varchar('twitter_list_id', { length: 255 }).notNull(),
    twitterUserId: varchar('twitter_user_id', { length: 255 }).notNull(),
    twitterName: varchar('twitter_name', { length: 255 }).notNull(),
    tokenId: varchar('token_id', { length: 100 }).notNull(),
    isEnqueued: boolean('is_enqueued').default(false),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (lq) => ({
    tuidIdx: index('twitter_list_user_id_idx').on(
      lq.twitterListId,
      lq.twitterUserId
    ),
  })
);

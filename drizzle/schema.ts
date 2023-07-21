import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  serial,
  bigint,
  varchar,
  timestamp,
  primaryKey,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const accounts = mysqlTable('accounts', {
  id: serial('id').primaryKey().notNull(),
  twitterId: bigint('twitter_id', { mode: 'number' }),
  twitterName: varchar('twitter_name', { length: 255 }),
  address: varchar('address', { length: 42 }),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

export const listMembers = mysqlTable(
  'list_members',
  {
    twitterListId: bigint('twitter_list_id', { mode: 'number' }).notNull(),
    twitterUserId: bigint('twitter_user_id', { mode: 'number' }).notNull(),
    twitterName: varchar('twitter_name', { length: 255 }),
    tokenId: varchar('token_id', { length: 100 }),
    joinedAt: timestamp('joined_at', { mode: 'string' }).defaultNow().notNull(),
    leftAt: timestamp('left_at', { mode: 'string' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      listMembersTwitterListIdTwitterUserId: primaryKey(
        table.twitterListId,
        table.twitterUserId
      ),
    };
  }
);

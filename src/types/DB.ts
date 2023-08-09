import { InferModel } from 'drizzle-orm';
import { accounts, joinQueue, listMembers, listTweets } from '@/db/schema';
export type Account = InferModel<typeof accounts, 'select'>;
export type NewAccount = InferModel<typeof accounts, 'insert'>;
export type NewMember = InferModel<typeof listMembers, 'insert'>;
export type joinQueue = InferModel<typeof joinQueue, 'select'>;
export type NewListJoiner = InferModel<typeof joinQueue, 'insert'>;
export type NewListTweet = InferModel<typeof listTweets, 'insert'>;
export type ListTweet = InferModel<typeof listTweets, 'select'>;

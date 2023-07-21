import { InferModel } from 'drizzle-orm';
import { accounts, joinQueue, listMembers } from '@/db/schema';
export type Account = InferModel<typeof accounts, 'select'>;
export type NewAccount = InferModel<typeof accounts, 'insert'>;
export type newMember = InferModel<typeof listMembers, 'insert'>;
export type joinQueue = InferModel<typeof joinQueue, 'select'>;
export type NewListJoiner = InferModel<typeof joinQueue, 'insert'>;

import { Inngest } from 'inngest';
import { redisClient } from '@/connectors/redis';
import * as joinQueueModel from '@/models/joinQueue';
import * as ListMembersModel from '@/models/ListMembers';
import { getTwitterClient } from '@/lib/client';
import { env } from '@/env.mjs';

export const inngest = new Inngest({ name: '3MPOWER' });

//reset limit and dequeue every 15 minutes
export const manageQueue = inngest.createFunction(
  { name: 'Reset limit/Dequeue' },
  { cron: '*/15 * * * *' },
  async ({ step }) => {
    await step.run('dequeue', async () => {
      await redisClient.set(env.RATE_LIMIT_COUNT, 0);
      const queue = await joinQueueModel.getAllQueue(env.QUEUE_LIMIT);
      if (queue.length > 0) {
        console.log('Case have queue');
        const twitterClient = await getTwitterClient();
        const ListMembersPromise = queue.map((item) => {
          return twitterClient.v2.addListMember(
            item.twitterListId,
            item.twitterUserId
          );
        });
        await Promise.all(ListMembersPromise);
        let ids = [];
        let members = [];
        for (let member of queue) {
          ids.push(member.id);
          members.push({
            twitterListId: member.twitterListId,
            twitterUserId: member.twitterUserId,
            twitterName: member.twitterName,
            tokenId: member.tokenId,
          });
        }

        const removeMemberPromise = members.map((item) => {
          return ListMembersModel.getMemberInfoByTokenId(
            item.twitterListId,
            item.tokenId
          );
        });

        const removeMember = await Promise.all(removeMemberPromise);

        if (removeMember.length > 0) {
          const removeMemberPromise = removeMember.map((item) => {
            if (item.twitterListId && item.twitterUserId) {
              return twitterClient.v2.removeListMember(
                item.twitterListId,
                item.twitterUserId
              );
            }
          });
          await Promise.all(removeMemberPromise);
        }
        await joinQueueModel.dequeued(ids);
        await ListMembersModel.upsertMembers(members);
        await redisClient.incrby(env.RATE_LIMIT_COUNT, ids.length);
      } else {
        console.log('Case no queue');
        return;
      }
    });
  }
);

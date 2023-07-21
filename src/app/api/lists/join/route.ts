import { NextResponse, NextRequest } from 'next/server';
import { getTwitterClient } from '@/lib/client';
import { Community } from '@/types/community';
import { TwitterTokenResponse } from '@/types/API';
import { getToken } from 'next-auth/jwt';
import { conditionsValidator } from '@/lib/validate';
import { env } from '@/env.mjs';
import { get } from '@vercel/edge-config';
import { redisClient } from '@/connectors/redis';
import * as AccountsModel from '@/models/Accounts';
import * as ListMembersModel from '@/models/ListMembers';
import * as JoinQueueModel from '@/models/joinQueue';
import * as z from 'zod';

// export const runtime = 'edge';

const resBuilder = (msg: string, status: number = 200) => {
  return NextResponse.json(
    {
      msg,
    },
    { status }
  );
};

const schema = z.object({
  twitterListId: z.string(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  // console.log('POST bilding twitter');
  try {
    const token = await getToken({ req, secret: env.NEXTAUTH_SECRET });
    // console.log('token', token);
    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    const { user, expires_at, access_token } = token;
    if (Number(expires_at) * 1000 < Date.now()) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    const account = await AccountsModel.getAccountInfo(user.id);

    if (!account.address) {
      return resBuilder('You need to bind your wallet', 401);
    }

    const body = await req.json();
    const { twitterListId } = schema.parse(body);
    const community = await get<Community[]>('communities');

    const communityInfo = community?.find((c) => c.list === twitterListId);

    if (!communityInfo) return resBuilder('List not found', 404);

    // console.log('communityInfo', communityInfo);

    const member = await ListMembersModel.getMemberInfo(
      communityInfo.list,
      user.id
    );

    if (member) return resBuilder('You are already in the list', 400);

    let tokenId = undefined;
    for (let conditions of communityInfo.conditions) {
      const valid = await conditionsValidator(conditions, account.address);

      if (!valid.pass) {
        return resBuilder('You are not eligible for this list', 400);
      }

      if (valid.tokenId) {
        tokenId = valid.tokenId;
      }
    }
    // get access token from redis
    const twitterToken: TwitterTokenResponse = await redisClient.json.get(
      env.OAUTH_OFFICIAL_TWITTER_KEY
    );

    if (!twitterToken) return resBuilder('Something went wrong', 400);

    if (tokenId) {
      const queueSize = await JoinQueueModel.getQueueSize();

      //case has queue
      if (queueSize > 0) {
        console.log('case has queue');
        await JoinQueueModel.enqueued({
          twitterListId: communityInfo.list,
          twitterUserId: user.id,
          twitterName: user.name,
          tokenId,
        });
        return resBuilder(
          'Your already in queue, the process may take a while',
          200
        );
      } else {
        const rateLimitCount = await redisClient.get<number>(
          env.RATE_LIMIT_COUNT
        );
        // console.log('rateLimitCount', rateLimitCount);

        //case has no queue and hit rate limit
        if (rateLimitCount && rateLimitCount >= env.QUEUE_LIMIT) {
          console.log('case has no queue and hit rate limit');
          await JoinQueueModel.enqueued({
            twitterListId: communityInfo.list,
            twitterUserId: user.id,
            twitterName: user.name,
            tokenId,
          });
          return resBuilder(
            'Your already in queue, the process may take a while',
            200
          );
        } else if (
          rateLimitCount !== null &&
          rateLimitCount < env.QUEUE_LIMIT
        ) {
          //case has no queue and not hit rate limit
          console.log('case has no queue and not hit rate limit');
          const twitterClient = await getTwitterClient();
          const prevMember = await ListMembersModel.getMemberInfoByTokenId(
            communityInfo.list,
            tokenId
          );

          if (prevMember && prevMember.twitterUserId) {
            const res = await twitterClient.v2.removeListMember(
              communityInfo.list,
              prevMember.twitterUserId
            );
            if (res.errors) return resBuilder('Something went wrong', 400);
          }
          // else {
          // }
          // //TODO CASE ERC20:insert with out token id

          const res = await twitterClient.v2.addListMember(
            communityInfo.list,
            user.id
          );
          if (res.errors) return resBuilder('Something went wrong', 400);
          await ListMembersModel.upsertMembers([
            {
              twitterUserId: user.id,
              twitterName: user.name,
              twitterListId: communityInfo.list,
              tokenId,
            },
          ]);
          //increase rate limit count +1
          await redisClient.incr(env.RATE_LIMIT_COUNT);
        }
      }
    }

    return resBuilder(
      'Your application has been received, the process may take a while.',
      200
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: 'Something went wrong' }, { status: 400 });
  }
}

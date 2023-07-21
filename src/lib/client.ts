import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { TwitterApi } from 'twitter-api-v2';
import { redisClient } from '@/connectors/redis';
import { TwitterTokenResponse } from '@/types/API';
import { env } from '@/env.mjs';

export const client = createPublicClient({
  chain: mainnet,
  transport: http(`https://eth-mainnet.g.alchemy.com/v2/${env.ALCHEMY_KEY}`),
});

export const getTwitterClient = async () => {
  const twitterToken: TwitterTokenResponse = await redisClient.json.get(
    env.OAUTH_OFFICIAL_TWITTER_KEY
  );
  let twitterClient = new TwitterApi({
    clientId: env.TWITTER_CLIENT_ID,
    clientSecret: env.TWITTER_CLIENT_SECRET,
  });
  if (twitterToken.expires_at * 1000 < Date.now()) {
    const {
      client: refreshedClient,
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    } = await twitterClient.refreshOAuth2Token(twitterToken.refresh_token);
    twitterClient = refreshedClient;
    await redisClient.json.set(
      env.OAUTH_OFFICIAL_TWITTER_KEY,
      '$',
      JSON.stringify({
        twitter_id: twitterToken.twitter_id,
        expires_at: Date.now() / 1000 + expiresIn,
        access_token: accessToken,
        refresh_token: newRefreshToken,
      })
    );
  } else {
    twitterClient = new TwitterApi(twitterToken.access_token);
  }
  return twitterClient;
};

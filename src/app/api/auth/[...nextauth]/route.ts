import NextAuth, { NextAuthOptions } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import { TwitterApi } from 'twitter-api-v2';
import { env } from '@/env.mjs';
import * as AccountModel from '@/models/Accounts';

// Helper to obtain a new access_token from a refresh token.
async function refreshAccessToken(token: any) {
  console.log('refreshAccessToken');
  try {
    let twitterClient = new TwitterApi({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
    });

    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    } = await twitterClient.refreshOAuth2Token(token.refresh_token);

    return {
      ...token,
      access_token: accessToken,
      expires_at: Date.now() / 1000 + expiresIn,
      refresh_token: newRefreshToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: '2.0',
      authorization: {
        params: {
          scope: 'tweet.read users.read follows.read offline.access',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Initial sign in
      if (account && account.expires_at) {
        console.log('case initial sign in');
        // console.log('jwt', { token, account });
        const accountInfo = await AccountModel.getAccountInfo(
          account.providerAccountId
        );
        const user = {
          id: account.providerAccountId,
          name: token.name,
          image: token.picture,
          bindWallet: accountInfo ? accountInfo.address : null,
        };
        return {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (token && Date.now() < Number(token.expires_at) * 1000) {
        console.log('case not expired');
        const accountInfo = await AccountModel.getAccountInfo(token.user?.id);
        // console.log('jwt', { accountInfo });
        // console.log('jwt', { token });
        if (accountInfo) {
          return {
            ...token,
            user: { ...token.user, bindWallet: accountInfo.address },
          };
        } else {
          return token;
        }
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
        session.error = token.error;
      }
      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

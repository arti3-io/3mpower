'use client';

import { FC, PropsWithChildren } from 'react';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { WagmiConfig, createConfig } from 'wagmi';
import { SessionProvider } from 'next-auth/react';
import { APP_NAME } from '@/lib/consts';
import { env } from '@/env.mjs';

const config = createConfig(
  getDefaultConfig({
    appName: APP_NAME,
    // infuraId: env.NEXT_PUBLIC_INFURA_ID,
    // alchemyId: env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  })
);

const Web3Provider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <SessionProvider>
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="midnight">{children}</ConnectKitProvider>
    </WagmiConfig>
  </SessionProvider>
);

export default Web3Provider;

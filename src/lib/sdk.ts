import { Network, Alchemy } from 'alchemy-sdk';
import { env } from '@/env.mjs';

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: env.ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

export const alchemy = new Alchemy(settings);

import { Community } from '@/types/community';
import Client from './client';
import { get } from '@vercel/edge-config';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Communities',
};

export default async function Community() {
  const communities: Community[] = (await get('communities')) || [];
  return <Client communities={communities} />;
}

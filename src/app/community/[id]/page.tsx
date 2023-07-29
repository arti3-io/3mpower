import { Community } from '@/types/community';
import Client from './client';
import { get } from '@vercel/edge-config';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Member } from './columns';

export const metadata: Metadata = {
  title: 'Communities',
};

export default async function Community({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const communities: Community[] = (await get('communities')) || [];
  const community = communities.find((community) => community.id === id);

  if (!community) {
    notFound();
  }
  return <Client community={community} />;
}

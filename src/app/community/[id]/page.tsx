import { Community } from '@/types/community';
import Client from './client';
import { get } from '@vercel/edge-config';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Member } from './columns';

export const metadata: Metadata = {
  title: 'Communities',
};

async function getData(): Promise<Member[]> {
  // Fetch data from your API here.
  return [
    {
      rank: 1,
      id: 'mazkgang',
      name: 'Mazk Gang',
      profile_url:
        'https://i.seadn.io/gcs/files/9a3eca819213540351ae773d384d4383.gif?auto=format&dpr=1&w=256',
      engagement_rank: 1,
      joined_at: new Date(),
      engagement: 16,
    },
    {
      rank: 2,
      id: '0N1Force',
      name: '0N1 Force',
      profile_url:
        'https://i.seadn.io/gae/7gOej3SUvqALR-qkqL_ApAt97SpUKQOZQe88p8jPjeiDDcqITesbAdsLcWlsIg8oh7SRrTpUPfPlm12lb4xDahgP2h32pQQYCsuOM_s?auto=format&dpr=1&w=256',
      engagement_rank: 2,
      joined_at: new Date(),
      engagement: 13,
    },
    {
      rank: 3,
      id: 'y00ts',
      name: 'y00ts',
      profile_url:
        'https://i.seadn.io/gcs/files/ce85ffa4aab75e4024e70f18160bbf9f.png?auto=format&dpr=1&w=256',
      engagement_rank: 13,
      joined_at: new Date(),
      engagement: 14,
    },
  ];
}

export default async function Community({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const communities: Community[] = (await get('communities')) || [];
  const community = communities.find((community) => community.id === id);

  const data = await getData();

  if (!community) {
    notFound();
  }
  return <Client community={community} data={data} />;
}

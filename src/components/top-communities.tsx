'use client';
import { Community } from '@/types/community';
import { CommunityCard } from './community-card';
import { useEffect, useState } from 'react';

export default function TopCommunities({
  communities,
}: {
  communities: Community[];
}) {
  const [topCommunities, setTopCommunities] = useState<any[]>([]);
  useEffect(() => {
    const getTop = async () => {
      const res = await fetch(`/api/lists/top?limit=4`);
      const { lists } = await res.json();

      const mergedCommunities = lists.map((list: any) => {
        const matchingCommunity = communities.find(
          (community: Community) => community.list === list.twitterListId
        );
        return { ...list, ...matchingCommunity };
      });

      setTopCommunities(mergedCommunities);
    };
    getTop();
  }, []);

  return (
    <>
      {topCommunities.slice(0, 4).map((community, index) => (
        <div className="col-span-12 md:col-span-6 lg:col-span-3" key={index}>
          <CommunityCard community={community} />
        </div>
      ))}
    </>
  );
}

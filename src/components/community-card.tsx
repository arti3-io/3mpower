'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Icons } from './icons';
import { FilterDialogue } from './filter-dialogue';

import { Community } from '@/types/community';
import { CollectionDialogue } from './collection-dialogue';
import { ConditionCarousel } from './condition-carousel';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type CardProps = React.ComponentProps<typeof Card>;

export function CommunityCard({
  className,
  community,
  ...props
}: CardProps & {
  community: Community;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const getCount = async () => {
      const res = await fetch(`/api/lists/members/${community.list}/count`);
      const { count } = await res.json();
      setCount(count);
    };
    getCount();
  }, [community]);

  return (
    <Card {...props}>
      <CardContent className="grid gap-4">
        <div className="flex relative mt-6">
          <div
            className="overflow-hidden rounded-md border"
            style={{ height: '50px', width: '100%' }}
          >
            <img
              src={community.banner_url}
              className="w-full h-full object-cover"
              alt={community.name}
            />
          </div>
          <img
            src={community.profile_url}
            className="w-14 h-14 rounded-lg absolute top-4 left-2 border"
          />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="font-bold">{community.name} Twitter List</div>
          <div className="flex gap-2">
            <div className="flex items-center text-sm">
              <Icons.user className="mr-1 h-4 w-4" />
              {count}
            </div>
          </div>
        </div>
        <ConditionCarousel community={community} />
      </CardContent>
      <CardFooter className="flex gap-2 justify-between">
        <div className="gap-2 flex">
          <Link href={`/community/${community.id}`}>
            <Button>View</Button>
          </Link>
        </div>

        <FilterDialogue community={community} />
      </CardFooter>
    </Card>
  );
}

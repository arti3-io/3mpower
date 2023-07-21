'use client';
import Link from 'next/link';
import { Icons } from './icons';
import { Button } from './ui/button';

import { env } from '@/env.mjs';

export function Footer() {
  return (
    <div className="flex py-6 px-8 lg:px-40 justify-between flex-col md:flex-row items-center text-center gap-4">
      <div className="text-sm">
        Copyright © 2023. 3MPOWER. All rights reserved.
      </div>
      <div className="flex gap-1 items-center">
        <Link
          href={`http://twitter.com/${env.NEXT_PUBLIC_TWITTER_USERNAME}`}
          target="_blank"
        >
          <Button variant="ghost" size="icon">
            <Icons.twitter className="h-6 w-6" />
          </Button>
        </Link>
        <Link href={env.NEXT_PUBLIC_DISCORD_INVITE_URL} target="_blank">
          <Button variant="ghost" size="icon">
            <Icons.discord className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

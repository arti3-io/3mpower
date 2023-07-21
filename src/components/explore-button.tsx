'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';

export default function ExploreButton() {
  const { status } = useSession();
  return (
    <>
      {status === 'authenticated' ? (
        <Link href={'/#educate'}>
          <Button className="bg-gradient-to-br from-purple-500 to-cyan-500">
            Explore
          </Button>
        </Link>
      ) : (
        <Link href={'/signin'}>
          <Button className="bg-gradient-to-br from-purple-500 to-cyan-500">
            Sign in with Twitter
          </Button>
        </Link>
      )}
    </>
  );
}

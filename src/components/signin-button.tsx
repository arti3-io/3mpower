'use client';
import { signIn, useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Icons } from './icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBaseUrl } from '@/lib/utils';

export function Signin() {
  const [loading, setLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const handleSignin = async () => {
    setLoading(true);

    await signIn('twitter', {
      callbackUrl: `${getBaseUrl}/${from}`,
    });
    setLoading(false);
  };

  if (status === 'authenticated') {
    router.push('/');
  }

  return (
    <div>
      <Button
        type="button"
        disabled={loading}
        onClick={handleSignin}
        className="w-full"
      >
        {loading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.twitter className="mr-2 h-4 w-4" />
        )}{' '}
        Sign in
      </Button>
    </div>
  );
}

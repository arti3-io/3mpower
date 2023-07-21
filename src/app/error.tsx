'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Loading({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div
      className="h-screen justify-center items-center flex flex-col gap-4 md:px-40 px-8"
      style={{ height: 'calc(100vh - 104px)' }}
    >
      <h1 className="text-4xl font-semibold">Something went wrong</h1>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}

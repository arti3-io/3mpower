import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="h-screen justify-center items-center flex flex-col gap-4 md:px-40 px-8"
      style={{ height: 'calc(100vh - 104px)' }}
    >
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <span className="md:text-lg text-gray-400">
        Sorry, we couldn&apos;t find the page you were looking for.
      </span>
      <Link href="/">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}

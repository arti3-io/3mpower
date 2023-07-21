import { Metadata } from 'next';

import Link from 'next/link';

import { UserAuthForm } from './components/user-auth-form';
import { Icons } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to 3MPOWER.',
};

export default function AuthenticationPage() {
  return (
    <>
      <div
        className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-40"
        style={{ height: 'calc(100vh - 208px)' }}
      >
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Icons.community className="h-8 w-8 mr-2" />
            Empower, support, and connect.
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className=" text-gray-400">
                &ldquo;In a tapestry of hearts united, we empower each other,
                breaking barriers, embracing diversity, and nurturing growth.
                Together, we forge a future of strength, love, and freedom,
                creating a world where community thrives.&rdquo;
              </p>
              <footer className="text-sm">- Your friendly AI</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign in with Twitter
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in with your Twitter account to continue.
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  );
}

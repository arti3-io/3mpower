import { Metadata } from 'next';

import Link from 'next/link';

import { UserAuthForm } from './components/user-auth-form';
import { Icons } from '@/components/icons';
import { Tweet } from 'react-tweet';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to 3MPOWER.',
};

export default function AuthenticationPage() {
  return (
    <>
      <div
        className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-40"
        style={{ minHeight: 'calc(100vh - 208px)' }}
      >
        <div className="relative hidden custom-tweet lg:flex justify-center">
          <Tweet id="1681758529030602752" />
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign in with X
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in with your X account to join token-gated lists.
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  );
}

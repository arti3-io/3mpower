'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from './ui/label';

import { useSignMessage } from 'wagmi';
import { useAccount } from 'wagmi';
import { useSession } from 'next-auth/react';
import { ITwitterBindingRes } from '@/types/API';
export function VerifyWalletsDialogue({
  open,
  setOpen,
  setBindWallet,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  setBindWallet: (bindWallet: string) => void;
}) {
  const { address } = useAccount();
  const { data: session } = useSession();
  const { signMessage } = useSignMessage({
    message: `Binding wallet with ID: ${session?.user?.id}`,
    onSuccess: async (data) => {
      const res = await fetch(`/api/binding/twitter`, {
        method: 'POST',
        body: JSON.stringify({ signature: data }),
        headers: { 'Content-Type': 'application/json' },
      });
      const { bindWallet } = (await res.json()) as ITwitterBindingRes;

      setBindWallet(bindWallet);
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Verify Wallets</DialogTitle>
          <DialogDescription>
            Connect your wallets that you would like to use to access the token
            gated lists with.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="area">Your Wallet</Label>

            <div className="w-full">
              <Button className="w-full" variant="outline" disabled>
                <p className="text-sm font-normal leading-none">{address} </p>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="default"
              className="w-full"
              onClick={() => signMessage()}
            >
              Sign message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

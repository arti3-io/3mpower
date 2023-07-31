import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function SignInDialogue({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in to your account</DialogTitle>
          <DialogDescription>
            Choose the provider you want to use to sign in
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6">
          <Button variant="outline" className="w-full bg-twitter">
            <Icons.twitter className="mr-2 h-4 w-4" />
            Sign in with X
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

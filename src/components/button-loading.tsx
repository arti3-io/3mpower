import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ButtonLoading({ icon }: { icon?: boolean } = { icon: false }) {
  return (
    <Button disabled className="w-full">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {!icon && 'Please wait'}
    </Button>
  );
}

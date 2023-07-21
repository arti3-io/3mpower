import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Icons } from './icons';
import { Community } from '@/types/community';

export default function CollectionMenu({
  community,
}: {
  community: Community;
}) {
  const handleFollowList = () => {
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const options = `location,status,scrollbars,resizable,width=${width},height=${height},left=${left},top=${top}`;

    window.open(
      `https://twitter.com/i/lists/${community.list}`,
      'Popup',
      options
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon">
          <Icons.ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleFollowList}>Follow</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

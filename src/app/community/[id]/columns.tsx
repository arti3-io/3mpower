'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import moment from 'moment';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Member = {
  rank: number;
  id: string;
  name: string;
  profile_url: string;
  engagement: number;
  engagement_rank: number;
  joined_at: Date;
};

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'rank',
    header: () => <div>#</div>,
  },
  {
    accessorKey: 'profile_url',
    header: () => <div />,
    cell: ({ row }) => {
      const profile_url: string = row.getValue('profile_url');
      const name: string = row.getValue('name');
      return (
        <div className="flex items-center w-8 h-8">
          <Image
            className="rounded-full"
            src={profile_url}
            alt={name}
            width={32}
            height={32}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // {
  //   accessorKey: 'engagement_rank',
  //   header: ({ column }) => {
  //     return (
  //       <div className="flex justify-end">
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //         >
  //           Engagement Rank
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const engagement = parseFloat(row.getValue('engagement_rank'));
  //     return <div className="text-right font-medium">{engagement}</div>;
  //   },
  // },
  // {
  //   accessorKey: 'engagement',
  //   header: ({ column }) => {
  //     return (
  //       <div className="flex justify-end">
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //         >
  //           Engagement
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const engagement = parseFloat(row.getValue('engagement'));
  //     return <div className="text-right font-medium">{engagement}</div>;
  //   },
  // },
  {
    accessorKey: 'joined_at',
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Joined At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const joinedAt = moment(row.getValue('joined_at'));
      const currentDate = moment();
      const timeDifferenceInDays = currentDate.diff(joinedAt, 'days');

      return (
        <div className="text-right font-medium">
          {timeDifferenceInDays} days ago
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <Button size="xs" variant="outline">
          Follow
        </Button>
      );
    },
  },
];

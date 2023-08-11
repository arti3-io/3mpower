'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

import { ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { DataTableRowActions } from './data-table-row-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Member = {
  twitterUserId: string;
  twitterName: string;
  profile_url?: string;
  engagement: number;
  engagement_rank: number;
  updatedAt: Date;
  label: string;
  rank: number;
};

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'rank',
    header: () => <div>#</div>,
    cell: ({ row }) => {
      // if rank is 1 then use gold emoji
      // if rank is 2 then use silver emoji
      // if rank is 3 then use bronze emoji
      // else use rank number
      const rank: string =
        row.getValue('rank') === 1
          ? '🥇'
          : row.getValue('rank') === 2
          ? '🥈'
          : row.getValue('rank') === 3
          ? '🥉'
          : row.getValue('rank');

      return <div className="text-right font-medium">{rank}</div>;
    },
  },
  {
    accessorKey: 'profilePictureUrl',
    header: () => <div />,
    cell: ({ row }) => {
      const profile_url: string = row.getValue('profilePictureUrl');
      const name: string = row.getValue('twitterName');
      return (
        <div className="flex items-center w-8 h-8">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile_url && profile_url} alt={`@${name}`} />
            <AvatarFallback>3M</AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: 'twitterName',
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
    cell: ({ row }) => {
      return (
        <div className="w-[120px] overflow-hidden whitespace-nowrap text-ellipsis">
          {row.getValue('twitterName')}
        </div>
      );
    },
  },

  {
    accessorKey: 'twitterUserId',
    id: 'twitterUserId',
    header: () => <div />,
    cell: ({ row }) => {
      return (
        <Link
          href={`https://x.com/intent/user?user_id=${row.getValue(
            'twitterUserId'
          )}`}
          target="_blank"
        >
          <Button size="xs">Follow</Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'label',
    id: 'label',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Label
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const labelValue: string = row.getValue('label');
      return labelValue ? <Badge variant="outline">{labelValue}</Badge> : null;
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
  // {
  //   accessorKey: 'updatedAt',
  //   header: ({ column }) => {
  //     return (
  //       <div className="flex justify-end">
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //         >
  //           Joined
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const joinedAt = moment(row.getValue('updatedAt'));

  //     return <div className="text-right font-medium">{joinedAt.fromNow()}</div>;
  //   },
  // },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];

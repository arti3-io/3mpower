'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

import { ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';

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
  // {
  //   accessorKey: 'rank',
  //   header: () => <div>#</div>,
  // },
  {
    accessorKey: 'pfp',
    header: () => <div />,
    cell: ({ row }) => {
      const profile_url: string = row.getValue('pfp');
      const name: string = row.getValue('twitterName');
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
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Joined
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const joinedAt = moment(row.getValue('updatedAt'));

      return <div className="text-right font-medium">{joinedAt.fromNow()}</div>;
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
          <Button size="xs" variant="outline">
            Follow
          </Button>
        </Link>
      );
    },
  },
];

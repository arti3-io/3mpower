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
import { Icons } from '@/components/icons';

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
  previousRank: number;
};

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'rank',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rank: number = row.getValue('rank');
      const previousRank: number = row.getValue('previousRank');
      const rankChange: number = previousRank === 0 ? 0 : previousRank - rank;

      return (
        <div className="flex flex-col">
          <div>{rank}</div>
          <div className="text-xs flex">
            {rankChange === 0 ? (
              <div className="flex items-center">-</div>
            ) : rankChange < 0 ? (
              <div className="text-destructive flex items-center">
                {rankChange}
                <Icons.chevronDown className="w-4 h-4" />
              </div>
            ) : (
              <div className="text-green-500 flex items-center">
                {rankChange}
                <Icons.chevronUp className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'previousRank',
    enableHiding: false,
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
];

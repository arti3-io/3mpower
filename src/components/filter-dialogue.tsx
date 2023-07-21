'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';
import { Icons } from './icons';
import { motion } from 'framer-motion';

import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import Link from 'next/link';
import { Community } from '@/types/community';

export function FilterDialogue({ community }: { community: Community }) {
  const [searchUrl, setSearchUrl] = useState('');
  const [sort, setSort] = useState(false);

  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(today, -7),
    to: today,
  });

  const handleSortChange = (event: boolean) => {
    setSort(event);
  };

  const handleToday = () => {
    setDate({
      from: today,
      to: addDays(today, 1),
    });
  };

  const handleYesterday = () => {
    setDate({
      from: addDays(today, -1),
      to: today,
    });
  };

  const handleWeek = () => {
    setDate({
      from: addDays(today, -7),
      to: today,
    });
  };

  const handleDateChange = (event: string) => {
    if (event === 'today') {
      handleToday();
    } else if (event === 'yesterday') {
      handleYesterday();
    } else {
      handleWeek();
    }
  };

  useEffect(() => {
    const sorted = sort ? '&f=live' : '';

    const since = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const until = date?.to ? format(date.to, 'yyyy-MM-dd') : '';
    const dates = `since%3A${since}%20until%3A${until}`;

    const url = `https://twitter.com/search?q=list%3A${community.list}%20-filter%3Aretweets%20-filter%3Areplies%20${dates}&src=typed_query${sorted}`;
    setSearchUrl(url);
  }, [date, sort]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Icons.history className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{community.name}</DialogTitle>
          <DialogDescription>Curated Timelines</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="grid gap-2">
            <Label htmlFor="area">Date</Label>

            <RadioGroup
              defaultValue="week"
              className="grid grid-cols-3 gap-4"
              onValueChange={(value) => handleDateChange(value)}
            >
              <Label
                htmlFor="week"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="week" id="week" className="sr-only" />
                Week
              </Label>
              <Label
                htmlFor="today"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="today" id="today" className="sr-only" />
                Today
              </Label>
              <Label
                htmlFor="yesterday"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem
                  value="yesterday"
                  id="yesterday"
                  className="sr-only"
                />
                Yesterday
              </Label>
            </RadioGroup>
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="necessary" className="flex flex-col space-y-1">
              <span>Recent Tweets</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Sort by recent tweets to see what’s happening now
              </span>
            </Label>
            <Switch id="necessary" onCheckedChange={handleSortChange} />
          </div>
        </div>
        <DialogFooter>
          <Link href={searchUrl} target="_blank" className="w-full">
            <Button className="w-full">Search</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

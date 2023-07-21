'use client';

import Link from 'next/link';

import { Card } from './ui/card';

import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export const EventsBanner = ({
  event,
  community,
}: {
  event: any;
  community: any;
}) => {
  const hashtags = event.hashtags.join('%20').replaceAll('#', '%23') || '';

  const url = `https://twitter.com/search?q=list%3A${community?.list}%20${hashtags}%20-filter:replies%20-filter%3Aretweets%20until%3A${event.date.to}%20since%3A${event.date.from}&src=typed_query`;

  return (
    <Link href={url} target="_blank">
      <Card className="w-full bg-gradient-to-b from-slate-950 to-slate-900 border-slate-900 rounded-lg overflow-hidden">
        <div className="flex gap-2">
          <div>
            <Image
              src="https://i.imgur.com/8IZw7Md.png"
              width={110}
              height={110}
              style={{ objectFit: 'cover', height: '100%' }}
              alt="0n1force"
            />
          </div>
          <div className="flex p-4 items-center gap-4 justify-between w-full">
            <div className="flex flex-col -gap-1 md:gap-2">
              <span className="text-xs text-gray-400">
                {`${event.date.from} - ${event.date.to}`}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <h3 className="text-2xl font-semibold">
                      {event.title.slice(0, 14) + '...'}
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent>{event.title}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

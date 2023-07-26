'use client';

import { EventsBanner } from '@/components/events-banner';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Community } from '@/types/community';
import Image from 'next/image';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { MembersJoined, ActiveMembers } from './chart';
import { motion } from 'framer-motion';
import { formatNumber, getConditionTitleAndValue, truncate } from '@/lib/utils';
import Link from 'next/link';
import { FloorPrice } from '@/types/alchemy';
import { Skeleton } from '@/components/skeleton';

export default function Client({
  community, // data,
}: {
  community: Community;
  // data: any;
}) {
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRecentlyJoined, setLoadingRecentlyJoined] = useState(false);

  const [membersCount, setMembersCount] = useState();
  const [floorPrice, setFloorPrice] = useState<FloorPrice>();
  const [holders, setHolders] = useState<number>();
  const [metadata, setMetadata] = useState<any>();

  const today = new Date(); // Get the current date

  // Assuming community.events is an array of events
  // const closestEvent = community.events.reduce((closest, event) => {
  //   const eventDate = new Date(event.date.to);
  //   const timeDifference = eventDate - today;

  //   // Check if the event date is in the future and closer than the previously closest event
  //   if (
  //     timeDifference > 0 &&
  //     (closest === null || timeDifference < closest.timeDifference)
  //   ) {
  //     return { event, timeDifference };
  //   }
  //   return closest;
  // }, null);2

  useEffect(() => {
    const getRecentMembers = async () => {
      setLoadingRecentlyJoined(true);
      const res = await fetch(
        `/api/lists/members/${community.list}/recent?limit=6`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await res.json();

      const memberPromises = data.members.map(async (member: any) => {
        const res = await fetch(
          `/api/nft/${community.contractAddr}/${member.tokenId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const token = await res.json();
        return { ...member, media: token.media };
      });
      const members = await Promise.all(memberPromises);
      await setRecentMembers(members);
      setLoadingRecentlyJoined(false);
    };

    getRecentMembers();
  }, []);

  useEffect(() => {
    const getAllMembers = async () => {
      setLoading(true);
      const res = await fetch(`/api/lists/members/${community.list}/recent`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      const memberPromises = data.members.map(async (member: any) => {
        const res = await fetch(
          `/api/nft/${community.contractAddr}/${member.tokenId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const token = await res.json();
        return { ...member, pfp: token.media[0].thumbnail };
      });
      const members = await Promise.all(memberPromises);
      await setMembers(members);
      setLoading(false);
    };
    getAllMembers();
  }, [showMembers]);

  useEffect(() => {
    const getContractMetadata = async () => {
      const res = await fetch(
        `/api/nft/contractMetadata?address=${community.contractAddr}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await res.json();
      setFloorPrice(data.floorPrice);
      setHolders(data.holders);
      setMetadata(data.contractMetadata);
    };

    const getMembersCount = async () => {
      const res = await fetch(`/api/lists/members/${community.list}/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setMembersCount(data.count);
    };
    getContractMetadata();
    getMembersCount();
  }, []);

  return (
    <div className="min-w-screen grid grid-cols-12 lg:px-40 px-8 py-4 gap-8">
      <div className="col-span-8 flex flex-col">
        <div className="flex items-center gap-4 justify-between">
          <div className="flex gap-4 items-center">
            <Image
              src={community.profile_url}
              alt={community.id}
              width={56}
              height={56}
              className="rounded-full"
            />
            <h1 className="text-4xl font-bold">{community.name}</h1>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {metadata?.openSea?.discordUrl && (
              <Link href={metadata.openSea.discordUrl} target="_blank">
                <Button size="icon" variant="outline">
                  <Icons.discord className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link href="">
              <Button size="icon" variant="outline">
                <Icons.twitter className="h-4 w-4" />
              </Button>
            </Link>
            {metadata?.openSea?.externalUrl && (
              <Link href={metadata.openSea.externalUrl} target="_blank">
                <Button size="icon" variant="outline">
                  <Icons.web className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {floorPrice?.openSea?.collectionUrl && (
              <Link href={floorPrice?.openSea?.collectionUrl} target="_blank">
                <Button size="icon" variant="outline">
                  <Icons.opensea className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          {truncate(280, metadata?.openSea?.description)}
        </div>
        <div className="flex gap-4 items-center mt-4">
          <Card>
            <div className="px-4 py-2 flex flex-col">
              <div className="flex items-center">
                <Icons.join className="mr-1 h-3 w-3" />
                <span className="bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
                  69
                </span>
              </div>
              <div className="text-xs text-muted-foreground">30d Joins</div>
            </div>
          </Card>
          <Card>
            <div className="px-4 py-2 flex flex-col">
              <div className="flex items-center">
                <Icons.activity className="mr-1 h-3 w-3" />
                <span className="bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
                  69
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </Card>
          <Card>
            <div className="px-4 py-2 flex flex-col">
              <div className="flex items-center">
                <Icons.user className="mr-1 h-3 w-3" />
                <span className="bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
                  {membersCount ? formatNumber(membersCount) : <Skeleton />}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Members</div>
            </div>
          </Card>
          <Card className="hidden md:inline-block">
            <div className="px-4 py-2 flex flex-col">
              <div className="flex items-center">
                <Icons.holder className="mr-1 h-3 w-3" />
                <span className="bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
                  {holders ? formatNumber(holders) : <Skeleton />}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Holders</div>
            </div>
          </Card>
          <Card>
            <div className="px-4 py-2 flex flex-col">
              <div className="flex items-center">
                <Icons.eth className="mr-1 h-3 w-3" />
                <span className="bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
                  {floorPrice ? (
                    `${floorPrice?.openSea.floorPrice.toFixed(2)} ${floorPrice
                      ?.openSea.priceCurrency}`
                  ) : (
                    <Skeleton />
                  )}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Floor</div>
            </div>
          </Card>
        </div>

        <div className="flex items-center gap-2 mt-8">
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="home" className="gap-2 items-center w-full">
                <Icons.home className="w-4 h-4" />
                Home
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="gap-2 items-center w-full"
                onClick={() => setShowMembers(true)}
              >
                <Icons.community className="w-4 h-4" />
                Members
              </TabsTrigger>
              <TabsTrigger
                value="conditions"
                className="gap-2 items-center w-full"
              >
                <Icons.conditions className="w-4 h-4" />
                Conditions
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2 items-center w-full">
                <Icons.event className="w-4 h-4" />
                Events
              </TabsTrigger>
            </TabsList>
            <TabsContent value="home">
              <h1 className="text-xl font-bold bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
                Recently Joined
              </h1>
              {loadingRecentlyJoined ? (
                <p className="text-muted-foreground mt-4">Loading...</p>
              ) : (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {recentMembers.map((member, index) => (
                    <div
                      className="flex col-span-2 lg:col-span-2 gap-2 items-center justify-between"
                      key={index}
                    >
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="ghost"
                          className="relative h-10 w-10 rounded-full"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={member?.media[0]?.thumbnail}
                              alt={`@${member.twitterId}`}
                            />
                            <AvatarFallback>3M</AvatarFallback>
                          </Avatar>
                        </Button>
                        <div className="flex flex-col">
                          <div>{member.twitterName}</div>
                          <div className="text-sm text-muted-foreground">
                            #{member.tokenId}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <Button
                          size="xs"
                          variant="outline"
                          // onClick={() => handleFollowUser(member)}
                        >
                          Follow
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="members">
              <DataTable columns={columns} data={members} loading={loading} />
            </TabsContent>
            <TabsContent value="conditions">
              {community.conditions.map((condition, index) => {
                const { title, value } = getConditionTitleAndValue(condition);
                return (
                  <motion.div
                    key={index}
                    className="grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0 absolute"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Display the current condition */}
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium leading-none">{title}</p>
                      {condition.type === 'balance' ? (
                        <Link
                          href={`https://opensea.io/assets/ethereum/${condition.contractAddr}`}
                          target={'_blank'}
                        >
                          <p className="text-sm text-muted-foreground underline">
                            {value}
                          </p>
                        </Link>
                      ) : (
                        <p className="text-sm text-muted-foreground">{value}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </TabsContent>
            <TabsContent value="events">
              <div className="grid grid-cols-2 gap-4">
                {community.events.map((event, index) => (
                  <div className="col-span-2 lg:col-span-1" key={index}>
                    <EventsBanner event={event} community={community} />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="col-span-4 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-bold bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
            Weekly Top Tweets
          </h1>
          {Array.from({ length: 3 }).map((_, index) => (
            <TweetCard key={index} />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-bold bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
            Upcoming event
          </h1>
          {/* {closestEvent ? (
            <EventsBanner community={community} event={closestEvent} />
          ) : ( */}
          <p className="text-muted-foreground">No upcoming events</p>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}

const TweetCard = () => {
  return (
    <Card>
      <div className="px-4 py-2 flex gap-2">
        <div className="flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt="" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-2">
            <div className="font-bold">John Doe</div>
            <div className="text-muted-foreground">@johndoe</div>
            <div className="text-muted-foreground">· Jul 21</div>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed
            feugiat sapien.
          </p>
        </div>
      </div>
    </Card>
  );
};

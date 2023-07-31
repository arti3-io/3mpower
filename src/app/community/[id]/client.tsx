'use client';

import { EventsBanner } from '@/components/events-banner';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Community } from '@/types/community';
import Image from 'next/image';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useEffect, useState } from 'react';

import { formatNumber, getConditionTitleAndValue, truncate } from '@/lib/utils';
import Link from 'next/link';
import { FloorPrice } from '@/types/alchemy';
import { Skeleton, SkeletonUser } from '@/components/skeleton';
import { toast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { ButtonLoading } from '@/components/button-loading';
import { useModal } from 'connectkit';
import { useAccount } from 'wagmi';
import { SigninNav } from '@/components/signin-nav';
import { useSession } from 'next-auth/react';
import { VerifyWalletsDialogue } from '@/components/verify-wallets-dialogue';
import { Tweet } from 'react-tweet';

export default function Client({ community }: { community: Community }) {
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [activeMembers, setActiveMembers] = useState<string>();
  const [monthlyJoins, setMonthlyJoins] = useState<string>();
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRecentlyJoined, setLoadingRecentlyJoined] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [topTweets, setTopTweets] = useState<any[]>([]);

  const [membersCount, setMembersCount] = useState();
  const [floorPrice, setFloorPrice] = useState<FloorPrice>();
  const [holders, setHolders] = useState<number>();
  const [metadata, setMetadata] = useState<any>();

  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState<
    'not-joined' | 'joined' | 'processing'
  >('not-joined');
  const { openProfile } = useModal();
  const [bindWallet, setBindWallet] = useState('');
  const [verifyWalletsOpen, setVerifyWalletsOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: session, status } = useSession();

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
    const getTopTweets = async () => {
      setLoadingRecentlyJoined(true);
      const res = await fetch(`/api/lists/tweets/${community.list}/top`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      await setTopTweets(data);
    };

    getTopTweets();
  }, []);

  useEffect(() => {
    const getActiveMembers = async () => {
      const res = await fetch(`/api/lists/stats/${community.list}/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const active = await res.json();
      await setActiveMembers(active.count);
    };
    getActiveMembers();
  }, []);

  useEffect(() => {
    const getMonthlyJoins = async () => {
      const res = await fetch(`/api/lists/stats/${community.list}/joins`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const joins = await res.json();
      await setMonthlyJoins(joins.count);
    };

    getMonthlyJoins();
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

      const chunkSize = 10;
      const memberChunks = [];
      for (let i = 0; i < data.members.length; i += chunkSize) {
        memberChunks.push(data.members.slice(i, i + chunkSize));
      }

      const processChunk = async (chunk: any) => {
        const memberPromises = chunk.map(async (member: any) => {
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
        return Promise.all(memberPromises);
      };

      const members = [];
      for (let i = 0; i < memberChunks.length; i++) {
        const chunk = memberChunks[i];
        const processedChunk = await processChunk(chunk);
        members.push(...processedChunk);

        // Introduce a delay of 100 milliseconds (10 requests per second)
        if (i < memberChunks.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

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

  const handleFollowUser = (member: {
    twitterName: string;
    twitterUserId: string;
    avatar: string;
  }) => {
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const options = `location,status,scrollbars,resizable,width=${width},height=${height},left=${left},top=${top}`;

    window.open(
      `https://twitter.com/intent/user?user_id=${member.twitterUserId}`,
      'Popup',
      options
    );
  };

  const handleJoin = async () => {
    if (!isConnected && !bindWallet) {
      openProfile();
      return;
    } else if (!bindWallet) {
      setVerifyWalletsOpen(true);
      return;
    }
    setLoading(true);
    const res = await fetch('/api/lists/join', {
      method: 'POST',
      body: JSON.stringify({
        twitterListId: community.list,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      await toast({
        title: 'Success',
        description: data.msg,
        action: (
          <ToastAction altText="Follow list" onClick={handleFollowList}>
            Follow list
          </ToastAction>
        ),
      });
      setShow(false);
    } else {
      await toast({
        title: 'Uh oh! Something went wrong.',
        description: data.msg || 'Please try again later.',
        variant: 'destructive',
      });
    }
    setLoading(false);
    setProgress('processing');
  };

  const renderSkeletonUsers = () => {
    const skeletonCount = 6;
    const skeletons = [];

    for (let i = 0; i < skeletonCount; i++) {
      skeletons.push(
        <div className="col-span-2 lg:col-span-1 gap-2">
          <SkeletonUser key={i} />
        </div>
      );
    }

    return skeletons;
  };

  return (
    <div className="grid grid-cols-12 lg:px-40 py-4 gap-8">
      <div className="col-span-12 lg:col-span-8 flex flex-col">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
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
            {metadata?.openSea?.twitterUsername && (
              <Link
                href={`https://x.com/${metadata.openSea.twitterUsername}`}
                target="_blank"
              >
                <Button size="icon" variant="outline">
                  <Icons.twitter className="h-4 w-4" />
                </Button>
              </Link>
            )}
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
            <div className="hidden md:flex gap-2 w-full">
              {!session ? (
                <SigninNav text="Sign in to join list" className="w-full" />
              ) : (
                <>
                  {!isConnected ? (
                    <Button onClick={handleJoin} className="w-full">
                      Connect Wallet
                    </Button>
                  ) : !bindWallet ? (
                    <Button onClick={handleJoin} className="w-full">
                      Sign Message
                    </Button>
                  ) : (
                    <RegisterProcess
                      loading={loading}
                      progress={progress}
                      handleJoin={handleJoin}
                    />
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex md:hidden gap-2 w-full">
            {!session ? (
              <SigninNav text="Sign in to join list" className="w-full" />
            ) : (
              <>
                {!isConnected ? (
                  <Button onClick={handleJoin} className="w-full">
                    Connect Wallet
                  </Button>
                ) : !bindWallet ? (
                  <Button onClick={handleJoin} className="w-full">
                    Sign Message
                  </Button>
                ) : (
                  <RegisterProcess
                    loading={loading}
                    progress={progress}
                    handleJoin={handleJoin}
                  />
                )}
              </>
            )}
          </div>
        </div>
        {metadata?.openSea?.description && (
          <div className="hidden md:flex flex-col gap-2 mt-4 text-muted-foreground px-4">
            {readMore
              ? metadata?.openSea?.description
              : truncate(200, metadata?.openSea?.description)}
            <div>
              <Button
                size="xs"
                variant="link"
                onClick={() => setReadMore(!readMore)}
                className="px-0"
              >
                Read more
              </Button>
            </div>
          </div>
        )}
        <div className="grid md:flex grid-cols-12 gap-4 items-center mt-4 px-4">
          <Card className="col-span-6">
            <div className="px-4 py-2 flex flex-col">
              <div className="flex items-center">
                <Icons.join className="mr-1 h-3 w-3" />
                <span className="bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
                  {monthlyJoins ? formatNumber(monthlyJoins) : <Skeleton />}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">30d Joins</div>
            </div>
          </Card>
          <Card className="col-span-6">
            <div className="px-4 py-2 flex flex-col">
              <div className="flex items-center">
                <Icons.activity className="mr-1 h-3 w-3" />
                <span className="bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
                  {activeMembers ? formatNumber(activeMembers) : <Skeleton />}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </Card>
          <Card className="col-span-6">
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
          <Card className="col-span-6">
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
        <div className="flex items-center gap-2 mt-8 px-4">
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="home" className="gap-2 items-center w-full">
                <Icons.home className="w-4 h-4" />
                <span className="hidden md:inline-block">Home</span>
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="gap-2 items-center w-full"
                onClick={() => setShowMembers(true)}
              >
                <Icons.community className="w-4 h-4" />
                <span className="hidden md:inline-block">Members</span>
              </TabsTrigger>
              <TabsTrigger
                value="conditions"
                className="gap-2 items-center w-full"
              >
                <Icons.conditions className="w-4 h-4" />
                <span className="hidden md:inline-block">Conditions</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2 items-center w-full">
                <Icons.event className="w-4 h-4" />
                <span className="hidden md:inline-block">Events</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="home">
              <h1 className="text-xl font-bold">Recently Joined</h1>
              {loadingRecentlyJoined ? (
                <p className="text-muted-foreground mt-4">Loading...</p>
              ) : (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {recentMembers.map((member, index) => (
                    <div
                      className="flex col-span-4 md:col-span-2 gap-2 items-center justify-between"
                      key={index}
                    >
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="ghost"
                          className="relative h-10 w-10 rounded-full"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={member.media && member?.media[0]?.thumbnail}
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
                          onClick={() => handleFollowUser(member)}
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
                  <div
                    key={index}
                    className="grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
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
                  </div>
                );
              })}
            </TabsContent>
            <TabsContent value="events">
              {community.events.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {community.events.map((event, index) => (
                    <div className="col-span-2 lg:col-span-1" key={index}>
                      <EventsBanner event={event} community={community} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No events</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-8  px-4">
        {/* <div className="flex flex-col gap-3">
          <h1 className="text-xl font-bold bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
            Upcoming event
          </h1>
          {closestEvent ? (
            <EventsBanner community={community} event={closestEvent} />
          ) : (
            <p className="text-muted-foreground">No upcoming events</p>
          )}
        </div> */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold bg-gradient-to-br text-transparent bg-clip-text from-purple-500 to-cyan-500">
            Weekly Top Tweets
          </h1>
          <div className="gap-4">
            {topTweets.length > 0 ? (
              topTweets.map((tweet, index) => (
                <div className="custom-tweet" key={index}>
                  <Tweet id={tweet.tweetId} />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground mt-4">No top tweets</p>
            )}
          </div>
        </div>
      </div>
      <VerifyWalletsDialogue
        open={verifyWalletsOpen}
        setOpen={setVerifyWalletsOpen}
        setBindWallet={setBindWallet}
      />
    </div>
  );
}

const RegisterProcess = ({
  loading,
  progress,
  handleJoin,
}: {
  loading: boolean;
  progress: 'not-joined' | 'joined' | 'processing';
  handleJoin: () => void;
}) => {
  switch (progress) {
    case 'not-joined':
      return (
        <>
          {!loading ? (
            <Button onClick={handleJoin} className="w-full">
              Join List
            </Button>
          ) : (
            <ButtonLoading />
          )}
        </>
      );
    case 'joined':
      return (
        <Button
          onClick={handleJoin}
          className="w-full"
          variant="outline"
          disabled
        >
          Joined
        </Button>
      );
    case 'processing':
      return (
        <Button onClick={handleJoin} className="w-full" disabled>
          Processing
        </Button>
      );
    default:
      return null;
  }
};

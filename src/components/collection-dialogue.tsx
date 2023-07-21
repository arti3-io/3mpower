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

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Icons } from './icons';

import { Community } from '@/types/community';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';

import Link from 'next/link';
import { formatNumber, getConditionTitleAndValue } from '@/lib/utils';

import { useEffect, useState } from 'react';
import { FloorPrice } from '@/types/alchemy';
import { Skeleton, SkeletonUser } from './skeleton';
import { toast } from './ui/use-toast';
import { ToastAction } from './ui/toast';
import { ButtonLoading } from './button-loading';
import { useSession } from 'next-auth/react';
import { SigninNav } from './signin-nav';

import { Label } from './ui/label';
import { Switch } from './ui/switch';

import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useModal } from 'connectkit';
import { VerifyWalletsDialogue } from './verify-wallets-dialogue';
import { EventsBanner } from './events-banner';
import CollectionMenu from './collection-menu';

export function CollectionDialogue({
  community,
  children,
}: {
  community: Community;
  children: React.ReactNode;
}) {
  const [floorPrice, setFloorPrice] = useState<FloorPrice>();
  const [holders, setHolders] = useState<number>();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<
    'not-joined' | 'joined' | 'processing'
  >('not-joined');

  const [randomMembers, setRandomMembers] = useState<any[]>([]);
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [showRecentMembers, setShowRecentMembers] = useState(false);
  const [membersCount, setMembersCount] = useState();

  const [verifyWalletsOpen, setVerifyWalletsOpen] = useState(false);
  const { data: session, status } = useSession();
  const { address, isConnected } = useAccount();
  const { openProfile } = useModal();
  const [bindWallet, setBindWallet] = useState('');

  useEffect(() => {
    const getQueue = async () => {
      const res = await fetch(
        `/api/lists/members/${community.list}/${session?.user.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();

      if (!data.member) {
        const res = await fetch(
          `/api/lists/queue/${community.list}/${session?.user.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await res.json();
        if (data.queue) {
          setProgress('processing');
        } else {
          setProgress('not-joined');
        }
      } else {
        setProgress('joined');
      }
    };
    getQueue();
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      setBindWallet(session?.user?.bindWallet);
    }
  }, [status]);

  useEffect(() => {
    const getRecentMembers = async () => {
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
        return { ...member, media: token.media };
      });
      const members = await Promise.all(memberPromises);
      await setRecentMembers(members);
    };

    if (showRecentMembers) {
      getRecentMembers();
    }
  }, [showRecentMembers]);

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
    };
    const getMembers = async () => {
      const res = await fetch(`/api/lists/members/${community.list}`, {
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
        return { ...member, media: token.media, tokenId: token.tokenId };
      });
      const members = await Promise.all(memberPromises);
      await setRandomMembers(members);
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

    if (show) {
      getContractMetadata();
      getMembers();
      getMembersCount();
    }
  }, [show]);

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
    <Dialog>
      <DialogTrigger asChild onClick={() => setShow(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex relative mb-10">
            <div
              className="overflow-hidden rounded-md border"
              style={{ height: '100px', width: '100%' }}
            >
              <img
                src={community.banner_url}
                className="w-full h-full object-cover"
                alt={community.name}
              />
            </div>
            <img
              src={community.profile_url}
              className="w-16 h-16 rounded-lg absolute top-16 left-2 border"
            />
            <div className="flex absolute top-16 right-2 gap-2">
              <Card>
                <div className="px-4 py-2 flex flex-col">
                  <div className="flex items-center">
                    <Icons.user className="mr-1 h-3 w-3" />
                    {membersCount ? formatNumber(membersCount) : <Skeleton />}
                  </div>
                  <div className="text-xs text-gray-500">Members</div>
                </div>
              </Card>
              <Card className="hidden md:inline-block">
                <div className="px-4 py-2 flex flex-col">
                  <div className="flex items-center">
                    <Icons.holder className="mr-1 h-3 w-3" />
                    {holders ? formatNumber(holders) : <Skeleton />}
                  </div>
                  <div className="text-xs text-gray-500">Holders</div>
                </div>
              </Card>
              <Card>
                <div className="px-4 py-2 flex flex-col">
                  <div className="flex items-center">
                    <Icons.eth className="mr-1 h-3 w-3" />
                    {floorPrice ? (
                      `${floorPrice?.openSea.floorPrice.toFixed(2)} ${floorPrice
                        ?.openSea.priceCurrency}`
                    ) : (
                      <Skeleton />
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Floor</div>
                </div>
              </Card>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2 w-3/4">
              <DialogTitle className="text-left">{community.name}</DialogTitle>
              <DialogDescription className="text-left">
                Join this token-gated Twitter list to get added to the custom
                feed to easier support each other.
              </DialogDescription>
            </div>
            <CollectionMenu community={community} />
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-8 justify-between">
          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="members" className="gap-2 items-center">
                <Icons.community className="w-4 h-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="conditions" className="gap-2 items-center">
                <Icons.conditions className="w-4 h-4" />
                Conditions
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2 items-center">
                <Icons.event className="w-4 h-4" />
                Events
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="members"
              className="h-[240px] overflow-scroll mt-6 gap-4"
            >
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="necessary" className="flex flex-col space-y-1">
                  <span>Show Recently Joined Members</span>
                </Label>
                <Switch
                  id="necessary"
                  onCheckedChange={() =>
                    setShowRecentMembers(!showRecentMembers)
                  }
                />
              </div>
              {showRecentMembers ? (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {recentMembers.length > 0 ? (
                    <>
                      {recentMembers.map((member, index) => (
                        <div
                          className="flex col-span-2 lg:col-span-1 gap-2 items-center justify-between"
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
                              <div className="text-sm text-gray-500">
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
                    </>
                  ) : (
                    <>
                      {membersCount == 0 ? (
                        <div className="text-gray-500 text-sm">
                          No members yet
                        </div>
                      ) : (
                        renderSkeletonUsers()
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {randomMembers.length > 0 ? (
                    <>
                      {randomMembers.map((member, index) => (
                        <div
                          className="flex col-span-2 lg:col-span-1 gap-2 items-center justify-between"
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
                              <div className="text-sm text-gray-500">
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
                    </>
                  ) : (
                    <>
                      {membersCount == 0 ? (
                        <div className="text-gray-500 text-sm">
                          No members yet
                        </div>
                      ) : (
                        renderSkeletonUsers()
                      )}
                    </>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="conditions"
              className="min-h-[240px] overflow-scroll mt-6 gap-4"
            >
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
            <TabsContent
              value="events"
              className="min-h-[240px] overflow-scroll mt-6 gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                {community.events.map((event, index) => (
                  <div className="col-span-2" key={index}>
                    <EventsBanner event={event} community={community} />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <div className="flex gap-2 w-full">
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
        </DialogFooter>
      </DialogContent>
      <VerifyWalletsDialogue
        open={verifyWalletsOpen}
        setOpen={setVerifyWalletsOpen}
        setBindWallet={setBindWallet}
      />
    </Dialog>
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

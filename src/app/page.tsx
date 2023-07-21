import { CommunityCard } from '@/components/community-card';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

import { FeaturedBanner } from '@/components/featured-banner';
import Link from 'next/link';

import { env } from '@/env.mjs';

import { get } from '@vercel/edge-config';
import { Community } from '@/types/community';
import FeaturedCollections from '@/components/featured-collections';
import SplineArt from '@/components/spline-art';
import ScrollDownIndicator from '@/components/scroll-down';
import ShowCase from '@/components/showcase';
import TopCommunities from '@/components/top-communities';
import ExploreButton from '@/components/explore-button';

// testing linear

export default async function Home() {
  const communities: Community[] = (await get('communities')) || [];
  return (
    <div>
      <div
        className="h-screen justify-center items-center grid grid-cols-12 gap-4 md:px-40 px-8"
        style={{ height: 'calc(100vh - 104px)' }}
      >
        <div className="relative z-20 col-span-12 lg:col-span-6">
          <FeaturedCollections communities={communities} />
          <h1 className="text-4xl md:text-6xl font-extrabold md:text-center lg:text-left">
            EMPOWER YOUR COMMUNITY
          </h1>
          <p className="text-sm md:text-center lg:text-left text-gray-500 mt-4">
            Connect, engage, and grow your community, start by simply signing in
            with Twitter, connect your wallet and join token-gate Twitter lists
            below.
          </p>
          <div className="flex justify-center lg:justify-normal mt-8 gap-4">
            <ExploreButton />
            <Link href={env.NEXT_PUBLIC_DISCORD_INVITE_URL} target="_blank">
              <Button variant="outline">Contact</Button>
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6 col-span-12 h-full hidden lg:flex">
          <SplineArt />
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <ScrollDownIndicator />
        </div>
      </div>
      <div className="min-w:h-screen flex flex-col lg:px-40 px-8 py-4 gap-24">
        <div className="flex flex-col">
          <div className="w-full flex justify-between">
            <h1 className="text-xl md:text-3xl font-extrabold">
              Top Communities
            </h1>
          </div>
          <div className="grid grid-cols-12 gap-4 mt-8">
            <TopCommunities communities={communities} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="w-full flex flex-col text-center gap-4" id="educate">
            <h1 className="md:text-3xl text-2xl font-extrabold bg-gradient-to-br from-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Connect
            </h1>
            <h1 className="md:text-6xl text-4xl font-extrabold">
              Building Deeper Connections
            </h1>
            <p className="text-md text-center text-gray-500 max-w-screen-sm mx-auto">
              Foster meaningful connections with your community through curated
              Twitter lists and interactive initiatives. Enhance engagement,
              nurture relationships, and create a thriving community ecosystem
              that fosters collaboration, support, and growth.
            </p>
          </div>
          <div className="w-full grid grid-cols-12 gap-4 mt-24">
            <div className="col-span-12 lg:col-span-6 gap-8 flex flex-col">
              <div>
                <div className="p-2 bg-gray-800 inline-block rounded-lg">
                  <Icons.add />
                </div>
                <h1 className="text-2xl font-bold">
                  Experience Token-Gated Curated Twitter Lists
                </h1>
                <p className="text-md text-gray-500 mt-4">
                  Discover and stay connected with your beloved communities on
                  Twitter through our innovative token-gated lists. Immerse
                  yourself in the platform you love while seamlessly exploring
                  curated content and fostering meaningful connections.
                </p>
              </div>
              <div>
                <div className="p-2 bg-gray-800 inline-block rounded-lg">
                  <Icons.community />
                </div>
                <h1 className="text-2xl font-bold">
                  Seamlessly Engage with Your Community on Twitter
                </h1>
                <p className="text-md text-gray-500 mt-4">
                  Interact effortlessly with your community directly on Twitter
                  using our token-gated lists. Leave the worry of identifying
                  real holders to us as we ensure authenticity. Explore curated
                  timelines effortlessly, scrolling through carefully selected
                  content that resonates with your interests.
                </p>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 hidden lg:inline-block relative">
              <ShowCase />
            </div>
          </div>
        </div>
      </div>
      <FeaturedBanner communities={communities} />
    </div>
  );
}

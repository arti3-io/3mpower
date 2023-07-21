import { NextResponse } from 'next/server';
import { alchemy } from '@/lib/sdk';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contractAddress = searchParams.get('address');

  if (!contractAddress) {
    return NextResponse.json(
      {
        error: 'Missing required parameter: address',
      },
      { status: 400 }
    );
  }

  const [floorPrice, holders] = await Promise.all([
    alchemy.nft.getFloorPrice(contractAddress),
    alchemy.nft.getOwnersForContract(contractAddress),
  ]);

  return NextResponse.json(
    { floorPrice, holders: holders.owners.length },
    { status: 200 }
  );
}

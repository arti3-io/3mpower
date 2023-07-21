import { NextResponse } from 'next/server';
import { alchemy } from '@/lib/sdk';

const resBuilder = (data: any, status: number = 200) => {
  if (status === 200) {
    return NextResponse.json(data, { status });
  }
  return NextResponse.json({ error: data }, { status });
};

export async function GET(
  request: Request,
  { params }: { params: { address: string; id: string } }
) {
  const address = params.address;
  const id = params.id;

  if (!address || !id) {
    return NextResponse.json(
      {
        error: 'Missing required parameter: address',
      },
      { status: 400 }
    );
  }

  const metadata = await alchemy.nft.getNftMetadata(address, id, {});

  return resBuilder(metadata);
}

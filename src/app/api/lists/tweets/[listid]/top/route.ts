import { NextResponse } from 'next/server';
import * as TopTweetsModel from '@/models/TopTweets';

const resBuilder = (data: any, status: number = 200) => {
  if (status === 200) {
    return NextResponse.json(data, { status });
  }
  return NextResponse.json({ error: data }, { status });
};

export async function GET(
  request: Request,
  { params }: { params: { listid: string } }
) {
  const listId = params.listid;

  if (!listId) {
    return resBuilder('Missing list id', 400);
  }

  const tweets = (await TopTweetsModel.getTopTweetsByList(listId)) || [];

  if (!tweets) {
    return resBuilder({ message: 'No data found' }, 404);
  }

  return resBuilder(tweets);
}

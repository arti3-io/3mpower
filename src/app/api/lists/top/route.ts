import { NextResponse } from 'next/server';
import * as ListMembersModel from '@/models/ListMembers';

const resBuilder = (data: any, status: number = 200) => {
  if (status === 200) {
    return NextResponse.json(data, { status });
  }
  return NextResponse.json({ error: data }, { status });
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');

    let lists;
    if (limitParam) {
      const limit = parseInt(limitParam);
      lists = await ListMembersModel.getTopLists(limit);
    } else {
      lists = await ListMembersModel.getTopLists();
    }

    if (!lists || lists.length === 0) {
      return resBuilder({ lists: [] });
    }

    return resBuilder({ lists });
  } catch (error) {
    console.error('Error fetching top lists:', error);
    return resBuilder({ error: 'Failed to fetch top lists' }, 500);
  }
}

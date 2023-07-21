import { NextResponse } from 'next/server';
import * as ListMembersModel from '@/models/ListMembers';

const resBuilder = (data: any, status: number = 200) => {
  if (status === 200) {
    return NextResponse.json(data, { status });
  }
  return NextResponse.json({ error: data }, { status });
};

export async function GET() {
  try {
    const lists = await ListMembersModel.getRecentLists();

    if (!lists || lists.length === 0) {
      return resBuilder({ lists: [] });
    }

    return resBuilder({ lists });
  } catch (error) {
    console.error('Error fetching recent lists:', error);
    return resBuilder({ error: 'Failed to fetch recent lists' }, 500);
  }
}

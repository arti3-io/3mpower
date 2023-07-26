import { NextResponse } from 'next/server';
import * as ListMembersModel from '@/models/ListMembers';

const resBuilder = (data: any, status: number = 200) => {
  if (status === 200) {
    return NextResponse.json(data, { status });
  }
  return NextResponse.json({ error: data }, { status });
};

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const listId = params.slug;
  const { searchParams } = new URL(request.url);

  const limit = searchParams.get('limit')
    ? parseInt(searchParams.get('limit') as string)
    : undefined;

  if (!listId) {
    return resBuilder('Missing list id', 400);
  }

  const members = await ListMembersModel.getMembersFromList(listId, limit);
  const countData = await ListMembersModel.getMembersCountFromList(listId);

  if (!members || members.length === 0) {
    return resBuilder({ members: [], count: 0 });
  }

  return resBuilder({ members, count: countData[0].count });
}

import { NextResponse } from 'next/server';
import * as ListMembersModel from '@/models/ListMembers';
import * as AccountsModel from '@/models/Accounts';

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

  if (!listId) {
    return resBuilder('Missing list id', 400);
  }

  const data = await ListMembersModel.getMembersCountFromList(listId);

  if (!data) {
    return resBuilder({ count: 0 });
  }

  return resBuilder({ count: data[0].count });
}

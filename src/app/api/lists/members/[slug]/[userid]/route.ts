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
  { params }: { params: { slug: string; userid: string } }
) {
  const listId = params.slug;
  const userId = params.userid;

  if (!listId || !userId) {
    return resBuilder('Missing list id or user id', 400);
  }

  const member = await ListMembersModel.getMemberInfo(listId, userId);

  if (!member) {
    return resBuilder('User not found', 404);
  }

  return resBuilder({ member });
}

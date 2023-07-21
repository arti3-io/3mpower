import { NextResponse } from 'next/server';
import * as QueueModel from '@/models/joinQueue';

const resBuilder = (data: any, status: number = 200) => {
  if (status === 200) {
    return NextResponse.json(data, { status });
  }
  return NextResponse.json({ error: data }, { status });
};

export async function GET(
  request: Request,
  { params }: { params: { listid: string; userid: string } }
) {
  const listId = params.listid;
  const userid = params.userid;

  if (!listId || !userid) {
    return resBuilder('Missing list id or user id', 400);
  }
  const data = await QueueModel.getQueue(listId, userid);

  if (!data) {
    return resBuilder({ message: 'Queue not found' }, 404);
  }

  return resBuilder({ queue: true });
}

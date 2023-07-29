import { NextResponse } from 'next/server';
import * as UserStatsModel from '@/models/UserStats';

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
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period');

  const listId = params.listid;

  if (!listId) {
    return resBuilder('Missing list id', 400);
  }
  let stats;

  if (period === '30d') {
    stats = await UserStatsModel.getMonthlyUserStatsByList(listId);
  } else {
    stats = await UserStatsModel.getUserStatsByList(listId);
  }

  if (!stats) {
    return resBuilder({ message: 'No data found' }, 404);
  }

  return resBuilder({ stats });
}

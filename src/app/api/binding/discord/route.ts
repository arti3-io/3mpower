//TODO bilding discord
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  //hello world
  return NextResponse.json({ hello: 'world' });
}

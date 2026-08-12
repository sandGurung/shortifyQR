import { NextRequest, NextResponse } from 'next/server';
import { getWebsiteVisitorCount, recordWebsiteVisit } from '@/lib/storage';

export async function GET() {
  const count = getWebsiteVisitorCount();
  return NextResponse.json({ count });
}

export async function POST() {
  const count = recordWebsiteVisit();
  return NextResponse.json({ count });
}

import { NextRequest, NextResponse } from 'next/server';
import { getLinkStats, deleteShortLink } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;
  const stats = getLinkStats(code);

  if (!stats) {
    return NextResponse.json({ error: 'Short link not found.' }, { status: 404 });
  }

  return NextResponse.json({ stats });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;
  const success = deleteShortLink(code);

  if (!success) {
    return NextResponse.json({ error: 'Link not found or already deleted.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

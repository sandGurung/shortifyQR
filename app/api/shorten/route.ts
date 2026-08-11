import { NextRequest, NextResponse } from 'next/server';
import { createShortLink, getAllShortLinks } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { originalUrl, customAlias, expiresInHours } = body;

    if (!originalUrl || typeof originalUrl !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required.' }, { status: 400 });
    }

    let urlToShorten = originalUrl.trim();
    if (!/^https?:\/\//i.test(urlToShorten)) {
      urlToShorten = 'https://' + urlToShorten;
    }

    try {
      new URL(urlToShorten);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format provided.' }, { status: 400 });
    }

    const result = createShortLink({
      originalUrl: urlToShorten,
      customAlias,
      expiresInHours: expiresInHours ? Number(expiresInHours) : null,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const shortUrl = `${protocol}://${host}/${result.link?.shortCode}`;

    return NextResponse.json({
      success: true,
      link: {
        ...result.link,
        shortUrl,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error processing short link.' }, { status: 500 });
  }
}

export async function GET() {
  const links = getAllShortLinks();
  return NextResponse.json({ links });
}

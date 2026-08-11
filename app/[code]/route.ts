import { NextRequest, NextResponse } from 'next/server';
import { getShortLink, recordClick } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  // Ignore static assets or system requests
  if (code.includes('.') || code.startsWith('_next') || code === 'favicon.ico') {
    return new NextResponse('Not found', { status: 404 });
  }

  const link = getShortLink(code);

  if (!link) {
    // Show user friendly 404 / Expired page
    const html = `
      <!DOCTYPE html>
      <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Link Not Found or Expired - Shortify & QR Studio</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-[#090d16] text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
        <div class="max-w-md w-full text-center space-y-6 bg-slate-900/80 p-8 rounded-2xl border border-slate-800 backdrop-blur-md shadow-2xl">
          <div class="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20 text-3xl">
            ⚠️
          </div>
          <div class="space-y-2">
            <h1 class="text-2xl font-bold tracking-tight text-white">Link Unavailable</h1>
            <p class="text-sm text-slate-400">The shortened link code <span class="text-cyan-400 font-mono font-semibold">/${code}</span> is invalid, has been deleted, or has expired.</p>
          </div>
          <a href="/" class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition shadow-lg shadow-cyan-500/25">
            Back to Shortify Studio
          </a>
        </div>
      </body>
      </html>
    `;
    return new NextResponse(html, {
      status: 404,
      headers: { 'content-type': 'text/html' },
    });
  }

  // Record analytics asynchronously
  const userAgent = req.headers.get('user-agent') || '';
  const referrer = req.headers.get('referer') || '';
  recordClick(code, userAgent, referrer);

  // Redirect to original target URL
  return NextResponse.redirect(link.originalUrl, { status: 307 });
}

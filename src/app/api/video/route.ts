import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOST = 'video.twimg.com';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'url parameter required' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 });
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return NextResponse.json({ error: 'host not allowed' }, { status: 403 });
  }

  const rangeHeader = request.headers.get('range');
  const headers: HeadersInit = {};
  if (rangeHeader) {
    headers['Range'] = rangeHeader;
  }

  const upstream = await fetch(url, { headers });

  const responseHeaders = new Headers();
  responseHeaders.set('Content-Type', upstream.headers.get('content-type') || 'video/mp4');
  responseHeaders.set('Accept-Ranges', 'bytes');

  const contentLength = upstream.headers.get('content-length');
  if (contentLength) {
    responseHeaders.set('Content-Length', contentLength);
  }

  const contentRange = upstream.headers.get('content-range');
  if (contentRange) {
    responseHeaders.set('Content-Range', contentRange);
  }

  responseHeaders.set('Cache-Control', 'public, max-age=86400');

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

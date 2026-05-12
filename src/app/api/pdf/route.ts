import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy route that fetches a PDF from Cloudinary (or any public URL) and
 * serves it with Content-Disposition: inline so browsers display it
 * rather than downloading it. Also sets CORS headers for the iframe.
 *
 * Usage: /api/pdf?url=https://res.cloudinary.com/...
 */
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('url');
  if (!raw) return NextResponse.json({ error: 'Missing url param' }, { status: 400 });

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  /* Only proxy from trusted origins */
  const allowed = ['res.cloudinary.com', 'archive.org'];
  if (!allowed.some(h => url.hostname.endsWith(h))) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
  }

  try {
    const upstream = await fetch(url.toString(), { headers: { 'User-Agent': 'MeoQoum/1.0' } });
    if (!upstream.ok) {
      return NextResponse.json({ error: `Upstream ${upstream.status}` }, { status: 502 });
    }

    const body = await upstream.arrayBuffer();
    return new NextResponse(body, {
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control':       'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}

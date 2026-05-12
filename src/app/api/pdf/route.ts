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
    /* Try raw/upload first, then image/upload as fallback for Cloudinary PDFs */
    const upstream = await fetch(url.toString(), { headers: { 'User-Agent': 'MeoQoum/1.0' } });

    if (upstream.status === 401 || upstream.status === 403) {
      /* Cloudinary private resource — try swapping resource type in URL */
      const fallbackUrl = url.toString()
        .replace('/raw/upload/', '/image/upload/')
        .replace('/image/upload/', '/raw/upload/');  /* swap back if already image */
      const fallback = await fetch(fallbackUrl, { headers: { 'User-Agent': 'MeoQoum/1.0' } });
      if (fallback.ok) {
        const body = await fallback.arrayBuffer();
        return new NextResponse(body, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      return NextResponse.json({
        error: 'The file is not publicly accessible on Cloudinary. Go to Cloudinary Dashboard → Media Library → find the file → Resource type should be "Raw" and Access mode should be "Public". Or re-upload the file.',
      }, { status: 403 });
    }

    if (!upstream.ok) {
      return NextResponse.json({ error: `File not found on Cloudinary (${upstream.status}). It may have been deleted or the URL is incorrect.` }, { status: 502 });
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

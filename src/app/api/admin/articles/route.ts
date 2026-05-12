import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, getAdmin, slugify } from '@/lib/admin';

export async function GET(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdmin();
  const { data, error } = await admin
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ articles: data });
}

export async function POST(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const admin = getAdmin();

  const slug = slugify(body.title_en || 'article');
  const uniqueSlug = `${slug}-${Date.now().toString(36)}`;

  const { data, error } = await admin.from('articles').insert({
    slug:         uniqueSlug,
    title_en:     body.title_en     || '',
    title_ur:     body.title_ur     || '',
    title_mew:    body.title_mew    || '',
    excerpt_en:   body.excerpt_en   || '',
    excerpt_ur:   body.excerpt_ur   || '',
    excerpt_mew:  body.excerpt_mew  || '',
    body_en:      body.body_en      || '',
    body_ur:      body.body_ur      || '',
    body_mew:     body.body_mew     || '',
    category:     body.category     || 'community',
    cover_id:     body.cover_id     || null,
    author:       body.author       || '',
    read_min:     body.read_min     ? Number(body.read_min) : null,
    is_pinned:    body.is_pinned    ?? false,
    is_published: body.is_published ?? true,
    published_at: body.published_at || new Date().toISOString(),
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ article: data });
}

export async function DELETE(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const admin = getAdmin();
  const { error } = await admin.from('articles').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

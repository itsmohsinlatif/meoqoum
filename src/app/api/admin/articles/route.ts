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

export async function PATCH(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const admin = getAdmin();
  const { id, ...fields } = body;

  const { data, error } = await admin.from('articles').update({
    title_en:     fields.title_en,
    title_ur:     fields.title_ur,
    title_mew:    fields.title_mew,
    excerpt_en:   fields.excerpt_en,
    excerpt_ur:   fields.excerpt_ur,
    excerpt_mew:  fields.excerpt_mew,
    body_en:      fields.body_en,
    body_ur:      fields.body_ur,
    body_mew:     fields.body_mew,
    category:     fields.category,
    author:       fields.author,
    read_min:     fields.read_min ? Number(fields.read_min) : null,
    cover_id:     fields.cover_id || null,
    is_pinned:    fields.is_pinned,
    is_published: fields.is_published,
  }).eq('id', id).select().single();

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

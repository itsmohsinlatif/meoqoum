import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, getAdmin, slugify } from '@/lib/admin';

export async function GET(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdmin();
  const { data, error } = await admin
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ books: data });
}

export async function POST(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const admin = getAdmin();

  const slug = slugify(body.title_en || 'book');
  const uniqueSlug = `${slug}-${Date.now().toString(36)}`;

  const { data, error } = await admin.from('books').insert({
    slug:            uniqueSlug,
    title_en:        body.title_en        || '',
    title_ur:        body.title_ur        || '',
    title_mew:       body.title_mew       || '',
    author:          body.author          || '',
    year:            body.year            ? Number(body.year) : null,
    language:        body.language        || ['en'],
    category:        body.category        || 'history',
    description_en:  body.description_en  || '',
    description_ur:  body.description_ur  || '',
    description_mew: body.description_mew || '',
    cover_id:        body.cover_id        || null,
    cover_gradient:  body.cover_gradient  || 'linear-gradient(135deg,#1a3a2a,#004225)',
    source_type:     body.source_type     || 'pdf_url',
    source_id:       body.source_id       || '',
    is_published:    body.is_published     ?? true,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ book: data });
}

export async function DELETE(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const admin = getAdmin();
  const { error } = await admin.from('books').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

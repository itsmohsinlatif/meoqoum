import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, getAdmin } from '@/lib/admin';

export async function GET(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdmin();
  const { data, error } = await admin
    .from('marriage_profiles')
    .select(`
      id, user_id, degree_doc_id, degree_type,
      is_degree_verified, degree_status, degree_note, created_at,
      profiles:user_id (
        first_name, last_name, country, city, gender
      )
    `)
    .not('degree_doc_id', 'is', null)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  /* Enrich with emails */
  const { data: authList } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const emailMap = Object.fromEntries((authList?.users ?? []).map(u => [u.id, u.email]));
  const enriched = (data ?? []).map(d => ({ ...d, email: emailMap[d.user_id] ?? null }));

  return NextResponse.json({ degrees: enriched });
}

export async function PATCH(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const admin = getAdmin();

  if (body.action === 'verify') {
    const { error } = await admin.from('marriage_profiles').update({
      is_degree_verified: true,
      degree_status: 'verified',
      degree_note: body.note ?? null,
    }).eq('id', body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (body.action === 'amend') {
    const { error } = await admin.from('marriage_profiles').update({
      is_degree_verified: false,
      degree_status: 'amendment_requested',
      degree_note: body.note ?? 'Please re-upload a clearer document.',
    }).eq('id', body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const admin = getAdmin();

  const { error } = await admin.from('marriage_profiles').update({
    degree_doc_id:      null,
    degree_type:        null,
    is_degree_verified: false,
    degree_status:      'pending',
    degree_note:        null,
  }).eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

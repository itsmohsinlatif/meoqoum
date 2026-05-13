import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, getAdmin } from '@/lib/admin';

export async function GET(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdmin();
  const { data, error } = await admin
    .from('profiles')
    .select(`
      id, first_name, last_name, father_name,
      gender, date_of_birth, pal_id, country, city,
      is_verified, is_active, created_at,
      marriage_profiles (
        id, degree_doc_id, degree_type,
        is_degree_verified, degree_status, degree_note, is_active
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  /* Fetch auth emails via admin API */
  const { data: authList } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const emailMap = Object.fromEntries((authList?.users ?? []).map(u => [u.id, u.email]));

  const enriched = (data ?? []).map(p => ({ ...p, email: emailMap[p.id] ?? null }));
  return NextResponse.json({ users: enriched });
}

export async function PATCH(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const admin = getAdmin();

  if (body.action === 'toggle_verified') {
    const { error } = await admin.from('profiles')
      .update({ is_verified: body.value })
      .eq('id', body.profile_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (body.action === 'edit_profile') {
    const { error } = await admin.from('profiles').update({
      first_name: body.first_name,
      last_name:  body.last_name,
      country:    body.country    || null,
      city:       body.city       || null,
      is_active:  body.is_active  ?? true,
    }).eq('id', body.profile_id);
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

  /* Delete auth user (cascades to profiles via FK) */
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

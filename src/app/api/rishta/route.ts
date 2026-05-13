import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

const PAGE_SIZE = 12;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page     = Math.max(0, Number(searchParams.get('page') ?? 0));
  const gender   = searchParams.get('gender')   ?? '';
  const country  = searchParams.get('country')  ?? '';
  const palId    = searchParams.get('palId')    ?? '';
  const eduLevel = searchParams.get('eduLevel') ?? '';
  const status   = searchParams.get('status')   ?? '';
  const ageMin   = Number(searchParams.get('ageMin') ?? 18);
  const ageMax   = Number(searchParams.get('ageMax') ?? 100);

  const admin = getAdmin();

  /* Step 1 — all active marriage profiles (id + user_id + fields) */
  const { data: mps, error: mpErr } = await admin
    .from('marriage_profiles')
    .select('id, user_id, is_active, about, height, weight, complexion, looking_for, degree_status, is_degree_verified, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (mpErr) return NextResponse.json({ error: mpErr.message }, { status: 500 });
  if (!mps || mps.length === 0) return NextResponse.json({ profiles: [], total: 0, page, pageSize: PAGE_SIZE, hasMore: false });

  const userIds = mps.map(mp => mp.user_id);

  /* Step 2 — query profiles for those user_ids with direct column filters */
  let pq = admin
    .from('profiles')
    .select(`
      id, first_name, last_name, date_of_birth, gender,
      pal_id, gotra_id, education_level, profession,
      country, city, marital_status, profile_pic_id, bio,
      pals ( name_en, name_ur ),
      gotras ( name_en, name_ur )
    `)
    .in('id', userIds);

  /* Apply filters directly on profiles columns — this works correctly */
  if (gender)   pq = pq.eq('gender', gender);
  if (country)  pq = pq.eq('country', country);
  if (palId)    pq = pq.eq('pal_id', Number(palId));
  if (eduLevel) pq = pq.eq('education_level', eduLevel);
  if (status)   pq = pq.eq('marital_status', status);

  const { data: profileRows, error: pErr } = await pq;
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  /* Step 3 — age filter in JS (DOB as date string) */
  const today = new Date();
  const matched = (profileRows ?? []).filter(p => {
    if (!p.date_of_birth) return true;
    const birth = new Date(p.date_of_birth);
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age >= ageMin && age <= ageMax;
  });

  /* Step 4 — merge marriage_profile data back in, preserve created_at order */
  const mpMap = Object.fromEntries(mps.map(mp => [mp.user_id, mp]));
  const merged = matched
    .map(p => ({ ...mpMap[p.id], profiles: p }))
    .filter(Boolean)
    .sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  /* Step 5 — paginate */
  const total     = merged.length;
  const paginated = merged.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return NextResponse.json({
    profiles: paginated,
    total,
    page,
    pageSize: PAGE_SIZE,
    hasMore:  (page + 1) * PAGE_SIZE < total,
  });
}

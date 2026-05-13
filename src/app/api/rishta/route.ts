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

  let q = admin
    .from('marriage_profiles')
    .select(`
      *,
      profiles (
        id, first_name, last_name, date_of_birth, gender,
        pal_id, gotra_id, education_level, profession,
        country, city, marital_status, profile_pic_id, bio,
        pals ( name_en, name_ur ),
        gotras ( name_en, name_ur )
      )
    `, { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  if (gender)   q = q.eq('profiles.gender',          gender);
  if (country)  q = q.eq('profiles.country',          country);
  if (palId)    q = q.eq('profiles.pal_id',           Number(palId));
  if (eduLevel) q = q.eq('profiles.education_level',  eduLevel);
  if (status)   q = q.eq('profiles.marital_status',   status);

  const { data, error, count } = await q;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  /* Client-side age filter (DOB stored as string, easier server-side here) */
  const today = new Date();
  const filtered = (data ?? []).filter(mp => {
    const dob = (mp as any).profiles?.date_of_birth;
    if (!dob) return true;
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age >= ageMin && age <= ageMax;
  });

  return NextResponse.json({
    profiles: filtered,
    total:    count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    hasMore:  (page + 1) * PAGE_SIZE < (count ?? 0),
  });
}

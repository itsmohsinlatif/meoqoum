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

  /* Fetch all active marriage profiles — filtering on joined table columns
     via PostgREST .eq() is not supported, so we filter in JS server-side */
  const { data, error } = await admin
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
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const today = new Date();

  /* Apply all filters in JavaScript */
  const filtered = (data ?? []).filter(mp => {
    const p = (mp as any).profiles;
    if (!p) return false;

    if (gender   && p.gender           !== gender)          return false;
    if (country  && p.country          !== country)         return false;
    if (palId    && String(p.pal_id)   !== palId)           return false;
    if (eduLevel && p.education_level  !== eduLevel)        return false;
    if (status   && p.marital_status   !== status)          return false;

    /* Age filter */
    if (p.date_of_birth) {
      const birth = new Date(p.date_of_birth);
      let age = today.getFullYear() - birth.getFullYear();
      if (today.getMonth() < birth.getMonth() ||
          (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
      if (age < ageMin || age > ageMax) return false;
    }

    return true;
  });

  const total    = filtered.length;
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return NextResponse.json({
    profiles: paginated,
    total,
    page,
    pageSize: PAGE_SIZE,
    hasMore:  (page + 1) * PAGE_SIZE < total,
  });
}

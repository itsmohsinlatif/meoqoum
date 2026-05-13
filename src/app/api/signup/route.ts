import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getAdmin() {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Supabase not configured.');
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const origin = req.headers.get('origin') ?? 'http://localhost:3000';
    const locale = body.locale ?? 'en';

    /* 1. Sign up via anon client → Supabase sends the verification email automatically */
    const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: authData, error: authErr } = await anonClient.auth.signUp({
      email:    body.email,
      password: body.password,
      options: {
        emailRedirectTo: `${origin}/${locale}/login?verified=1`,
      },
    });

    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 400 });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User creation failed.' }, { status: 500 });
    }

    /* 2. Insert profile via admin (service_role bypasses RLS) */
    const admin = getAdmin();
    const { error: profileErr } = await admin.from('profiles').insert({
      id:               userId,
      first_name:       body.firstName,
      last_name:        body.lastName,
      father_name:      body.fatherName,
      date_of_birth:    body.dob,
      gender:           body.gender,
      marital_status:   body.maritalStatus,
      pal_id:           body.palId    ? Number(body.palId)    : null,
      gotra_id:         body.gotraId  ? Number(body.gotraId)  : null,
      pichla_gaoon:     body.village  || null,
      education_level:  body.educationLevel || null,
      education_field:  body.educationField || null,
      profession:       body.profession    || null,
      blood_group:      body.bloodGroup    || null,
      religion:         'Islam',
      intro:            body.intro         || null,
      permanent_addr:   body.permAddr,
      current_addr:     body.currAddr      || null,
      country:          body.country       || null,
      state_province:   body.province      || null,
      city:             body.city          || null,
      contact_no:       body.contact       || null,
      profile_pic_id:   body.profilePicId  || null,
      social_whatsapp:  body.whatsapp      || null,
      social_facebook:  body.facebook      || null,
      social_instagram: body.instagram     || null,
      social_linkedin:  body.linkedin      || null,
      social_twitter:   body.twitter       || null,
    });

    if (profileErr) {
      /* Roll back: delete the auth user so the email can be reused */
      await admin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

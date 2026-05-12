import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/* Server-only admin client — service_role key is NEVER sent to the browser */
function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured on the server.');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const admin = getAdmin();

    /* 1. Create auth user (email_confirm:true skips the confirmation email
          so the user can log in immediately after signup) */
    const { data: authData, error: authErr } = await admin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
    });

    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 400 });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User creation failed.' }, { status: 500 });
    }

    /* 2. Insert profile — runs with service_role, bypasses RLS entirely */
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

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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
    const admin  = getAdmin();

    /* 1. Create auth user — unconfirmed, we send the email ourselves */
    const { data: authData, error: authErr } = await admin.auth.admin.createUser({
      email:         body.email,
      password:      body.password,
      email_confirm: false,
    });

    if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 });

    const userId = authData.user?.id;
    if (!userId) return NextResponse.json({ error: 'User creation failed.' }, { status: 500 });

    /* 2. Insert profile (service_role bypasses RLS) */
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
      await admin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    /* 3. Generate Supabase confirmation link */
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type:     'signup',
      email:    body.email,
      password: body.password,
      options:  { redirectTo: `${origin}/${locale}/login?verified=1` },
    });

    if (linkErr || !linkData?.properties?.action_link) {
      /* User is created — just no email. Tell them to contact support. */
      return NextResponse.json({ success: true, emailSent: false });
    }

    const confirmUrl = linkData.properties.action_link;

    /* 4. Send via Gmail SMTP */
    const gmailUser = process.env.EMAIL_USER;
    const gmailPass = process.env.EMAIL_PASS;
    console.log('[signup] Gmail configured:', Boolean(gmailUser && gmailPass));
    console.log('[signup] Sending to:', body.email);
    if (gmailUser && gmailPass) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: gmailUser, pass: gmailPass },
      });
      const emailResult = await transporter.sendMail({
        from:    `"Meo Qoum" <${gmailUser}>`,
        to:      body.email,
        subject: 'Verify your Meo Qoum account — میو قوم',
        html: `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5dc;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5dc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e0d9c6;max-width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#004225;padding:28px 36px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:22px;color:#D4AF37;font-weight:600;letter-spacing:0.04em;">
              میو قوم · Meo Qoum
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 36px 24px;">
            <p style="margin:0 0 16px;font-size:16px;color:#333;font-family:sans-serif;">
              Assalamu Alaikum, <strong>${body.firstName} ${body.lastName}</strong>
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;font-family:sans-serif;">
              Thank you for joining <strong>Meo Qoum</strong> — the community archive of the Meo people.
              Please verify your email address to activate your account.
            </p>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
              <tr>
                <td style="background:#D4AF37;border-radius:3px;">
                  <a href="${confirmUrl}"
                     style="display:inline-block;padding:14px 36px;color:#0f1a0a;text-decoration:none;
                            font-family:sans-serif;font-size:15px;font-weight:800;
                            letter-spacing:0.08em;text-transform:uppercase;">
                    Verify Email
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;font-size:13px;color:#888;font-family:sans-serif;">
              Or copy this link into your browser:
            </p>
            <p style="margin:0 0 24px;font-size:12px;color:#004225;word-break:break-all;font-family:monospace;">
              ${confirmUrl}
            </p>

            <div style="border-top:1px solid #e0d9c6;padding-top:16px;">
              <p style="margin:0;font-size:12px;color:#aaa;font-family:sans-serif;">
                This link expires in 24 hours. If you didn't sign up for Meo Qoum, ignore this email.
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9f7f0;padding:16px 36px;text-align:center;border-top:1px solid #e0d9c6;">
            <p style="margin:0;font-size:12px;color:#bbb;font-family:sans-serif;">
              © 2026 Meo Qoum · میوات کی قوم
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      });
      console.log('[signup] Email sent:', emailResult.messageId);
    }

    return NextResponse.json({ success: true, emailSent: Boolean(gmailUser && gmailPass) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

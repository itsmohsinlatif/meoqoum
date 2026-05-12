'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { routing } from '@/config/routing';
import { getSupabase } from '@/lib/supabase-browser';
import type { Locale } from '@/data/content';

export default function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = use(params);
  if (!routing.locales.includes(rawLocale as (typeof routing.locales)[number])) notFound();
  const locale = rawLocale as Locale;

  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff  = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const ffH = locale === 'en' ? 'var(--serif)' : 'var(--urdu)';

  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const T = {
    title:       { en: 'Reset your password',            ur: 'پاس ورڈ ری سیٹ کریں',       mew: 'پاس ورڈ ری سیٹ کرو'      },
    sub:         { en: 'Enter your email and we\'ll send a reset link.', ur: 'اپنا ای میل درج کریں، ہم ری سیٹ لنک بھیجیں گے۔', mew: 'اپنو ای میل لکھو، ہم ری سیٹ لنک بھیجاں گے۔' },
    emailLabel:  { en: 'Email address',                  ur: 'ای میل پتہ',                  mew: 'ای میل پتو'               },
    sendBtn:     { en: 'Send reset link',                ur: 'ری سیٹ لنک بھیجیں',           mew: 'ری سیٹ لنک بھیجو'         },
    sending:     { en: 'Sending…',                       ur: 'بھیج رہے ہیں…',               mew: 'بھیج رہے ہاں…'            },
    successTitle:{ en: 'Check your inbox',               ur: 'اپنا ان باکس چیک کریں',       mew: 'اپنو ان باکس چیک کرو'    },
    successMsg:  { en: 'A reset link has been sent to',  ur: 'ری سیٹ لنک بھیج دیا گیا:',   mew: 'ری سیٹ لنک بھیج دیو:'    },
    backToLogin: { en: 'Back to login',                  ur: 'لاگ ان پر واپس',              mew: 'لاگ ان پر واپس'           },
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true); setError('');
    const { error: err } = await getSupabase().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/${locale}/profile?reset=1`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  }

  return (
    <div className="mp-root" dir={dir}>
      <Header active="home" />

      <section style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--cream)', padding: 'clamp(40px,5vw,80px) 20px',
      }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: '#fff', border: '1.5px solid var(--rule)',
          padding: 'clamp(28px,4vw,48px)',
        }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h2 style={{ fontFamily: ffH, fontSize: 22, color: 'var(--emerald-deep)', marginBottom: 10 }}>
                {T.successTitle[locale]}
              </h2>
              <p style={{ fontFamily: ff, fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 24 }}>
                {T.successMsg[locale]} <strong>{email}</strong>
              </p>
              <Link href={`/${locale}/login`} style={{ fontFamily: ff, fontSize: 13, color: 'var(--emerald)', textDecoration: 'underline' }}>
                {T.backToLogin[locale]}
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: ffH, fontSize: 'clamp(22px,2.5vw,28px)', color: 'var(--emerald-deep)', marginBottom: 10, lineHeight: 1.2 }}>
                {T.title[locale]}
              </h1>
              <p style={{ fontFamily: ff, fontSize: 13, color: 'var(--ink-mute)', marginBottom: 28, lineHeight: 1.7 }}>
                {T.sub[locale]}
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: ff, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 6 }}>
                    {T.emailLabel[locale]}
                  </label>
                  <input
                    type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--rule)', fontFamily: ff, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fafaf8' }}
                  />
                </div>

                {error && <p style={{ fontFamily: ff, fontSize: 13, color: '#c0392b', margin: 0 }}>{error}</p>}

                <button type="submit" disabled={loading} style={{
                  background: 'var(--emerald)', color: 'var(--cream)',
                  border: 0, padding: '12px', fontFamily: ff, fontSize: 14, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                }}>
                  {loading ? T.sending[locale] : T.sendBtn[locale]}
                </button>

                <Link href={`/${locale}/login`} style={{ fontFamily: ff, fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center', textDecoration: 'underline' }}>
                  {T.backToLogin[locale]}
                </Link>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}

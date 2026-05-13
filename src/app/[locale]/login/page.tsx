'use client';

import { use, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { routing } from '@/config/routing';
import { LOGIN, type Locale } from '@/data/content';
import { getSupabase } from '@/lib/supabase-browser';

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <Suspense>
      <LoginForm params={params} />
    </Suspense>
  );
}

function LoginForm({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = use(params);
  if (!routing.locales.includes(rawLocale as (typeof routing.locales)[number])) notFound();
  const locale = rawLocale as Locale;

  const router      = useRouter();
  const searchParams = useSearchParams();
  const verified     = searchParams.get('verified') === '1';
  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff  = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const ffH = locale === 'en' ? 'var(--serif)' : 'var(--urdu)';
  const d   = LOGIN;

  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [unconfirmed,   setUnconfirmed]   = useState(false);
  const [resendSent,    setResendSent]    = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setUnconfirmed(false);
    setLoading(true);
    try {
      const sb = getSupabase();
      const { error: err } = await sb.auth.signInWithPassword({ email, password });
      if (err) {
        if (err.message.toLowerCase().includes('email not confirmed')) {
          setUnconfirmed(true);
        } else {
          setError(d.errorMsg[locale]);
        }
        return;
      }
      router.push(`/${locale}/rishta`);
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    if (!email) { setError(locale === 'en' ? 'Enter your email first.' : 'پہلے ای میل لکھیں۔'); return; }
    const sb = getSupabase();
    await sb.auth.resend({ type: 'signup', email });
    setResendSent(true);
  }

  return (
    <div className="mp-root" dir={dir}>
      <Header active="home" />

      <section style={{
        minHeight: 'calc(100vh - 180px)',
        background: 'linear-gradient(180deg, var(--cream) 0%, var(--cream-warm) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(40px,6vw,80px) clamp(20px,5vw,40px)',
      }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          {/* Email verified banner */}
          {verified && (
            <div style={{
              background: '#004225', color: '#d4f5e0',
              padding: '12px 16px', borderRadius: 6, marginBottom: 24,
              fontSize: 14, fontFamily: ff, display: 'flex', gap: 10, alignItems: 'center',
            }}>
              <span style={{ fontSize: 18 }}>✓</span>
              <span>
                {locale === 'en' ? 'Email verified! You can now log in.'
                  : locale === 'ur' ? 'ای میل تصدیق ہو گئی! اب لاگ ان کریں۔'
                  : 'ای میل تصدیق ہو گئی! اب لاگ ان کرو۔'}
              </span>
            </div>
          )}

          <span className="mp-eyebrow" style={{ fontFamily: ff, display: 'block', marginBottom: 12 }}>
            {d.eyebrow[locale]}
          </span>
          <h1 style={{
            fontFamily: ffH, fontSize: 'clamp(32px,4vw,48px)',
            marginBottom: 32, lineHeight: 1.1,
          }}>
            {d.title[locale]}
          </h1>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FormField label={d.email[locale]} ff={ff}>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle(ff, dir)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </FormField>

            <FormField label={d.password[locale]} ff={ff}>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle(ff, dir)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </FormField>

            {error && (
              <p style={{ color: '#c0392b', fontFamily: ff, fontSize: 13 }}>{error}</p>
            )}

            {/* Unconfirmed email warning */}
            {unconfirmed && (
              <div style={{
                background: '#fff8e1', border: '1px solid #f0c040',
                borderRadius: 6, padding: '12px 16px', fontSize: 13, fontFamily: ff,
              }}>
                <p style={{ margin: '0 0 8px', color: '#7a5c00', fontWeight: 600 }}>
                  {locale === 'en' ? 'Email not verified yet.'
                    : locale === 'ur' ? 'ای میل ابھی تصدیق نہیں ہوئی۔'
                    : 'ای میل ابھی تصدیق نہیں ہوئی۔'}
                </p>
                {resendSent ? (
                  <p style={{ margin: 0, color: '#2e7d32' }}>
                    {locale === 'en' ? '✓ Verification email resent — check your inbox.'
                      : locale === 'ur' ? '✓ تصدیقی ای میل دوبارہ بھیج دی گئی۔'
                      : '✓ تصدیقی ای میل دوبارہ بھیج دی گئی۔'}
                  </p>
                ) : (
                  <button type="button" onClick={resendVerification}
                    style={{
                      background: 'transparent', border: 0, padding: 0,
                      color: '#004225', fontWeight: 700, cursor: 'pointer',
                      fontFamily: ff, fontSize: 13, textDecoration: 'underline',
                    }}>
                    {locale === 'en' ? 'Resend verification email →'
                      : locale === 'ur' ? 'تصدیقی ای میل دوبارہ بھیجیں →'
                      : 'تصدیقی ای میل دوبارہ بھیجو →'}
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#D4AF37',
                color: '#0f1a0a',
                border: 0,
                padding: '15px 28px',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: ff, fontSize: 15, fontWeight: 800,
                letterSpacing: locale === 'en' ? '0.1em' : 0,
                textTransform: locale === 'en' ? 'uppercase' : 'none',
                opacity: loading ? 0.7 : 1,
                marginTop: 4,
                boxShadow: '0 2px 12px rgba(212,175,55,0.4)',
                transition: 'opacity 0.15s',
              }}
            >
              {loading ? '…' : d.loginBtn[locale]}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <Link href={`/${locale}/forgot-password`} style={{ fontFamily: ff, fontSize: 13, color: 'var(--ink-mute)', textDecoration: 'underline' }}>
                {locale === 'en' ? 'Forgot password?' : locale === 'ur' ? 'پاس ورڈ بھول گئے؟' : 'پاس ورڈ بھول گئے؟'}
              </Link>
              <p style={{ fontFamily: ff, fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>
                {d.noAccount[locale]}{' '}
                <Link href={`/${locale}/join`} style={{ color: 'var(--emerald)', fontWeight: 600 }}>
                  {d.joinLink[locale]}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}

function FormField({ label, ff, children }: { label: string; ff: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: ff, fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--ink-soft)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function inputStyle(ff: string, dir: string): React.CSSProperties {
  return {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid var(--rule)',
    padding: '10px 12px',
    fontFamily: ff, fontSize: 14, color: 'var(--ink)',
    background: 'var(--paper)',
    outline: 'none',
    /* email & password are always LTR — RTL breaks browser validation */
    direction: 'ltr',
    textAlign: dir === 'rtl' ? 'right' : 'left',
  };
}

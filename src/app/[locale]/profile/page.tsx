'use client';

import { use, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { routing } from '@/config/routing';
import { getSupabase } from '@/lib/supabase-browser';
import type { Locale } from '@/data/content';

export default function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = use(params);
  if (!routing.locales.includes(rawLocale as (typeof routing.locales)[number])) notFound();
  const locale = rawLocale as Locale;
  const router  = useRouter();
  const search  = useSearchParams();
  const isReset = search.get('reset') === '1';

  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff  = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const ffH = locale === 'en' ? 'var(--serif)' : 'var(--urdu)';

  const [tab, setTab]       = useState<'profile' | 'password'>(isReset ? 'password' : 'profile');
  const [loading, setLoading] = useState(true);

  /* Profile fields */
  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [fatherName, setFatherName] = useState('');
  const [contact,    setContact]    = useState('');
  const [city,       setCity]       = useState('');
  const [country,    setCountry]    = useState('');
  const [intro,      setIntro]      = useState('');
  const [profSaving, setProfSaving] = useState(false);
  const [profMsg,    setProfMsg]    = useState('');

  /* Password fields */
  const [newPass,   setNewPass]   = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [passSaving, setPassSaving] = useState(false);
  const [passMsg,    setPassMsg]    = useState('');
  const [passErr,    setPassErr]    = useState('');

  useEffect(() => {
    async function load() {
      const sb  = getSupabase();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { router.replace(`/${locale}/login`); return; }

      const { data } = await sb.from('profiles').select('first_name,last_name,father_name,contact_no,city,country,intro').eq('id', user.id).single();
      if (data) {
        setFirstName(data.first_name ?? '');
        setLastName(data.last_name ?? '');
        setFatherName(data.father_name ?? '');
        setContact(data.contact_no ?? '');
        setCity(data.city ?? '');
        setCountry(data.country ?? '');
        setIntro(data.intro ?? '');
      }
      setLoading(false);
    }
    load();
  }, [locale, router]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) return;
    setProfSaving(true); setProfMsg('');
    const { error } = await getSupabase().from('profiles').update({
      first_name:  firstName.trim(),
      last_name:   lastName.trim(),
      father_name: fatherName.trim(),
      contact_no:  contact.trim(),
      city:        city.trim(),
      country:     country.trim(),
      intro:       intro.trim(),
    }).eq('id', user.id);
    setProfSaving(false);
    setProfMsg(error ? (locale === 'en' ? 'Save failed: ' + error.message : 'ناکام: ' + error.message) : (locale === 'en' ? '✓ Profile updated.' : '✓ پروفائل اپ ڈیٹ ہو گئی۔'));
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassErr(''); setPassMsg('');
    if (newPass.length < 6) { setPassErr(locale === 'en' ? 'Password must be at least 6 characters.' : 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے۔'); return; }
    if (newPass !== confirm)  { setPassErr(locale === 'en' ? 'Passwords do not match.' : 'پاس ورڈ مطابقت نہیں رکھتے۔'); return; }
    setPassSaving(true);
    const { error } = await getSupabase().auth.updateUser({ password: newPass });
    setPassSaving(false);
    if (error) { setPassErr(error.message); return; }
    setPassMsg(locale === 'en' ? '✓ Password changed successfully.' : '✓ پاس ورڈ کامیابی سے بدل دیا گیا۔');
    setNewPass(''); setConfirm('');
  }

  const T = {
    profile:  { en: 'Edit Profile',     ur: 'پروفائل ترمیم',    mew: 'پروفائل تبدیل کرو' },
    password: { en: 'Change Password',  ur: 'پاس ورڈ بدلیں',    mew: 'پاس ورڈ بدلو'      },
    save:     { en: 'Save Changes',     ur: 'تبدیلیاں محفوظ',   mew: 'تبدیلیاں محفوظ'    },
    saving:   { en: 'Saving…',          ur: 'محفوظ ہو رہا ہے…', mew: 'محفوظ ہو رہو ہے…'  },
    change:   { en: 'Change Password',  ur: 'پاس ورڈ بدلیں',    mew: 'پاس ورڈ بدلو'      },
    changing: { en: 'Updating…',        ur: 'اپڈیٹ ہو رہا ہے…', mew: 'اپڈیٹ ہو رہو ہے…'  },
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    border: '1.5px solid var(--rule)',
    background: '#fafaf8', fontFamily: ff,
    fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
    direction: dir,
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: ff, fontSize: 11,
    fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 5,
  };

  if (loading) return (
    <div className="mp-root" dir={dir}>
      <Header active="home" />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ff, color: 'var(--ink-mute)' }}>
        {locale === 'en' ? 'Loading…' : 'لوڈ ہو رہا ہے…'}
      </div>
      <Footer locale={locale} />
    </div>
  );

  return (
    <div className="mp-root" dir={dir}>
      <Header active="home" />

      <section style={{
        background: 'var(--cream)',
        padding: 'clamp(40px,5vw,72px) clamp(20px,5vw,64px)',
        minHeight: 'calc(100vh - 120px)',
      }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <h1 style={{ fontFamily: ffH, fontSize: 'clamp(26px,3vw,36px)', color: 'var(--emerald-deep)', marginBottom: 8 }}>
            {locale === 'en' ? 'My Account' : locale === 'ur' ? 'میرا اکاؤنٹ' : 'میرو اکاؤنٹ'}
          </h1>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '2px solid var(--rule)' }}>
            {(['profile', 'password'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '10px 20px',
                fontFamily: ff, fontSize: 13, fontWeight: 600,
                background: 'transparent',
                color: tab === t ? 'var(--emerald)' : 'var(--ink-mute)',
                border: 'none',
                borderBottom: tab === t ? '2px solid var(--emerald)' : '2px solid transparent',
                marginBottom: -2,
                cursor: 'pointer',
                letterSpacing: locale === 'en' ? '0.06em' : 0,
                textTransform: locale === 'en' ? 'uppercase' : 'none',
              }}>
                {T[t][locale]}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {tab === 'profile' && (
            <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{locale === 'en' ? 'First Name' : 'پہلا نام'}</label>
                  <input style={inputStyle} value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>{locale === 'en' ? 'Last Name' : 'خاندانی نام'}</label>
                  <input style={inputStyle} value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
              </div>
              <div>
                <label style={labelStyle}>{locale === 'en' ? 'Father\'s Name' : 'والد کا نام'}</label>
                <input style={inputStyle} value={fatherName} onChange={e => setFatherName(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{locale === 'en' ? 'City' : 'شہر'}</label>
                  <input style={inputStyle} value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>{locale === 'en' ? 'Country' : 'ملک'}</label>
                  <input style={inputStyle} value={country} onChange={e => setCountry(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>{locale === 'en' ? 'Contact Number' : 'رابطہ نمبر'}</label>
                <input style={inputStyle} type="tel" value={contact} onChange={e => setContact(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>{locale === 'en' ? 'About You' : 'اپنے بارے میں'}</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                  value={intro} onChange={e => setIntro(e.target.value)} maxLength={500}
                />
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', textAlign: 'end', marginTop: 3 }}>{intro.length}/500</div>
              </div>
              {profMsg && <p style={{ fontFamily: ff, fontSize: 13, color: profMsg.startsWith('✓') ? 'var(--emerald)' : '#c0392b', margin: 0 }}>{profMsg}</p>}
              <button type="submit" disabled={profSaving} style={{
                background: 'var(--emerald)', color: 'var(--cream)',
                border: 0, padding: '12px 28px',
                fontFamily: ff, fontSize: 14, fontWeight: 700,
                cursor: profSaving ? 'not-allowed' : 'pointer',
                opacity: profSaving ? 0.7 : 1, alignSelf: 'flex-start',
              }}>
                {profSaving ? T.saving[locale] : T.save[locale]}
              </button>
            </form>
          )}

          {/* Password tab */}
          {tab === 'password' && (
            <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 360 }}>
              {isReset && (
                <div style={{ background: '#f0f8f4', border: '1px solid var(--emerald)', padding: '10px 14px', fontFamily: ff, fontSize: 13, color: 'var(--emerald-deep)' }}>
                  {locale === 'en' ? 'You followed a reset link. Set your new password below.' : 'آپ نے ری سیٹ لنک سے آئے ہیں۔ نیچے نیا پاس ورڈ سیٹ کریں۔'}
                </div>
              )}
              <div>
                <label style={labelStyle}>{locale === 'en' ? 'New Password' : 'نیا پاس ورڈ'}</label>
                <input type="password" style={inputStyle} value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={6} autoComplete="new-password" />
              </div>
              <div>
                <label style={labelStyle}>{locale === 'en' ? 'Confirm New Password' : 'پاس ورڈ دوبارہ'}</label>
                <input type="password" style={inputStyle} value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} autoComplete="new-password" />
              </div>
              {passErr && <p style={{ fontFamily: ff, fontSize: 13, color: '#c0392b', margin: 0 }}>{passErr}</p>}
              {passMsg && <p style={{ fontFamily: ff, fontSize: 13, color: 'var(--emerald)', margin: 0 }}>{passMsg}</p>}
              <button type="submit" disabled={passSaving} style={{
                background: 'var(--emerald)', color: 'var(--cream)',
                border: 0, padding: '12px 28px',
                fontFamily: ff, fontSize: 14, fontWeight: 700,
                cursor: passSaving ? 'not-allowed' : 'pointer',
                opacity: passSaving ? 0.7 : 1, alignSelf: 'flex-start',
              }}>
                {passSaving ? T.changing[locale] : T.change[locale]}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}
